# Changelog

## [3.0.0] - 2026-01-16

### Breaking Changes

- Minimum Node.js version is now 14+
- Removed deprecated `getRemark()` and `setRemark()` methods (use `getCommentBefore()` and `setCommentBefore()` instead)

### Complete Rewrite

Version 3.0.0 is a complete rewrite of YAWN using the modern [`yaml`](https://www.npmjs.com/package/yaml) package's CST (Concrete Syntax Tree) model. This provides robust, reliable comment preservation that was impossible with the previous string-splicing approach.

### New Features

- **Robust comment preservation**: Comments are now first-class citizens in the AST, not afterthoughts handled via string manipulation
- **Scalar style preservation**: Quoted strings (`"value"`, `'value'`), block scalars (`|`, `>`), and other formatting is preserved when updating values
- **New API methods**:
  - `getCommentBefore(path)` - Get the comment before a node at a given path
  - `setCommentBefore(path, comment)` - Set the comment before a node at a given path

### Bug Fixes

This release fixes all 11 open GitHub issues:

- **#2** - Appending to empty object throws
- **#6** - Array order is not preserved
- **#8** - Flow styles are unsupported
- **#10** - Changing a null value to a mapping results in `[object Object]` string value
- **#18** - Comments should remain associated with the element they comment
- **#19** - Should be able to add an attribute after expanding an array
- **#24** - Changing value in a multiple line value breaks
- **#25** - Duplicate comment when converting back from document
- **#53** - getRemark() does not function as expected (replaced with getCommentBefore/setCommentBefore)
- **#68** - The block chomping indicator doesn't work
- **#78** - Incorrectly converts string to number sometimes

### Performance & Size

- **Reduced bundle size**: ~32KB (down from ~300KB) by consolidating dependencies
- **Removed dependencies**: `lodash`, `yaml-js`, `js-yaml`
- **Single dependency**: `yaml` package (v2.x)

### Demo

- New interactive demo with CodeMirror 6 editors
- Real-time live updating on keypress
- Dark/light mode support following system preference
- Syntax highlighting for YAML and JSON

### Migration Guide

```javascript
// Before (v2.x)
import YAWN from 'yawn-yaml';
const yawn = new YAWN(yamlString);
yawn.getRemark('path.to.key');
yawn.setRemark('path.to.key', 'comment');

// After (v3.0.0)
import YAWN from 'yawn-yaml';
const yawn = new YAWN(yamlString);
yawn.getCommentBefore('path.to.key');
yawn.setCommentBefore('path.to.key', 'comment');
```

The core API remains the same:
- `new YAWN(yamlString)` - Create a new YAWN instance
- `yawn.yaml` - Get the current YAML string
- `yawn.json` - Get/set the JSON representation

---

## [2.1.0] and earlier

See [GitHub releases](https://github.com/mohsen1/yawn-yaml/releases) for previous versions.
