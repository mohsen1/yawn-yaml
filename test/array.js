'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('preserves comments and styling when', ()=> {

  describe('JSON is an array and', ()=> {

    it('transformed to an object', ()=> {
      let str = `
        # leading comment
        - value1 # inline comment
        - value2
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = {val1: 1, val2: 2};

      expect(yawn.yaml).to.equal(`
        # leading comment
        val1: 1
        val2: 2
        # trailing comment`);
    });
  });
});
