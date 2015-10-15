'use strict';

import {expect} from 'chai';
import YAWN from '../src/index.js';


const input = `
swagger: '2.0'
info:
  version: 0.0.0
  title: Simple API
paths:
  /:

    parameters:
      - name: test
        in: query
        type: string

    get:
      responses:
        '200':
          description: OK
`;

const output = `
swagger: '2.0'
info:
  version: 0.0.0
  title: Simple API
paths:
  /:

    parameters:
      - name: test
        in: query
        type: string

    get:
      responses:
        '200':
          description: OK
  /newPath:
    get:
      responses:
        '200':
          description: OK
`;

describe('preserves comments and styling when', ()=> {

  describe('JSON is complex', ()=> {
    // debugger
    it('adds new object hash', ()=> {
      let yawn = new YAWN(input);

      let json = yawn.json;

      json.paths['/newPath'] = {
        get: {
          responses: {
            200: {
              description: 'OK'
            }
          }
        }
      };

      yawn.json = json;

      expect(yawn.yaml).to.equal(output);
    });
  });
});
