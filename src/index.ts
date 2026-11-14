import {
  parseDocument,
  Document,
  isAlias,
  isMap,
  isSeq,
  isScalar,
  isPair,
  isNode,
  visit,
  Scalar,
  YAMLMap,
  YAMLSeq,
  Pair,
  Node,
} from 'yaml';

/**
 * Custom error class for YAWN-specific errors
 */
export class YAWNError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'YAWNError';
  }
}

/**
 * Options for YAML serialization
 */
export interface YAWNOptions {
  /** @deprecated Untouched content is always preserved byte for byte. */
  preserveIndent?: boolean;
  /** Indentation for new content (default: detected from the source, or 2) */
  indent?: number;
  /** Line width used when folding new content (default: 80) */
  lineWidth?: number;
}

/**
 * YAWN - YAML parser that preserves comments and formatting
 *
 * YAWN allows you to modify YAML files programmatically while preserving
 * comments, formatting, and other non-semantic content. Assigning to `json`
 * rewrites only the parts of the source text that actually changed.
 *
 * @example
 * ```typescript
 * const yaml = `
 * # Configuration file
 * server:
 *   port: 8080 # Default port
 * `;
 *
 * const yawn = new YAWN(yaml);
 * const json = yawn.json;
 * json.server.port = 3000;
 * yawn.json = json;
 *
 * console.log(yawn.yaml);
 * // # Configuration file
 * // server:
 * //   port: 3000 # Default port
 * ```
 */
export default class YAWN {
  private source!: string;
  private document!: Document;
  private options: YAWNOptions;
  private style?: RenderOptions;

  /**
   * Creates a new YAWN instance from a YAML string
   * @param yaml - The YAML string to parse
   * @param options - Optional configuration options
   */
  constructor(yaml: string, options: YAWNOptions = {}) {
    if (typeof yaml !== 'string') {
      throw new TypeError('yaml should be a string');
    }
    this.options = { ...options };
    this.load(yaml);
  }

  /**
   * Gets the YAML string representation
   */
  get yaml(): string {
    return this.source;
  }

  /**
   * Sets the YAML string (re-parses the document)
   */
  set yaml(value: string) {
    if (typeof value !== 'string') {
      throw new TypeError('yaml should be a string');
    }
    this.load(value);
  }

  /**
   * Gets the JSON representation of the YAML document
   */
  get json(): any {
    return this.document.toJS();
  }

  /**
   * Sets the JSON and updates the YAML while preserving comments and styling
   * @param newJson - The new JSON value to set
   */
  set json(newJson: any) {
    const value = normalize(newJson);
    const current = this.json;

    if (deepEqual(current, value)) {
      return;
    }

    // 1. Minimal text edits: everything that did not change stays untouched.
    try {
      const patcher = new Patcher(this.source, this.document, this.getStyle());
      if (this.commit(patcher.run(value, current), value)) return;
    } catch (e) {
      // fall through to the next strategy
    }

    // 2. Update the document tree and re-stringify it. Comments survive but
    //    the formatting of the document is normalized.
    try {
      const doc = parse(this.source);
      doc.contents = patchNode(doc, doc.contents, value, current) as any;
      if (this.commit(doc.toString(this.getStyle()), value)) return;
    } catch (e) {
      // fall through to the next strategy
    }

    // 3. Last resort: write the value from scratch.
    this.load(new Document(value).toString(this.getStyle()));
  }

  /**
   * Messages of the syntax errors found in the YAML string. A document
   * with errors can still be read and updated on a best effort basis.
   */
  get errors(): string[] {
    return this.document.errors.map(error => error.message);
  }

  /**
   * Returns the YAML string
   */
  toString(): string {
    return this.yaml;
  }

  /**
   * Returns the JSON representation
   */
  toJSON(): any {
    return this.json;
  }

  /**
   * Gets the comment (remark) at a given path
   * @param path - Dot-separated path to the node (e.g., "server.port" or "items.0")
   * @returns The comment text without the # prefix, or empty string if no comment
   */
  getRemark(path: string): string {
    const found = this.find(path);
    if (!found || !isNode(found.node) || !found.node.comment) {
      return '';
    }
    return found.node.comment.trim();
  }

