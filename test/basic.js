'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';

describe('preserves comments and styling', ()=> {
  it('when JSON type is changed', ()=> {

    //         012345678  01234
    let str = '# comment\nme: 1\n#more comments';
    let yawn = new YAWN(str);
    yawn.json = ['foo', 'bar', 'baz'];

    expect(yawn.yaml).to.equal('# comment\n[foo, bar, baz]\n#more comments');

  });
});