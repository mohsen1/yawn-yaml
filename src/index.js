'use strict';

import { EOL } from 'os';
import {compose, serialize} from 'yaml-js';
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
  includes,
  last
} from 'lodash';

import YAWNError from './error.js';

const NULL_TAG = 'tag:yaml.org,2002:null';
const STR_TAG = 'tag:yaml.org,2002:str';
const INT_TAG = 'tag:yaml.org,2002:int';
const FLOAT_TAG = 'tag:yaml.org,2002:float';
const MAP_TAG = 'tag:yaml.org,2002:map';
const SEQ_TAG = 'tag:yaml.org,2002:seq';

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
    if (includes([NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG], ast.tag)) {
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

    // Trim trailing whitespaces
    this.yaml = this.yaml
      .split(EOL)
      .map(line=> line.replace(/[ \t]+$/, ''))
      .join(EOL);
  }

  toString() {
    return this.yaml;
  }

  toJSON() {
    return this.json;
  }

  getRemark(path) {
    const ast = compose(this.yaml);
    let pathlist = path.split('.');
    let node = getNode(ast, pathlist);
    return node && getNodeRemark(node, this.yaml);
  }

  setRemark(path, remark) {
    const ast = compose(this.yaml);
    let pathlist = path.split('.');
    let node = getNode(ast, pathlist);
    return !!node && !!(this.yaml = setNodeRemark(node, remark, this.yaml));
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
 * Update a sequence with new JSON
 *
 * @param {Node} ast
 * @param {object} newJson
 * @param {string} yaml
 *
 * @returns {string}
 *
*/
function updateSeq(ast, newJson, yaml) {
  let values = load(serialize(ast));
  let min = Math.min(values.length, newJson.length);

  if (values.length > min) {
    for (let i = values.length - 1; i >= min; --i) {
      yaml = removeArrayElement(ast.value[i], yaml);
    }
  } else if (newJson.length > min) {
    yaml = insertAfterNode(ast, cleanDump(newJson.slice(min)), yaml);
  }

  for (let i = min - 1; i >= 0; --i) {
    yaml = changeArrayElement(ast.value[i], cleanDump(newJson[i]), yaml);
  }

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
 * @param value {string}
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
 * @param value {string}
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
 * @param value {string}
 * @param yaml {string}
 *
 * @returns {string}
*/
function insertAfterNode(node, value, yaml) {
  let indentedValue = indent(value, node.start_mark.column);

  return yaml.substr(0, getNodeEndMark(node).pointer) +
    EOL +
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
  let index = node.start_mark.pointer - node.start_mark.column - 1;

  return yaml.substr(0, index) +
      yaml.substring(getNodeEndMark(node).pointer);
}

/*
 * Changes a node from array
 *
 * @param {Node} node
 * @param value {string}
 * @param {string} yaml
 *
 * @returns {string}
*/
function changeArrayElement(node, value, yaml) {
  let indentedValue = indent(value, node.start_mark.column);

  // find index of DASH(`-`) character for this array
  let index = node.start_mark.pointer;
  while (index > 0 && yaml[index] !== DASH) {
    index--;
  }

  return yaml.substr(0, index + 2) +
      indentedValue.substr(node.start_mark.column) +
      yaml.substring(getNodeEndMark(node).pointer);
}

/*
 * Gets end mark of an AST
 *
 * @param {Node} ast
 *
 * @returns {Mark}
*/
function getNodeEndMark(ast) {
  if (isArray(ast.value) && ast.value.length) {
    let lastItem = last(ast.value);

    if (isArray(lastItem) && lastItem.length) {
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
    .split(EOL)
    .filter(line => line)
    .map(line => repeat(SPACE, depth) + line)
    .join(EOL);
}

/*
 * Dump a value to YAML sting without the trailing new line
 *
 * @param {any} value
 *
 * @returns {string}
 *
*/
function cleanDump(value) {
  let yaml = dump(value).replace(/\n$/, '');

  if (EOL !== '\n') {
    yaml = yaml.replace(/\n/g, EOL);
  }

  return yaml;
}

/*
 * Gets remark of an AST
 *
 * @param {Node} ast
 * @param {string} yaml
 *
 * @returns {string}
*/
function getNodeRemark(ast, yaml) {
  let index = getNodeEndMark(ast).pointer;
  while (index < yaml.length && yaml[index] !== '#' && yaml[index] !== EOL) {
    ++index;
  }

  if (EOL === yaml[index] || index === yaml.length) {
    return '';
  } else {
    while (index < yaml.length && (yaml[index] === '#' || yaml[index] === ' ')) {
      ++index;
    }
    let end = index;
    while (end < yaml.length && yaml[end] !== EOL) {
      ++end;
    }
    return yaml.substring(index, end);
  }
}

/*
 * Sets remark of an AST
 *
 * @param {Node} ast
 * @param {string} remark
 * @param {string} yaml
 *
 * @returns {boolean}
*/
function setNodeRemark(ast, remark, yaml) {
  let index = getNodeEndMark(ast).pointer;
  while (index < yaml.length && yaml[index] !== '#' && yaml[index] !== EOL) {
    ++index;
  }

  if (EOL === yaml[index] || index === yaml.length) {
    return yaml.substr(0, index) + ' # ' + remark +
        yaml.substring(index);
  } else {
    while (index < yaml.length && (yaml[index] === '#' || yaml[index] === ' ')) {
      ++index;
    }
    let end = index;
    while (end < yaml.length && yaml[end] !== EOL) {
      ++end;
    }
    return yaml.substr(0, index) + remark +
        yaml.substring(end);
  }
}

/*
 * Gets node of an AST which path
 *
 * @param {Node} ast
 * @param {array} path
 *
 * @returns {Node}
*/
function getNode(ast, path) {
  if (path.length) {
    if (ast.tag === MAP_TAG) {
      let value = ast.value;
      for (let i = 0; i < value.length; ++i) {
        let [keyNode, valNode] = value[i];
        if (path[0] === keyNode.value) {
          return getNode(valNode, path.slice(1));
        }
      }
      return undefined;
    } else if (ast.tag === SEQ_TAG) {
      return ast.value[path[0]] && getNode(ast.value[path[0]], path.slice(1));
    }
  }
  return ast;
}