  /**
   * Sets the comment (remark) at a given path
   * @param path - Dot-separated path to the node
   * @param remark - The comment text (without # prefix)
   * @returns true if successful, false if path not found
   */
  setRemark(path: string, remark: string): boolean {
    const found = this.find(path);
    if (!found || !isNode(found.node)) {
      return false;
    }
    const node = found.node;
    const text = remark ? String(remark) : '';
    const json = this.json;
    const ok = (): boolean => this.getRemark(path) === text.trim();

    // Edit the end of the line in place when the node ends on a single line.
    const inline =
      isScalar(node) || isAlias(node) || (isCollection(node) && node.flow);
    if (inline && node.range && !/[\r\n]/.test(text)) {
      const src = this.source;
      const start = contentEnd(src, node);
      if (start > node.range[0]) {
        const end = lineEnd(src, start);
        const tail = src.slice(start, end);
        if (/^\s*(#.*)?$/.test(tail)) {
          const next =
            src.slice(0, start) + (text ? ' # ' + text : '') + src.slice(end);
          if (this.commit(next, json, ok)) return true;
        }
      }
    }

    node.comment = text ? ` ${text}` : undefined;
    this.load(this.document.toString(this.getStyle()));
    return true;
  }

  /**
   * Gets the comment before a node (block comment)
   * @param path - Dot-separated path to the node
   * @returns The comment text, or empty string if no comment
   */
  getCommentBefore(path: string): string {
    const found = this.find(path);
    if (!found) {
      return '';
    }
    const { node, pair } = found;

    // For map entries, the comment is attached to the key of the pair
    if (pair && isNode(pair.key) && pair.key.commentBefore) {
      return pair.key.commentBefore.trim();
    }
    if (isNode(node) && node.commentBefore) {
      return node.commentBefore.trim();
    }
    return '';
  }

  /**
   * Sets the comment before a node (block comment)
   * @param path - Dot-separated path to the node
   * @param comment - The comment text (without # prefix)
   * @returns true if successful, false if path not found
   */
  setCommentBefore(path: string, comment: string): boolean {
    const found = this.find(path);
    if (!found) {
      return false;
    }
    const { node, pair, parent, index } = found;
    const target = pair && isNode(pair.key) ? pair.key : node;
    if (!isNode(target)) {
      return false;
    }
    const text = comment ? String(comment) : '';
    const json = this.json;
    const ok = (): boolean =>
      squash(this.getCommentBefore(path)) === squash(text);

    // Rewrite the comment lines right above the entry in place.
    try {
      const src = this.source;
      let start = -1;
      if (pair && isNode(pair.key) && pair.key.range) {
        start = pair.key.range[0];
      } else if (isSeq(parent) && !parent.flow) {
        start = dashOffsets(parent)[index];
      }
      if (start >= 0 && atLineStart(src, start)) {
        const to = lineStart(src, start);
        const from = target.commentBefore ? commentBlockStart(src, to, 0) : to;
        const pad = src.slice(to, start);
        const lines = text
          ? text
              .split(/\r?\n/)
              .map(l => pad + (l.trim() ? '# ' + l.trim() : '#') + '\n')
              .join('')
          : '';
        const next = src.slice(0, from) + lines + src.slice(to);
        if (this.commit(next, json, ok)) return true;
      }
    } catch (e) {
      // fall through to the tree based update
    }

    target.commentBefore = text ? ` ${text}` : undefined;
    this.load(this.document.toString(this.getStyle()));
    return true;
  }

  /**
   * Parses and stores a new source text
   */
  private load(source: string): void {
    this.source = source;
    this.document = parse(source);
    this.style = undefined;
  }

  /**
   * Stores a candidate source text if it parses cleanly to the expected value
   */
  private commit(
    source: string,
    expected: any,
    check?: () => boolean
  ): boolean {
    const doc = parse(source);
    if (doc.errors.length > this.document.errors.length) return false;
    if (!deepEqual(doc.toJS(), expected)) return false;

    const previous = { source: this.source, document: this.document };
    const style = this.style;
    this.source = source;
    this.document = doc;
    if (check && !check()) {
      this.source = previous.source;
      this.document = previous.document;
      return false;
    }
    // The detected style is kept so that formatting stays consistent
    this.style = style;
    return true;
  }

  /**
   * Options used to render new content, matching the style of the source
   */
  private getStyle(): RenderOptions {
    if (!this.style) {
      const detected = detectStyle(this.source, this.document);
      this.style = {
        indent: this.options.indent || detected.indent || 2,
        indentSeq: detected.indentSeq !== false,
        flowCollectionPadding: detected.flowPadding !== false,
        lineWidth:
          this.options.lineWidth === undefined ? 80 : this.options.lineWidth,
        minContentWidth: 0,
      };
    }
    return this.style;
  }

  /**
   * Finds the node at a dot-separated path, with its parent
   */
  private find(path: string): Found | undefined {
    let found: Found = {
      node: this.document.contents,
      pair: null,
      parent: null,
      index: -1,
    };
    if (!path) {
      return found;
    }

    for (const part of path.split('.')) {
      const current = found.node;
      if (isMap(current)) {
        const pair = current.items.find(
          item => isPair(item) && keyOf(item.key) === part
        );
        if (!pair) return undefined;
        found = { node: pair.value, pair, parent: current, index: -1 };
      } else if (isSeq(current)) {
        const index = /^\d+$/.test(part) ? parseInt(part, 10) : -1;
        if (index < 0 || index >= current.items.length) return undefined;
        found = {
          node: current.items[index],
          pair: null,
          parent: current,
          index,
        };
      } else {
        return undefined;
      }
    }

    return found;
  }
}

// Also export the class as named export for convenience
export { YAWN };

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

interface Found {
  node: unknown;
  pair: Pair | null;
  parent: YAMLMap | YAMLSeq | null;
  index: number;
}

interface RenderOptions {
  indent: number;
  indentSeq: boolean;
  flowCollectionPadding: boolean;
  lineWidth: number;
  minContentWidth: number;
}

interface Edit {
  start: number;
  end: number;
  text: string;
  order: number;
}

/** A child of a collection, located in the source text */
interface Entry {
  /** Offset of the key (maps) or of the `-` indicator / item (sequences) */
  start: number;
  /** Offset right after the last character of the entry's content */
  end: number;
  /** Whether a comment directly above the entry belongs to it */
  commentBefore: boolean;
}

/** How a node is embedded in its parent, which decides how to replace it */
type Context =
  | { kind: 'root' }
  /** Item of a flow collection; `pair` locates the whole `key: value` */
  | { kind: 'flow'; pair?: { start: number; end: number; key: string } }
  /** Value of a block map pair or block sequence item, after `:` or `-` */
  | { kind: 'pair' | 'item'; after: number; col: number };

/** Thrown when the source can not be edited in place safely */
class Bail extends Error {}

function parse(source: string): Document {
  return parseDocument(source, { keepSourceTokens: true, strict: false });
}

function isCollection(node: unknown): node is YAMLMap | YAMLSeq {
  return isMap(node) || isSeq(node);
}

/**
 * Computes the edits that turn the source of a document into one that
 * represents a new value, touching only what changed.
 */
class Patcher {
  private edits: Edit[] = [];
  /** Anchors whose node is gone, aliases to them have to be inlined */
  private removed = new Set<string>();
  /** Anchors whose node got a new value, aliases to them follow */
  private changed = new Map<string, any>();

