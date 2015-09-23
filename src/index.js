'use strict';

import YAML from 'yaml-js';
import _ from 'lodash';


const NULL_TAG  = 'tag:yaml.org,2002:null';
const STR_TAG   = 'tag:yaml.org,2002:str';
const INT_TAG   = 'tag:yaml.org,2002:int';
const FLOAT_TAG = 'tag:yaml.org,2002:float';
const MAP_TAG   = 'tag:yaml.org,2002:map';
const SEQ_TAG   = 'tag:yaml.org,2002:seq';

export default class YAWN {

  constructor(str) {
    this.yaml = str;
  }

  get json() {
    return YAML.load(this.yaml);
  }

  set json(newJson) {
    const ast = YAML.compose(this.yaml);

    if (newJson === undefined) {
      this.yaml = '';
      return;
    }


    // -------------------------------------------------------------------------
    // check if entire json is changed
    // -------------------------------------------------------------------------
    let newTag = null;
    if (_.isArray(newJson)) {
      newTag = SEQ_TAG;
    } else if (_.isObject(newJson)) {
      newTag = MAP_TAG;
    } else if (_.isNull(newJson)) {
      newTag = NULL_TAG;
    } else if (_.isNumber(newJson)) {
      if (newJson % 10 === 0) {
        newTag = INT_TAG;
      } else {
        newTag = FLOAT_TAG;
      }
    } else {
      throw new Error('Unknown type')
    };

    if (ast.tag !== newTag) {
      let newYaml = YAML.dump(newJson);

      // replace this.yaml value from start to end mark with newYaml
      this.yaml = this.yaml.substr(0, ast.start_mark.pointer) + newYaml +
        this.yaml.substring(ast.end_mark.pointer);

      return;
    }

    // -------------------------------------------------------------------------
    // NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG
    // -------------------------------------------------------------------------
    if (_.contains([NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG], ast.tag)) {

    }


    // -------------------------------------------------------------------------
    // MAP_TAG
    // -------------------------------------------------------------------------
    if (ast.tag === MAP_TAG) {
      _.each(ast.value, pair => {
        let [key, val] = pair;
        console.log(key);
      });
    }

    // -------------------------------------------------------------------------
    // SEQ_TAG
    // -------------------------------------------------------------------------
    if (ast.tag === SEQ_TAG) {

    }


  }

  toString() {
    return this.yaml;
  }

  toJSON() {
    return this.json;
  }
}