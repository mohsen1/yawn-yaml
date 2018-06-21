'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('preserves comments and styling in objects when', ()=> {

  describe('JSON is an object and', ()=> {

    it('transformed to an array', ()=> {
      // debugger
      let str = `
        # leading comment
        value: 1 # inline comment
        number: 42
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = ['foo', 'bar', 'baz'];

      expect(yawn.yaml).to.equal(`
        # leading comment
        - foo
        - bar
        - baz
        # trailing comment`);
    });

    it('one of the values changes', ()=> {

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
      let json = yawn.json;
      json.value = 2;
      json.number = 200;
      yawn.json = json;

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
      let json = yawn.json;
      delete json.value;
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
         # inline comment
        number: 42
        # trailing comment`);
    });

    it('a new primitive value has been added', ()=> {
      let str = `
        # leading comment
        value: 1 # inline comment
        number: 42
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.newVal = 99;
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        value: 1 # inline comment
        number: 42
        newVal: 99
        # trailing comment`);
    });

    it('a new non-primitive value has been added', ()=> {
      let str = `
        # leading comment
        value: 1 # inline comment
        number: 42
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.newVal = {ans: 42, cond: 'good'};
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        value: 1 # inline comment
        number: 42
        newVal:
          ans: 42
          cond: good
        # trailing comment`);
    });

    it('two new non-primitive value has been added to a map', ()=> {
      let str = `
        # leading comment
        map:
          val: 1
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json.map = {
        val: 1,
        hash1: {ans: 42, cond: 'good'},
        hash2: {ans: 34, cond: 'not-bad'}
      };
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        map:
          val: 1
          hash2:
            ans: 34
            cond: not-bad
          hash1:
            ans: 42
            cond: good
        # trailing comment`);
    });

    it('two new non-primitive value has been added to root', ()=> {
      let str = `
        # leading comment
        map:
          val: 1
        # trailing comment`;

      let yawn = new YAWN(str);
      let json = yawn.json;
      json = {
        map: {val: 1},
        hash1: {ans: 42, cond: 'good'},
        hash2: {ans: 34, cond: 'not-bad'}
      };
      yawn.json = json;

      expect(yawn.yaml).to.equal(`
        # leading comment
        map:
          val: 1
        hash2:
          ans: 34
          cond: not-bad
        hash1:
          ans: 42
          cond: good
        # trailing comment`);
    });
  });
});