  constructor(
    private src: string,
    private doc: Document,
    private style: RenderOptions
  ) {}

  run(value: any, old: any): string {
    this.reconcile(this.doc.contents, value, old, { kind: 'root' });
    if (this.src.indexOf('\r\n') !== -1) {
      this.edits.forEach(edit => {
        edit.text = edit.text.replace(/\r?\n/g, '\r\n');
      });
    }
    return applyEdits(this.src, this.edits);
  }

  private push(start: number, end: number, text: string): void {
    if (start === end && !text) return;
    if (end < start) throw new Bail();
    this.edits.push({ start, end, text, order: this.edits.length });
  }

  private reconcile(node: unknown, value: any, old: any, ctx: Context): void {
    if (isAlias(node)) {
      const name = node.source;
      const expected = this.changed.has(name) ? this.changed.get(name) : old;
      if (!this.removed.has(name) && deepEqual(expected, value)) return;
      this.replace(node, value, ctx);
      return;
    }

    const same = deepEqual(old, value);
    if (same) {
      const anchorsTouched = this.changed.size > 0 || this.removed.size > 0;
      if (!anchorsTouched || !isCollection(node) || !hasAlias(node)) return;
    }

    const kind = kindOf(value);
    if (isMap(node) && kind === 'object') {
      if (node.anchor && !same) this.changed.set(node.anchor, value);
      this.reconcileMap(node, value, kindOf(old) === 'object' ? old : {}, ctx);
    } else if (isSeq(node) && kind === 'array') {
      if (node.anchor && !same) this.changed.set(node.anchor, value);
      this.reconcileSeq(node, value, kindOf(old) === 'array' ? old : [], ctx);
    } else {
      this.replace(node, value, ctx);
    }
  }

