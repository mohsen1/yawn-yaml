'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('preserves comments and styling when', ()=> {

  describe('JSON is an array and', ()=> {
    // debugger
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

    it('one item in array is changed', ()=> {
      let str = `
        # leading comment
        - value1 # inline comment
        - value2
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json[0] = 'value0';
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
         # inline comment
        - value2
        - value0
        # trailing comment`);
    });

    it('one item is added to the array', ()=> {
      let str = `
        # leading comment
        - value1 # inline comment
        - value2
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.push('value3');
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        - value1 # inline comment
        - value2
        - value3
        # trailing comment`);
    });

    it('two items in array are changed', ()=> {
      let str = `
        # leading comment
        - value1 # inline comment
        - value2
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = ['newVal1', 'newVal2'];

      expect(yawn.yaml).to.equal(`
        # leading comment
         # inline comment

        - newVal2
        - newVal1
        # trailing comment`);
    });

    it('one item is deleted', ()=> {
      let str = `
        # leading comment
        - value1 # inline comment
        - value2
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.shift();
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
         # inline comment
        - value2
        # trailing comment`);
    });

    it('one item in middle is deleted', ()=> {
      let str = `
        # leading comment
        - value1 # inline comment
        - value2
        - value3
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json = json.slice(0, 1).concat(json.slice(2));
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        - value1 # inline comment

        - value3
        # trailing comment`);
    });

    it('one item is added', ()=> {
      let str = `
        # leading comment
        - value1 # inline comment
        - value2
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.push('value3');
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        - value1 # inline comment
        - value2
        - value3
        # trailing comment`);
    });
  });
});
