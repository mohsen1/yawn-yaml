(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.YAWN = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YAWNError = (function (_Error) {
  _inherits(YAWNError, _Error);

  function YAWNError(message) {
    _classCallCheck(this, YAWNError);

    _get(Object.getPrototypeOf(YAWNError.prototype), 'constructor', this).call(this, message);
    this.message = message;
    this.name = 'YAWNError';
  }

  return YAWNError;
})(Error);

exports['default'] = YAWNError;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
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

var _yamlJs = (window.yaml);

var _jsYaml = (window.jsyaml);

var _lodash = (window._);

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
    key: 'getRemark',
    value: function getRemark(path) {
      var ast = (0, _yamlJs.compose)(this.yaml);
      var pathlist = path.split('.');
      var node = getNode(ast, pathlist);
      return node && getNodeRemark(node, this.yaml);
    }
  }, {
    key: 'setRemark',
    value: function setRemark(path, remark) {
      var ast = (0, _yamlJs.compose)(this.yaml);
      var pathlist = path.split('.');
      var node = getNode(ast, pathlist);
      return !!node && !!(this.yaml = setNodeRemark(node, remark, this.yaml));
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
      if ((0, _lodash.includes)([NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG], ast.tag)) {
        this.yaml = replacePrimitive(ast, newJson, this.yaml, 0);

        return;
      }

      // -------------------------------------------------------------------------
      // MAP_TAG
      // -------------------------------------------------------------------------
      if (ast.tag === MAP_TAG) {
        var json = this.json;

        this.yaml = updateMap(ast, newJson, json, this.yaml, 0);
      }

      // -------------------------------------------------------------------------
      // SEQ_TAG
      // -------------------------------------------------------------------------
      if (ast.tag === SEQ_TAG) {
        this.yaml = updateSeq(ast, newJson, this.yaml, 0);
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
function updateSeq(ast, newJson, yaml, offset) {
  var values = (0, _jsYaml.load)((0, _yamlJs.serialize)(ast));
  var min = Math.min(values.length, newJson.length);
  for (var i = 0; i < min; i++) {
    var newYaml = changeArrayElement(ast.value[i], cleanDump(newJson[i]), yaml, offset);
    offset = offset + newYaml.length - yaml.length;
    yaml = newYaml;
  }

  if (values.length > min) {
    for (var i = min; i < values.length; i++) {
      var newYaml = removeArrayElement(ast.value[i], yaml, offset);
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
 *
 * @param {AST} ast - a map AST
 * @param {any} newJson
 * @param {any} - json
 * @param {string} yaml
 * @returns {boolean}
 * @throws {YAWNError} - if json has weird type
*/
function updateMap(ast, newJson, json, yaml, offset) {
  // look for changes
  (0, _lodash.each)(ast.value, function (pair) {
    var _pair = _slicedToArray(pair, 2);

    var keyNode = _pair[0];
    var valNode = _pair[1];

    // node is deleted
    if ((0, _lodash.isUndefined)(newJson[keyNode.value])) {

      // TODO: can we use of the methods below?
      var newYaml = yaml.substr(0, keyNode.start_mark.pointer + offset) + yaml.substring(getNodeEndMark(valNode).pointer + offset);
      offset = offset + newYaml.length - yaml.length;
      yaml = newYaml;
      return;
    }

    var value = json[keyNode.value];
    var newValue = newJson[keyNode.value];

    // primitive value has changed
    if (newValue !== value && !(0, _lodash.isArray)(valNode.value)) {

      // replace the value node
      var newYaml = replacePrimitive(valNode, newValue, yaml, offset);
      offset = offset + newYaml.length - yaml.length;
      yaml = newYaml;
      // remove the key/value from newJson so it's not detected as new pair in
      // later code
      delete newJson[keyNode.value];
    }

    // non primitive value has changed
    if (!(0, _lodash.isEqual)(newValue, value) && (0, _lodash.isArray)(valNode.value)) {

      // array value has changed
      if ((0, _lodash.isArray)(newValue)) {

        // recurse
        var newYaml = updateSeq(valNode, newValue, yaml, offset);
        offset = offset + newYaml.length - yaml.length;
        yaml = newYaml;

        // map value has changed
      } else {

          // recurse
          var newYaml = updateMap(valNode, newValue, value, yaml, offset);
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
  (0, _lodash.each)(newJson, function (value, key) {

    // item is new
    if ((0, _lodash.isUndefined)(json[key])) {
      var newValue = cleanDump(_defineProperty({}, key, value));

      var newYaml = insertAfterNode(ast, newValue, yaml, offset);
      offset = offset + newYaml.length - yaml.length;
      yaml = newYaml;
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
function replacePrimitive(node, value, yaml, offset) {
  return yaml.substr(0, node.start_mark.pointer + offset) + String(value) + yaml.substring(node.end_mark.pointer + offset);
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
function replaceNode(node, value, yaml, offset) {
  var indentedValue = indent(value, node.start_mark.column);
  var lineStart = node.start_mark.pointer - node.start_mark.column + offset;

  return yaml.substr(0, lineStart) + indentedValue + yaml.substring(getNodeEndMark(node).pointer + offset);
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
function insertAfterNode(node, value, yaml, offset) {
  var indentedValue = indent(value, node.start_mark.column);

  return yaml.substr(0, getNodeEndMark(node).pointer + offset) + _os.EOL + indentedValue + yaml.substring(getNodeEndMark(node).pointer + offset);
}

/*
 * Removes a node from array
 *
 * @param {Node} node
 * @param {string} yaml
 *
 * @returns {string}
*/
function removeArrayElement(node, yaml, offset) {
  var index = node.start_mark.pointer - node.start_mark.column - 1 + offset;

  return yaml.substr(0, index) + yaml.substring(getNodeEndMark(node).pointer + offset);
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
function changeArrayElement(node, value, yaml, offset) {
  var indentedValue = indent(value, node.start_mark.column);

  // find index of DASH(`-`) character for this array
  var index = node.start_mark.pointer + offset;
  while (index > 0 && yaml[index] !== DASH) {
    index--;
  }

  return yaml.substr(0, index + 2) + indentedValue.substr(node.start_mark.column) + yaml.substring(getNodeEndMark(node).pointer + offset);
}

/*
 * Gets end mark of an AST
 *
 * @param {Node} ast
 *
 * @returns {Mark}
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
 * Gets remark of an AST
 *
 * @param {Node} ast
 * @param {string} yaml
 *
 * @returns {string}
*/
function getNodeRemark(ast, yaml) {
  var index = getNodeEndMark(ast).pointer;
  while (index < yaml.length && yaml[index] !== '#' && yaml[index] !== _os.EOL) {
    ++index;
  }

  if (_os.EOL === yaml[index] || index === yaml.length) {
    return '';
  } else {
    while (index < yaml.length && (yaml[index] === '#' || yaml[index] === ' ')) {
      ++index;
    }
    var end = index;
    while (end < yaml.length && yaml[end] !== _os.EOL) {
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
  var index = getNodeEndMark(ast).pointer;
  while (index < yaml.length && yaml[index] !== '#' && yaml[index] !== _os.EOL) {
    ++index;
  }

  if (_os.EOL === yaml[index] || index === yaml.length) {
    return yaml.substr(0, index) + ' # ' + remark + yaml.substring(index);
  } else {
    while (index < yaml.length && (yaml[index] === '#' || yaml[index] === ' ')) {
      ++index;
    }
    var end = index;
    while (end < yaml.length && yaml[end] !== _os.EOL) {
      ++end;
    }
    return yaml.substr(0, index) + remark + yaml.substring(end);
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
function getNode(_x2, _x3) {
  var _left;

  var _again2 = true;

  _function2: while (_again2) {
    var ast = _x2,
        path = _x3;
    _again2 = false;

    if (path.length) {
      if (ast.tag === MAP_TAG) {
        var value = ast.value;
        for (var i = 0; i < value.length; ++i) {
          var _value$i = _slicedToArray(value[i], 2);

          var keyNode = _value$i[0];
          var valNode = _value$i[1];

          if (path[0] === keyNode.value) {
            _x2 = valNode;
            _x3 = path.slice(1);
            _again2 = true;
            value = i = _value$i = keyNode = valNode = undefined;
            continue _function2;
          }
        }
        return undefined;
      } else if (ast.tag === SEQ_TAG) {
        if (!(_left = ast.value[path[0]])) {
          return _left;
        }

        _x2 = ast.value[path[0]];
        _x3 = path.slice(1);
        _again2 = true;
        value = i = _value$i = keyNode = valNode = undefined;
        continue _function2;
      }
    }
    return ast;
  }
}
module.exports = exports['default'];

},{"./error.js":2,"os":1}]},{},[3])(3)
});

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvb3MtYnJvd3NlcmlmeS9icm93c2VyLmpzIiwic3JjL2Vycm9yLmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7O0lBRVEsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixPQUFPLEVBQUU7MEJBREYsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCLE9BQU8sRUFBRTtBQUNmLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0dBQ3pCOztTQUxrQixTQUFTO0dBQVMsS0FBSzs7cUJBQXZCLFNBQVM7Ozs7QUNGOUIsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O2tCQUVPLElBQUk7O3NCQUNTLFNBQVM7O3NCQUNqQixTQUFTOztzQkFhM0IsUUFBUTs7dUJBRU8sWUFBWTs7OztBQUVsQyxJQUFNLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQztBQUMxQyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4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ZixVQUFJLEdBQUcsQ0FBQyxHQUFHLEtBQUssT0FBTyxFQUFFO0FBQ3ZCLFlBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDdEIsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0NBQ1osS0FBSyxDQUFDLENBQUMsQ0FBQzs7Y0FBNUIsT0FBTztjQUFFLE9BQU87O0FBQ3JCLGNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxLQUFLLEVBQUU7a0JBQ2QsT0FBTztrQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFKckMsaUJBQUssR0FDQSxDQUFDLGNBQ0gsT0FBTyxHQUFFLE9BQU87O1dBR3BCO1NBQ0Y7QUFDRCxlQUFPLFNBQVMsQ0FBQztPQUNsQixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxPQUFPLEVBQUU7c0JBQ3ZCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7O2NBQVksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Y0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFUbEUsYUFBSyxHQUNBLENBQUMsY0FDSCxPQUFPLEdBQUUsT0FBTzs7T0FReEI7S0FDRjtBQUNELFdBQU8sR0FBRyxDQUFDO0dBQ1o7Q0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRzLmVuZGlhbm5lc3MgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnTEUnIH07XG5cbmV4cG9ydHMuaG9zdG5hbWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uLmhvc3RuYW1lXG4gICAgfVxuICAgIGVsc2UgcmV0dXJuICcnO1xufTtcblxuZXhwb3J0cy5sb2FkYXZnID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW10gfTtcblxuZXhwb3J0cy51cHRpbWUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAwIH07XG5cbmV4cG9ydHMuZnJlZW1lbSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTnVtYmVyLk1BWF9WQUxVRTtcbn07XG5cbmV4cG9ydHMudG90YWxtZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE51bWJlci5NQVhfVkFMVUU7XG59O1xuXG5leHBvcnRzLmNwdXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXSB9O1xuXG5leHBvcnRzLnR5cGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnQnJvd3NlcicgfTtcblxuZXhwb3J0cy5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLmFwcFZlcnNpb247XG4gICAgfVxuICAgIHJldHVybiAnJztcbn07XG5cbmV4cG9ydHMubmV0d29ya0ludGVyZmFjZXNcbj0gZXhwb3J0cy5nZXROZXR3b3JrSW50ZXJmYWNlc1xuPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7fSB9O1xuXG5leHBvcnRzLmFyY2ggPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnamF2YXNjcmlwdCcgfTtcblxuZXhwb3J0cy5wbGF0Zm9ybSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdicm93c2VyJyB9O1xuXG5leHBvcnRzLnRtcGRpciA9IGV4cG9ydHMudG1wRGlyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnL3RtcCc7XG59O1xuXG5leHBvcnRzLkVPTCA9ICdcXG4nO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBZQVdORXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMubmFtZSA9ICdZQVdORXJyb3InO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7IEVPTCB9IGZyb20gJ29zJztcbmltcG9ydCB7Y29tcG9zZSwgc2VyaWFsaXplfSBmcm9tICd5YW1sLWpzJztcbmltcG9ydCB7bG9hZCwgZHVtcH0gZnJvbSAnanMteWFtbCc7XG5pbXBvcnQge1xuICBpc0FycmF5LFxuICBpc1N0cmluZyxcbiAgaXNPYmplY3QsXG4gIGlzVW5kZWZpbmVkLFxuICBpc051bGwsXG4gIGlzTnVtYmVyLFxuICBpc0VxdWFsLFxuICByZXBlYXQsXG4gIGVhY2gsXG4gIGluY2x1ZGVzLFxuICBsYXN0XG59IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCBZQVdORXJyb3IgZnJvbSAnLi9lcnJvci5qcyc7XG5cbmNvbnN0IE5VTExfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOm51bGwnO1xuY29uc3QgU1RSX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpzdHInO1xuY29uc3QgSU5UX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnO1xuY29uc3QgRkxPQVRfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JztcbmNvbnN0IE1BUF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6bWFwJztcbmNvbnN0IFNFUV9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6c2VxJztcblxuY29uc3QgU1BBQ0UgPSAnICc7XG5jb25zdCBEQVNIID0gJy0nO1xuXG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBZQVdOIHtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV04ge1xuXG4gIGNvbnN0cnVjdG9yKHN0cikge1xuICAgIGlmICghaXNTdHJpbmcoc3RyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyIHNob3VsZCBiZSBhIHN0cmluZycpO1xuICAgIH1cblxuICAgIHRoaXMueWFtbCA9IHN0cjtcbiAgfVxuXG4gIGdldCBqc29uKCkge1xuICAgIHJldHVybiBsb2FkKHRoaXMueWFtbCk7XG4gIH1cblxuICBzZXQganNvbihuZXdKc29uKSB7XG5cbiAgICAvLyBpZiBqc29uIGlzIG5vdCBjaGFuZ2VkIGRvIG5vdGhpbmdcbiAgICBpZiAoaXNFcXVhbCh0aGlzLmpzb24sIG5ld0pzb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXN0ID0gY29tcG9zZSh0aGlzLnlhbWwpO1xuXG4gICAgaWYgKGlzVW5kZWZpbmVkKG5ld0pzb24pKSB7XG4gICAgICB0aGlzLnlhbWwgPSAnJztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY2hlY2sgaWYgZW50aXJlIGpzb24gaXMgY2hhbmdlZFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgbmV3VGFnID0gZ2V0VGFnKG5ld0pzb24pO1xuXG4gICAgaWYgKGFzdC50YWcgIT09IG5ld1RhZykge1xuICAgICAgbGV0IG5ld1lhbWwgPSBjbGVhbkR1bXAobmV3SnNvbik7XG5cbiAgICAgIC8vIHJlcGxhY2UgdGhpcy55YW1sIHZhbHVlIGZyb20gc3RhcnQgdG8gZW5kIG1hcmsgd2l0aCBuZXdZYW1sIGlmIG5vZGUgaXNcbiAgICAgIC8vIHByaW1pdGl2ZVxuICAgICAgaWYgKCFpc09iamVjdChuZXdKc29uKSkge1xuICAgICAgICB0aGlzLnlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKGFzdCwgbmV3WWFtbCwgdGhpcy55YW1sLCAwKTtcblxuICAgICAgLy8gaWYgbm9kZSBpcyBub3QgcHJpbWl0aXZlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnlhbWwgPSByZXBsYWNlTm9kZShhc3QsIG5ld1lhbWwsIHRoaXMueWFtbCwgMCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTlVMTF9UQUcsIFNUUl9UQUcsIElOVF9UQUcsIEZMT0FUX1RBR1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpZiAoaW5jbHVkZXMoW05VTExfVEFHLCBTVFJfVEFHLCBJTlRfVEFHLCBGTE9BVF9UQUddLCBhc3QudGFnKSkge1xuICAgICAgdGhpcy55YW1sID0gcmVwbGFjZVByaW1pdGl2ZShhc3QsIG5ld0pzb24sIHRoaXMueWFtbCwgMCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBNQVBfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChhc3QudGFnID09PSBNQVBfVEFHKSB7XG4gICAgICBsZXQganNvbiA9IHRoaXMuanNvbjtcblxuICAgICAgdGhpcy55YW1sID0gdXBkYXRlTWFwKGFzdCwgbmV3SnNvbiwganNvbiwgdGhpcy55YW1sLCAwKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU0VRX1RBR1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpZiAoYXN0LnRhZyA9PT0gU0VRX1RBRykge1xuICAgICAgdGhpcy55YW1sID0gdXBkYXRlU2VxKGFzdCwgbmV3SnNvbiwgdGhpcy55YW1sLCAwKTtcbiAgICB9XG5cbiAgICAvLyBUcmltIHRyYWlsaW5nIHdoaXRlc3BhY2VzXG4gICAgdGhpcy55YW1sID0gdGhpcy55YW1sXG4gICAgICAuc3BsaXQoRU9MKVxuICAgICAgLm1hcChsaW5lPT4gbGluZS5yZXBsYWNlKC9bIFxcdF0rJC8sICcnKSlcbiAgICAgIC5qb2luKEVPTCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy55YW1sO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLmpzb247XG4gIH1cblxuICBnZXRSZW1hcmsocGF0aCkge1xuICAgIGNvbnN0IGFzdCA9IGNvbXBvc2UodGhpcy55YW1sKTtcbiAgICBsZXQgcGF0aGxpc3QgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgbGV0IG5vZGUgPSBnZXROb2RlKGFzdCwgcGF0aGxpc3QpO1xuICAgIHJldHVybiBub2RlICYmIGdldE5vZGVSZW1hcmsobm9kZSwgdGhpcy55YW1sKTtcbiAgfVxuXG4gIHNldFJlbWFyayhwYXRoLCByZW1hcmspIHtcbiAgICBjb25zdCBhc3QgPSBjb21wb3NlKHRoaXMueWFtbCk7XG4gICAgbGV0IHBhdGhsaXN0ID0gcGF0aC5zcGxpdCgnLicpO1xuICAgIGxldCBub2RlID0gZ2V0Tm9kZShhc3QsIHBhdGhsaXN0KTtcbiAgICByZXR1cm4gISFub2RlICYmICEhKHRoaXMueWFtbCA9IHNldE5vZGVSZW1hcmsobm9kZSwgcmVtYXJrLCB0aGlzLnlhbWwpKTtcbiAgfVxufVxuXG4vKlxuICogRGV0ZXJtaW5lcyB0aGUgQVNUIHRhZyBvZiBhIEpTT04gb2JqZWN0XG4gKlxuICogQHBhcmFtIHthbnl9IC0ganNvblxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAdGhyb3dzIHtZQVdORXJyb3J9IC0gaWYganNvbiBoYXMgd2VpcmQgdHlwZVxuKi9cbmZ1bmN0aW9uIGdldFRhZyhqc29uKSB7XG4gIGxldCB0YWcgPSBudWxsO1xuXG4gIGlmIChpc0FycmF5KGpzb24pKSB7XG4gICAgdGFnID0gU0VRX1RBRztcbiAgfSBlbHNlIGlmIChpc09iamVjdChqc29uKSkge1xuICAgIHRhZyA9IE1BUF9UQUc7XG4gIH0gZWxzZSBpZiAoaXNOdWxsKGpzb24pKSB7XG4gICAgdGFnID0gTlVMTF9UQUc7XG4gIH0gZWxzZSBpZiAoaXNOdW1iZXIoanNvbikpIHtcbiAgICBpZiAoanNvbiAlIDEwID09PSAwKSB7XG4gICAgICB0YWcgPSBJTlRfVEFHO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWcgPSBGTE9BVF9UQUc7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzU3RyaW5nKGpzb24pKSB7XG4gICAgdGFnID0gU1RSX1RBRztcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgWUFXTkVycm9yKCdVbmtub3duIHR5cGUnKTtcbiAgfVxuICByZXR1cm4gdGFnO1xufVxuXG4vKlxuICogVXBkYXRlIGEgc2VxdWVuY2Ugd2l0aCBuZXcgSlNPTlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gYXN0XG4gKiBAcGFyYW0ge29iamVjdH0gbmV3SnNvblxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICpcbiovXG5mdW5jdGlvbiB1cGRhdGVTZXEoYXN0LCBuZXdKc29uLCB5YW1sLCBvZmZzZXQpIHtcbiAgbGV0IHZhbHVlcyA9IGxvYWQoc2VyaWFsaXplKGFzdCkpO1xuICBsZXQgbWluID0gTWF0aC5taW4odmFsdWVzLmxlbmd0aCwgbmV3SnNvbi5sZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbjsgaSsrKSB7XG4gICAgY29uc3QgbmV3WWFtbCA9IGNoYW5nZUFycmF5RWxlbWVudChhc3QudmFsdWVbaV0sIGNsZWFuRHVtcChuZXdKc29uW2ldKSwgeWFtbCwgb2Zmc2V0KTtcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyBuZXdZYW1sLmxlbmd0aCAtIHlhbWwubGVuZ3RoO1xuICAgIHlhbWwgPSBuZXdZYW1sO1xuICB9XG5cbiAgaWYgKHZhbHVlcy5sZW5ndGggPiBtaW4pIHtcbiAgICBmb3IgKGxldCBpID0gbWluOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBuZXdZYW1sID0gcmVtb3ZlQXJyYXlFbGVtZW50KGFzdC52YWx1ZVtpXSwgeWFtbCwgb2Zmc2V0KTtcbiAgICAgIG9mZnNldCA9IG9mZnNldCArIG5ld1lhbWwubGVuZ3RoIC0geWFtbC5sZW5ndGg7XG4gICAgICB5YW1sID0gbmV3WWFtbDtcbiAgICB9XG4gIH0gZWxzZSBpZiAobmV3SnNvbi5sZW5ndGggPiBtaW4pIHtcbiAgICB5YW1sID0gaW5zZXJ0QWZ0ZXJOb2RlKGFzdCwgY2xlYW5EdW1wKG5ld0pzb24uc2xpY2UobWluKSksIHlhbWwsIG9mZnNldCk7XG4gIH1cblxuICByZXR1cm4geWFtbDtcbn1cblxuLypcbiAqIHVwZGF0ZSBhIG1hcCBzdHJ1Y3R1cmUgd2l0aCBuZXcgdmFsdWVzXG4gKlxuICogQHBhcmFtIHtBU1R9IGFzdCAtIGEgbWFwIEFTVFxuICogQHBhcmFtIHthbnl9IG5ld0pzb25cbiAqIEBwYXJhbSB7YW55fSAtIGpzb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB5YW1sXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqIEB0aHJvd3Mge1lBV05FcnJvcn0gLSBpZiBqc29uIGhhcyB3ZWlyZCB0eXBlXG4qL1xuZnVuY3Rpb24gdXBkYXRlTWFwKGFzdCwgbmV3SnNvbiwganNvbiwgeWFtbCwgb2Zmc2V0KSB7XG4gIC8vIGxvb2sgZm9yIGNoYW5nZXNcbiAgZWFjaChhc3QudmFsdWUsIHBhaXIgPT4ge1xuICAgIGxldCBba2V5Tm9kZSwgdmFsTm9kZV0gPSBwYWlyO1xuXG4gICAgLy8gbm9kZSBpcyBkZWxldGVkXG4gICAgaWYgKGlzVW5kZWZpbmVkKG5ld0pzb25ba2V5Tm9kZS52YWx1ZV0pKSB7XG5cbiAgICAgIC8vIFRPRE86IGNhbiB3ZSB1c2Ugb2YgdGhlIG1ldGhvZHMgYmVsb3c/XG4gICAgICBjb25zdCBuZXdZYW1sID0geWFtbC5zdWJzdHIoMCwga2V5Tm9kZS5zdGFydF9tYXJrLnBvaW50ZXIgKyBvZmZzZXQpICtcbiAgICAgICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsodmFsTm9kZSkucG9pbnRlciArIG9mZnNldCk7XG4gICAgICBvZmZzZXQgPSBvZmZzZXQgKyBuZXdZYW1sLmxlbmd0aCAtIHlhbWwubGVuZ3RoO1xuICAgICAgeWFtbCA9IG5ld1lhbWw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHZhbHVlID0ganNvbltrZXlOb2RlLnZhbHVlXTtcbiAgICBsZXQgbmV3VmFsdWUgPSBuZXdKc29uW2tleU5vZGUudmFsdWVdO1xuXG4gICAgLy8gcHJpbWl0aXZlIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB2YWx1ZSAmJiAhaXNBcnJheSh2YWxOb2RlLnZhbHVlKSkge1xuXG4gICAgICAvLyByZXBsYWNlIHRoZSB2YWx1ZSBub2RlXG4gICAgICBjb25zdCBuZXdZYW1sID0gcmVwbGFjZVByaW1pdGl2ZSh2YWxOb2RlLCBuZXdWYWx1ZSwgeWFtbCwgb2Zmc2V0KTtcbiAgICAgIG9mZnNldCA9IG9mZnNldCArIG5ld1lhbWwubGVuZ3RoIC0geWFtbC5sZW5ndGg7XG4gICAgICB5YW1sID0gbmV3WWFtbDtcbiAgICAgIC8vIHJlbW92ZSB0aGUga2V5L3ZhbHVlIGZyb20gbmV3SnNvbiBzbyBpdCdzIG5vdCBkZXRlY3RlZCBhcyBuZXcgcGFpciBpblxuICAgICAgLy8gbGF0ZXIgY29kZVxuICAgICAgZGVsZXRlIG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XG4gICAgfVxuXG4gICAgLy8gbm9uIHByaW1pdGl2ZSB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgIGlmICghaXNFcXVhbChuZXdWYWx1ZSwgdmFsdWUpICYmIGlzQXJyYXkodmFsTm9kZS52YWx1ZSkpIHtcblxuICAgICAgLy8gYXJyYXkgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICAgIGlmIChpc0FycmF5KG5ld1ZhbHVlKSkge1xuXG4gICAgICAgIC8vIHJlY3Vyc2VcbiAgICAgICAgY29uc3QgbmV3WWFtbCA9IHVwZGF0ZVNlcSh2YWxOb2RlLCBuZXdWYWx1ZSwgeWFtbCwgb2Zmc2V0KTtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0ICsgbmV3WWFtbC5sZW5ndGggLSB5YW1sLmxlbmd0aDtcbiAgICAgICAgeWFtbCA9IG5ld1lhbWw7XG5cbiAgICAgIC8vIG1hcCB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAvLyByZWN1cnNlXG4gICAgICAgIGNvbnN0IG5ld1lhbWwgPSB1cGRhdGVNYXAodmFsTm9kZSwgbmV3VmFsdWUsIHZhbHVlLCB5YW1sLCBvZmZzZXQpO1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQgKyBuZXdZYW1sLmxlbmd0aCAtIHlhbWwubGVuZ3RoO1xuICAgICAgICB5YW1sID0gbmV3WWFtbDtcblxuICAgICAgICAvLyBhc3QgPSBjb21wb3NlKHlhbWwpO1xuXG4gICAgICAgIC8vIHJlbW92ZSB0aGUga2V5L3ZhbHVlIGZyb20gbmV3SnNvbiBzbyBpdCdzIG5vdCBkZXRlY3RlZCBhcyBuZXcgcGFpciBpblxuICAgICAgICAvLyBsYXRlciBjb2RlXG4gICAgICAgIGRlbGV0ZSBuZXdKc29uW2tleU5vZGUudmFsdWVdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gbG9vayBmb3IgbmV3IGl0ZW1zIHRvIGFkZFxuICBlYWNoKG5ld0pzb24sICh2YWx1ZSwga2V5KT0+IHtcblxuICAgIC8vIGl0ZW0gaXMgbmV3XG4gICAgaWYgKGlzVW5kZWZpbmVkKGpzb25ba2V5XSkpIHtcbiAgICAgIGxldCBuZXdWYWx1ZSA9IGNsZWFuRHVtcCh7W2tleV06IHZhbHVlfSk7XG5cbiAgICAgIGNvbnN0IG5ld1lhbWwgPSBpbnNlcnRBZnRlck5vZGUoYXN0LCBuZXdWYWx1ZSwgeWFtbCwgb2Zmc2V0KTtcbiAgICAgIG9mZnNldCA9IG9mZnNldCArIG5ld1lhbWwubGVuZ3RoIC0geWFtbC5sZW5ndGg7XG4gICAgICB5YW1sID0gbmV3WWFtbDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB5YW1sO1xufVxuXG4vKlxuICogUGxhY2UgdmFsdWUgaW4gbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xuICpcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxuICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gKiBAcGFyYW0geWFtbCB7c3RyaW5nfVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVwbGFjZVByaW1pdGl2ZShub2RlLCB2YWx1ZSwgeWFtbCwgb2Zmc2V0KSB7XG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBub2RlLnN0YXJ0X21hcmsucG9pbnRlciArIG9mZnNldCkgK1xuICAgIFN0cmluZyh2YWx1ZSkgK1xuICAgIHlhbWwuc3Vic3RyaW5nKG5vZGUuZW5kX21hcmsucG9pbnRlciArIG9mZnNldCk7XG59XG5cbi8qXG4gKiBQbGFjZSB2YWx1ZSBpbiBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXG4gKlxuICogQHBhcmFtIG5vZGUge05vZGV9XG4gKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cbiAqIEBwYXJhbSB5YW1sIHtzdHJpbmd9XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiByZXBsYWNlTm9kZShub2RlLCB2YWx1ZSwgeWFtbCwgb2Zmc2V0KSB7XG4gIGxldCBpbmRlbnRlZFZhbHVlID0gaW5kZW50KHZhbHVlLCBub2RlLnN0YXJ0X21hcmsuY29sdW1uKTtcbiAgbGV0IGxpbmVTdGFydCA9IG5vZGUuc3RhcnRfbWFyay5wb2ludGVyIC0gbm9kZS5zdGFydF9tYXJrLmNvbHVtbiArIG9mZnNldDtcblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgbGluZVN0YXJ0KSArXG4gICAgaW5kZW50ZWRWYWx1ZSArXG4gICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlciArIG9mZnNldCk7XG59XG5cbi8qXG4gKiBQbGFjZSB2YWx1ZSBhZnRlciBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXG4gKlxuICogQHBhcmFtIG5vZGUge05vZGV9XG4gKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cbiAqIEBwYXJhbSB5YW1sIHtzdHJpbmd9XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiBpbnNlcnRBZnRlck5vZGUobm9kZSwgdmFsdWUsIHlhbWwsIG9mZnNldCkge1xuICBsZXQgaW5kZW50ZWRWYWx1ZSA9IGluZGVudCh2YWx1ZSwgbm9kZS5zdGFydF9tYXJrLmNvbHVtbik7XG5cbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIgKyBvZmZzZXQpICtcbiAgICBFT0wgK1xuICAgIGluZGVudGVkVmFsdWUgK1xuICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIgKyBvZmZzZXQpO1xufVxuXG4vKlxuICogUmVtb3ZlcyBhIG5vZGUgZnJvbSBhcnJheVxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIHJlbW92ZUFycmF5RWxlbWVudChub2RlLCB5YW1sLCBvZmZzZXQpIHtcbiAgbGV0IGluZGV4ID0gbm9kZS5zdGFydF9tYXJrLnBvaW50ZXIgLSBub2RlLnN0YXJ0X21hcmsuY29sdW1uIC0gMSArIG9mZnNldDtcblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgaW5kZXgpICtcbiAgICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIgKyBvZmZzZXQpO1xufVxuXG4vKlxuICogQ2hhbmdlcyBhIG5vZGUgZnJvbSBhcnJheVxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gY2hhbmdlQXJyYXlFbGVtZW50KG5vZGUsIHZhbHVlLCB5YW1sLCBvZmZzZXQpIHtcbiAgbGV0IGluZGVudGVkVmFsdWUgPSBpbmRlbnQodmFsdWUsIG5vZGUuc3RhcnRfbWFyay5jb2x1bW4pO1xuXG4gIC8vIGZpbmQgaW5kZXggb2YgREFTSChgLWApIGNoYXJhY3RlciBmb3IgdGhpcyBhcnJheVxuICBsZXQgaW5kZXggPSBub2RlLnN0YXJ0X21hcmsucG9pbnRlciArIG9mZnNldDtcbiAgd2hpbGUgKGluZGV4ID4gMCAmJiB5YW1sW2luZGV4XSAhPT0gREFTSCkge1xuICAgIGluZGV4LS07XG4gIH1cblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgaW5kZXggKyAyKSArXG4gICAgICBpbmRlbnRlZFZhbHVlLnN1YnN0cihub2RlLnN0YXJ0X21hcmsuY29sdW1uKSArXG4gICAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyICsgb2Zmc2V0KTtcbn1cblxuLypcbiAqIEdldHMgZW5kIG1hcmsgb2YgYW4gQVNUXG4gKlxuICogQHBhcmFtIHtOb2RlfSBhc3RcbiAqXG4gKiBAcmV0dXJucyB7TWFya31cbiovXG5mdW5jdGlvbiBnZXROb2RlRW5kTWFyayhhc3QpIHtcbiAgaWYgKGlzQXJyYXkoYXN0LnZhbHVlKSAmJiBhc3QudmFsdWUubGVuZ3RoKSB7XG4gICAgbGV0IGxhc3RJdGVtID0gbGFzdChhc3QudmFsdWUpO1xuXG4gICAgaWYgKGlzQXJyYXkobGFzdEl0ZW0pICYmIGxhc3RJdGVtLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGdldE5vZGVFbmRNYXJrKGxhc3QobGFzdEl0ZW0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0Tm9kZUVuZE1hcmsobGFzdEl0ZW0pO1xuICB9XG5cbiAgcmV0dXJuIGFzdC5lbmRfbWFyaztcbn1cblxuLypcbiAqIEluZGVudHMgYSBzdHJpbmcgd2l0aCBudW1iZXIgb2YgY2hhcmFjdGVyc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7aW50ZWdlcn0gZGVwdGggLSBjYW4gYmUgbmVnYXRpdmUgYWxzb1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gaW5kZW50KHN0ciwgZGVwdGgpIHtcbiAgcmV0dXJuIHN0clxuICAgIC5zcGxpdChFT0wpXG4gICAgLmZpbHRlcihsaW5lID0+IGxpbmUpXG4gICAgLm1hcChsaW5lID0+IHJlcGVhdChTUEFDRSwgZGVwdGgpICsgbGluZSlcbiAgICAuam9pbihFT0wpO1xufVxuXG4vKlxuICogRHVtcCBhIHZhbHVlIHRvIFlBTUwgc3Rpbmcgd2l0aG91dCB0aGUgdHJhaWxpbmcgbmV3IGxpbmVcbiAqXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICpcbiovXG5mdW5jdGlvbiBjbGVhbkR1bXAodmFsdWUpIHtcbiAgbGV0IHlhbWwgPSBkdW1wKHZhbHVlKS5yZXBsYWNlKC9cXG4kLywgJycpO1xuXG4gIGlmIChFT0wgIT09ICdcXG4nKSB7XG4gICAgeWFtbCA9IHlhbWwucmVwbGFjZSgvXFxuL2csIEVPTCk7XG4gIH1cblxuICByZXR1cm4geWFtbDtcbn1cblxuLypcbiAqIEdldHMgcmVtYXJrIG9mIGFuIEFTVFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gYXN0XG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gZ2V0Tm9kZVJlbWFyayhhc3QsIHlhbWwpIHtcbiAgbGV0IGluZGV4ID0gZ2V0Tm9kZUVuZE1hcmsoYXN0KS5wb2ludGVyO1xuICB3aGlsZSAoaW5kZXggPCB5YW1sLmxlbmd0aCAmJiB5YW1sW2luZGV4XSAhPT0gJyMnICYmIHlhbWxbaW5kZXhdICE9PSBFT0wpIHtcbiAgICArK2luZGV4O1xuICB9XG5cbiAgaWYgKEVPTCA9PT0geWFtbFtpbmRleF0gfHwgaW5kZXggPT09IHlhbWwubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChpbmRleCA8IHlhbWwubGVuZ3RoICYmICh5YW1sW2luZGV4XSA9PT0gJyMnIHx8IHlhbWxbaW5kZXhdID09PSAnICcpKSB7XG4gICAgICArK2luZGV4O1xuICAgIH1cbiAgICBsZXQgZW5kID0gaW5kZXg7XG4gICAgd2hpbGUgKGVuZCA8IHlhbWwubGVuZ3RoICYmIHlhbWxbZW5kXSAhPT0gRU9MKSB7XG4gICAgICArK2VuZDtcbiAgICB9XG4gICAgcmV0dXJuIHlhbWwuc3Vic3RyaW5nKGluZGV4LCBlbmQpO1xuICB9XG59XG5cbi8qXG4gKiBTZXRzIHJlbWFyayBvZiBhbiBBU1RcbiAqXG4gKiBAcGFyYW0ge05vZGV9IGFzdFxuICogQHBhcmFtIHtzdHJpbmd9IHJlbWFya1xuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiovXG5mdW5jdGlvbiBzZXROb2RlUmVtYXJrKGFzdCwgcmVtYXJrLCB5YW1sKSB7XG4gIGxldCBpbmRleCA9IGdldE5vZGVFbmRNYXJrKGFzdCkucG9pbnRlcjtcbiAgd2hpbGUgKGluZGV4IDwgeWFtbC5sZW5ndGggJiYgeWFtbFtpbmRleF0gIT09ICcjJyAmJiB5YW1sW2luZGV4XSAhPT0gRU9MKSB7XG4gICAgKytpbmRleDtcbiAgfVxuXG4gIGlmIChFT0wgPT09IHlhbWxbaW5kZXhdIHx8IGluZGV4ID09PSB5YW1sLmxlbmd0aCkge1xuICAgIHJldHVybiB5YW1sLnN1YnN0cigwLCBpbmRleCkgKyAnICMgJyArIHJlbWFyayArXG4gICAgICAgIHlhbWwuc3Vic3RyaW5nKGluZGV4KTtcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoaW5kZXggPCB5YW1sLmxlbmd0aCAmJiAoeWFtbFtpbmRleF0gPT09ICcjJyB8fCB5YW1sW2luZGV4XSA9PT0gJyAnKSkge1xuICAgICAgKytpbmRleDtcbiAgICB9XG4gICAgbGV0IGVuZCA9IGluZGV4O1xuICAgIHdoaWxlIChlbmQgPCB5YW1sLmxlbmd0aCAmJiB5YW1sW2VuZF0gIT09IEVPTCkge1xuICAgICAgKytlbmQ7XG4gICAgfVxuICAgIHJldHVybiB5YW1sLnN1YnN0cigwLCBpbmRleCkgKyByZW1hcmsgK1xuICAgICAgICB5YW1sLnN1YnN0cmluZyhlbmQpO1xuICB9XG59XG5cbi8qXG4gKiBHZXRzIG5vZGUgb2YgYW4gQVNUIHdoaWNoIHBhdGhcbiAqXG4gKiBAcGFyYW0ge05vZGV9IGFzdFxuICogQHBhcmFtIHthcnJheX0gcGF0aFxuICpcbiAqIEByZXR1cm5zIHtOb2RlfVxuKi9cbmZ1bmN0aW9uIGdldE5vZGUoYXN0LCBwYXRoKSB7XG4gIGlmIChwYXRoLmxlbmd0aCkge1xuICAgIGlmIChhc3QudGFnID09PSBNQVBfVEFHKSB7XG4gICAgICBsZXQgdmFsdWUgPSBhc3QudmFsdWU7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCBba2V5Tm9kZSwgdmFsTm9kZV0gPSB2YWx1ZVtpXTtcbiAgICAgICAgaWYgKHBhdGhbMF0gPT09IGtleU5vZGUudmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0Tm9kZSh2YWxOb2RlLCBwYXRoLnNsaWNlKDEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKGFzdC50YWcgPT09IFNFUV9UQUcpIHtcbiAgICAgIHJldHVybiBhc3QudmFsdWVbcGF0aFswXV0gJiYgZ2V0Tm9kZShhc3QudmFsdWVbcGF0aFswXV0sIHBhdGguc2xpY2UoMSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXN0O1xufVxuIl19