  private reconcileMap(
    map: YAMLMap,
    obj: Record<string, any>,
    old: Record<string, any>,
    ctx: Context
  ): void {
    const flow = !!map.flow;
    if (!flow && ctx.kind === 'flow') throw new Bail();

    const keys: string[] = [];
    const colons: number[] = [];
    const entries: Entry[] = [];
    const index = new Map<string, number>();

    map.items.forEach((pair, i) => {
      const tok: any = (pair as any).srcToken;
      const key = pair.key;
      if (!tok || !isScalar(key) || !key.range) throw new Bail();
      if (key.value !== null && typeof key.value === 'object') throw new Bail();
      const mark = (tok.start || []).find(
        (t: any) => t.type === 'explicit-key-ind'
      );
      const colon = (tok.sep || []).find(
        (t: any) => t.type === 'map-value-ind'
      );
      // Without a `:` there is no place for a value, except in `{ a, b }`
      if (!colon && !flow) throw new Bail();

      const name = keyOf(key);
      if (index.has(name)) throw new Bail();
      index.set(name, i);
      keys.push(name);
      colons.push(colon ? colon.offset : -1);

      const valueEnd = isNode(pair.value)
        ? contentEnd(this.src, pair.value)
        : -1;
      const hasValue = isNode(pair.value) && valueEnd > pair.value.range![0];
      const keyEnd = contentEnd(this.src, key);
      entries.push({
        start: mark ? mark.offset : key.range[0],
        end: hasValue ? valueEnd : colon ? colon.offset + 1 : keyEnd,
        commentBefore: !!key.commentBefore,
      });
    });

    const keep = keys.map(key => hasOwn(obj, key));
    if (keep.indexOf(true) === -1) {
      this.replace(map, obj, ctx);
      return;
    }

    entries.forEach((entry, i) => {
      if (!keep[i]) {
        this.forget(map.items[i].value);
        return;
      }
      const key = keys[i];
      const child: Context = flow
        ? { kind: 'flow', pair: { start: entry.start, end: entry.end, key } }
        : {
            kind: 'pair',
            after: colons[i] + 1,
            col: column(this.src, entry.start),
          };
      this.reconcile(
        map.items[i].value,
        obj[key],
        hasOwn(old, key) ? old[key] : undefined,
        child
      );
    });

    // New keys go right after the key that precedes them in the new object
    const inserts = new Map<number, string[]>();
    let anchor = -1;
    for (const key of Object.keys(obj)) {
      const i = index.get(key);
      if (i !== undefined) {
        anchor = i;
        continue;
      }
      const text = flow
        ? this.renderFlow(obj[key], undefined, key)
        : this.renderBlock(new Map([[key, obj[key]]]));
      inserts.set(anchor, (inserts.get(anchor) || []).concat(text));
    }

    this.restructure(entries, keep, inserts, flow, ctx.kind === 'root');
  }

  private reconcileSeq(
    seq: YAMLSeq,
    arr: any[],
    old: any[],
    ctx: Context
  ): void {
    const flow = !!seq.flow;
    if (!flow && ctx.kind === 'flow') throw new Bail();
    if (old.length !== seq.items.length) throw new Bail();

    const dashes = flow ? [] : dashOffsets(seq);
    const entries: Entry[] = seq.items.map((item, i) => {
      if (!isNode(item) || !item.range) throw new Bail();
      const end = contentEnd(this.src, item);
      const hasValue = end > item.range[0];
      if (flow && !hasValue) throw new Bail();
      return {
        start: flow ? item.range[0] : dashes[i],
        end: hasValue ? end : dashes[i] + 1,
        commentBefore: !!item.commentBefore,
      };
    });

    const { match, inserts: added } = diffArrays(old, arr);
    const keep = match.map(j => j !== -1);
    if (keep.indexOf(true) === -1) {
      this.replace(seq, arr, ctx);
      return;
    }

    entries.forEach((entry, i) => {
      if (!keep[i]) {
        this.forget(seq.items[i]);
        return;
      }
      const child: Context = flow
        ? { kind: 'flow' }
        : {
            kind: 'item',
            after: entry.start + 1,
            col: column(this.src, entry.start),
          };
      this.reconcile(seq.items[i], arr[match[i]], old[i], child);
    });

    const inserts = new Map<number, string[]>();
    added.forEach((indices, anchor) => {
      inserts.set(
        anchor,
        indices.map(j =>
          flow ? this.renderFlow(arr[j]) : this.renderBlock([arr[j]])
        )
      );
    });

    this.restructure(entries, keep, inserts, flow, ctx.kind === 'root');
  }

