import os from 'os';
import _ from 'lodash';
import JSYAML from 'js-yaml';
const { parsers } = require('prettier/src/language-yaml/parser-yaml.js');
const YAMLParser = parsers.yaml;
const YAMLPrinter = require('prettier/src/language-yaml/printer-yaml');

class YAWNError extends Error {
    constructor(message: string) {
        super(message);
        this.message = message;
        this.name = 'YAWNError';
    }
}

type Node = any;
type AST = any;
type Mark = any;

const NULL_TAG = 'tag:yaml.org,2002:null';
const STR_TAG = 'tag:yaml.org,2002:str';
const INT_TAG = 'tag:yaml.org,2002:int';
const FLOAT_TAG = 'tag:yaml.org,2002:float';
const MAP_TAG = 'tag:yaml.org,2002:map';
const SEQ_TAG = 'tag:yaml.org,2002:seq';

const SPACE = ' ';
const DASH = '-';

/**
 * YAML parser that preserves comments and styling
 */
export default class YAWNYAML {
    private yamlValue: string = '';
    private jsonValue: any;
    private ast: AST;

    constructor(input: string) {
        this.yaml = input;
    }

    public set json(newJson: any) {
        // if json is not changed do nothing
        if (_.isEqual(newJson, this.jsonValue)) {
            return;
        }

        this.ast = YAMLParser.parse(this.yaml);

        if (_.isUndefined(newJson)) {
            this.yaml = '';
            return;
        }

        // -------------------------------------------------------------------------
        // check if entire json is changed
        // -------------------------------------------------------------------------
        let newTag = getTag(newJson);

        if (this.ast.tag !== newTag) {
            let newYaml = cleanDump(newJson);

            // replace this.yaml value from start to end mark with newYaml if node is
            // primitive
            if (!_.isObject(newJson)) {
                this.yaml = replacePrimitive(this.ast, newYaml, this.yaml);

                // if node is not primitive
            } else {
                this.yaml = replaceNode(this.ast, newYaml, this.yaml);
            }

            return;
        }

        // -------------------------------------------------------------------------
        // NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG
        // -------------------------------------------------------------------------
        if (_.includes([NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG], this.ast.tag)) {
            this.yaml = replacePrimitive(this.ast, newJson, this.yaml);

            return;
        }

        // -------------------------------------------------------------------------
        // MAP_TAG
        // -------------------------------------------------------------------------
        if (this.ast.tag === MAP_TAG) {
            let json = this.json;

            this.yaml = updateMap(this.ast, newJson, json, this.yaml);
        }

        // -------------------------------------------------------------------------
        // SEQ_TAG
        // -------------------------------------------------------------------------
        if (this.ast.tag === SEQ_TAG) {
            this.yaml = updateSeq(this.ast, newJson, this.yaml);
        }

        // Trim trailing whitespaces
        this.yaml = this.yaml
            .split(os.EOL)
            .map(line => line.replace(/[ \t]+$/, ''))
            .join(os.EOL);
    }

    public get json(): any {
        return JSYAML.safeLoad(this.jsonValue);
    }

    public get yaml() {
        return this.yamlValue;
    }

    public set yaml(value: string) {
        if (!_.isString(value)) {
            throw new TypeError(
                `Expected string but got ${typeof value} for value`
            );
        }
        this.jsonValue = JSYAML.load(value);
        this.ast = YAMLParser.parse(value);
    }

    getRemark(path: string) {
        const ast = YAMLParser.parse(this.yaml);
        let pathlist = path.split('.');
        let node = getNode(ast, pathlist);
        return node && getNodeRemark(node, this.yaml);
    }

    setRemark(path: string, remark: Mark) {
        const ast = YAMLParser.parse(this.yaml);
        let pathlist = path.split('.');
        let node = getNode(ast, pathlist);
        return !!node && !!(this.yaml = setNodeRemark(node, remark, this.yaml));
    }

    public toString() {
        return this.yaml;
    }

    public toJSON() {
        return this.json;
    }
}

/**
 * Determines the AST tag of a JSON object
 */
