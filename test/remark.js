'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('preserves comments and styling when', ()=> {

  describe('Get mark', ()=> {
    it('target is array member', ()=> {
      let str = `
        # leading comment
        - value1 # inline comment
        - value2
        # trailing comment`;

      let yawn = new YAWN(str);
      let value1 = yawn.getRemark('0');
      let value2 = yawn.getRemark('1');

      expect(value1).to.equal('inline comment');
      expect(value2).to.equal('');
    });

    it('target is object', ()=> {
      let str = `
        # leading comment
        value1: 1 # inline comment
        value2: 2
        # trailing comment`;

      let yawn = new YAWN(str);
      let value1 = yawn.getRemark('value1');
      let value2 = yawn.getRemark('value2');

      expect(value1).to.equal('inline comment');
      expect(value2).to.equal('');
    });

    it('target is unknown', ()=> {
      let str = `
        # leading comment
        value1: 1 # inline comment
        value2: 2
        # trailing comment`;

      let yawn = new YAWN(str);
      let unknown = yawn.getRemark('unknown');

      expect(unknown).to.equal(undefined);
    });

    it('target is deep array member', ()=> {
      let str = `
        # leading comment
        - - sub # sub inline comment
        - - sub
        # trailing comment`;

      let yawn = new YAWN(str);
      let value1 = yawn.getRemark('0.0');
      let value2 = yawn.getRemark('1.0');

      expect(value1).to.equal('sub inline comment');
      expect(value2).to.equal('');
    });

    it('target is deep object', ()=> {
      let str = `
        # leading comment
        value1: # inline comment
          sub: 1 # sub inline comment
        value2:
          sub: 2
        # trailing comment`;

      let yawn = new YAWN(str);
      let value1 = yawn.getRemark('value1.sub');
      let value2 = yawn.getRemark('value2.sub');

      expect(value1).to.equal('sub inline comment');
      expect(value2).to.equal('');
    });
  });

  describe('Set mark', ()=> {
    it('target is array member', ()=> {
      let str = `
        # leading comment
        - value1 # inline comment
        - value2
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.setRemark('0', 'inline changed comment1');
      yawn.setRemark('1', 'inline changed comment2');

      expect(yawn.yaml).to.equal(`
        # leading comment
        - value1 # inline changed comment1
        - value2 # inline changed comment2
        # trailing comment`);
    });

    it('target is object', ()=> {
      let str = `
        # leading comment
        value1: 1 # inline comment
        value2: 2
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.setRemark('value1', 'inline changed comment1');
      yawn.setRemark('value2', 'inline changed comment2');

      expect(yawn.yaml).to.equal(`
        # leading comment
        value1: 1 # inline changed comment1
        value2: 2 # inline changed comment2
        # trailing comment`);
    });

    it('target is unknown', ()=> {
      let str = `
        # leading comment
        value1: 1 # inline comment
        value2: 2
        # trailing comment`;

      let yawn = new YAWN(str);
      let unknown = yawn.setRemark('unknown', 'nouse');

      expect(unknown).to.equal(false);
      expect(yawn.yaml).to.equal(`
        # leading comment
        value1: 1 # inline comment
        value2: 2
        # trailing comment`);
    });

    it('target is deep array member', ()=> {
      let str = `
        # leading comment
        - - sub # sub inline comment
        - - sub
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.setRemark('0.0', 'sub changed comment1');
      yawn.setRemark('1.0', 'sub changed comment2');

      expect(yawn.yaml).to.equal(`
        # leading comment
        - - sub # sub changed comment1
        - - sub # sub changed comment2
        # trailing comment`);
    });

    it('target is deep object', ()=> {
      let str = `
        # leading comment
        value1: # inline comment
          sub: 1 # sub inline comment
        value2:
          sub: 2
        # trailing comment`;

      let yawn = new YAWN(str);
      yawn.setRemark('value1.sub', 'sub changed comment1');
      yawn.setRemark('value2.sub', 'sub changed comment2');

      expect(yawn.yaml).to.equal(`
        # leading comment
        value1: # inline comment
          sub: 1 # sub changed comment1
        value2:
          sub: 2 # sub changed comment2
        # trailing comment`);
    });
  });
});