  /**
   * Removes dropped entries from a collection and adds new ones
   * @param inserts - rendered new entries, keyed by the index of the kept
   *   entry they follow (-1 to put them in front)
   */
  private restructure(
    entries: Entry[],
    keep: boolean[],
    inserts: Map<number, string[]>,
    flow: boolean,
    root: boolean
  ): void {
    const src = this.src;
    const count = entries.length;
    const firstKept = keep.indexOf(true);
    const lastKept = keep.lastIndexOf(true);

    if (flow) {
      for (let i = 0; i < lastKept; i++) {
        if (!keep[i]) this.push(entries[i].start, entries[i + 1].start, '');
      }
      if (lastKept < count - 1) {
        this.push(entries[lastKept].end, entries[count - 1].end, '');
      }
      inserts.forEach((units, anchor) => {
        if (anchor === -1) {
          const at = entries[firstKept].start;
          const sep = flowSeparator(src, at);
          this.push(at, at, units.map(unit => unit + sep).join(''));
        } else {
          const at = entries[anchor].end;
          const sep = flowSeparator(src, entries[anchor].start);
          this.push(at, at, units.map(unit => sep + unit).join(''));
        }
      });
      return;
    }

    const pad = ' '.repeat(column(src, entries[0].start));
    const ownsComment = (i: number): boolean =>
      entries[i].commentBefore && !(root && i === 0);
    const blockStart = (i: number): number => {
      const from = lineStart(src, entries[i].start);
      if (!ownsComment(i)) return from;
      return commentBlockStart(src, from, i > 0 ? entries[i - 1].end : 0);
    };

    for (let i = 0; i < count; i++) {
      if (keep[i]) continue;
      const entry = entries[i];
      if (!atLineStart(src, entry.start)) {
        // The entry shares its line with the parent's indicator (`- a: 1`):
        // pull the next surviving entry up in its place.
        let next = i + 1;
        while (next < count && !keep[next]) next++;
        if (next >= count) throw new Bail();
        this.push(entry.start, entries[next].start, '');
        i = next - 1;
        continue;
      }
      this.push(blockStart(i), nextLine(src, entry.end), '');
    }

    inserts.forEach((units, anchor) => {
      if (anchor !== -1) {
        // New lines go below the last line of the entry they follow
        const eol = afterNestedComments(src, entries[anchor].end, pad.length);
        const last = src.indexOf('\n', eol) === -1;
        const at = last ? src.length : nextLine(src, eol);
        this.push(
          at,
          at,
          units
            .map(unit => pad + indentLines(unit, pad))
            .map(line => (last ? '\n' + line : line + '\n'))
            .join('')
        );
      } else if (atLineStart(src, entries[0].start)) {
        const at = blockStart(firstKept);
        this.push(
          at,
          at,
          units.map(unit => pad + indentLines(unit, pad) + '\n').join('')
        );
      } else {
        const at = entries[firstKept].start;
        this.push(
          at,
          at,
          units.map(unit => indentLines(unit, pad) + '\n' + pad).join('')
        );
      }
    });
  }

  /**
   * Replaces a node with a freshly rendered value
   */
  private replace(node: unknown, value: any, ctx: Context): void {
    const src = this.src;
    const range = isNode(node) && node.range ? node.range : undefined;
    const end = range ? contentEnd(src, node as Node) : -1;
    const empty = !range || end === range[0];
    const from = isScalar(node) ? node : undefined;

    if (ctx.kind === 'flow') {
      if (!range || empty) {
        // `{ a }` or `{ a: }`: there is no value to swap, rewrite the pair
        if (!ctx.pair) throw new Bail();
        const { start, end: stop, key } = ctx.pair;
        this.push(start, stop, this.renderFlow(value, undefined, key));
        return;
      }
      this.forget(node);
      this.push(range[0], end, this.renderFlow(value, from));
      return;
    }

    const render = (comment?: string): string => {
      if (ctx.kind === 'root') {
        const lead =
          range && atLineStart(src, range[0]) ? column(src, range[0]) : 0;
        return indentLines(
          this.renderBlock(value, from, false, comment),
          ' '.repeat(lead)
        );
      }
      const wrapped = ctx.kind === 'pair' ? { k: value } : [value];
      const rendered = this.renderBlock(wrapped, from, true, comment);
      // Drop the `k:` or `-` of the wrapper, keeping what follows it
      return indentLines(
        rendered.slice(ctx.kind === 'pair' ? 2 : 1),
        ' '.repeat(ctx.col)
      );
    };
    let text = render();

    // A scalar that stays on its line is swapped in place, which keeps
    // its anchor, tag and the spacing around it.
    const scalar = kindOf(value) === 'primitive' || kindOf(value) === 'null';
    if (from && range && !empty && scalar && text.indexOf('\n') === -1) {
      const retyped = !!from.tag && typeof from.value !== typeof value;
      if (!isBlockScalar(from) && !retyped) {
        if (from.anchor) this.changed.set(from.anchor, value);
        this.push(range[0], end, ctx.kind === 'root' ? text : text.slice(1));
        return;
      }
    }

    this.forget(node);

    if (ctx.kind === 'root' && (!range || empty)) {
      const at = src.length;
      const gap = at > 0 && src[at - 1] !== '\n' ? '\n' : '';
      this.push(at, at, gap + text + '\n');
      return;
    }

    const start = ctx.kind === 'root' ? range![0] : ctx.after;
    let stop = empty ? start : Math.max(end, start);

    if (from && from.comment && isBlockScalar(from)) {
      // The comment on the header of a block scalar is part of its range
      text = render(from.comment);
    } else if (text.indexOf('\n') !== -1) {
      // A comment trailing the old value has to move along, since it
      // can not just follow the last line of the new value.
      const eol = lineEnd(src, stop);
      const trailing = /^[ \t]*#(.*)$/.exec(src.slice(stop, eol));
      if (trailing) {
        // A block collection starts on the next line: stay next to the key
        const nested = ctx.kind === 'pair' && text[0] === '\n';
        text = nested ? ' #' + trailing[1] + text : render(trailing[1]);
        stop = eol;
      } else if (!src.slice(stop, eol).trim()) {
        stop = eol;
      }
    }

    this.push(start, stop, text);
  }

