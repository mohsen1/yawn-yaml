# YAWN YAML 🥱

YAML parser that preserves comments and styling

**[Live Demo](http://azimi.me/yawn-yaml/demo/index.html)**

## Usage

```ts
import YAWN from 'yawn-yaml';

let str = `
# my comment
value: 1 # the value is here!
`;

let yawn = new YAWN(str);

// update the `json` property
yawn.json = { value: 2 };

// value in `yawn.yaml` is now changed.
// with comments and styling preserved.
console.log(yawn.yaml); // =>
// # my comment
// value: 2 # the value is here!
```

## Installation

```bash
npm install --save yawn-yaml
```

## How it works

`yawn.yaml` is the text you passed in. When `json` is assigned, YAWN compares
the new value with the document and edits only the parts of the text that
changed. Indentation, spacing, quotes, flow collections, blank lines and
comments of everything else are kept byte for byte, and new content follows
the style of the document.

```ts
const yawn = new YAWN(`
# servers
servers:
    - name:   "one"   # first
      tags: [a, b]
    - name:   "two"
`);

const json = yawn.json;
json.servers[0].tags.push('c');
json.servers.push({ name: 'three' });
yawn.json = json;

console.log(yawn.yaml); // =>
// # servers
// servers:
//     - name:   "one"   # first
//       tags: [a, b, c]
//     - name:   "two"
//     - name: three
```

After every assignment `yawn.json` is deep equal to the assigned value.
Values are treated like `JSON.stringify` does: `undefined` and functions are
skipped and `toJSON()` is used when present.

## API

| Member | Description |
| --- | --- |
| `new YAWN(yaml, options?)` | Parses a YAML string. `options.indent` and `options.lineWidth` control how new content is written; the indentation is detected from the document by default. |
| `yawn.yaml` | The YAML string. Assign a string to load another document. |
| `yawn.json` | The value of the document. Assign a value to update the YAML. |
| `yawn.errors` | Messages of the syntax errors in the YAML string, empty for a valid document. |
| `yawn.getRemark(path)` / `yawn.setRemark(path, text)` | Reads or writes the comment at the end of the line of a value. |
| `yawn.getCommentBefore(path)` / `yawn.setCommentBefore(path, text)` | Reads or writes the comment lines above a key or sequence item. |

Paths are dot separated, for example `servers.0.name`.

## Development

```bash
npm install
```

```bash
npm test
```

To run the demo locally:

```bash
npm start
```

## License

[MIT](./LICENSE)
