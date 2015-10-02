# YAWN

> YAML parser that preserves comments and styling

## Usage

```js
import YAWN from 'ywan';

let str = `
# my comment
value: 1 # the value is here!
`;

let yawn = new YAWN(str);

yawn.json = {value: 2};

console.log(yawn.yaml); // =>

// `
// # my comment
// value: 1 # the value is here!
// `

```

## License
[MIT](./LICENSE)