  /** Records the anchors of a subtree that is being removed */
  private forget(node: unknown): void {
    if (!isNode(node)) return;
    visit(node, {
      Node: (_key, child) => {
        const anchor = (child as any).anchor;
        if (anchor) this.removed.add(anchor);
      },
    });
  }

  /**
   * Renders a value in block style, without the final line break
   * @param inner - style the first child of the value instead of the value
   */
  private renderBlock(
    value: any,
    from?: Scalar,
    inner?: boolean,
    comment?: string
  ): string {
    const doc = new Document(value);
    const target = inner ? firstChild(doc.contents) : doc.contents;
    copyStyle(from, target, inner ? firstValue(value) : value);
    if (comment && isNode(target)) target.comment = comment;
    return doc.toString(this.style).replace(/\n$/, '');
  }

  /**
   * Renders a value (or a `key: value` pair) for use inside a flow collection
   */
  private renderFlow(value: any, from?: Scalar, key?: string): string {
    const doc = new Document(
      key === undefined ? [value] : new Map([[key, value]])
    );
    (doc.contents as any).flow = true;
    copyStyle(from, firstChild(doc.contents), value);
    // Keep every scalar on one line
    visit(doc, {
      Scalar: (_key, node) => {
        if (typeof node.value === 'string' && node.value.indexOf('\n') !== -1) {
          node.type = 'QUOTE_DOUBLE';
        }
      },
    });
    const text = doc.toString({ ...this.style, lineWidth: 0 }).trim();
    if (text.indexOf('\n') !== -1) throw new Bail();
    const pad = text[1] === ' ' ? 2 : 1;
    return text.slice(pad, text.length - pad);
  }
}

// ---------------------------------------------------------------------------
// Tree based update, used when the source can not be edited in place
// ---------------------------------------------------------------------------

/**
 * Updates a node to represent a new value and returns the node to use in
 * its place, keeping comments wherever possible.
 */
function patchNode(
  doc: Document,
  node: unknown,
  value: any,
  old: any
): unknown {
  if (!isAlias(node)) {
    if (isNode(node) && deepEqual(old, value)) return node;
    const kind = kindOf(value);

    if (isMap(node) && kind === 'object') {
      const before = kindOf(old) === 'object' ? old : {};
      const seen = new Set<string>();
      node.items = node.items.filter(pair => {
        const key = keyOf(pair.key);
        if (seen.has(key) || !hasOwn(value, key)) return false;
        seen.add(key);
        pair.value = patchNode(doc, pair.value, value[key], before[key]) as any;
        return true;
      });
      for (const key of Object.keys(value)) {
        if (!seen.has(key)) {
          node.items.push(
            new Pair(new Scalar(key), doc.createNode(value[key])) as any
          );
        }
      }
      return node;
    }

    if (isSeq(node) && kind === 'array') {
      const before = kindOf(old) === 'array' ? old : [];
      const { match, inserts } = diffArrays(before, value);
      const items: unknown[] = [];
      const add = (anchor: number): void => {
        (inserts.get(anchor) || []).forEach(j =>
          items.push(doc.createNode(value[j]))
        );
      };
      add(-1);
      node.items.forEach((item, i) => {
        if (match[i] === -1 || match[i] === undefined) return;
        items.push(patchNode(doc, item, value[match[i]], before[i]));
        add(i);
      });
      node.items = items;
      return node;
    }

    if (isScalar(node) && (kind === 'primitive' || kind === 'null')) {
      const type = node.type;
      if (node.tag && typeof node.value !== typeof value) node.tag = undefined;
      node.value = value;
      if (typeof value === 'string') {
        const block = type === 'BLOCK_LITERAL' || type === 'BLOCK_FOLDED';
        node.type = block && value.indexOf('\n') === -1 ? undefined : type;
      } else {
        node.type = undefined;
      }
      return node;
    }
  } else if (deepEqual(old, value)) {
    return node;
  }

  const created = doc.createNode(value);
  if (isNode(node) && isNode(created)) {
    created.comment = node.comment;
    created.commentBefore = node.commentBefore;
    created.spaceBefore = node.spaceBefore;
  }
  return created;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function applyEdits(source: string, edits: Edit[]): string {
  const sorted = edits
    .slice()
    .sort((a, b) => a.start - b.start || a.end - b.end || a.order - b.order);
  let result = '';
  let cursor = 0;
  for (const edit of sorted) {
    if (edit.start < cursor) throw new Bail();
    result += source.slice(cursor, edit.start) + edit.text;
    cursor = edit.end;
  }
  return result + source.slice(cursor);
}

function lineStart(src: string, offset: number): number {
  return src.lastIndexOf('\n', offset - 1) + 1;
}

function lineEnd(src: string, offset: number): number {
  let end = src.indexOf('\n', offset);
  if (end === -1) end = src.length;
  if (end > offset && src[end - 1] === '\r') end--;
  return end;
}

/** Start of the line after the one that contains `offset` */
function nextLine(src: string, offset: number): number {
  const end = src.indexOf('\n', offset);
  return end === -1 ? src.length : end + 1;
}

/**
 * End of the last line that belongs to an entry ending at `offset`: its
 * own line, or the last of the comment lines below it that are indented
 * deeper than the collection the entry is part of.
 */
function afterNestedComments(src: string, offset: number, col: number): number {
  let end = lineEnd(src, offset);
  let probe = end;
  while (src.indexOf('\n', probe) !== -1) {
    const start = nextLine(src, probe);
    probe = lineEnd(src, start);
    const line = src.slice(start, probe);
    const text = line.trim();
    if (!text) continue;
    if (text[0] !== '#' || line.length - line.replace(/^ +/, '').length <= col)
      break;
    end = probe;
  }
  return end;
}

function column(src: string, offset: number): number {
  return offset - lineStart(src, offset);
}

function atLineStart(src: string, offset: number): boolean {
  return /^ *$/.test(src.slice(lineStart(src, offset), offset));
}

/** Offset right after the last non-blank character of a node */
function contentEnd(src: string, node: Node): number {
  const range = node.range;
  if (!range) throw new Bail();
  let end = range[1];
  while (end > range[0] && /\s/.test(src[end - 1])) end--;
  return end;
}

/**
 * Start of the block of comment lines that ends right before `from`
 * (which is the start of a line) and begins after `limit`.
 */
function commentBlockStart(src: string, from: number, limit: number): number {
  while (from > 0) {
    const start = lineStart(src, from - 1);
    if (start < limit || (limit > 0 && start === lineStart(src, limit))) break;
    if (src.slice(start, from).trim()[0] !== '#') break;
    from = start;
  }
  return from;
}

/** Separator between flow items, matching one-per-line layouts */
function flowSeparator(src: string, itemStart: number): string {
  const start = lineStart(src, itemStart);
  const lead = src.slice(start, itemStart);
  return start > 0 && /^[ \t]*$/.test(lead) ? ',\n' + lead : ', ';
}

function indentLines(text: string, pad: string): string {
  if (!pad || text.indexOf('\n') === -1) return text;
  return text
    .split('\n')
    .map((line, i) => (i === 0 || line === '' ? line : pad + line))
    .join('\n');
}

/** Offsets of the `-` indicators of a block sequence */
function dashOffsets(seq: YAMLSeq): number[] {
  const tok: any = (seq as any).srcToken;
  if (!tok || tok.type !== 'block-seq') throw new Bail();
  const offsets: number[] = [];
  for (const item of tok.items) {
    const dash = (item.start || []).find((t: any) => t.type === 'seq-item-ind');
    if (dash) offsets.push(dash.offset);
  }
  if (offsets.length !== seq.items.length) throw new Bail();
  return offsets;
}

function isBlockScalar(node: Scalar): boolean {
  return node.type === 'BLOCK_LITERAL' || node.type === 'BLOCK_FOLDED';
}

function firstChild(node: unknown): unknown {
  if (isMap(node)) return node.items[0] && node.items[0].value;
  if (isSeq(node)) return node.items[0];
  return undefined;
}

function firstValue(value: any): any {
  return Array.isArray(value) ? value[0] : value.k;
}

/** Carries the style of a scalar over to the scalar that replaces it */
function copyStyle(from: Scalar | undefined, to: unknown, value: any): void {
  if (!from || !isScalar(to)) return;
  if (typeof value === 'string' && typeof from.value === 'string') {
    const block = from.type === 'BLOCK_LITERAL' || from.type === 'BLOCK_FOLDED';
    if (!block || value.indexOf('\n') !== -1) to.type = from.type;
  } else if (typeof value === 'number' && typeof from.value === 'number') {
    to.format = from.format;
    to.minFractionDigits = from.minFractionDigits;
  }
}

function hasAlias(node: Node): boolean {
  let found = false;
  visit(node, {
    Alias: () => {
      found = true;
      return visit.BREAK;
    },
  });
  return found;
}

/** The property name a map key gets in the JSON representation */
function keyOf(key: unknown): string {
  if (isScalar(key)) {
    return key.value === null || key.value === undefined
      ? ''
      : String(key.value);
  }
  return String(key);
}

function hasOwn(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

interface DetectedStyle {
  indent?: number;
  indentSeq?: boolean;
  flowPadding?: boolean;
}

/** Looks at the source to find out how new content should be formatted */
function detectStyle(src: string, doc: Document): DetectedStyle {
  const style: DetectedStyle = {};
  try {
    visit(doc, {
      Pair: (_key, pair) => {
        const key = pair.key;
        const value = pair.value;
        if (!isNode(key) || !key.range || !isCollection(value) || value.flow)
          return;
        const tok: any = (value as any).srcToken;
        if (!tok || typeof tok.offset !== 'number') return;
        if (lineStart(src, tok.offset) <= key.range[0]) return;
        const delta = column(src, tok.offset) - column(src, key.range[0]);
        if (isSeq(value)) {
          if (style.indentSeq === undefined) style.indentSeq = delta > 0;
        } else if (style.indent === undefined && delta > 0) {
          style.indent = delta;
        }
      },
      Collection: (_key, node) => {
        if (!node.flow || !node.range || !node.items.length) return;
        if (style.flowPadding === undefined) {
          style.flowPadding = /\s/.test(src[node.range[0] + 1]);
        }
      },
    });
  } catch (e) {
    // defaults are fine
  }
  return style;
}

/**
 * Aligns two arrays. `match[i]` is the index in `next` that the i-th old
 * item turns into (-1 when it is dropped), `inserts` lists the indices of
 * new items by the index of the old item they follow (-1 for the front).
 */
function diffArrays(
  old: any[],
  next: any[]
): { match: number[]; inserts: Map<number, number[]> } {
  const a = old.map(stableKey);
  const b = next.map(stableKey);
  const pairs: Array<[number, number]> = [];

  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) {
    pairs.push([head, head]);
    head++;
  }
  let tail = 0;
  while (
    tail < a.length - head &&
    tail < b.length - head &&
    a[a.length - 1 - tail] === b[b.length - 1 - tail]
  ) {
    tail++;
  }

  const n = a.length - head - tail;
  const m = b.length - head - tail;
  if (n > 0 && m > 0 && n * m <= 1000000) {
    // Longest common subsequence of the part in the middle
    const width = m + 1;
    const table = new Uint32Array((n + 1) * width);
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        table[i * width + j] =
          a[head + i] === b[head + j]
            ? table[(i + 1) * width + j + 1] + 1
            : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
      }
    }
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (a[head + i] === b[head + j]) {
        pairs.push([head + i++, head + j++]);
      } else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) {
        i++;
      } else {
        j++;
      }
    }
  }
  for (let t = tail; t > 0; t--) {
    pairs.push([a.length - t, b.length - t]);
  }

  // Between two matches, old items are updated in place as far as they go
  const match: number[] = old.map(() => -1);
  const inserts = new Map<number, number[]>();
  let i = 0;
  let j = 0;
  pairs.concat([[a.length, b.length]]).forEach(([pi, pj]) => {
    while (i < pi && j < pj) match[i++] = j++;
    if (j < pj) {
      const added: number[] = [];
      while (j < pj) added.push(j++);
      inserts.set(i - 1, added);
    }
    if (pi < a.length) match[pi] = pj;
    i = pi + 1;
    j = pj + 1;
  });

  return { match, inserts };
}

