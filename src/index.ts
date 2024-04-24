'use strict';

import { compose, serialize } from 'yaml-js';
import { load, dump } from 'js-yaml';
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
  last,
} from 'lodash';

const EOL = '\n';

const NULL_TAG = 'tag:yaml.org,2002:null';
const STR_TAG = 'tag:yaml.org,2002:str';
const INT_TAG = 'tag:yaml.org,2002:int';
const FLOAT_TAG = 'tag:yaml.org,2002:float';
const MAP_TAG = 'tag:yaml.org,2002:map';
const SEQ_TAG = 'tag:yaml.org,2002:seq';

const SPACE = ' ';
const DASH = '-';

export class YAWNError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = 'YAWNError';
  }
}

interface Node {
  start_mark: { pointer: number; column: number };
  end_mark: { pointer: number; column: number };
  value: any;
  tag: string;
}

// export default class YAWN {
export default class YAWN {
  yaml: string;
  constructor(str: string) {
    if (!isString(str)) {
      throw new TypeError('str should be a string');
    }

    this.yaml = str;
  }

  get json() {
    return load(this.yaml);
  }

  set json(newJson: any) {
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
        this.yaml = replacePrimitive(ast, newYaml, this.yaml, 0);

        // if node is not primitive
      } else {
        this.yaml = replaceNode(ast, newYaml, this.yaml, 0);
      }

      return;
    }

    // -------------------------------------------------------------------------
    // NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG
    // -------------------------------------------------------------------------
    if (includes([NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG], ast.tag)) {
      this.yaml = replacePrimitive(ast, newJson, this.yaml, 0);

      return;
    }

    // -------------------------------------------------------------------------
    // MAP_TAG
    // -------------------------------------------------------------------------
    if (ast.tag === MAP_TAG) {
      let json = this.json;

      this.yaml = updateMap(ast, newJson, json, this.yaml, 0);
    }

    // -------------------------------------------------------------------------
    // SEQ_TAG
    // -------------------------------------------------------------------------
    if (ast.tag === SEQ_TAG) {
      this.yaml = updateSeq(ast, newJson, this.yaml, 0);
    }

    // Trim trailing whitespaces
    this.yaml = this.yaml
      .split(EOL)
      .map(line => line.replace(/[ \t]+$/, ''))
      .join(EOL);
  }

  toString() {
    return this.yaml;
  }

  toJSON() {
    return this.json;
  }

  getRemark(path: string) {
    const ast = compose(this.yaml);
    let pathlist = path.split('.');
    let node = getNode(ast, pathlist);
    return node && getNodeRemark(node, this.yaml);
  }

  setRemark(path: string, remark: string) {
    const ast = compose(this.yaml);
    let pathlist = path.split('.');
    let node = getNode(ast, pathlist);
    return !!node && !!(this.yaml = setNodeRemark(node, remark, this.yaml));
  }
}

/*
 * Determines the AST tag of a JSON object
 *
 */
