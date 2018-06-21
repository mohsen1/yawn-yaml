'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('preserves comments and styling when', ()=> {

  describe('JSON is a string and', ()=> {

    it('string changes', ()=> {
      let str = `
        # leading comment
        stringVal # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = 'newValue';

      expect(yawn.yaml).to.equal(`
        # leading comment
        newValue # inline comment
        # trailing comment`);
    });

    it('string become null', ()=> {
      let str = `
        # leading comment
        stringVal # inline comment
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = null;

      expect(yawn.yaml).to.equal(`
        # leading comment
        null # inline comment
        # trailing comment`);
    });
  });
});
