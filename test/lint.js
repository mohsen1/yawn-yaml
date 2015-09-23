'use strict';

import lint from 'mocha-eslint';
import path from 'path';

const paths = [
  path.join(__dirname, '../src'),
  __dirname
];

lint(paths);