function stableKey(value: any): string {
  const key = JSON.stringify(value);
  return key === undefined ? 'undefined' : key;
}

/**
 * Determines the general type category of a value
 */
function kindOf(value: any): 'null' | 'array' | 'object' | 'primitive' {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return 'primitive';
}

/**
 * Turns a value into what it would be after a JSON round trip, without
 * giving up the numbers that YAML can represent and JSON can not.
 */
function normalize(value: any): any {
  if (value === null || value === undefined) return null;
  if (typeof value === 'function' || typeof value === 'symbol') return null;
  if (typeof value !== 'object') return value;
  if (typeof value.toJSON === 'function') return normalize(value.toJSON());
  if (Array.isArray(value)) return value.map(normalize);

  const result: Record<string, any> = {};
  for (const key of Object.keys(value)) {
    const item = value[key];
    if (
      item === undefined ||
      typeof item === 'function' ||
      typeof item === 'symbol'
    ) {
      continue;
    }
    Object.defineProperty(result, key, {
      value: normalize(item),
      enumerable: true,
      writable: true,
      configurable: true,
    });
  }
  return result;
}

/** Comment text without the differences that do not survive a round trip */
function squash(comment: string): string {
  return comment
    .split(/\r?\n/)
    .map(line => line.trim())
    .join('\n')
    .trim();
}

/**
 * Deep equality check for JSON values
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return a !== a && b !== b;
  if (a === null || b === null || a === undefined || b === undefined)
    return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const arrayA = Array.isArray(a);
  if (arrayA !== Array.isArray(b)) return false;

  if (arrayA) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  for (const key of keysA) {
    if (!hasOwn(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}
