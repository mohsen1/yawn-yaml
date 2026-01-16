/**
 * Object/Map-specific tests for YAWN
 */
import YAWN from '../src';
import dedent from 'dedent';

describe('Object Operations', () => {
  describe('Basic object operations', () => {
    it('parses simple objects', () => {
      const yaml = dedent`
        name: test
        value: 42
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json).toEqual({ name: 'test', value: 42 });
    });

    it('updates object properties', () => {
      const yaml = 'name: original';
      const yawn = new YAWN(yaml);
      yawn.json = { name: 'updated' };

      expect(yawn.json.name).toBe('updated');
    });

    it('adds new properties', () => {
      const yaml = 'existing: value';
      const yawn = new YAWN(yaml);
      yawn.json = { existing: 'value', newProp: 'newValue' };

      expect(yawn.json.existing).toBe('value');
      expect(yawn.json.newProp).toBe('newValue');
    });

    it('removes properties', () => {
      const yaml = dedent`
        keep: value
        remove: value
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { keep: 'value' };

      expect(yawn.json.keep).toBe('value');
      expect(yawn.json.remove).toBeUndefined();
    });

    it('replaces property value type', () => {
      const yaml = 'prop: string';
      const yawn = new YAWN(yaml);
      yawn.json = { prop: 42 };

      expect(yawn.json.prop).toBe(42);
    });
  });

  describe('Nested objects', () => {
    it('parses nested objects', () => {
      const yaml = dedent`
        level1:
          level2:
            level3: value
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.level1.level2.level3).toBe('value');
    });

    it('updates deeply nested values', () => {
      const yaml = dedent`
        level1:
          level2:
            level3: original
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.level1.level2.level3 = 'updated';
      yawn.json = json;

      expect(yawn.json.level1.level2.level3).toBe('updated');
    });

    it('adds nested property', () => {
      const yaml = dedent`
        parent:
          existing: value
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.parent.newProp = 'newValue';
      yawn.json = json;

      expect(yawn.json.parent.newProp).toBe('newValue');
    });

    it('removes nested property', () => {
      const yaml = dedent`
        parent:
          keep: value
          remove: value
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      delete json.parent.remove;
      yawn.json = json;

      expect(yawn.json.parent.keep).toBe('value');
      expect(yawn.json.parent.remove).toBeUndefined();
    });

    it('replaces nested object entirely', () => {
      const yaml = dedent`
        config:
          old: value
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { config: { new: 'value' } };

      expect(yawn.json.config.old).toBeUndefined();
      expect(yawn.json.config.new).toBe('value');
    });
  });

  describe('Object comments preservation', () => {
    it('preserves inline comments', () => {
      const yaml = dedent`
        name: value # this is a name
        count: 42 # this is a count
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { name: 'updated', count: 100 };

      expect(yawn.yaml).toContain('# this is a name');
      expect(yawn.yaml).toContain('# this is a count');
    });

    it('preserves block comments', () => {
      const yaml = dedent`
        # This is the name field
        name: value
        # This is the count field
        count: 42
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.name = 'updated';
      yawn.json = json;

      expect(yawn.yaml).toContain('# This is the name field');
      expect(yawn.yaml).toContain('# This is the count field');
    });

    it('preserves comments on nested objects', () => {
      const yaml = dedent`
        parent:
          # Child property comment
          child: value # inline
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.parent.child = 'updated';
      yawn.json = json;

      expect(yawn.yaml).toContain('# Child property comment');
      expect(yawn.yaml).toContain('# inline');
    });
  });

  describe('Empty objects', () => {
    it('handles empty object', () => {
      const yaml = 'config: {}';
      const yawn = new YAWN(yaml);
      expect(yawn.json.config).toEqual({});
    });

    it('can add to empty object', () => {
      const yaml = 'config: {}';
      const yawn = new YAWN(yaml);
      yawn.json = { config: { key: 'value' } };

      expect(yawn.json.config.key).toBe('value');
    });

    it('can empty an object', () => {
      const yaml = dedent`
        config:
          key: value
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { config: {} };

      expect(yawn.json.config).toEqual({});
    });
  });

  describe('Flow style objects', () => {
    it('parses flow style objects', () => {
      const yaml = 'config: {key: value, another: test}';
      const yawn = new YAWN(yaml);
      expect(yawn.json.config).toEqual({ key: 'value', another: 'test' });
    });

    it('updates flow style objects', () => {
      const yaml = 'config: {key: value}';
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.config.key = 'updated';
      yawn.json = json;

      expect(yawn.json.config.key).toBe('updated');
    });

    it('handles nested flow objects', () => {
      const yaml = 'config: {outer: {inner: value}}';
      const yawn = new YAWN(yaml);
      expect(yawn.json.config.outer.inner).toBe('value');
    });
  });

  describe('Special key names', () => {
    it('handles keys with special characters', () => {
      const yaml = dedent`
        "special-key": value
        "key.with.dots": value2
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json['special-key']).toBe('value');
      expect(yawn.json['key.with.dots']).toBe('value2');
    });

    it('handles numeric keys', () => {
      const yaml = dedent`
        "123": value
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json['123']).toBe('value');
    });

    it('handles empty string key', () => {
      const yaml = '"": empty key value';
      const yawn = new YAWN(yaml);
      expect(yawn.json['']).toBe('empty key value');
    });
  });

  describe('Object with arrays', () => {
    it('handles object containing arrays', () => {
      const yaml = dedent`
        config:
          items:
            - one
            - two
          name: test
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.config.items).toEqual(['one', 'two']);
      expect(yawn.json.config.name).toBe('test');
    });

    it('updates array inside object', () => {
      const yaml = dedent`
        config:
          items:
            - one
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.config.items.push('two');
      yawn.json = json;

      expect(yawn.json.config.items).toEqual(['one', 'two']);
    });
  });

  describe('Type conversions', () => {
    it('converts object to array', () => {
      const yaml = 'data: {key: value}';
      const yawn = new YAWN(yaml);
      yawn.json = { data: ['item1', 'item2'] };

      expect(yawn.json.data).toEqual(['item1', 'item2']);
    });

    it('converts array to object', () => {
      const yaml = dedent`
        data:
          - item1
          - item2
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { data: { key: 'value' } };

      expect(yawn.json.data).toEqual({ key: 'value' });
    });

    it('converts primitive to object', () => {
      const yaml = 'data: simple';
      const yawn = new YAWN(yaml);
      yawn.json = { data: { nested: 'value' } };

      expect(yawn.json.data).toEqual({ nested: 'value' });
    });

    it('converts object to primitive', () => {
      const yaml = dedent`
        data:
          nested: value
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { data: 'simple' };

      expect(yawn.json.data).toBe('simple');
    });
  });

  describe('Large objects', () => {
    it('handles objects with many keys', () => {
      const pairs = Array.from({ length: 50 }, (_, i) => `key${i}: value${i}`);
      const yaml = pairs.join('\n');
      const yawn = new YAWN(yaml);

      expect(Object.keys(yawn.json).length).toBe(50);
      expect(yawn.json.key25).toBe('value25');

      const json = yawn.json;
      json.key25 = 'updated';
      yawn.json = json;

      expect(yawn.json.key25).toBe('updated');
      expect(yawn.json.key24).toBe('value24');
      expect(yawn.json.key26).toBe('value26');
    });
  });

  describe('Object key ordering', () => {
    it('preserves key order when updating values', () => {
      const yaml = dedent`
        first: 1
        second: 2
        third: 3
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.second = 'updated';
      yawn.json = json;

      const lines = yawn.yaml.split('\n').filter(l => l.trim());
      expect(lines[0]).toContain('first');
      expect(lines[1]).toContain('second');
      expect(lines[2]).toContain('third');
    });
  });
});
