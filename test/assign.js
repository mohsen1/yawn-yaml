'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('doesn\'t throw errors when', ()=> {

  describe('JSON is an object and gets replaced with', ()=> {

    it('a new JSON object with one change', ()=> {
      let str = `
        # leading comment
        foo:
          bar: Bar
          baz: Baz
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = {
        foo: {
          bar: 'New Bar',
          baz: 'Baz'
        }
      };

      expect(yawn.yaml).to.equal(`
        # leading comment
        foo:
          bar: New Bar
          baz: Baz
        # trailing comment`);
    });

    it('a new JSON object with two changes', ()=> {
      let str = `
        # leading comment
        foo:
          bar: Bar
          baz: Baz
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.json = {
        foo: {
          bar: 'New Bar',
          baz: 'New Baz'
        }
      };

      expect(yawn.yaml).to.equal(`
        # leading comment
        foo:
          bar: New Bar
          baz: New Baz
        # trailing comment`);
    });

  });

});
