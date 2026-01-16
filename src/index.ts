'use strict';

import {
  parseDocument,
  Document,
  isMap,
  isSeq,
  isScalar,
  isPair,
  isNode,
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
interface YAWNOptions {
  /** Preserve original indentation (default: true) */
  preserveIndent?: boolean;
  /** Default indentation for new content (default: 2) */
  indent?: number;
  /** Line width for flow styles (default: 80) */
  lineWidth?: number;
}

/**
 * YAWN - YAML parser that preserves comments and formatting
 *
 * YAWN allows you to modify YAML files programmatically while preserving
 * comments, formatting, and other non-semantic content.
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
  private document: Document;
  private options: YAWNOptions;

  /**
   * Creates a new YAWN instance from a YAML string
   * @param yaml - The YAML string to parse
   * @param options - Optional configuration options
   */
  constructor(yaml: string, options: YAWNOptions = {}) {
    if (typeof yaml !== 'string') {
      throw new TypeError('yaml should be a string');
    }

    this.options = {
      preserveIndent: true,
      indent: 2,
      lineWidth: 80,
      ...options,
    };

    // Parse with options that preserve as much as possible
    this.document = parseDocument(yaml, {
      keepSourceTokens: true,
      strict: false,
    });
  }

  /**
   * Gets the YAML string representation
   */
  get yaml(): string {
    return this.document.toString({
      indent: this.options.indent,
      lineWidth: this.options.lineWidth,
      minContentWidth: 0,
    });
  }

  /**
   * Sets the YAML string (re-parses the document)
   */
  set yaml(value: string) {
    this.document = parseDocument(value, {
      keepSourceTokens: true,
      strict: false,
    });
  }

  /**
   * Gets the JSON representation of the YAML document
   */
  get json(): any {
    return this.document.toJS();
  }

  /**
   * Sets the JSON and updates the YAML while preserving comments
   * @param newJson - The new JSON value to set
   */
  set json(newJson: any) {
    const currentJson = this.json;

    // If nothing changed, do nothing
    if (deepEqual(currentJson, newJson)) {
      return;
    }

    // Handle undefined/null - clear the document
    if (newJson === undefined) {
      this.document = new Document(null);
      return;
    }

    // Update the document recursively, preserving comments
    this.updateNode(this.document.contents, newJson, currentJson);
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
    const node = this.getNodeAtPath(path);
    if (!node || !isNode(node)) {
      return '';
    }

    // Get trailing comment (inline comment)
    if (node.comment) {
      return node.comment.trim();
    }

    return '';
  }

  /**
   * Sets the comment (remark) at a given path
   * @param path - Dot-separated path to the node
   * @param remark - The comment text (without # prefix)
   * @returns true if successful, false if path not found
   */
  setRemark(path: string, remark: string): boolean {
    const node = this.getNodeAtPath(path);
    if (!node || !isNode(node)) {
      return false;
    }

    node.comment = remark ? ` ${remark}` : undefined;
    return true;
  }

  /**
   * Gets the comment before a node (block comment)
   * @param path - Dot-separated path to the node
   * @returns The comment text, or empty string if no comment
   */
  getCommentBefore(path: string): string {
    // For map entries, the commentBefore is on the key node of the pair
    const result = this.getNodeAndPairAtPath(path);
    if (!result) {
      return '';
    }

    const { node, pair } = result;

    // Check pair's key commentBefore first (for map entries)
    if (pair && isPair(pair) && isNode(pair.key)) {
      if ((pair.key as any).commentBefore) {
        return (pair.key as any).commentBefore.trim();
      }
    }

    // Check the node itself
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
    const result = this.getNodeAndPairAtPath(path);
    if (!result) {
      return false;
    }

    const { node, pair } = result;
    // yaml package expects commentBefore without leading space
    // but the # is added automatically during serialization
    const normalizedComment = comment ? ` ${comment}` : undefined;

    // For map entries, set commentBefore on the key node
    if (pair && isPair(pair) && isNode(pair.key)) {
      (pair.key as any).commentBefore = normalizedComment;
      return true;
    }

    // For other nodes, set on the node itself
    if (isNode(node)) {
      node.commentBefore = normalizedComment;
      return true;
    }

    return false;
  }

  /**
   * Updates a node in the document while preserving comments
   */
  private updateNode(node: any, newValue: any, oldValue: any): void {
    // Handle null/undefined new value
    if (newValue === null || newValue === undefined) {
      if (isMap(this.document.contents) || isSeq(this.document.contents)) {
        this.document.contents = this.document.createNode(newValue);
      }
      return;
    }

    // Handle type change (e.g., object -> array, primitive -> object)
    const newType = getValueType(newValue);
    const oldType = getValueType(oldValue);

    if (newType !== oldType) {
      // Type changed - replace the entire contents
      const newNode = this.document.createNode(newValue);
      // Try to preserve document-level comments
      if (isNode(this.document.contents)) {
        const oldContents = this.document.contents;
        if (isNode(newNode)) {
          newNode.commentBefore = oldContents.commentBefore;
        }
      }
      this.document.contents = newNode;
      return;
    }

    // Handle maps (objects)
    if (isMap(node) && typeof newValue === 'object' && !Array.isArray(newValue)) {
      this.updateMap(node, newValue, oldValue || {});
      return;
    }

    // Handle sequences (arrays)
    if (isSeq(node) && Array.isArray(newValue)) {
      this.updateSeq(node, newValue, oldValue || []);
      return;
    }

    // Handle scalars (primitives)
    if (isScalar(node)) {
      this.updateScalar(node, newValue);
      return;
    }

    // Fallback: replace entirely
    this.document.contents = this.document.createNode(newValue);
  }

  /**
   * Updates a map (object) node while preserving comments
   */
  private updateMap(mapNode: YAMLMap, newObj: Record<string, any>, oldObj: Record<string, any>): void {
    const existingKeys = new Set<string>();

    // Update existing keys and track deletions
    const itemsToRemove: number[] = [];

    for (let i = 0; i < mapNode.items.length; i++) {
      const pair = mapNode.items[i];
      if (!isPair(pair)) continue;

      const key = isScalar(pair.key) ? String(pair.key.value) : String(pair.key);
      existingKeys.add(key);

      if (!(key in newObj)) {
        // Key was deleted
        itemsToRemove.push(i);
      } else {
        // Key exists - check if value changed
        const newVal = newObj[key];
        const oldVal = oldObj[key];

        if (!deepEqual(newVal, oldVal)) {
          this.updatePairValue(pair, newVal, oldVal);
        }
      }
    }

    // Remove deleted items (in reverse order to maintain indices)
    for (let i = itemsToRemove.length - 1; i >= 0; i--) {
      mapNode.items.splice(itemsToRemove[i], 1);
    }

    // Add new keys
    for (const key of Object.keys(newObj)) {
      if (!existingKeys.has(key)) {
        const newNode = this.document.createNode(newObj[key]);
        mapNode.add(new Pair(new Scalar(key), newNode));
      }
    }
  }

  /**
   * Updates a sequence (array) node while preserving comments
   */
  private updateSeq(seqNode: YAMLSeq, newArr: any[], oldArr: any[]): void {
    const minLen = Math.min(seqNode.items.length, newArr.length);

    // Update existing items
    for (let i = 0; i < minLen; i++) {
      const item = seqNode.items[i];
      const newVal = newArr[i];
      const oldVal = oldArr[i];

      // Only update if value actually changed
      if (!deepEqual(newVal, oldVal)) {
        if (isNode(item)) {
          this.updateNodeValue(seqNode, i, item, newVal, oldVal);
        } else {
          seqNode.set(i, this.document.createNode(newVal));
        }
      }
    }

    // Remove extra items (in reverse to maintain indices)
    while (seqNode.items.length > newArr.length) {
      seqNode.items.pop();
    }

    // Add new items
    for (let i = seqNode.items.length; i < newArr.length; i++) {
      seqNode.add(this.document.createNode(newArr[i]));
    }
  }

  /**
   * Updates a pair's value while preserving the value node's comments
   */
  private updatePairValue(pair: Pair, newValue: any, oldValue: any): void {
    const valueNode = pair.value;

    // Determine if we need to replace the entire node due to type change
    const oldType = getValueType(oldValue);
    const newType = getValueType(newValue);
    const typeChanged = oldType !== newType;

    if (!typeChanged && isMap(valueNode) && typeof newValue === 'object' && !Array.isArray(newValue) && newValue !== null) {
      this.updateMap(valueNode, newValue, oldValue || {});
    } else if (!typeChanged && isSeq(valueNode) && Array.isArray(newValue)) {
      this.updateSeq(valueNode, newValue, oldValue || []);
    } else if (!typeChanged && isScalar(valueNode) && (typeof newValue !== 'object' || newValue === null)) {
      this.updateScalar(valueNode, newValue);
    } else {
      // Type changed or incompatible - replace the value but preserve any comment
      const newNode = this.document.createNode(newValue);
      if (isNode(valueNode) && isNode(newNode)) {
        newNode.comment = valueNode.comment;
        newNode.commentBefore = valueNode.commentBefore;
      }
      pair.value = newNode;
    }
  }

  /**
   * Updates a node's value in a sequence while preserving comments
   */
  private updateNodeValue(seqNode: YAMLSeq, index: number, node: Node, newValue: any, oldValue: any): void {
    if (isMap(node) && typeof newValue === 'object' && !Array.isArray(newValue) && newValue !== null) {
      this.updateMap(node, newValue, oldValue || {});
    } else if (isSeq(node) && Array.isArray(newValue)) {
      this.updateSeq(node, newValue, oldValue || []);
    } else if (isScalar(node)) {
      this.updateScalar(node, newValue);
    } else {
      // Replace the node but preserve comments
      const newNode = this.document.createNode(newValue);
      if (isNode(newNode)) {
        newNode.comment = node.comment;
        newNode.commentBefore = node.commentBefore;
      }
      seqNode.set(index, newNode);
    }
  }

  /**
   * Updates a scalar value while preserving its style and comments
   */
  private updateScalar(scalar: Scalar, newValue: any): void {
    // Preserve the original type/style if the new value is compatible
    const oldType = scalar.type;

    scalar.value = newValue;

    // If the original was quoted and new value is a string, keep quoted
    if (oldType === 'QUOTE_DOUBLE' || oldType === 'QUOTE_SINGLE') {
      if (typeof newValue === 'string') {
        scalar.type = oldType;
      }
    }

    // Preserve block scalar styles
    if (oldType === 'BLOCK_LITERAL' || oldType === 'BLOCK_FOLDED') {
      if (typeof newValue === 'string' && newValue.includes('\n')) {
        scalar.type = oldType;
      }
    }
  }

  /**
   * Gets a node at a given dot-separated path
   */
  private getNodeAtPath(path: string): any {
    const result = this.getNodeAndPairAtPath(path);
    return result ? result.node : undefined;
  }

  /**
   * Gets a node and its parent pair at a given dot-separated path
   */
  private getNodeAndPairAtPath(path: string): { node: any; pair: Pair | null } | undefined {
    if (!path) {
      return { node: this.document.contents, pair: null };
    }

    const parts = path.split('.');
    let current: any = this.document.contents;
    let currentPair: Pair | null = null;

    for (const part of parts) {
      if (!current) return undefined;

      if (isMap(current)) {
        // Find the pair with this key
        const pair = current.items.find((item: any) => {
          if (isPair(item)) {
            const key = isScalar(item.key) ? item.key.value : item.key;
            return String(key) === part;
          }
          return false;
        }) as Pair | undefined;

        if (!pair) return undefined;
        currentPair = pair;
        current = pair.value;
      } else if (isSeq(current)) {
        const index = parseInt(part, 10);
        if (isNaN(index)) return undefined;
        currentPair = null;
        current = current.items[index];
      } else {
        return undefined;
      }
    }

    return { node: current, pair: currentPair };
  }
}

/**
 * Determines the general type category of a value
 */
function getValueType(value: any): 'null' | 'array' | 'object' | 'primitive' {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return 'primitive';
}

/**
 * Deep equality check for JSON values
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

// Also export the class as named export for convenience
export { YAWN };