function getTag(json: any) {
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

/**
 * Update a sequence with new JSON
 *
 */
function updateSeq(ast: Node, newJson: any, yaml: string) {
    let values = JSYAML.load(YAMLPrinter.print(ast));
    if (values === undefined || !_.isArray(values)) return yaml;
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

/**
 * update a map structure with new values
 */
function updateMap(ast: AST, newJson: any, json: any, yaml: string) {
    // look for changes
    _.each(ast.value, pair => {
        let [keyNode, valNode] = pair;

        // node is deleted
        if (_.isUndefined(newJson[keyNode.value])) {
            // TODO: can we use of the methods below?
            yaml =
                yaml.substr(0, keyNode.start_mark.pointer) +
                yaml.substring(getNodeEndMark(valNode).pointer);
            return;
        }

        let value = json[keyNode.value];
        let newValue = newJson[keyNode.value];

        // primitive value has changed
        if (newValue !== value && !_.isArray(valNode.value)) {
            // replace the value node
            yaml = replacePrimitive(valNode, newValue, yaml);

            // remove the key/value from newJson so it's not detected as new pair in
            // later code
            delete newJson[keyNode.value];
        }

        // non primitive value has changed
        if (!_.isEqual(newValue, value) && _.isArray(valNode.value)) {
            // array value has changed
            if (_.isArray(newValue)) {
                // recourse
                yaml = updateSeq(valNode, newValue, yaml);

                // map value has changed
            } else {
                // recourse
                yaml = updateMap(valNode, newValue, value, yaml);

                ast = YAMLParser.parse(yaml);

                // remove the key/value from newJson so it's not detected as new pair in
                // later code
                delete newJson[keyNode.value];
            }
        }
    });

    // look for new items to add
    _.each(newJson, (value, key) => {
        // item is new
        if (_.isUndefined(json[key])) {
            let newValue = YAMLPrinter.print({ [key]: value });

            yaml = insertAfterNode(ast, newValue, yaml);
        }
    });

    return yaml;
}

/**
 * Place value in node range in yaml string
 */
function replacePrimitive(node: Node, value: string, yaml: string) {
    return (
        yaml.substr(0, node.start_mark.pointer) +
        String(value) +
        yaml.substring(node.end_mark.pointer)
    );
}

/**
 * Place value in node range in yaml string
 */
function replaceNode(node: Node, value: string, yaml: string) {
    let indentedValue = indent(value, node.start_mark.column);
    let lineStart = node.start_mark.pointer - node.start_mark.column;

    return (
        yaml.substr(0, lineStart) +
        indentedValue +
        yaml.substring(getNodeEndMark(node).pointer)
    );
}

/**
 * Place value after node range in yaml string
 */
function insertAfterNode(node: Node, value: string, yaml: string) {
    let indentedValue = indent(value, node.start_mark.column);

    return (
        yaml.substr(0, getNodeEndMark(node).pointer) +
        os.EOL +
        indentedValue +
        yaml.substring(getNodeEndMark(node).pointer)
    );
}

/**
 * Removes a node from array
 */
function removeArrayElement(node: Node, yaml: string) {
    let index = node.start_mark.pointer - node.start_mark.column - 1;

    return yaml.substr(0, index) + yaml.substring(getNodeEndMark(node).pointer);
}

/** Changes a node from array */
function changeArrayElement(node: Node, value: string, yaml: string) {
    let indentedValue = indent(value, node.start_mark.column);

    // find index of DASH(`-`) character for this array
    let index = node.start_mark.pointer;
    while (index > 0 && yaml[index] !== DASH) {
        index--;
    }

    return (
        yaml.substr(0, index + 2) +
        indentedValue.substr(node.start_mark.column) +
        yaml.substring(getNodeEndMark(node).pointer)
    );
}

/**
 * Gets end mark of an AST
 */
function getNodeEndMark(ast: Node): Mark {
    if (_.isArray(ast.value) && ast.value.length) {
        let lastItem = _.last(ast.value);

        if (_.isArray(lastItem) && lastItem.length) {
            return getNodeEndMark(_.last(lastItem));
        }

        return getNodeEndMark(lastItem);
    }

    return ast.end_mark;
}

/**
 * Indents a string with number of characters
 */
function indent(str: string, depth: number) {
    return str
        .split(os.EOL)
        .filter(line => line)
        .map(line => _.repeat(SPACE, depth) + line)
        .join(os.EOL);
}

/**
 * Dump a value to YAML sting without the trailing new line
 *
 */
function cleanDump(value: string) {
    let yaml = YAMLPrinter.print(value).replace(/\n$/, '');

    if (os.EOL !== '\n') {
        yaml = yaml.replace(/\n/g, os.EOL);
    }

    return yaml;
}

/**
 * Gets remark of an AST
 */
function getNodeRemark(ast: Node, yaml: string) {
    let index = getNodeEndMark(ast).pointer;
    while (
        index < yaml.length &&
        yaml[index] !== '#' &&
        yaml[index] !== os.EOL
    ) {
        ++index;
    }

    if (os.EOL === yaml[index] || index === yaml.length) {
        return '';
    } else {
        while (
            index < yaml.length &&
            (yaml[index] === '#' || yaml[index] === ' ')
        ) {
            ++index;
        }
        let end = index;
        while (end < yaml.length && yaml[end] !== os.EOL) {
            ++end;
        }
        return yaml.substring(index, end);
    }
}

/**
 * Sets remark of an AST
 */
function setNodeRemark(ast: Node, remark: string, yaml: string) {
    let index = getNodeEndMark(ast).pointer;
    while (
        index < yaml.length &&
        yaml[index] !== '#' &&
        yaml[index] !== os.EOL
    ) {
        ++index;
    }

    if (os.EOL === yaml[index] || index === yaml.length) {
        return yaml.substr(0, index) + ' # ' + remark + yaml.substring(index);
    } else {
        while (
            index < yaml.length &&
            (yaml[index] === '#' || yaml[index] === ' ')
        ) {
            ++index;
        }
        let end = index;
        while (end < yaml.length && yaml[end] !== os.EOL) {
            ++end;
        }
        return yaml.substr(0, index) + remark + yaml.substring(end);
    }
}

/** Gets node of an AST which path */
function getNode(ast: Node, path: string[]): Node {
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
            return (
                ast.value[path[0]] && getNode(ast.value[path[0]], path.slice(1))
            );
        }
    }
    return ast;
}
