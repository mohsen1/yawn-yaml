import fs from 'fs-extra';

import YAWNYAML from '../src';

fs.readdirSync('./__tests__/cases').forEach(caseName => {
    const { yaml, modifier } = require('./cases/' + caseName);
    describe(`Test case: ${caseName}`, () => {
        if (caseName.endsWith('.d.ts')) return;

        const yawn = new YAWNYAML(yaml);
        yawn.json = modifier(yawn.json);
        it('returns correct JSON', () => {
            expect(yawn.json).toMatchSnapshot();
        });
        it('returns correct YAML', () => {
            expect(yawn.yaml).toMatchSnapshot();
        });
    });
});
