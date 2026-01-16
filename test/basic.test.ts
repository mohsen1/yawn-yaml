import YAWN from '../src';
import dedent from 'dedent';

describe('Basic YAWN functionality', () => {
  describe('Constructor', () => {
    it('accepts a valid YAML string', () => {
      const yawn = new YAWN('key: value');
      expect(yawn.json).toEqual({ key: 'value' });
    });

    it('throws TypeError for non-string input', () => {
      expect(() => new YAWN(123 as any)).toThrow(TypeError);
      expect(() => new YAWN(null as any)).toThrow(TypeError);
      expect(() => new YAWN(undefined as any)).toThrow(TypeError);
      expect(() => new YAWN({} as any)).toThrow(TypeError);
    });

    it('handles empty string', () => {
      const yawn = new YAWN('');
      expect(yawn.json).toBeNull();
    });
  });

  describe('json getter', () => {
    it('parses simple key-value', () => {
      const yawn = new YAWN('key: value');
      expect(yawn.json).toEqual({ key: 'value' });
    });

    it('parses nested objects', () => {
      const yaml = dedent`
        parent:
          child: value
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json).toEqual({ parent: { child: 'value' } });
    });

    it('parses arrays', () => {
      const yaml = dedent`
        - item1
        - item2
        - item3
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json).toEqual(['item1', 'item2', 'item3']);
    });

    it('parses mixed structures', () => {
      const yaml = dedent`
        name: test
        items:
          - one
          - two
        config:
          enabled: true
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json).toEqual({
        name: 'test',
        items: ['one', 'two'],
        config: { enabled: true },
      });
    });
  });

  describe('json setter', () => {
    it('updates simple value', () => {
      const yawn = new YAWN('key: value');
      yawn.json = { key: 'newValue' };
      expect(yawn.json).toEqual({ key: 'newValue' });
    });

    it('does nothing when value unchanged', () => {
      const yaml = 'key: value # comment';
      const yawn = new YAWN(yaml);
      const originalYaml = yawn.yaml;
      yawn.json = { key: 'value' };
      expect(yawn.yaml).toBe(originalYaml);
    });

    it('handles undefined by clearing document', () => {
      const yawn = new YAWN('key: value');
      yawn.json = undefined;
      expect(yawn.yaml.trim()).toBe('null');
    });

    it('adds new keys', () => {
      const yawn = new YAWN('existing: value');
      yawn.json = { existing: 'value', newKey: 'newValue' };
      expect(yawn.json).toEqual({ existing: 'value', newKey: 'newValue' });
    });

    it('removes keys', () => {
      const yawn = new YAWN('key1: value1\nkey2: value2');
      yawn.json = { key1: 'value1' };
      expect(yawn.json).toEqual({ key1: 'value1' });
    });
  });

  describe('yaml getter', () => {
    it('returns valid YAML string', () => {
      const yawn = new YAWN('key: value');
      expect(yawn.yaml).toContain('key: value');
    });

    it('preserves original formatting where possible', () => {
      const yaml = dedent`
        # Comment
        key: value
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.yaml).toContain('# Comment');
      expect(yawn.yaml).toContain('key: value');
    });
  });

  describe('yaml setter', () => {
    it('re-parses the document', () => {
      const yawn = new YAWN('key: value');
      yawn.yaml = 'newKey: newValue';
      expect(yawn.json).toEqual({ newKey: 'newValue' });
    });
  });

  describe('toString()', () => {
    it('returns the yaml string', () => {
      const yawn = new YAWN('key: value');
      expect(yawn.toString()).toBe(yawn.yaml);
    });
  });

  describe('toJSON()', () => {
    it('returns the json representation', () => {
      const yawn = new YAWN('key: value');
      expect(yawn.toJSON()).toEqual(yawn.json);
    });
  });

  describe('Comment preservation (basic)', () => {
    it('preserves inline comments when updating values', () => {
      const yaml = dedent`
        # my comment
        value: 1 # the value is here!
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { value: 2 };
      expect(yawn.yaml).toContain('# my comment');
      expect(yawn.yaml).toContain('# the value is here!');
      expect(yawn.yaml).toContain('value: 2');
    });

    it('preserves block comments', () => {
      const yaml = dedent`
        # This is a block comment
        # spanning multiple lines
        key: value
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { key: 'newValue' };
      expect(yawn.yaml).toContain('# This is a block comment');
      expect(yawn.yaml).toContain('key: newValue');
    });

    it('preserves nested comments', () => {
      const yaml = dedent`
        parent:
          # Child comment
          child: value # inline
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.parent.child = 'newValue';
      yawn.json = json;
      expect(yawn.yaml).toContain('# Child comment');
      expect(yawn.yaml).toContain('# inline');
    });
  });
});
