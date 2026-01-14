import YAWN from '../src';

import dedent from 'dedent';

describe('Comments on array elements', () => {
  it('preserves comments nested in arrays', () => {
    let str = dedent`
      - name: some-customer # inline comment
        region: us-east-1
    `;

    let yawn = new YAWN(str);
    yawn.json = [
      {
        name: 'some-customer',
        region: 'us-east-1',
      },
      {
        name: 'some-other-customer',
        region: 'us-east-1',
      },
    ];

    expect(yawn.yaml).toEqual(dedent`
      - name: some-customer # inline comment
        region: us-east-1
      - name: some-other-customer
        region: us-east-1
    `);
  });
});
