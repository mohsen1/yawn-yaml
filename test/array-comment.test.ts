import YAWN from '../src';

import dedent from 'dedent';

describe('Comments on array elements', () => {
  it('preserves comments nested in arrays', () => {
    let str = dedent`
      customers:
        - name: some-customer
          deployment:
            region: us-east-1 # inline comment
          id: 12345
    `;

    let yawn = new YAWN(str);
    yawn.json = {
      customers: [
        {
          name: 'some-customer',
          deployment: { region: 'us-east-1' },
          id: 12345,
        },
        {
          name: 'some-other-customer',
          deployment: { region: 'us-east-1' },
          id: 54321,
        },
      ],
    };

    expect(yawn.yaml).toEqual(dedent`
      customers:
        - name: some-customer
          deployment:
            region: us-east-1 # inline comment
          id: 12345
        - name: some-other-customer
          deployment:
            region: us-east-1
          id: 54321
    `);
  });
});
