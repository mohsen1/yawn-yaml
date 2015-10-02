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
          val: 1
          newVal: 2 # inline comment
        # trailing comment`);
    });

    it('a primitive value is changed in third level', ()=> {

      let str = `
        # leading comment
        obj:
          deep: # inline_comment
            val: 1 # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.obj.deep.val = 2;
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        obj:
          deep: # inline_comment
            val: 2 # inline comment
        # trailing comment`);
    });

    it('a non-primitive key/value is inserted in third level', ()=> {

      let str = `
        # leading comment
        obj:
          deep: # inline_comment
            val: 1 # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.obj.deep.newVal = {val: 43};
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        obj:
          deep: # inline_comment
            val: 1
            newVal:
              val: 43 # inline comment
        # trailing comment`);
    });
  });
});
