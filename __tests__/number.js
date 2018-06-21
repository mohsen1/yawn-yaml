'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('preserves comments and styling when', ()=> {

  // FIXME: these tests are failing for no good reason!
  describe('JSON is an int and', ()=> {

    it('number changes', ()=> {
      let str = `
        # leading comment
        100 # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = 1501;

      expect(yawn.yaml).to.equal(`
        # leading comment
        1501 # inline comment
        # trailing comment`);
    });

    it('number changes to a float', ()=> {
      let str = `
        # leading comment
        100 # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = 101.99999;

      expect(yawn.yaml).to.equal(`
        # leading comment
        101.99999 # inline comment
        # trailing comment`);
    });
  });

  describe('JSON is a float and', ()=> {

    it('number changes', ()=> {
      let str = `
        # leading comment
        3.14 # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = 1.000000001;

      expect(yawn.yaml).to.equal(`
        # leading comment
        1.000000001 # inline comment
        # trailing comment`);
    });

    it('number changes to an int', ()=> {
      let str = `
        # leading comment
        3.14 # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = 42424242;

      expect(yawn.yaml).to.equal(`
        # leading comment
        42424242 # inline comment
        # trailing comment`);
    });
  });
});
