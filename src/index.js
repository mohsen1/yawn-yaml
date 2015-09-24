  'use strict';

import YAML from 'yaml-js';
import _ from 'lodash';

import YAWNError from './error.js';

const NULL_TAG = 'tag:yaml.org,2002:null';
const STR_TAG = 'tag:yaml.org,2002:str';
const INT_TAG = 'tag:yaml.org,2002:int';
const FLOAT_TAG = 'tag:yaml.org,2002:float';
const MAP_TAG = 'tag:yaml.org,2002:map';
const SEQ_TAG = 'tag:yaml.org,2002:seq';

// export default class YAWN {
export default class YAWN {

  constructor(str) {
    if (!_.isString(str)) {
      throw new TypeError('str should be a string');
    }

    this.yaml = str;
  }

  get json() {
    return YAML.load(this.yaml);
  }

  set json(newJson) {
    const ast = YAML.compose(this.yaml);

    if (_.isUndefined(newJson)) {
      this.yaml = '';
      return;
    }


    // -------------------------------------------------------------------------
    // check if entire json is changed
    // -------------------------------------------------------------------------
    let newTag = getTag(newJson);

    if (ast.tag !== newTag) {
      let newYaml = YAML.dump(newJson);

      // replace this.yaml value from start to end mark with newYaml
      this.yaml = replace(ast, newYaml, this.yaml);

      return;
    }

    // -------------------------------------------------------------------------
    // NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG
    // -------------------------------------------------------------------------
    if (_.contains([NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG], ast.tag)) {
      this.yaml = replace(ast, newJson, this.yaml);

      return;
    }


    // -------------------------------------------------------------------------
    // MAP_TAG
    // -------------------------------------------------------------------------
    if (ast.tag === MAP_TAG) {
      let json = this.json;

      _.each(ast.value, pair => {
        let [keyNode, valNode] = pair;

        // node is deleted
        if (_.isUndefined(json[keyNode.value])) {
          return; // TODO: delete node
        }

        let value = json[keyNode.value];
        let newValue = newJson[keyNode.value];

        // TODO: This is for only primitive value
        if (newValue !== value) {
          this.yaml = replace(valNode, newValue, this.yaml);
        }
      });
    }

    // -------------------------------------------------------------------------
    // SEQ_TAG
    // -------------------------------------------------------------------------
    if (ast.tag === SEQ_TAG) {
      return; // TODO
    }


  }

  toString() {
    return this.yaml;
  }

  toJSON() {
    return this.json;
  }
}

/*
 * Determines the AST tag of a JSON object
 *
 * @param {any} - json
 * @returns {boolean}
 * @throws {YAWNError} - if json has weird type
*/
function getTag(json) {
  let tag = null;

  if (_.isArray(json)) {
    tag = SEQ_TAG;
  } else if (_.isObject(json)) {
    tag = MAP_TAG;
  } else if (_.isNull(json)) {
    tag = NULL_TAG;
  } else if (_.isNumber(json)) {
    if (json % 10 === 0) {
      tag = INT_TAG;
    } else {
      tag = FLOAT_TAG;
    }
  } else if (_.isString(json)) {
    tag = STR_TAG;
  } else {
    throw new YAWNError('Unknown type');
  }
  return tag;
}

/*
 * Place value in node range in yaml string
 *
 * @param node {ScalarNode}
 * @param value {any}
 * @param yaml {string}
 *
 * @returns {string}
*/
function replace(node, value, yaml) {
  return yaml.substr(0, node.start_mark.pointer) +
    String(value) +
    yaml.substring(node.end_mark.pointer);
}
