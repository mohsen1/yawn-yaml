# YAWN YAML

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
// # my comment
// value: 1 # the value is here!

```

## Installation

Use npm or Bower to install `"yawn-yaml"` package

```
npm install --save yawn-yaml
```

```
bower install --save yawm-yaml
```

If you wish to depend to ES6 version use [`src/index.js`](./src/index.js) file.

## Development

To install dependencies run:

```
npm install
```

To run the test run:

```
npm test
```

To run tests continuously and watch for changes install [mocha](https://mochajs.org/) and run:

```
mocha --compilers js:babel/register -w
```

To make a new build run:

```
npm run browserify
```


## License
[MIT](./LICENSE)