/**
 * Array-specific tests for YAWN
 */
import YAWN from '../src';
import dedent from 'dedent';

describe('Array Operations', () => {
  describe('Basic array operations', () => {
    it('parses simple arrays', () => {
      const yaml = dedent`
        - one
        - two
        - three
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json).toEqual(['one', 'two', 'three']);
    });

    it('updates array elements', () => {
      const yaml = dedent`
        - first
        - second
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json[0] = 'updated';
      yawn.json = json;

      expect(yawn.json[0]).toBe('updated');
      expect(yawn.json[1]).toBe('second');
    });

    it('pushes new elements', () => {
      const yaml = dedent`
        - one
        - two
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.push('three');
      yawn.json = json;

      expect(yawn.json).toEqual(['one', 'two', 'three']);
    });

    it('pops elements', () => {
      const yaml = dedent`
        - one
        - two
        - three
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.pop();
      yawn.json = json;

      expect(yawn.json).toEqual(['one', 'two']);
    });

    it('shifts elements', () => {
      const yaml = dedent`
        - one
        - two
        - three
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.shift();
      yawn.json = json;

      expect(yawn.json).toEqual(['two', 'three']);
    });

    it('unshifts elements', () => {
      const yaml = dedent`
        - two
        - three
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.unshift('one');
      yawn.json = json;

      expect(yawn.json).toEqual(['one', 'two', 'three']);
    });

    it('splices elements', () => {
      const yaml = dedent`
        - one
        - two
        - four
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.splice(2, 0, 'three');
      yawn.json = json;

      expect(yawn.json).toEqual(['one', 'two', 'three', 'four']);
    });
  });

  describe('Nested arrays', () => {
    it('handles arrays inside objects', () => {
      const yaml = dedent`
        config:
          items:
            - one
            - two
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.config.items).toEqual(['one', 'two']);

      const json = yawn.json;
      json.config.items.push('three');
      yawn.json = json;

      expect(yawn.json.config.items).toEqual(['one', 'two', 'three']);
    });

    it('handles arrays of arrays', () => {
      const yaml = dedent`
        matrix:
          - - 1
            - 2
          - - 3
            - 4
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.matrix).toEqual([[1, 2], [3, 4]]);

      const json = yawn.json;
      json.matrix[0][0] = 10;
      yawn.json = json;

      expect(yawn.json.matrix[0][0]).toBe(10);
    });
  });

  describe('Arrays of objects', () => {
    it('handles arrays of objects', () => {
      const yaml = dedent`
        users:
          - name: Alice
            age: 30
          - name: Bob
            age: 25
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.users).toEqual([
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ]);
    });

    it('updates object in array', () => {
      const yaml = dedent`
        users:
          - name: Alice
            age: 30
          - name: Bob
            age: 25
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.users[0].age = 31;
      yawn.json = json;

      expect(yawn.json.users[0].age).toBe(31);
      expect(yawn.json.users[0].name).toBe('Alice');
    });

    it('adds object to array', () => {
      const yaml = dedent`
        users:
          - name: Alice
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.users.push({ name: 'Bob', age: 25 });
      yawn.json = json;

      expect(yawn.json.users.length).toBe(2);
      expect(yawn.json.users[1].name).toBe('Bob');
    });

    it('removes object from array', () => {
      const yaml = dedent`
        users:
          - name: Alice
          - name: Bob
          - name: Charlie
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.users.splice(1, 1);
      yawn.json = json;

      expect(yawn.json.users.length).toBe(2);
      expect(yawn.json.users.map((u: any) => u.name)).toEqual(['Alice', 'Charlie']);
    });
  });

  describe('Array comments preservation', () => {
    it('preserves comments on array items', () => {
      const yaml = dedent`
        - item1 # first
        - item2 # second
        - item3 # third
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json[1] = 'updated';
      yawn.json = json;

      expect(yawn.yaml).toContain('# first');
      expect(yawn.yaml).toContain('# second');
      expect(yawn.yaml).toContain('# third');
    });

    it('preserves comments when adding items', () => {
      const yaml = dedent`
        - item1 # first
        - item2 # second
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.push('item3');
      yawn.json = json;

      expect(yawn.yaml).toContain('# first');
      expect(yawn.yaml).toContain('# second');
    });

    it('preserves block comments above array items', () => {
      const yaml = dedent`
        # First item description
        - item1
        # Second item description
        - item2
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json[0] = 'updated';
      yawn.json = json;

      expect(yawn.yaml).toContain('# First item description');
      expect(yawn.yaml).toContain('# Second item description');
    });
  });

  describe('Empty arrays', () => {
    it('handles empty array', () => {
      const yaml = 'items: []';
      const yawn = new YAWN(yaml);
      expect(yawn.json.items).toEqual([]);
    });

    it('can add to empty array', () => {
      const yaml = 'items: []';
      const yawn = new YAWN(yaml);
      yawn.json = { items: ['first'] };

      expect(yawn.json.items).toEqual(['first']);
    });

    it('can empty an array', () => {
      const yaml = dedent`
        items:
          - one
          - two
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { items: [] };

      expect(yawn.json.items).toEqual([]);
    });
  });

  describe('Mixed type arrays', () => {
    it('handles arrays with mixed types', () => {
      const yaml = dedent`
        mixed:
          - string
          - 42
          - true
          - null
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.json.mixed).toEqual(['string', 42, true, null]);
    });

    it('updates mixed type array', () => {
      const yaml = dedent`
        mixed:
          - string
          - 42
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.mixed[0] = 100;
      json.mixed[1] = 'text';
      yawn.json = json;

      expect(yawn.json.mixed).toEqual([100, 'text']);
    });
  });

  describe('Flow style arrays', () => {
    it('parses flow style arrays', () => {
      const yaml = 'items: [one, two, three]';
      const yawn = new YAWN(yaml);
      expect(yawn.json.items).toEqual(['one', 'two', 'three']);
    });

    it('updates flow style arrays', () => {
      const yaml = 'items: [one, two]';
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.items.push('three');
      yawn.json = json;

      expect(yawn.json.items).toContain('three');
    });

    it('handles nested flow arrays', () => {
      const yaml = 'matrix: [[1, 2], [3, 4]]';
      const yawn = new YAWN(yaml);
      expect(yawn.json.matrix).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('Large arrays', () => {
    it('handles arrays with many elements', () => {
      const items = Array.from({ length: 100 }, (_, i) => `item${i}`);
      const yaml = items.map(i => `- ${i}`).join('\n');
      const yawn = new YAWN(yaml);

      expect(yawn.json.length).toBe(100);
      expect(yawn.json[50]).toBe('item50');

      const json = yawn.json;
      json[50] = 'updated';
      yawn.json = json;

      expect(yawn.json[50]).toBe('updated');
      expect(yawn.json[49]).toBe('item49');
      expect(yawn.json[51]).toBe('item51');
    });
  });
});
