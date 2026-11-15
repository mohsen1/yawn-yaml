/**
 * Assigning `json` must only touch the parts of the source that changed
 */
import YAWN from '../src';
import { parse } from 'yaml';

const SOURCE = `# header comment

server:
    host:   "localhost"   # the host
    port: 8080
    tags: [a, b,  c]   # flow
    opts: {x: 1, y: 2}

# about items
items:
- name: one   # first
  v: 1
- name: two
  v: 2
- name: three
text: |
    line1
    line2
last: 'q'   # end
`;

/** Applies a change to the JSON of SOURCE and returns the changed lines */
function edit(
  change: (json: any) => any
): { removed: string[]; added: string[] } {
  const yawn = new YAWN(SOURCE);
  const json = yawn.json;
  const next = change(json) || json;
  yawn.json = next;
  expect(yawn.json).toEqual(next);
  expect(parse(yawn.yaml)).toEqual(next);

  const before = SOURCE.split('\n');
  const after = yawn.yaml.split('\n');
  return {
    removed: before.filter(line => after.indexOf(line) === -1),
    added: after.filter(line => before.indexOf(line) === -1),
  };
}

describe('Source preservation', () => {
  it('returns the source untouched', () => {
    expect(new YAWN(SOURCE).yaml).toBe(SOURCE);
    const odd = 'a:   {  x:1 ,y: [ 1,2 ] }  \n\n\n# c\r\nb :   !!str 1';
    expect(new YAWN(odd).yaml).toBe(odd);
  });

  it('keeps the source when the same json is assigned', () => {
    const yawn = new YAWN(SOURCE);
    yawn.json = JSON.parse(JSON.stringify(yawn.json));
    expect(yawn.yaml).toBe(SOURCE);
  });

  describe('scalars', () => {
    it('changes only the value', () => {
      expect(edit(j => void (j.server.port = 9090))).toEqual({
        removed: ['    port: 8080'],
        added: ['    port: 9090'],
      });
    });

    it('keeps quotes, spacing and the trailing comment', () => {
      expect(edit(j => void (j.server.host = 'example.com'))).toEqual({
        removed: ['    host:   "localhost"   # the host'],
        added: ['    host:   "example.com"   # the host'],
      });
    });

    it('rewrites a block scalar with the indentation of the document', () => {
      expect(edit(j => void (j.text = 'a\nb\n'))).toEqual({
        removed: ['    line1', '    line2'],
        added: ['    a', '    b'],
      });
    });

    it('turns a block scalar into a plain one', () => {
      expect(edit(j => void (j.text = 'single'))).toEqual({
        removed: ['text: |', '    line1', '    line2'],
        added: ['text: single'],
      });
    });

    it('keeps the comment when a scalar becomes a multi line string', () => {
      const yawn = new YAWN("a: 'q'   # end\nb: 1\n");
      yawn.json = { a: 'multi\nline\n', b: 1 };
      expect(yawn.json).toEqual({ a: 'multi\nline\n', b: 1 });
      expect(yawn.getRemark('a')).toBe('end');
    });

    it('keeps number formats', () => {
      const yawn = new YAWN('hex: 0x10\nfloat: 1.0\n');
      yawn.json = { hex: 17, float: 2 };
      expect(yawn.yaml).toBe('hex: 0x11\nfloat: 2.0\n');
    });

    it('drops a tag that no longer fits', () => {
      const yawn = new YAWN('a: !!str 5 # c\n');
      yawn.json = { a: 5 };
      expect(yawn.json).toEqual({ a: 5 });
      expect(yawn.yaml).toContain('# c');
    });

    it('replaces a root scalar', () => {
      const yawn = new YAWN('# top\n5 # five\n');
      yawn.json = null;
      expect(yawn.yaml).toBe('# top\nnull # five\n');
      yawn.json = 'text';
      expect(yawn.yaml).toBe('# top\ntext # five\n');
    });
  });

  describe('maps', () => {
    it('adds a key with the indentation of the document', () => {
      expect(edit(j => void (j.server.extra = { deep: true }))).toEqual({
        removed: [],
        added: ['    extra:', '        deep: true'],
      });
    });

    it('removes only the lines of a key', () => {
      expect(edit(j => void delete j.server.port)).toEqual({
        removed: ['    port: 8080'],
        added: [],
      });
    });

    it('removes a key together with its comment', () => {
      expect(edit(j => void delete j.items).removed).toEqual([
        '# about items',
        'items:',
        '- name: one   # first',
        '  v: 1',
        '- name: two',
        '  v: 2',
        '- name: three',
      ]);
    });

    it('keeps the header comment when the first key is removed', () => {
      const yawn = new YAWN('# header\na: 1\nb: 2\n');
      yawn.json = { b: 2 };
      expect(yawn.yaml).toBe('# header\nb: 2\n');
    });

    it('puts new keys where they are in the new object', () => {
      const yawn = new YAWN('a: 1 # one\n# about b\nb: 2\n');
      yawn.json = { first: 0, a: 1, mid: 1.5, b: 2, last: 3 };
      expect(yawn.yaml).toBe(
        'first: 0\na: 1 # one\nmid: 1.5\n# about b\nb: 2\nlast: 3\n'
      );
    });

    it('edits flow maps in place', () => {
      expect(edit(j => void (j.server.opts.z = [1, 'two']))).toEqual({
        removed: ['    opts: {x: 1, y: 2}'],
        added: ['    opts: {x: 1, y: 2, z: [1, two]}'],
      });
      expect(edit(j => void delete j.server.opts.x).added).toEqual([
        '    opts: {y: 2}',
      ]);
      expect(edit(j => void delete j.server.opts.y).added).toEqual([
        '    opts: {x: 1}',
      ]);
    });

    it('removes the first key of a map inside a sequence', () => {
      expect(edit(j => void delete j.items[0].name)).toEqual({
        removed: ['- name: one   # first', '  v: 1'],
        added: ['- v: 1'],
      });
    });

    it('replaces a value with a collection and keeps its comment', () => {
      expect(edit(j => void (j.last = [1, 2]))).toEqual({
        removed: ["last: 'q'   # end"],
        added: ['last: # end', '  - 1', '  - 2'],
      });
    });

    it('handles explicit keys', () => {
      const yawn = new YAWN('? complex\n: value # c\nplain: 1\n');
      yawn.json = { complex: 'changed', plain: 1 };
      expect(yawn.yaml).toBe('? complex\n: changed # c\nplain: 1\n');
    });

    it('ignores undefined values', () => {
      const yawn = new YAWN('a: 1\nb: 2\n');
      yawn.json = { a: 1, b: undefined, c: undefined };
      expect(yawn.yaml).toBe('a: 1\n');
    });
  });

  describe('sequences', () => {
    it('keeps comments with their items when an item is removed', () => {
      const yawn = new YAWN('- a # one\n- b # two\n- c # three\n');
      yawn.json = ['a', 'c'];
      expect(yawn.yaml).toBe('- a # one\n- c # three\n');
    });

    it('keeps comments with their items when an item is added in front', () => {
      const yawn = new YAWN('- a # one\n- b # two\n');
      yawn.json = ['x', 'a', 'b'];
      expect(yawn.yaml).toBe('- x\n- a # one\n- b # two\n');
    });

    it('inserts in the middle', () => {
      const yawn = new YAWN('- a # one\n- b # two\n');
      yawn.json = ['a', { n: 1 }, 'b'];
      expect(yawn.yaml).toBe('- a # one\n- n: 1\n- b # two\n');
    });

    it('removes a whole item', () => {
      expect(edit(j => void j.items.splice(1, 1))).toEqual({
        removed: ['- name: two', '  v: 2'],
        added: [],
      });
    });

    it('appends an item', () => {
      expect(edit(j => void j.items.push({ name: 'four' }))).toEqual({
        removed: [],
        added: ['- name: four'],
      });
    });

    it('edits flow sequences in place', () => {
      expect(edit(j => void j.server.tags.push('d')).added).toEqual([
        '    tags: [a, b,  c, d]   # flow',
      ]);
      expect(edit(j => void j.server.tags.shift()).added).toEqual([
        '    tags: [b,  c]   # flow',
      ]);
      expect(edit(j => void j.server.tags.pop()).added).toEqual([
        '    tags: [a, b]   # flow',
      ]);
    });

    it('keeps one item per line layouts of flow collections', () => {
      const yawn = new YAWN('[\n  1,\n  2\n]\n');
      yawn.json = [1, 2, 3];
      expect(yawn.yaml).toBe('[\n  1,\n  2,\n  3\n]\n');
    });

    it('updates nested sequences', () => {
      const yawn = new YAWN('- - 1\n  - 2\n- x\n');
      yawn.json = [[1, 2, 3], 'x'];
      expect(yawn.yaml).toBe('- - 1\n  - 2\n  - 3\n- x\n');
    });
  });

  describe('anchors and aliases', () => {
    it('inlines an alias that gets its own value', () => {
      const yawn = new YAWN('a: &x 1\nb: *x\n');
      yawn.json = { a: 1, b: 2 };
      expect(yawn.yaml).toBe('a: &x 1\nb: 2\n');
    });

    it('lets an alias follow its anchor', () => {
      const yawn = new YAWN('a: &x 1\nb: *x\n');
      yawn.json = { a: 2, b: 2 };
      expect(yawn.yaml).toBe('a: &x 2\nb: *x\n');
    });

    it('inlines an alias that does not follow its anchor', () => {
      const yawn = new YAWN('a: &x 1\nb: *x\nc: [*x]\n');
      yawn.json = { a: 2, b: 1, c: [1] };
      expect(yawn.json).toEqual({ a: 2, b: 1, c: [1] });
      expect(yawn.yaml).toContain('a: &x 2');
    });

    it('inlines aliases of a removed anchor', () => {
      const yawn = new YAWN('base: &b {k: 1}\nuse: *b\n');
      yawn.json = { use: { k: 1 } };
      expect(yawn.json).toEqual({ use: { k: 1 } });
    });
  });

  describe('unusual documents', () => {
    it('keeps CRLF line endings', () => {
      const yawn = new YAWN('a: 1\r\nb: 2\r\n');
      yawn.json = { a: 1, n: [1], b: 3 };
      expect(yawn.yaml).toBe('a: 1\r\nn:\r\n  - 1\r\nb: 3\r\n');
    });

    it('works without a final line break', () => {
      const yawn = new YAWN('a: 1 # c');
      yawn.json = { a: 1, b: 2 };
      expect(yawn.yaml).toBe('a: 1 # c\nb: 2');
    });

    it('fills an empty document', () => {
      const yawn = new YAWN('');
      yawn.json = { a: 1 };
      expect(yawn.yaml).toBe('a: 1\n');
    });

    it('fills a document that only has comments', () => {
      const yawn = new YAWN('# only comment\n');
      yawn.json = { a: 1 };
      expect(yawn.yaml).toBe('# only comment\na: 1\n');
    });

    it('keeps document markers and directives', () => {
      const yawn = new YAWN('%YAML 1.2\n---\n# c\na: 1\n...\n');
      yawn.json = { a: 2, b: [] };
      expect(yawn.yaml).toBe('%YAML 1.2\n---\n# c\na: 2\nb: []\n...\n');
    });

    it('does not throw for documents with errors', () => {
      const yawn = new YAWN('a: 1\na: 2\n');
      expect(() => yawn.yaml).not.toThrow();
      expect(yawn.errors.length).toBe(1);
      expect(new YAWN('a: 1\n').errors).toEqual([]);
      yawn.json = { a: 3 };
      expect(yawn.json).toEqual({ a: 3 });

      const multi = new YAWN('a: 1\n---\nb: 2\n');
      multi.json = { a: 2 };
      expect(multi.yaml).toBe('a: 2\n---\nb: 2\n');
    });

    it('handles values JSON can not hold', () => {
      const yawn = new YAWN('a: 1\n');
      yawn.json = { a: NaN, b: Infinity, c: new Date(0), d: () => 1 };
      expect(yawn.json.a).toBeNaN();
      expect(yawn.json.b).toBe(Infinity);
      expect(yawn.json.c).toBe('1970-01-01T00:00:00.000Z');
      expect('d' in yawn.json).toBe(false);
    });
  });

  describe('comment setters', () => {
    it('setRemark only changes the end of the line', () => {
      const yawn = new YAWN(SOURCE);
      yawn.setRemark('server.port', 'the port');
      yawn.setRemark('items.1.name', 'second');
      expect(yawn.yaml).toBe(
        SOURCE.replace('port: 8080', 'port: 8080 # the port').replace(
          'name: two',
          'name: two # second'
        )
      );
      yawn.setRemark('server.port', '');
      yawn.setRemark('items.1.name', '');
      expect(yawn.yaml).toBe(SOURCE);
    });

    it('setCommentBefore only changes the lines above', () => {
      const yawn = new YAWN(SOURCE);
      yawn.setCommentBefore('server.port', 'one\ntwo');
      expect(yawn.yaml).toBe(
        SOURCE.replace('    port', '    # one\n    # two\n    port')
      );
      expect(yawn.getCommentBefore('server.port')).toContain('one');
      yawn.setCommentBefore('server.port', '');
      expect(yawn.yaml).toBe(SOURCE);

      yawn.setCommentBefore('items.1', 'second item');
      expect(yawn.yaml).toBe(
        SOURCE.replace('- name: two', '# second item\n- name: two')
      );
    });
  });

  describe('random edits', () => {
    // Small deterministic generator
    let seed = 42;
    const random = (): number => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const int = (n: number): number => Math.floor(random() * n);
    const pick = <T>(items: T[]): T => items[int(items.length)];
    const keys = ['a', 'b', 'c', 'x y', '1', 'true', 'with: colon', ''];
    const strings = ['a', 'x y', '', 'true', '12', 'multi\nline\n', '# no'];
    strings.push('- dash', "it's", 'a: b', ' lead', 'long '.repeat(30), '~');
    const scalar = (): any =>
      pick([
        () => int(100),
        () => pick(strings),
        () => random() < 0.5,
        () => null,
        () => int(100) / 10,
      ])();
    const value = (depth: number): any => {
      const r = random();
      if (depth <= 0 || r < 0.4) return scalar();
      if (r < 0.7) {
        const obj: any = {};
        for (let i = int(4); i > 0; i--) obj[pick(keys)] = value(depth - 1);
        return obj;
      }
      return Array.from({ length: int(4) }, () => value(depth - 1));
    };
    const mutate = (v: any): any => {
      if (v === null || typeof v !== 'object') {
        return random() < 0.7 ? scalar() : value(2);
      }
      const r = random();
      if (r < 0.05) return value(2);
      if (Array.isArray(v)) {
        if (!v.length || r < 0.25) v.splice(int(v.length + 1), 0, value(2));
        else if (r < 0.4) v.splice(int(v.length), 1);
        else {
          const i = int(v.length);
          v[i] = mutate(v[i]);
        }
        return v;
      }
      const own = Object.keys(v);
      if (!own.length || r < 0.25) v[pick(keys)] = value(2);
      else if (r < 0.4) delete v[pick(own)];
      else {
        const key = pick(own);
        v[key] = mutate(v[key]);
      }
      return v;
    };

    const sources = [
      SOURCE,
      'base: &base\n  name: n\n  port: 1\nuse: *base\nlist: [*base, 2]\n',
      'a: [1, # one\n  2, # two\n  3]\nb: {x: 1, # ex\n  y: 2}\n',
      'a:\n  - b:\n      - c:\n          d: 1 # deep\n    e: 2\n  -\n    f: 3\n  - - g\n    - h\n',
      '{\n  "a": 1,\n  "b": [true, null],\n  "c": {"d": "e"}\n}\n',
      'a: >-\n  folded\n  text\nb: |+\n  keep\n\nc: "dq"\nd: plain\n  multi\n',
      'a:\n  # leading\n  b: 1\n  # trailing\n\n# before c\nc:\n  - 1\n  # in seq\n  - 2\n# end',
      'empty:\nnulls: [~, null, ]\nseq:\n-\n- \nm: {a, b: }\n',
      'a: 1\r\nb:\r\n  - x # c\r\n  - y\r\nc: {k: v}\r\n',
      '- 1\n',
      '',
    ];

    it('always ends up with the assigned value', () => {
      for (const source of sources) {
        for (let round = 0; round < 40; round++) {
          const yawn = new YAWN(source);
          for (let step = 0; step < 4; step++) {
            const before = yawn.yaml;
            const next = mutate(JSON.parse(JSON.stringify(yawn.json)));
            yawn.json = next;
            const context = JSON.stringify({ before, next, after: yawn.yaml });
            expect([context, yawn.json]).toEqual([context, next]);
            expect([context, parse(yawn.yaml)]).toEqual([context, next]);
          }
        }
      }
    });
  });
});
