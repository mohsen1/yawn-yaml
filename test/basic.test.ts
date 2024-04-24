import YAWN from '../src';

import dedent from 'dedent';

describe('Basic tests', () => {
  it('converting back to YAML with comments', () => {
    let str = dedent`
      # my comment
      value: 1 # the value is here!
    `;

    let yawn = new YAWN(str);

    yawn.json = {value: 2};

    expect(yawn.yaml).toEqual(dedent`
      # my comment
      value: 2 # the value is here!
    `);
  });
});

