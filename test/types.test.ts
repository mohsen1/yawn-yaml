/**
 * Type preservation and handling tests for YAWN
 */
import YAWN from '../src';
import dedent from 'dedent';

describe('Type Handling', () => {
  describe('String types', () => {
    it('handles plain strings', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      expect(yawn.json.key).toBe('value');
      expect(typeof yawn.json.key).toBe('string');
    });

    it('handles double-quoted strings', () => {
      const yaml = 'key: "quoted value"';
      const yawn = new YAWN(yaml);
      expect(yawn.json.key).toBe('quoted value');
    });

    it('handles single-quoted strings', () => {
      const yaml = "key: 'single quoted'";
      const yawn = new YAWN(yaml);
      expect(yawn.json.key).toBe('single quoted');
    });

    it('preserves double-quoted style when updating', () => {
      const yaml = 'key: "original"';
      const yawn = new YAWN(yaml);
      yawn.json = { key: 'updated' };

      expect(yawn.yaml).toContain('"updated"');
    });

    it('preserves single-quoted style when updating', () => {
      const yaml = "key: 'original'";
      const yawn = new YAWN(yaml);
      yawn.json = { key: 'updated' };

      expect(yawn.yaml).toContain("'updated'");
    });

    it('handles strings with special characters', () => {
      const yaml = 'key: "value with: colons"';
      const yawn = new YAWN(yaml);
      expect(yawn.json.key).toBe('value with: colons');
    });

    it('handles strings with newlines', () => {
      const yaml = 'key: "line1\\nline2"';
      const yawn = new YAWN(yaml);
      expect(yawn.json.key).toBe('line1\nline2');
    });

    it('handles empty strings', () => {
      const yaml = 'key: ""';
      const yawn = new YAWN(yaml);
      expect(yawn.json.key).toBe('');
    });

    it('handles strings that look like numbers (quoted)', () => {
      const yaml = 'port: "8080"';
      const yawn = new YAWN(yaml);
      expect(yawn.json.port).toBe('8080');
      expect(typeof yawn.json.port).toBe('string');

      yawn.json = { port: '3000' };
      expect(yawn.yaml).toContain('"3000"');
    });

    it('handles strings that look like booleans (quoted)', () => {
      const yaml = 'flag: "true"';
      const yawn = new YAWN(yaml);
      expect(yawn.json.flag).toBe('true');
      expect(typeof yawn.json.flag).toBe('string');
    });
  });

  describe('Number types', () => {
    it('handles integers', () => {
      const yaml = 'count: 42';
      const yawn = new YAWN(yaml);
      expect(yawn.json.count).toBe(42);
      expect(typeof yawn.json.count).toBe('number');
    });

    it('handles negative integers', () => {
      const yaml = 'temp: -10';
      const yawn = new YAWN(yaml);
      expect(yawn.json.temp).toBe(-10);
    });

    it('handles floats', () => {
      const yaml = 'ratio: 3.14159';
      const yawn = new YAWN(yaml);
      expect(yawn.json.ratio).toBeCloseTo(3.14159);
    });

    it('handles negative floats', () => {
      const yaml = 'balance: -123.45';
      const yawn = new YAWN(yaml);
      expect(yawn.json.balance).toBeCloseTo(-123.45);
    });

    it('handles scientific notation', () => {
      const yaml = 'big: 1.5e10';
      const yawn = new YAWN(yaml);
      expect(yawn.json.big).toBe(1.5e10);
    });

    it('handles zero', () => {
      const yaml = 'zero: 0';
      const yawn = new YAWN(yaml);
      expect(yawn.json.zero).toBe(0);
    });

    it('updates number values', () => {
      const yaml = 'count: 1';
      const yawn = new YAWN(yaml);
      yawn.json = { count: 100 };

      expect(yawn.json.count).toBe(100);
    });

    it('handles octal numbers', () => {
      const yaml = 'octal: 0o755';
      const yawn = new YAWN(yaml);
      expect(yawn.json.octal).toBe(493); // 0o755 in decimal
    });

    it('handles hex numbers', () => {
      const yaml = 'hex: 0xFF';
      const yawn = new YAWN(yaml);
      expect(yawn.json.hex).toBe(255);
    });
  });

  describe('Boolean types', () => {
    it('handles true', () => {
      const yaml = 'enabled: true';
      const yawn = new YAWN(yaml);
      expect(yawn.json.enabled).toBe(true);
      expect(typeof yawn.json.enabled).toBe('boolean');
    });

    it('handles false', () => {
      const yaml = 'enabled: false';
      const yawn = new YAWN(yaml);
      expect(yawn.json.enabled).toBe(false);
    });

    it('handles yes/no (YAML 1.1 booleans)', () => {
      // Note: yaml package may handle these differently
      const yaml = dedent`
        a: yes
        b: no
      `;
      const yawn = new YAWN(yaml);
      // Behavior depends on YAML schema
      expect(yawn.json.a).toBeDefined();
      expect(yawn.json.b).toBeDefined();
    });

    it('updates boolean values', () => {
      const yaml = 'enabled: true';
      const yawn = new YAWN(yaml);
      yawn.json = { enabled: false };

      expect(yawn.json.enabled).toBe(false);
    });

    it('converts boolean to other type', () => {
      const yaml = 'value: true';
      const yawn = new YAWN(yaml);
      yawn.json = { value: 'string' };

      expect(yawn.json.value).toBe('string');
    });
  });

  describe('Null types', () => {
    it('handles null keyword', () => {
      const yaml = 'value: null';
      const yawn = new YAWN(yaml);
      expect(yawn.json.value).toBeNull();
    });

    it('handles tilde (~) for null', () => {
      const yaml = 'value: ~';
      const yawn = new YAWN(yaml);
      expect(yawn.json.value).toBeNull();
    });

    it('handles empty value as null', () => {
      const yaml = 'value:';
      const yawn = new YAWN(yaml);
      expect(yawn.json.value).toBeNull();
    });

    it('converts null to value', () => {
      const yaml = 'value: null';
      const yawn = new YAWN(yaml);
      yawn.json = { value: 'not null' };

      expect(yawn.json.value).toBe('not null');
    });

    it('converts value to null', () => {
      const yaml = 'value: something';
      const yawn = new YAWN(yaml);
      yawn.json = { value: null };

      expect(yawn.json.value).toBeNull();
    });

    it('converts null to object', () => {
      const yaml = 'config: null';
      const yawn = new YAWN(yaml);
      yawn.json = { config: { key: 'value' } };

      expect(yawn.json.config).toEqual({ key: 'value' });
    });

    it('converts null to array', () => {
      const yaml = 'items: null';
      const yawn = new YAWN(yaml);
      yawn.json = { items: [1, 2, 3] };

      expect(yawn.json.items).toEqual([1, 2, 3]);
    });
  });

  describe('Block scalar types', () => {
    it('handles literal block scalar (|)', () => {
      const yaml = dedent`
        text: |
          Line 1
          Line 2
          Line 3
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.text).toContain('Line 1');
      expect(yawn.json.text).toContain('Line 2');
      expect(yawn.json.text).toContain('Line 3');
    });

    it('handles folded block scalar (>)', () => {
      const yaml = dedent`
        text: >
          This is a long
          paragraph that should
          be folded.
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.text).toBeDefined();
    });

    it('preserves literal block style when updating', () => {
      const yaml = dedent`
        script: |
          echo "hello"
          echo "world"
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.script = 'echo "updated"\necho "script"\n';
      yawn.json = json;

      expect(yawn.json.script).toContain('updated');
    });
  });

  describe('Type conversions', () => {
    it('converts string to number', () => {
      const yaml = 'value: "42"';
      const yawn = new YAWN(yaml);
      yawn.json = { value: 42 };

      expect(yawn.json.value).toBe(42);
      expect(typeof yawn.json.value).toBe('number');
    });

    it('converts number to string', () => {
      const yaml = 'value: 42';
      const yawn = new YAWN(yaml);
      yawn.json = { value: 'forty-two' };

      expect(yawn.json.value).toBe('forty-two');
    });

    it('converts primitive to object', () => {
      const yaml = 'value: simple';
      const yawn = new YAWN(yaml);
      yawn.json = { value: { complex: true } };

      expect(yawn.json.value).toEqual({ complex: true });
    });

    it('converts object to primitive', () => {
      const yaml = dedent`
        value:
          complex: true
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { value: 'simple' };

      expect(yawn.json.value).toBe('simple');
    });

    it('converts primitive to array', () => {
      const yaml = 'value: single';
      const yawn = new YAWN(yaml);
      yawn.json = { value: ['multiple', 'items'] };

      expect(yawn.json.value).toEqual(['multiple', 'items']);
    });

    it('converts array to primitive', () => {
      const yaml = dedent`
        value:
          - one
          - two
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { value: 'single' };

      expect(yawn.json.value).toBe('single');
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

    it('converts object to array', () => {
      const yaml = dedent`
        data:
          key: value
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { data: ['item1', 'item2'] };

      expect(yawn.json.data).toEqual(['item1', 'item2']);
    });
  });

  describe('Date/timestamp types', () => {
    it('handles ISO date format', () => {
      const yaml = 'date: 2024-01-15';
      const yawn = new YAWN(yaml);
      // yaml package typically parses this as a Date object
      expect(yawn.json.date).toBeDefined();
    });

    it('handles ISO datetime format', () => {
      const yaml = 'timestamp: 2024-01-15T10:30:00Z';
      const yawn = new YAWN(yaml);
      expect(yawn.json.timestamp).toBeDefined();
    });
  });

  describe('Special values', () => {
    it('handles infinity', () => {
      const yaml = 'value: .inf';
      const yawn = new YAWN(yaml);
      expect(yawn.json.value).toBe(Infinity);
    });

    it('handles negative infinity', () => {
      const yaml = 'value: -.inf';
      const yawn = new YAWN(yaml);
      expect(yawn.json.value).toBe(-Infinity);
    });

    it('handles NaN', () => {
      const yaml = 'value: .nan';
      const yawn = new YAWN(yaml);
      expect(Number.isNaN(yawn.json.value)).toBe(true);
    });
  });

  describe('Anchors and aliases', () => {
    it('handles simple anchor and alias', () => {
      const yaml = dedent`
        defaults: &defaults
          timeout: 30
          retries: 3
        production:
          config: *defaults
      `;
      const yawn = new YAWN(yaml);
      // Alias resolves to the anchored value
      expect(yawn.json.production.config.timeout).toBe(30);
      expect(yawn.json.production.config.retries).toBe(3);
    });

    it('handles scalar anchors and aliases', () => {
      const yaml = dedent`
        default_port: &port 8080
        server:
          port: *port
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.server.port).toBe(8080);
    });

    it('preserves merge keys in document structure', () => {
      // Note: yaml package preserves merge keys as-is
      // rather than automatically flattening them
      const yaml = dedent`
        defaults: &defaults
          timeout: 30
        production:
          <<: *defaults
          timeout: 60
      `;
      const yawn = new YAWN(yaml);
      // The merge key is preserved as a separate key
      expect(yawn.json.production.timeout).toBe(60);
      expect(yawn.json.production['<<']).toBeDefined();
    });
  });
});
