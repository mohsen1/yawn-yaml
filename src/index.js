'use strict';

import {compose} from 'yaml-js';
import {load, dump} from 'js-yaml';
import {
  isArray,
  isString,
  isObject,
  isUndefined,
  isNull,
  isNumber,
  isEqual,
  repeat,
  each,
  contains,
  last,
  difference
} from 'lodash';

import YAWNError from './error.js';

const NULL_TAG = 'tag:yaml.org,2002:null';
const STR_TAG = 'tag:yaml.org,2002:str';
const INT_TAG = 'tag:yaml.org,2002:int';
const FLOAT_TAG = 'tag:yaml.org,2002:float';
const MAP_TAG = 'tag:yaml.org,2002:map';
const SEQ_TAG = 'tag:yaml.org,2002:seq';

const LINE_SEPERATOR = '\n';
const SPACE = ' ';
const DASH = '-';

// export default class YAWN {
export default class YAWN {

  constructor(str) {
    if (!isString(str)) {
      throw new TypeError('str should be a string');
    }

    this.yaml = str;
  }

  get json() {
    return load(this.yaml);
  }

  set json(newJson) {

    // if json is not changed do nothing
    if (isEqual(this.json, newJson)) {
      return;
    }

    const ast = compose(this.yaml);

    if (isUndefined(newJson)) {
      this.yaml = '';
      return;
    }

    // -------------------------------------------------------------------------
    // check if entire json is changed
    // -------------------------------------------------------------------------
    let newTag = getTag(newJson);

    if (ast.tag !== newTag) {
      let newYaml = cleanDump(newJson);

      // replace this.yaml value from start to end mark with newYaml if node is
      // primitive
      if (!isObject(newJson)) {
        this.yaml = replacePrimitive(ast, newYaml, this.yaml);

      // if node is not primitive
      } else {
        this.yaml = replaceNode(ast, newYaml, this.yaml);
      }

      return;
    }

    // -------------------------------------------------------------------------
    // NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG
    // -------------------------------------------------------------------------
    if (contains([NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG], ast.tag)) {
      this.yaml = replacePrimitive(ast, newJson, this.yaml);

      return;
    }


    // -------------------------------------------------------------------------
    // MAP_TAG
    // -------------------------------------------------------------------------
    if (ast.tag === MAP_TAG) {
      let json = this.json;

      this.yaml = updateMap(ast, newJson, json, this.yaml);
    }

    // -------------------------------------------------------------------------
    // SEQ_TAG
    // -------------------------------------------------------------------------
    if (ast.tag === SEQ_TAG) {
      this.yaml = updateSeq(ast, newJson, this.yaml);
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

  if (isArray(json)) {
    tag = SEQ_TAG;
  } else if (isObject(json)) {
    tag = MAP_TAG;
  } else if (isNull(json)) {
    tag = NULL_TAG;
  } else if (isNumber(json)) {
    if (json % 10 === 0) {
      tag = INT_TAG;
    } else {
      tag = FLOAT_TAG;
    }
  } else if (isString(json)) {
    tag = STR_TAG;
  } else {
    throw new YAWNError('Unknown type');
  }
  return tag;
}

/*
 *
 *
 *
*/
function updateSeq(ast, newJson, yaml) {
  let values = ast.value.map(item => item.value);

  // new items in newJson
  let newItems = difference(newJson, values).reverse();

  if (newItems.length) {
    yaml = insertAfterNode(ast, cleanDump(newItems), yaml);
  }

  // deleted items in newJson
  difference(values, newJson).forEach((deletedItem)=> {

    // find the node for this item
    each(ast.value, node => {
      if (isEqual(node.value, deletedItem)) {

        // remove it from yaml
        yaml = removeArrayElement(node, yaml);

        // re-compose the AST for accurate removals after
        ast = compose(yaml);
      }
    });
  });

  return yaml;
}

/*
 * update a map structure with new values
 *
 * @param {AST} ast - a map AST
 * @param {any} newJson
 * @param {any} - json
 * @param {string} yaml
 * @returns {boolean}
 * @throws {YAWNError} - if json has weird type
*/
function updateMap(ast, newJson, json, yaml) {

  // look for changes
  each(ast.value, pair => {
    let [keyNode, valNode] = pair;

    // node is deleted
    if (isUndefined(newJson[keyNode.value])) {

      // TODO: can we use of the methods below?
      yaml = yaml.substr(0, keyNode.start_mark.pointer) +
        yaml.substring(getNodeEndMark(valNode).pointer);
      return;
    }

    let value = json[keyNode.value];
    let newValue = newJson[keyNode.value];

    // primitive value has changed
    if (newValue !== value && !isArray(valNode.value)) {

      // replace the value node
      yaml = replacePrimitive(valNode, newValue, yaml);

      // remove the key/value from newJson so it's not detected as new pair in
      // later code
      delete newJson[keyNode.value];
    }

    // non primitive value has changed
    if (!isEqual(newValue, value) && isArray(valNode.value)) {

      // array value has changed
      if (isArray(newValue)) {

        // recurse
        yaml = updateSeq(valNode, newValue, yaml);

      // map value has changed
      } else {

        // recurse
        yaml = updateMap(valNode, newValue, value, yaml);

        ast = compose(yaml);

        // remove the key/value from newJson so it's not detected as new pair in
        // later code
        delete newJson[keyNode.value];
      }
    }
  });

  // look for new items to add
  each(newJson, (value, key)=> {

    // item is new
    if (isUndefined(json[key])) {
      let newValue = cleanDump({[key]: value});

      yaml = insertAfterNode(ast, newValue, yaml);
    }
  });

  return yaml;
}

/*
 * Place value in node range in yaml string
 *
 * @param node {Node}
 * @param value {any}
 * @param yaml {string}
 *
 * @returns {string}
*/
function replacePrimitive(node, value, yaml) {
  return yaml.substr(0, node.start_mark.pointer) +
    String(value) +
    yaml.substring(node.end_mark.pointer);
}

/*
 * Place value in node range in yaml string
 *
 * @param node {Node}
 * @param value {any}
 * @param yaml {string}
 *
 * @returns {string}
*/
function replaceNode(node, value, yaml) {
  let indentedValue = indent(value, node.start_mark.column);
  let lineStart = node.start_mark.pointer - node.start_mark.column;

  return yaml.substr(0, lineStart) +
    indentedValue +
    yaml.substring(getNodeEndMark(node).pointer);
}

/*
 * Place value after node range in yaml string
 *
 * @param node {Node}
 * @param value {any}
 * @param yaml {string}
 *
 * @returns {string}
*/
function insertAfterNode(node, value, yaml) {
  let indentedValue = indent(value, node.start_mark.column);

  return yaml.substr(0, getNodeEndMark(node).pointer) +
    LINE_SEPERATOR +
    indentedValue +
    yaml.substring(getNodeEndMark(node).pointer);
}

/*
 * Removes a node from array
 *
 * @param {Node} node
 * @param {string} yaml
 *
 * @returns {string}
*/
function removeArrayElement(node, yaml) {

  // FIXME: Removing element from a YAML like `[a,b]` won't work with this.

  // find index of DASH(`-`) character for this array
  let index = node.start_mark.pointer;
  while (index > 0 && yaml[index] !== DASH) {
    index--;
  }

  return yaml.substr(0, index) +
      yaml.substring(getNodeEndMark(node).pointer);
}


/*
 * Gets end mark of an AST
 *
 * @param {Node} ast
 *
 * @retusns {Mark}
*/
function getNodeEndMark(ast) {
  if (isArray(ast.value)) {
    let lastItem = last(ast.value);

    if (isArray(lastItem)) {
      return getNodeEndMark(last(lastItem));
    }
    return getNodeEndMark(lastItem);
  }

  return ast.end_mark;
}

/*
 * Indents a string with number of characters
 *
 * @param {string} str
 * @param {integer} depth - can be negative also
 *
 * @returns {string}
*/
function indent(str, depth) {
  return str
    .split(LINE_SEPERATOR)
    .filter(line => line)
    .map(line => repeat(SPACE, depth) + line)
    .join(LINE_SEPERATOR);
}

function cleanDump(value) {
  return dump(value).replace(/\n$/, '');
}

// TODO: fix UMD exports...
if (typeof window !== 'undefined') {
  window.YAWN = YAWN;
}
