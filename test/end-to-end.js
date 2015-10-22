'use strict';

import {readFileSync, readdirSync} from 'fs';
import {join} from 'path';
import {load} from 'js-yaml';
import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('end to end', ()=> {

  readdirSync(join(__dirname, 'end-to-end')).forEach(testCase=> {

    it(`preserves comments and styling for test case ${testCase}`, ()=> {

      const path = join(__dirname, 'end-to-end', testCase);
      const input = readFileSync(join(path, 'input.yaml')).toString();
      const output = readFileSync(join(path, 'output.yaml')).toString();
      const newJson = load(output);

      const yawn = new YAWN(input);
      yawn.json = newJson;

      expect(yawn.yaml).to.equal(output);
    });
  });
});
