'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('preserves comments and styling in objects when', ()=> {

  describe('JSON is an object and', ()=> {

    it('transformed to an array', ()=> {

      let str = `
        # leading comment
        value: 1 # inline comment
        number: 42
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = ['foo', 'bar', 'baz'];

      expect(yawn.yaml).to.equal(`
        # leading comment
        [foo, bar, baz] # inline comment
        # trailing comment`);
    });

    it('one of the values changes  oooo', ()=> {

      let str = `
        # leading comment
        value: 1 # inline comment
        number: 42
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.value = 2;
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        value: 2 # inline comment
        number: 42
        # trailing comment`);
    });

    it('two values changes', ()=> {

      let str = `
        # leading comment
        value: 1 # inline comment
        number: 42
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json.value = 2;
      yawn.json.number = 200;

      expect(yawn.yaml).to.equal(`
        # leading comment
        value: 2 # inline comment
        number: 200
        # trailing comment`);
    });

    it('one of the values is deleted', ()=> {
      let str = `
        # leading comment
        value: 1 # inline comment
        number: 42
        # trailing comment`;

      let yawn = new YAWN(str);
      delete yawn.json.value;

      expect(yawn.yaml).to.equal(`
        # leading comment
        number: 42
        # trailing comment`);
    });

    it('a new value has been added', ()=> {
      let str = `
        # leading comment
        value: 1 # inline comment
        number: 42
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.newVal = 99;

      expect(yawn.yaml).to.equal(`
        # leading comment
        value: 1 # inline comment
        number: 42
        newVal: 99
        # trailing comment`);
    });
  });
});