function getTag(json: any) {
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
 */
function updateSeq(
  ast: Node,
  newJson: any[],
  yaml: string,
  offset: number
): string {
  let values: any[] = load(serialize(ast)) as any[];
  let min: number = Math.min(values.length, newJson.length);
  for (let i: number = 0; i < min; i++) {
    const newYaml: string = changeArrayElement(
      ast.value[i],
      cleanDump(newJson[i]),
      yaml,
      offset
    );
    offset = offset + newYaml.length - yaml.length;
    yaml = newYaml;
  }

  if (values.length > min) {
    for (let i: number = min; i < values.length; i++) {
      const newYaml: string = removeArrayElement(ast.value[i], yaml, offset);
      offset = offset + newYaml.length - yaml.length;
      yaml = newYaml;
    }
  } else if (newJson.length > min) {
    yaml = insertAfterNode(ast, cleanDump(newJson.slice(min)), yaml, offset);
  }

  return yaml;
}

/*
 * update a map structure with new values
 */
function updateMap(
  ast: Node,
  newJson: any,
  json: any,
  yaml: string,
  offset: number
) {
  // look for changes
  each(ast.value, pair => {
    let [keyNode, valNode] = pair;

    // node is deleted
    if (isUndefined(newJson[keyNode.value])) {
      // TODO: can we use of the methods below?
      const newYaml =
        yaml.substr(0, keyNode.start_mark.pointer + offset) +
        yaml.substring(getNodeEndMark(valNode).pointer + offset);
      offset = offset + newYaml.length - yaml.length;
      yaml = newYaml;
      return;
    }

    let value = json[keyNode.value];
    let newValue = newJson[keyNode.value];

    // primitive value has changed
    if (newValue !== value && !isArray(valNode.value)) {
      // replace the value node
      const newYaml = replacePrimitive(valNode, newValue, yaml, offset);
      offset = offset + newYaml.length - yaml.length;
      yaml = newYaml;
      // remove the key/value from newJson so it's not detected as new pair in
      // later code
      delete newJson[keyNode.value];
    }

    // non primitive value has changed
    if (!isEqual(newValue, value) && isArray(valNode.value)) {
      // array value has changed
      if (isArray(newValue)) {
        // recurse
        const newYaml = updateSeq(valNode, newValue, yaml, offset);
        offset = offset + newYaml.length - yaml.length;
        yaml = newYaml;

        // map value has changed
      } else {
        // recurse
        const newYaml = updateMap(valNode, newValue, value, yaml, offset);
        offset = offset + newYaml.length - yaml.length;
        yaml = newYaml;

        // ast = compose(yaml);

        // remove the key/value from newJson so it's not detected as new pair in
        // later code
        delete newJson[keyNode.value];
      }
    }
  });

  // look for new items to add
  each(newJson, (value, key) => {
    // item is new
    if (isUndefined(json[key])) {
      let newValue = cleanDump({ [key]: value });

      const newYaml = insertAfterNode(ast, newValue, yaml, offset);
      offset = offset + newYaml.length - yaml.length;
      yaml = newYaml;
    }
  });

  return yaml;
}

/*
 * Place value in node range in yaml string
 */
function replacePrimitive(
  node: Node,
  value: unknown,
  yaml: string,
  offset: number
) {
  return (
    yaml.substr(0, node.start_mark.pointer + offset) +
    String(value) +
    yaml.substring(node.end_mark.pointer + offset)
  );
}

/*
 * Place value in node range in yaml string
 */
function replaceNode(node: Node, value: string, yaml: string, offset: number) {
  let indentedValue = indent(value, node.start_mark.column);
  let lineStart = node.start_mark.pointer - node.start_mark.column + offset;

  return (
    yaml.substr(0, lineStart) +
    indentedValue +
    yaml.substring(getNodeEndMark(node).pointer + offset)
  );
}

/*
 * Place value after node range in yaml string
 */
function insertAfterNode(
  node: Node,
  value: string,
  yaml: string,
  offset: number
) {
  let indentedValue = indent(value, node.start_mark.column);

  return (
    yaml.substr(0, getNodeEndMark(node).pointer + offset) +
    EOL +
    indentedValue +
    yaml.substring(getNodeEndMark(node).pointer + offset)
  );
}

/*
 * Removes a node from array
 */
function removeArrayElement(node: Node, yaml: string, offset: number) {
  let index = node.start_mark.pointer - node.start_mark.column - 1 + offset;

  return (
    yaml.substr(0, index) +
    yaml.substring(getNodeEndMark(node).pointer + offset)
  );
}

/*
 * Changes a node from array
 */
function changeArrayElement(
  node: Node,
  value: string,
  yaml: string,
  offset: number
): string {
  let indentedValue = indent(value, node.start_mark.column);

  // find index of DASH(`-`) character for this array
  let index = node.start_mark.pointer + offset;
  while (index > 0 && yaml[index] !== DASH) {
    index--;
  }

  return (
    yaml.substr(0, index + 2) +
    indentedValue.substr(node.start_mark.column) +
    yaml.substring(getNodeEndMark(node).pointer + offset)
  );
}

/*
 * Gets end mark of an AST
 */
function getNodeEndMark(ast: Node): Node['end_mark'] {
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
 */
function indent(str: string, depth: number) {
  return str
    .split(EOL)
    .filter(line => line)
    .map(line => repeat(SPACE, depth) + line)
    .join(EOL);
}

/*
 * Dump a value to YAML sting without the trailing new line
 */
function cleanDump(value: any) {
  let yaml = dump(value).replace(/\n$/, '');

  if (EOL !== '\n') {
    yaml = yaml.replace(/\n/g, EOL);
  }

  return yaml;
}

/*
 * Gets remark of an AST
 */
function getNodeRemark(ast: Node, yaml: string) {
  let index = getNodeEndMark(ast).pointer;
  while (index < yaml.length && yaml[index] !== '#' && yaml[index] !== EOL) {
    ++index;
  }

  if (EOL === yaml[index] || index === yaml.length) {
    return '';
  } else {
    while (
      index < yaml.length &&
      (yaml[index] === '#' || yaml[index] === ' ')
    ) {
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
 */
function setNodeRemark(ast: Node, remark: string, yaml: string) {
  let index = getNodeEndMark(ast).pointer;
  while (index < yaml.length && yaml[index] !== '#' && yaml[index] !== EOL) {
    ++index;
  }

  if (EOL === yaml[index] || index === yaml.length) {
    return yaml.substr(0, index) + ' # ' + remark + yaml.substring(index);
  } else {
    while (
      index < yaml.length &&
      (yaml[index] === '#' || yaml[index] === ' ')
    ) {
      ++index;
    }
    let end = index;
    while (end < yaml.length && yaml[end] !== EOL) {
      ++end;
    }
    return yaml.substr(0, index) + remark + yaml.substring(end);
  }
}

/*
 * Gets node of an AST which path
 */
function getNode(ast: Node, path: string | any[]): Node | undefined {
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
