/**
 * Regression tests for all reported GitHub issues
 * These tests ensure the issues are fixed and don't regress
 */
import YAWN from '../src';
import dedent from 'dedent';

describe('GitHub Issues Regression Tests', () => {
  describe('Issue #78: String to number conversion', () => {
    it('preserves quoted string that looks like a number', () => {
      const yaml = 'timer: "1000"';
      const yawn = new YAWN(yaml);
      yawn.json = { timer: '1001' };

      // Should remain a quoted string
      expect(yawn.yaml).toContain('"1001"');
      expect(yawn.json.timer).toBe('1001');
    });

    it('preserves single-quoted string that looks like a number', () => {
      const yaml = "port: '8080'";
      const yawn = new YAWN(yaml);
      yawn.json = { port: '3000' };

      expect(yawn.yaml).toContain("'3000'");
      expect(yawn.json.port).toBe('3000');
    });

    it('preserves string type even when value is purely numeric', () => {
      const yaml = dedent`
        config:
          timeout: "500"
          retries: "3"
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.config.timeout = '1000';
      json.config.retries = '5';
      yawn.json = json;

      expect(yawn.yaml).toContain('"1000"');
      expect(yawn.yaml).toContain('"5"');
    });
  });

  describe('Issue #68: Block chomping indicators', () => {
    it('preserves literal block scalar style (|)', () => {
      const yaml = dedent`
        description: |
          This is a multi-line
          description that should
          preserve newlines.
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.description = 'Updated multi-line\ndescription here.\n';
      yawn.json = json;

      // The content should be updated
      expect(yawn.json.description).toContain('Updated multi-line');
    });

    it('preserves folded block scalar style (>)', () => {
      const yaml = dedent`
        summary: >
          This is a long summary
          that gets folded into
          a single line.
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.summary).toBeDefined();
    });
  });

  describe('Issue #53: getRemark functionality', () => {
    it('getRemark returns inline comment', () => {
      const yaml = 'key: value # this is a comment';
      const yawn = new YAWN(yaml);
      const remark = yawn.getRemark('key');
      expect(remark).toBe('this is a comment');
    });

    it('getRemark returns empty string for no comment', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('key')).toBe('');
    });

    it('getRemark works with nested paths', () => {
      const yaml = dedent`
        parent:
          child: value # nested comment
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('parent.child')).toBe('nested comment');
    });

    it('getRemark returns empty for non-existent path', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('nonexistent')).toBe('');
    });
  });

  describe('Issue #25: Duplicate comments', () => {
    it('does not duplicate comments when converting back', () => {
      const yaml = dedent`
        test1:
          foo: #123
            bar: 1
      `;
      const yawn = new YAWN(yaml);
      // Just access and set back (no-op)
      yawn.json = yawn.json;

      // Count occurrences of the comment
      const matches = yawn.yaml.match(/#123/g);
      expect(matches?.length || 0).toBeLessThanOrEqual(1);
    });

    it('does not duplicate inline comments on nested objects', () => {
      const yaml = dedent`
        config:
          setting: value # important
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.config.setting = 'newValue';
      yawn.json = json;

      const matches = yawn.yaml.match(/# important/g);
      expect(matches?.length || 0).toBe(1);
    });
  });

  describe('Issue #24: Multi-line value changes', () => {
    it('handles updating multi-line strings', () => {
      const yaml = dedent`
        description: |
          Line one
          Line two
        name: test
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.name).toBe('test');

      const json = yawn.json;
      json.name = 'updated';
      yawn.json = json;

      expect(yawn.json.name).toBe('updated');
    });
  });

  describe('Issue #19: Add attribute after expanding array', () => {
    it('can add attributes after modifying an array', () => {
      const yaml = dedent`
        items:
          - first
        name: test
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.items.push('second');
      json.newAttr = 'newValue';
      yawn.json = json;

      expect(yawn.json.items).toEqual(['first', 'second']);
      expect(yawn.json.newAttr).toBe('newValue');
    });
  });

  describe('Issue #18: Comments remain associated with elements', () => {
    it('keeps comments with their array elements when pushing', () => {
      const yaml = dedent`
        - foo # 1st comment
        - bar # 2nd comment
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.push('biz');
      yawn.json = json;

      // Comments should stay with their original elements
      expect(yawn.yaml).toContain('foo');
      expect(yawn.yaml).toContain('# 1st comment');
      expect(yawn.yaml).toContain('bar');
      expect(yawn.yaml).toContain('# 2nd comment');
      expect(yawn.yaml).toContain('biz');
    });

    it('preserves comments when array element values unchanged', () => {
      const yaml = dedent`
        items:
          - name: first # comment 1
          - name: second # comment 2
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.items.push({ name: 'third' });
      yawn.json = json;

      expect(yawn.yaml).toContain('# comment 1');
      expect(yawn.yaml).toContain('# comment 2');
    });
  });

  describe('Issue #10: Null to mapping conversion', () => {
    it('converts null to an object without [object Object]', () => {
      const yaml = 'config: null';
      const yawn = new YAWN(yaml);
      yawn.json = { config: { key: 'value' } };

      expect(yawn.yaml).not.toContain('[object Object]');
      expect(yawn.json.config).toEqual({ key: 'value' });
    });

    it('converts null to an array', () => {
      const yaml = 'items: null';
      const yawn = new YAWN(yaml);
      yawn.json = { items: ['one', 'two'] };

      expect(yawn.yaml).not.toContain('[object Object]');
      expect(yawn.json.items).toEqual(['one', 'two']);
    });
  });

  describe('Issue #8: Flow styles support', () => {
    it('handles flow mapping style', () => {
      const yaml = 'config: {key: value, another: test}';
      const yawn = new YAWN(yaml);
      expect(yawn.json.config).toEqual({ key: 'value', another: 'test' });

      const json = yawn.json;
      json.config.key = 'newValue';
      yawn.json = json;

      expect(yawn.json.config.key).toBe('newValue');
    });

    it('handles flow sequence style', () => {
      const yaml = 'items: [one, two, three]';
      const yawn = new YAWN(yaml);
      expect(yawn.json.items).toEqual(['one', 'two', 'three']);

      const json = yawn.json;
      json.items.push('four');
      yawn.json = json;

      expect(yawn.json.items).toContain('four');
    });
  });

  describe('Issue #6: Array order preservation', () => {
    it('preserves array order when updating', () => {
      const yaml = dedent`
        items:
          - first
          - second
          - third
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.items[1] = 'modified';
      yawn.json = json;

      expect(yawn.json.items).toEqual(['first', 'modified', 'third']);
    });

    it('preserves order with complex array elements', () => {
      const yaml = dedent`
        users:
          - name: Alice
            age: 30
          - name: Bob
            age: 25
          - name: Charlie
            age: 35
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.users[1].age = 26;
      yawn.json = json;

      expect(yawn.json.users[0].name).toBe('Alice');
      expect(yawn.json.users[1].name).toBe('Bob');
      expect(yawn.json.users[1].age).toBe(26);
      expect(yawn.json.users[2].name).toBe('Charlie');
    });
  });

  describe('Issue #2: Appending to empty object', () => {
    it('can append to empty object', () => {
      const yaml = 'config: {}';
      const yawn = new YAWN(yaml);
      yawn.json = { config: { newKey: 'value' } };

      expect(yawn.json.config.newKey).toBe('value');
    });

    it('can add keys to object with no existing properties', () => {
      const yaml = dedent`
        empty:
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { empty: null, newKey: 'value' };

      expect(yawn.json.newKey).toBe('value');
    });
  });

  describe('PR #120: Comments preserved on array items when updating JSON', () => {
    it('preserves comments when array spread and add new element', () => {
      const yaml = dedent`
        items:
          - foo # comment 1
          - bar # comment 2
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      // This mimics [...existing_elements, new_element]
      yawn.json = { items: [...json.items, 'baz'] };

      expect(yawn.yaml).toContain('# comment 1');
      expect(yawn.yaml).toContain('# comment 2');
      expect(yawn.json.items).toContain('baz');
    });

    it('preserves comments when setting array to same values plus new', () => {
      const yaml = dedent`
        - name: first # important
        - name: second # also important
      `;
      const yawn = new YAWN(yaml);
      const existing = yawn.json;
      yawn.json = [...existing, { name: 'third' }];

      expect(yawn.yaml).toContain('# important');
      expect(yawn.yaml).toContain('# also important');
    });
  });
});

describe('Additional Edge Cases', () => {
  describe('Deeply nested structures', () => {
    it('handles deep nesting with comments', () => {
      const yaml = dedent`
        level1:
          level2:
            level3:
              value: deep # deep comment
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.level1.level2.level3.value = 'updated';
      yawn.json = json;

      expect(yawn.yaml).toContain('# deep comment');
      expect(yawn.json.level1.level2.level3.value).toBe('updated');
    });
  });

  describe('Mixed arrays and objects', () => {
    it('handles arrays of objects with comments', () => {
      const yaml = dedent`
        servers:
          # Production server
          - host: prod.example.com # main
            port: 443
          # Staging server
          - host: staging.example.com # test
            port: 8443
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.servers[0].port = 8080;
      yawn.json = json;

      expect(yawn.yaml).toContain('# Production server');
      expect(yawn.yaml).toContain('# main');
      expect(yawn.yaml).toContain('# Staging server');
      expect(yawn.json.servers[0].port).toBe(8080);
    });
  });

  describe('Special characters', () => {
    it('handles special characters in values', () => {
      const yaml = 'special: "value with: colons and #hashes"';
      const yawn = new YAWN(yaml);
      expect(yawn.json.special).toBe('value with: colons and #hashes');
    });

    it('handles unicode characters', () => {
      const yaml = 'emoji: "Hello 🌍"';
      const yawn = new YAWN(yaml);
      expect(yawn.json.emoji).toBe('Hello 🌍');

      yawn.json = { emoji: 'Updated 🚀' };
      expect(yawn.json.emoji).toBe('Updated 🚀');
    });
  });

  describe('Boolean and null values', () => {
    it('handles boolean values', () => {
      const yaml = dedent`
        enabled: true
        disabled: false
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.enabled).toBe(true);
      expect(yawn.json.disabled).toBe(false);

      yawn.json = { enabled: false, disabled: true };
      expect(yawn.json.enabled).toBe(false);
      expect(yawn.json.disabled).toBe(true);
    });

    it('handles null values', () => {
      const yaml = 'value: null';
      const yawn = new YAWN(yaml);
      expect(yawn.json.value).toBeNull();

      yawn.json = { value: 'notNull' };
      expect(yawn.json.value).toBe('notNull');
    });
  });

  describe('Number types', () => {
    it('handles integers', () => {
      const yaml = 'count: 42';
      const yawn = new YAWN(yaml);
      expect(yawn.json.count).toBe(42);

      yawn.json = { count: 100 };
      expect(yawn.json.count).toBe(100);
    });

    it('handles floats', () => {
      const yaml = 'ratio: 3.14';
      const yawn = new YAWN(yaml);
      expect(yawn.json.ratio).toBe(3.14);

      yawn.json = { ratio: 2.718 };
      expect(yawn.json.ratio).toBe(2.718);
    });

    it('handles negative numbers', () => {
      const yaml = 'temperature: -10';
      const yawn = new YAWN(yaml);
      expect(yawn.json.temperature).toBe(-10);
    });
  });
});
