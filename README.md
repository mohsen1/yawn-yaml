# YAWN YAML 🥱

**YAML parser that preserves comments and styling**

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

Use npm or Bower to install [`yawn-yaml`](https://www.npmjs.com/package/yawn-yaml) package

```
npm install --save yawn-yaml
```

```
yarn add yawm-yaml
```


## Development

To install dependencies run:

```
yarn install
```


To run tests continuously and watch for changes 

```
yarn start
```

To run the test run:

```
yarn test
```

## License
[MIT](./LICENSE)
