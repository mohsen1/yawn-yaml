'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('preserves comments and styling in objects when', ()=> {

  describe('JSON is a deep object and', ()=> {

    it('a primitive value is changed in second level', ()=> {

      let str = `
        # leading comment
        obj:
          val: 1 # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.obj.val = 2;
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        obj:
          val: 2 # inline comment
        # trailing comment`);
    });

    it('a primitive key/value is inserted in second level', ()=> {

      let str = `
        # leading comment
        obj:
          val: 1 # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.obj.newVal = 2;
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        obj:
          val: 1 # inline comment
          newVal: 2
        # trailing comment`);
    });
  });
});
