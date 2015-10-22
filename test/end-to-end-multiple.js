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
    get:
      responses:
        '200':
          description: OK
  /new-models:
    post:
      description: Make a new \`NewModel\`.
      parameters:
        - name: body
          description: A new \`NewModel\`
          in: body
          schema:
            $ref: '#/definitions/NewModel'
      responses:
        '200':
          description: OK
          schema:
            $ref: '#/definitions/NewModel'
definitions:
  NewModel:
    type: string
`;

// Using JSON.parse to get away from style checker!
const newJson = JSON.parse(`{
  "swagger": "2.0",
  "info": {
    "version": "0.0.0",
    "title": "Simple API"
  },
  "paths": {
    "/": {
      "get": {
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/new-models": {
      "post": {
        "description": "Make a new \`NewModel\`.",
        "parameters": [
          {
            "name": "body",
            "description": "A new \`NewModel\`",
            "in": "body",
            "schema": {
              "$ref": "#/definitions/NewModel"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/NewModel"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "NewModel": {
      "type": "string"
    }
  }
}`);

describe('preserves comments and styling when', ()=> {

  describe('JSON is complex', ()=> {
    // debugger
    it('adds two new object hashes', ()=> {
      let yawn = new YAWN(input);

      yawn.json = newJson;

      expect(yawn.yaml).to.equal(output);
    });
  });
});
