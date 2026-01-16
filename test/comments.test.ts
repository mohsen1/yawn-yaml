/**
 * Comprehensive comment handling tests for YAWN
 */
import YAWN from '../src';
import dedent from 'dedent';

describe('Comment Handling', () => {
  describe('getRemark()', () => {
    it('gets inline comment', () => {
      const yaml = 'key: value # this is a comment';
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('key')).toBe('this is a comment');
    });

    it('returns empty string when no comment', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('key')).toBe('');
    });

    it('gets comment from nested path', () => {
      const yaml = dedent`
        parent:
          child: value # nested comment
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('parent.child')).toBe('nested comment');
    });

    it('gets comment from array element by index', () => {
      const yaml = dedent`
        items:
          - first # comment on first
          - second # comment on second
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('items.0')).toBe('comment on first');
      expect(yawn.getRemark('items.1')).toBe('comment on second');
    });

    it('returns empty for non-existent path', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('nonexistent')).toBe('');
    });

    it('returns empty for non-existent nested path', () => {
      const yaml = dedent`
        parent:
          child: value
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('parent.nonexistent')).toBe('');
    });
  });

  describe('setRemark()', () => {
    it('sets inline comment', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      const result = yawn.setRemark('key', 'new comment');

      expect(result).toBe(true);
      expect(yawn.yaml).toContain('# new comment');
    });

    it('updates existing comment', () => {
      const yaml = 'key: value # old comment';
      const yawn = new YAWN(yaml);
      yawn.setRemark('key', 'new comment');

      expect(yawn.yaml).toContain('# new comment');
      expect(yawn.yaml).not.toContain('old comment');
    });

    it('removes comment when setting empty string', () => {
      const yaml = 'key: value # comment to remove';
      const yawn = new YAWN(yaml);
      yawn.setRemark('key', '');

      expect(yawn.getRemark('key')).toBe('');
    });

    it('sets comment on nested path', () => {
      const yaml = dedent`
        parent:
          child: value
      `;
      const yawn = new YAWN(yaml);
      yawn.setRemark('parent.child', 'nested comment');

      expect(yawn.yaml).toContain('# nested comment');
    });

    it('returns false for non-existent path', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      const result = yawn.setRemark('nonexistent', 'comment');

      expect(result).toBe(false);
    });

    it('sets comment on array element', () => {
      const yaml = dedent`
        items:
          - first
          - second
      `;
      const yawn = new YAWN(yaml);
      yawn.setRemark('items.0', 'first item comment');

      expect(yawn.yaml).toContain('# first item comment');
    });
  });

  describe('getCommentBefore()', () => {
    it('gets block comment before node', () => {
      const yaml = dedent`
        # This is a block comment
        key: value
      `;
      const yawn = new YAWN(yaml);
      expect(yawn.getCommentBefore('key')).toBe('This is a block comment');
    });

    it('returns empty when no comment before', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      expect(yawn.getCommentBefore('key')).toBe('');
    });

    it('gets multi-line block comment', () => {
      const yaml = dedent`
        # Line 1
        # Line 2
        key: value
      `;
      const yawn = new YAWN(yaml);
      const comment = yawn.getCommentBefore('key');
      expect(comment).toContain('Line 1');
      expect(comment).toContain('Line 2');
    });
  });

  describe('setCommentBefore()', () => {
    it('sets block comment before node', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      yawn.setCommentBefore('key', 'New block comment');

      expect(yawn.yaml).toContain('# New block comment');
    });

    it('removes block comment when setting empty', () => {
      const yaml = dedent`
        # Comment to remove
        key: value
      `;
      const yawn = new YAWN(yaml);
      yawn.setCommentBefore('key', '');

      expect(yawn.getCommentBefore('key')).toBe('');
    });

    it('returns false for non-existent path', () => {
      const yaml = 'key: value';
      const yawn = new YAWN(yaml);
      const result = yawn.setCommentBefore('nonexistent', 'comment');

      expect(result).toBe(false);
    });
  });

  describe('Comment preservation during updates', () => {
    it('preserves inline comments when updating values', () => {
      const yaml = dedent`
        name: original # the name
        count: 1 # the count
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { name: 'updated', count: 2 };

      expect(yawn.yaml).toContain('# the name');
      expect(yawn.yaml).toContain('# the count');
      expect(yawn.json.name).toBe('updated');
      expect(yawn.json.count).toBe(2);
    });

    it('preserves block comments when updating values', () => {
      const yaml = dedent`
        # Name field
        name: original
        # Count field
        count: 1
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.name = 'updated';
      json.count = 2;
      yawn.json = json;

      expect(yawn.yaml).toContain('# Name field');
      expect(yawn.yaml).toContain('# Count field');
    });

    it('preserves comments in nested structures', () => {
      const yaml = dedent`
        config:
          # Database settings
          database:
            host: localhost # the host
            port: 5432 # the port
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.config.database.port = 3306;
      yawn.json = json;

      expect(yawn.yaml).toContain('# Database settings');
      expect(yawn.yaml).toContain('# the host');
      expect(yawn.yaml).toContain('# the port');
    });

    it('preserves comments when adding new keys', () => {
      const yaml = dedent`
        existing: value # existing comment
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { existing: 'value', newKey: 'newValue' };

      expect(yawn.yaml).toContain('# existing comment');
    });

    it('preserves comments when removing keys', () => {
      const yaml = dedent`
        keep: value # keep this comment
        remove: value # this goes away
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { keep: 'value' };

      expect(yawn.yaml).toContain('# keep this comment');
    });

    it('preserves array item comments when updating', () => {
      const yaml = dedent`
        items:
          - first # comment 1
          - second # comment 2
          - third # comment 3
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.items[1] = 'updated';
      yawn.json = json;

      expect(yawn.yaml).toContain('# comment 1');
      expect(yawn.yaml).toContain('# comment 2');
      expect(yawn.yaml).toContain('# comment 3');
    });

    it('preserves array item comments when adding elements', () => {
      const yaml = dedent`
        - one # first
        - two # second
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.push('three');
      yawn.json = json;

      expect(yawn.yaml).toContain('# first');
      expect(yawn.yaml).toContain('# second');
    });

    it('preserves comments when value unchanged', () => {
      const yaml = 'key: value # important comment';
      const yawn = new YAWN(yaml);
      const originalYaml = yawn.yaml;
      yawn.json = { key: 'value' }; // Same value

      expect(yawn.yaml).toBe(originalYaml);
    });
  });

  describe('Complex comment scenarios', () => {
    it('handles comments with special characters', () => {
      const yaml = 'key: value # comment with: colons and "quotes"';
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.key = 'updated';
      yawn.json = json;

      expect(yawn.yaml).toContain('comment with: colons');
    });

    it('handles multiple comments on same line', () => {
      const yaml = 'key: value # first # second';
      const yawn = new YAWN(yaml);
      expect(yawn.getRemark('key')).toContain('first');
    });

    it('preserves document-level comments', () => {
      const yaml = dedent`
        # Document header comment
        key: value
      `;
      const yawn = new YAWN(yaml);
      yawn.json = { key: 'updated' };

      expect(yawn.yaml).toContain('# Document header comment');
    });

    it('handles comments in deeply nested arrays', () => {
      const yaml = dedent`
        level1:
          level2:
            items:
              - deep # deep comment
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.level1.level2.items[0] = 'updated';
      yawn.json = json;

      expect(yawn.yaml).toContain('# deep comment');
    });
  });

  describe('Edge cases', () => {
    it('handles empty path to getRemark', () => {
      const yaml = '# doc comment\nkey: value';
      const yawn = new YAWN(yaml);
      // Empty path should get root node
      expect(yawn.getRemark('')).toBeDefined();
    });

    it('handles comments after arrays', () => {
      const yaml = dedent`
        items:
          - one
          - two
        # Comment after array
        next: value
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.items.push('three');
      yawn.json = json;

      expect(yawn.yaml).toContain('# Comment after array');
    });

    it('preserves blank line separation', () => {
      const yaml = dedent`
        section1:
          key: value

        # Section 2
        section2:
          key: value
      `;
      const yawn = new YAWN(yaml);
      const json = yawn.json;
      json.section1.key = 'updated';
      yawn.json = json;

      expect(yawn.yaml).toContain('# Section 2');
    });
  });
});
