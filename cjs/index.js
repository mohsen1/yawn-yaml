'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _os = require('os');

var _yamlJs = require('yaml-js');

var _jsYaml = require('js-yaml');

var _lodash = require('lodash');

var _errorJs = require('./error.js');

var _errorJs2 = _interopRequireDefault(_errorJs);

var NULL_TAG = 'tag:yaml.org,2002:null';
var STR_TAG = 'tag:yaml.org,2002:str';
var INT_TAG = 'tag:yaml.org,2002:int';
var FLOAT_TAG = 'tag:yaml.org,2002:float';
var MAP_TAG = 'tag:yaml.org,2002:map';
var SEQ_TAG = 'tag:yaml.org,2002:seq';

var SPACE = ' ';
var DASH = '-';

// export default class YAWN {
var YAWN = (function () {
  function YAWN(str) {
    _classCallCheck(this, YAWN);

    if (!(0, _lodash.isString)(str)) {
      throw new TypeError('str should be a string');
    }

    this.yaml = str;
  }

  /*
   * Determines the AST tag of a JSON object
   *
   * @param {any} - json
   * @returns {boolean}
   * @throws {YAWNError} - if json has weird type
  */

  _createClass(YAWN, [{
    key: 'toString',
    value: function toString() {
      return this.yaml;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.json;
    }
  }, {
    key: 'json',
    get: function get() {
      return (0, _jsYaml.load)(this.yaml);
    },
    set: function set(newJson) {

      // if json is not changed do nothing
      if ((0, _lodash.isEqual)(this.json, newJson)) {
        return;
      }

      var ast = (0, _yamlJs.compose)(this.yaml);

      if ((0, _lodash.isUndefined)(newJson)) {
        this.yaml = '';
        return;
      }

      // -------------------------------------------------------------------------
      // check if entire json is changed
      // -------------------------------------------------------------------------
      var newTag = getTag(newJson);

      if (ast.tag !== newTag) {
        var newYaml = cleanDump(newJson);

        // replace this.yaml value from start to end mark with newYaml if node is
        // primitive
        if (!(0, _lodash.isObject)(newJson)) {
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
      if ((0, _lodash.contains)([NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG], ast.tag)) {
        this.yaml = replacePrimitive(ast, newJson, this.yaml);

        return;
      }

      // -------------------------------------------------------------------------
      // MAP_TAG
      // -------------------------------------------------------------------------
      if (ast.tag === MAP_TAG) {
        var json = this.json;

        this.yaml = updateMap(ast, newJson, json, this.yaml);
      }

      // -------------------------------------------------------------------------
      // SEQ_TAG
      // -------------------------------------------------------------------------
      if (ast.tag === SEQ_TAG) {
        this.yaml = updateSeq(ast, newJson, this.yaml);
      }

      // Trim trailing whitespaces
      this.yaml = this.yaml.split(_os.EOL).map(function (line) {
        return line.replace(/[ \t]+$/, '');
      }).join(_os.EOL);
    }
  }]);

  return YAWN;
})();

exports['default'] = YAWN;
function getTag(json) {
  var tag = null;

  if ((0, _lodash.isArray)(json)) {
    tag = SEQ_TAG;
  } else if ((0, _lodash.isObject)(json)) {
    tag = MAP_TAG;
  } else if ((0, _lodash.isNull)(json)) {
    tag = NULL_TAG;
  } else if ((0, _lodash.isNumber)(json)) {
    if (json % 10 === 0) {
      tag = INT_TAG;
    } else {
      tag = FLOAT_TAG;
    }
  } else if ((0, _lodash.isString)(json)) {
    tag = STR_TAG;
  } else {
    throw new _errorJs2['default']('Unknown type');
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
  var values = (0, _jsYaml.load)((0, _yamlJs.serialize)(ast));

  // new items in newJson
  var newItems = differenceWith(newJson, values, _lodash.isEqual).reverse();

  if (newItems.length) {
    yaml = insertAfterNode(ast, cleanDump(newItems), yaml);
  }

  // deleted items in newJson
  var deletedItems = differenceWith(values, newJson, _lodash.isEqual);

  deletedItems.forEach(function (deletedItem) {

    // find the node for this item
    (0, _lodash.each)(ast.value, function (node) {
      if ((0, _lodash.isEqual)((0, _jsYaml.load)((0, _yamlJs.serialize)(node)), deletedItem)) {

        // remove it from yaml
        yaml = removeArrayElement(node, yaml);

        // re-compose the AST for accurate removals after
        ast = (0, _yamlJs.compose)(yaml);
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
  (0, _lodash.each)(ast.value, function (pair) {
    var _pair = _slicedToArray(pair, 2);

    var keyNode = _pair[0];
    var valNode = _pair[1];

    // node is deleted
    if ((0, _lodash.isUndefined)(newJson[keyNode.value])) {

      // TODO: can we use of the methods below?
      yaml = yaml.substr(0, keyNode.start_mark.pointer) + yaml.substring(getNodeEndMark(valNode).pointer);
      return;
    }

    var value = json[keyNode.value];
    var newValue = newJson[keyNode.value];

    // primitive value has changed
    if (newValue !== value && !(0, _lodash.isArray)(valNode.value)) {

      // replace the value node
      yaml = replacePrimitive(valNode, newValue, yaml);

      // remove the key/value from newJson so it's not detected as new pair in
      // later code
      delete newJson[keyNode.value];
    }

    // non primitive value has changed
    if (!(0, _lodash.isEqual)(newValue, value) && (0, _lodash.isArray)(valNode.value)) {

      // array value has changed
      if ((0, _lodash.isArray)(newValue)) {

        // recurse
        yaml = updateSeq(valNode, newValue, yaml);

        // map value has changed
      } else {

          // recurse
          yaml = updateMap(valNode, newValue, value, yaml);

          ast = (0, _yamlJs.compose)(yaml);

          // remove the key/value from newJson so it's not detected as new pair in
          // later code
          delete newJson[keyNode.value];
        }
    }
  });

  // look for new items to add
  (0, _lodash.each)(newJson, function (value, key) {

    // item is new
    if ((0, _lodash.isUndefined)(json[key])) {
      var newValue = cleanDump(_defineProperty({}, key, value));

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
  return yaml.substr(0, node.start_mark.pointer) + String(value) + yaml.substring(node.end_mark.pointer);
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
  var indentedValue = indent(value, node.start_mark.column);
  var lineStart = node.start_mark.pointer - node.start_mark.column;

  return yaml.substr(0, lineStart) + indentedValue + yaml.substring(getNodeEndMark(node).pointer);
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
  var indentedValue = indent(value, node.start_mark.column);

  return yaml.substr(0, getNodeEndMark(node).pointer) + _os.EOL + indentedValue + yaml.substring(getNodeEndMark(node).pointer);
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
  var index = node.start_mark.pointer;
  while (index > 0 && yaml[index] !== DASH) {
    index--;
  }

  return yaml.substr(0, index) + yaml.substring(getNodeEndMark(node).pointer);
}

/*
 * Gets end mark of an AST
 *
 * @param {Node} ast
 *
 * @retusns {Mark}
*/
function getNodeEndMark(_x) {
  var _again = true;

  _function: while (_again) {
    var ast = _x;
    _again = false;

    if ((0, _lodash.isArray)(ast.value) && ast.value.length) {
      var lastItem = (0, _lodash.last)(ast.value);

      if ((0, _lodash.isArray)(lastItem) && lastItem.length) {
        _x = (0, _lodash.last)(lastItem);
        _again = true;
        lastItem = undefined;
        continue _function;
      }

      _x = lastItem;
      _again = true;
      lastItem = undefined;
      continue _function;
    }

    return ast.end_mark;
  }
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
  return str.split(_os.EOL).filter(function (line) {
    return line;
  }).map(function (line) {
    return (0, _lodash.repeat)(SPACE, depth) + line;
  }).join(_os.EOL);
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
  var yaml = (0, _jsYaml.dump)(value).replace(/\n$/, '');

  if (_os.EOL !== '\n') {
    yaml = yaml.replace(/\n/g, _os.EOL);
  }

  return yaml;
}

/*
 * find difference between two arrays by using a comparison function
 *
 * @param {array<any>} src
 * @param {array<any>} dest
 * @param {function} compFn
 *
 * @returns {array}
*/
function differenceWith(src, dest, compFn) {
  return src.filter(function (srcItem) {
    return dest.every(function (destItem) {
      return !compFn(srcItem, destItem);
    });
  });
}
module.exports = exports['default'];