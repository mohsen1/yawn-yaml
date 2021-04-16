(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.YAWN = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

exports.homedir = function () {
	return '/'
};

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvb3MtYnJvd3NlcmlmeS9icm93c2VyLmpzIiwic3JjL2Vycm9yLmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7SUFFUSxTQUFTO1lBQVQsU0FBUzs7QUFDakIsV0FEUSxTQUFTLENBQ2hCLE9BQU8sRUFBRTswQkFERixTQUFTOztBQUUxQiwrQkFGaUIsU0FBUyw2Q0FFcEIsT0FBTyxFQUFFO0FBQ2YsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsUUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7R0FDekI7O1NBTGtCLFNBQVM7R0FBUyxLQUFLOztxQkFBdkIsU0FBUzs7OztBQ0Y5QixZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBRU8sSUFBSTs7c0JBQ1MsU0FBUzs7c0JBQ2pCLFNBQVM7O3NCQWEzQixRQUFROzt1QkFFTyxZQUFZOzs7O0FBRWxDLElBQU0sUUFBUSxHQUFHLHdCQUF3QixDQUFDO0FBQzFDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDO0FBQ3hDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDO0FBQ3hDLElBQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFDO0FBQzVDLElBQU0sT0FBTyxH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SSxDQUFDLE1BQU0sRUFBRTtBQUNmLFVBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxPQUFPLEVBQUU7QUFDdkIsWUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUN0QixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTt3Q0FDWixLQUFLLENBQUMsQ0FBQyxDQUFDOztjQUE1QixPQUFPO2NBQUUsT0FBTzs7QUFDckIsY0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLEtBQUssRUFBRTtrQkFDZCxPQUFPO2tCQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUpyQyxpQkFBSyxHQUNBLENBQUMsY0FDSCxPQUFPLEdBQUUsT0FBTzs7V0FHcEI7U0FDRjtBQUNELGVBQU8sU0FBUyxDQUFDO09BQ2xCLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLE9BQU8sRUFBRTtzQkFDdkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Y0FBWSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQVRsRSxhQUFLLEdBQ0EsQ0FBQyxjQUNILE9BQU8sR0FBRSxPQUFPOztPQVF4QjtLQUNGO0FBQ0QsV0FBTyxHQUFHLENBQUM7R0FDWjtDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0cy5lbmRpYW5uZXNzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0xFJyB9O1xuXG5leHBvcnRzLmhvc3RuYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgbG9jYXRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGlvbi5ob3N0bmFtZVxuICAgIH1cbiAgICBlbHNlIHJldHVybiAnJztcbn07XG5cbmV4cG9ydHMubG9hZGF2ZyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdIH07XG5cbmV4cG9ydHMudXB0aW1lID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMCB9O1xuXG5leHBvcnRzLmZyZWVtZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE51bWJlci5NQVhfVkFMVUU7XG59O1xuXG5leHBvcnRzLnRvdGFsbWVtID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBOdW1iZXIuTUFYX1ZBTFVFO1xufTtcblxuZXhwb3J0cy5jcHVzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW10gfTtcblxuZXhwb3J0cy50eXBlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0Jyb3dzZXInIH07XG5cbmV4cG9ydHMucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci5hcHBWZXJzaW9uO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59O1xuXG5leHBvcnRzLm5ldHdvcmtJbnRlcmZhY2VzXG49IGV4cG9ydHMuZ2V0TmV0d29ya0ludGVyZmFjZXNcbj0gZnVuY3Rpb24gKCkgeyByZXR1cm4ge30gfTtcblxuZXhwb3J0cy5hcmNoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ2phdmFzY3JpcHQnIH07XG5cbmV4cG9ydHMucGxhdGZvcm0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnYnJvd3NlcicgfTtcblxuZXhwb3J0cy50bXBkaXIgPSBleHBvcnRzLnRtcERpciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJy90bXAnO1xufTtcblxuZXhwb3J0cy5FT0wgPSAnXFxuJztcblxuZXhwb3J0cy5ob21lZGlyID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gJy8nXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWUFXTkVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcclxuICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIHRoaXMubmFtZSA9ICdZQVdORXJyb3InO1xyXG4gIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgeyBFT0wgfSBmcm9tICdvcyc7XHJcbmltcG9ydCB7Y29tcG9zZSwgc2VyaWFsaXplfSBmcm9tICd5YW1sLWpzJztcclxuaW1wb3J0IHtsb2FkLCBkdW1wfSBmcm9tICdqcy15YW1sJztcclxuaW1wb3J0IHtcclxuICBpc0FycmF5LFxyXG4gIGlzU3RyaW5nLFxyXG4gIGlzT2JqZWN0LFxyXG4gIGlzVW5kZWZpbmVkLFxyXG4gIGlzTnVsbCxcclxuICBpc051bWJlcixcclxuICBpc0VxdWFsLFxyXG4gIHJlcGVhdCxcclxuICBlYWNoLFxyXG4gIGluY2x1ZGVzLFxyXG4gIGxhc3RcclxufSBmcm9tICdsb2Rhc2gnO1xyXG5cclxuaW1wb3J0IFlBV05FcnJvciBmcm9tICcuL2Vycm9yLmpzJztcclxuXHJcbmNvbnN0IE5VTExfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOm51bGwnO1xyXG5jb25zdCBTVFJfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOnN0cic7XHJcbmNvbnN0IElOVF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6aW50JztcclxuY29uc3QgRkxPQVRfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JztcclxuY29uc3QgTUFQX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjptYXAnO1xyXG5jb25zdCBTRVFfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOnNlcSc7XHJcblxyXG5jb25zdCBTUEFDRSA9ICcgJztcclxuY29uc3QgREFTSCA9ICctJztcclxuXHJcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV04ge1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBZQVdOIHtcclxuXHJcbiAgY29uc3RydWN0b3Ioc3RyKSB7XHJcbiAgICBpZiAoIWlzU3RyaW5nKHN0cikpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyIHNob3VsZCBiZSBhIHN0cmluZycpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMueWFtbCA9IHN0cjtcclxuICB9XHJcblxyXG4gIGdldCBqc29uKCkge1xyXG4gICAgcmV0dXJuIGxvYWQodGhpcy55YW1sKTtcclxuICB9XHJcblxyXG4gIHNldCBqc29uKG5ld0pzb24pIHtcclxuXHJcbiAgICAvLyBpZiBqc29uIGlzIG5vdCBjaGFuZ2VkIGRvIG5vdGhpbmdcclxuICAgIGlmIChpc0VxdWFsKHRoaXMuanNvbiwgbmV3SnNvbikpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFzdCA9IGNvbXBvc2UodGhpcy55YW1sKTtcclxuXHJcbiAgICBpZiAoaXNVbmRlZmluZWQobmV3SnNvbikpIHtcclxuICAgICAgdGhpcy55YW1sID0gJyc7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBjaGVjayBpZiBlbnRpcmUganNvbiBpcyBjaGFuZ2VkXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBsZXQgbmV3VGFnID0gZ2V0VGFnKG5ld0pzb24pO1xyXG5cclxuICAgIGlmIChhc3QudGFnICE9PSBuZXdUYWcpIHtcclxuICAgICAgbGV0IG5ld1lhbWwgPSBjbGVhbkR1bXAobmV3SnNvbik7XHJcblxyXG4gICAgICAvLyByZXBsYWNlIHRoaXMueWFtbCB2YWx1ZSBmcm9tIHN0YXJ0IHRvIGVuZCBtYXJrIHdpdGggbmV3WWFtbCBpZiBub2RlIGlzXHJcbiAgICAgIC8vIHByaW1pdGl2ZVxyXG4gICAgICBpZiAoIWlzT2JqZWN0KG5ld0pzb24pKSB7XHJcbiAgICAgICAgdGhpcy55YW1sID0gcmVwbGFjZVByaW1pdGl2ZShhc3QsIG5ld1lhbWwsIHRoaXMueWFtbCwgMCk7XHJcblxyXG4gICAgICAvLyBpZiBub2RlIGlzIG5vdCBwcmltaXRpdmVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnlhbWwgPSByZXBsYWNlTm9kZShhc3QsIG5ld1lhbWwsIHRoaXMueWFtbCwgMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBOVUxMX1RBRywgU1RSX1RBRywgSU5UX1RBRywgRkxPQVRfVEFHXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBpZiAoaW5jbHVkZXMoW05VTExfVEFHLCBTVFJfVEFHLCBJTlRfVEFHLCBGTE9BVF9UQUddLCBhc3QudGFnKSkge1xyXG4gICAgICB0aGlzLnlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKGFzdCwgbmV3SnNvbiwgdGhpcy55YW1sLCAwKTtcclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gTUFQX1RBR1xyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgaWYgKGFzdC50YWcgPT09IE1BUF9UQUcpIHtcclxuICAgICAgbGV0IGpzb24gPSB0aGlzLmpzb247XHJcblxyXG4gICAgICB0aGlzLnlhbWwgPSB1cGRhdGVNYXAoYXN0LCBuZXdKc29uLCBqc29uLCB0aGlzLnlhbWwsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFNFUV9UQUdcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIGlmIChhc3QudGFnID09PSBTRVFfVEFHKSB7XHJcbiAgICAgIHRoaXMueWFtbCA9IHVwZGF0ZVNlcShhc3QsIG5ld0pzb24sIHRoaXMueWFtbCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVHJpbSB0cmFpbGluZyB3aGl0ZXNwYWNlc1xyXG4gICAgdGhpcy55YW1sID0gdGhpcy55YW1sXHJcbiAgICAgIC5zcGxpdChFT0wpXHJcbiAgICAgIC5tYXAobGluZT0+IGxpbmUucmVwbGFjZSgvWyBcXHRdKyQvLCAnJykpXHJcbiAgICAgIC5qb2luKEVPTCk7XHJcbiAgfVxyXG5cclxuICB0b1N0cmluZygpIHtcclxuICAgIHJldHVybiB0aGlzLnlhbWw7XHJcbiAgfVxyXG5cclxuICB0b0pTT04oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5qc29uO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVtYXJrKHBhdGgpIHtcclxuICAgIGNvbnN0IGFzdCA9IGNvbXBvc2UodGhpcy55YW1sKTtcclxuICAgIGxldCBwYXRobGlzdCA9IHBhdGguc3BsaXQoJy4nKTtcclxuICAgIGxldCBub2RlID0gZ2V0Tm9kZShhc3QsIHBhdGhsaXN0KTtcclxuICAgIHJldHVybiBub2RlICYmIGdldE5vZGVSZW1hcmsobm9kZSwgdGhpcy55YW1sKTtcclxuICB9XHJcblxyXG4gIHNldFJlbWFyayhwYXRoLCByZW1hcmspIHtcclxuICAgIGNvbnN0IGFzdCA9IGNvbXBvc2UodGhpcy55YW1sKTtcclxuICAgIGxldCBwYXRobGlzdCA9IHBhdGguc3BsaXQoJy4nKTtcclxuICAgIGxldCBub2RlID0gZ2V0Tm9kZShhc3QsIHBhdGhsaXN0KTtcclxuICAgIHJldHVybiAhIW5vZGUgJiYgISEodGhpcy55YW1sID0gc2V0Tm9kZVJlbWFyayhub2RlLCByZW1hcmssIHRoaXMueWFtbCkpO1xyXG4gIH1cclxufVxyXG5cclxuLypcclxuICogRGV0ZXJtaW5lcyB0aGUgQVNUIHRhZyBvZiBhIEpTT04gb2JqZWN0XHJcbiAqXHJcbiAqIEBwYXJhbSB7YW55fSAtIGpzb25cclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqIEB0aHJvd3Mge1lBV05FcnJvcn0gLSBpZiBqc29uIGhhcyB3ZWlyZCB0eXBlXHJcbiovXHJcbmZ1bmN0aW9uIGdldFRhZyhqc29uKSB7XHJcbiAgbGV0IHRhZyA9IG51bGw7XHJcblxyXG4gIGlmIChpc0FycmF5KGpzb24pKSB7XHJcbiAgICB0YWcgPSBTRVFfVEFHO1xyXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoanNvbikpIHtcclxuICAgIHRhZyA9IE1BUF9UQUc7XHJcbiAgfSBlbHNlIGlmIChpc051bGwoanNvbikpIHtcclxuICAgIHRhZyA9IE5VTExfVEFHO1xyXG4gIH0gZWxzZSBpZiAoaXNOdW1iZXIoanNvbikpIHtcclxuICAgIGlmIChqc29uICUgMTAgPT09IDApIHtcclxuICAgICAgdGFnID0gSU5UX1RBRztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRhZyA9IEZMT0FUX1RBRztcclxuICAgIH1cclxuICB9IGVsc2UgaWYgKGlzU3RyaW5nKGpzb24pKSB7XHJcbiAgICB0YWcgPSBTVFJfVEFHO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBuZXcgWUFXTkVycm9yKCdVbmtub3duIHR5cGUnKTtcclxuICB9XHJcbiAgcmV0dXJuIHRhZztcclxufVxyXG5cclxuLypcclxuICogVXBkYXRlIGEgc2VxdWVuY2Ugd2l0aCBuZXcgSlNPTlxyXG4gKlxyXG4gKiBAcGFyYW0ge05vZGV9IGFzdFxyXG4gKiBAcGFyYW0ge29iamVjdH0gbmV3SnNvblxyXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKlxyXG4qL1xyXG5mdW5jdGlvbiB1cGRhdGVTZXEoYXN0LCBuZXdKc29uLCB5YW1sLCBvZmZzZXQpIHtcclxuICBsZXQgdmFsdWVzID0gbG9hZChzZXJpYWxpemUoYXN0KSk7XHJcbiAgbGV0IG1pbiA9IE1hdGgubWluKHZhbHVlcy5sZW5ndGgsIG5ld0pzb24ubGVuZ3RoKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbjsgaSsrKSB7XHJcbiAgICBjb25zdCBuZXdZYW1sID0gY2hhbmdlQXJyYXlFbGVtZW50KGFzdC52YWx1ZVtpXSwgY2xlYW5EdW1wKG5ld0pzb25baV0pLCB5YW1sLCBvZmZzZXQpO1xyXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgbmV3WWFtbC5sZW5ndGggLSB5YW1sLmxlbmd0aDtcclxuICAgIHlhbWwgPSBuZXdZYW1sO1xyXG4gIH1cclxuXHJcbiAgaWYgKHZhbHVlcy5sZW5ndGggPiBtaW4pIHtcclxuICAgIGZvciAobGV0IGkgPSBtaW47IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgbmV3WWFtbCA9IHJlbW92ZUFycmF5RWxlbWVudChhc3QudmFsdWVbaV0sIHlhbWwsIG9mZnNldCk7XHJcbiAgICAgIG9mZnNldCA9IG9mZnNldCArIG5ld1lhbWwubGVuZ3RoIC0geWFtbC5sZW5ndGg7XHJcbiAgICAgIHlhbWwgPSBuZXdZYW1sO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAobmV3SnNvbi5sZW5ndGggPiBtaW4pIHtcclxuICAgIHlhbWwgPSBpbnNlcnRBZnRlck5vZGUoYXN0LCBjbGVhbkR1bXAobmV3SnNvbi5zbGljZShtaW4pKSwgeWFtbCwgb2Zmc2V0KTtcclxuICB9XHJcblxyXG4gIHJldHVybiB5YW1sO1xyXG59XHJcblxyXG4vKlxyXG4gKiB1cGRhdGUgYSBtYXAgc3RydWN0dXJlIHdpdGggbmV3IHZhbHVlc1xyXG4gKlxyXG4gKiBAcGFyYW0ge0FTVH0gYXN0IC0gYSBtYXAgQVNUXHJcbiAqIEBwYXJhbSB7YW55fSBuZXdKc29uXHJcbiAqIEBwYXJhbSB7YW55fSAtIGpzb25cclxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqIEB0aHJvd3Mge1lBV05FcnJvcn0gLSBpZiBqc29uIGhhcyB3ZWlyZCB0eXBlXHJcbiovXHJcbmZ1bmN0aW9uIHVwZGF0ZU1hcChhc3QsIG5ld0pzb24sIGpzb24sIHlhbWwsIG9mZnNldCkge1xyXG4gIC8vIGxvb2sgZm9yIGNoYW5nZXNcclxuICBlYWNoKGFzdC52YWx1ZSwgcGFpciA9PiB7XHJcbiAgICBsZXQgW2tleU5vZGUsIHZhbE5vZGVdID0gcGFpcjtcclxuXHJcbiAgICAvLyBub2RlIGlzIGRlbGV0ZWRcclxuICAgIGlmIChpc1VuZGVmaW5lZChuZXdKc29uW2tleU5vZGUudmFsdWVdKSkge1xyXG5cclxuICAgICAgLy8gVE9ETzogY2FuIHdlIHVzZSBvZiB0aGUgbWV0aG9kcyBiZWxvdz9cclxuICAgICAgY29uc3QgbmV3WWFtbCA9IHlhbWwuc3Vic3RyKDAsIGtleU5vZGUuc3RhcnRfbWFyay5wb2ludGVyICsgb2Zmc2V0KSArXHJcbiAgICAgICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsodmFsTm9kZSkucG9pbnRlciArIG9mZnNldCk7XHJcbiAgICAgIG9mZnNldCA9IG9mZnNldCArIG5ld1lhbWwubGVuZ3RoIC0geWFtbC5sZW5ndGg7XHJcbiAgICAgIHlhbWwgPSBuZXdZYW1sO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHZhbHVlID0ganNvbltrZXlOb2RlLnZhbHVlXTtcclxuICAgIGxldCBuZXdWYWx1ZSA9IG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XHJcblxyXG4gICAgLy8gcHJpbWl0aXZlIHZhbHVlIGhhcyBjaGFuZ2VkXHJcbiAgICBpZiAobmV3VmFsdWUgIT09IHZhbHVlICYmICFpc0FycmF5KHZhbE5vZGUudmFsdWUpKSB7XHJcblxyXG4gICAgICAvLyByZXBsYWNlIHRoZSB2YWx1ZSBub2RlXHJcbiAgICAgIGNvbnN0IG5ld1lhbWwgPSByZXBsYWNlUHJpbWl0aXZlKHZhbE5vZGUsIG5ld1ZhbHVlLCB5YW1sLCBvZmZzZXQpO1xyXG4gICAgICBvZmZzZXQgPSBvZmZzZXQgKyBuZXdZYW1sLmxlbmd0aCAtIHlhbWwubGVuZ3RoO1xyXG4gICAgICB5YW1sID0gbmV3WWFtbDtcclxuICAgICAgLy8gcmVtb3ZlIHRoZSBrZXkvdmFsdWUgZnJvbSBuZXdKc29uIHNvIGl0J3Mgbm90IGRldGVjdGVkIGFzIG5ldyBwYWlyIGluXHJcbiAgICAgIC8vIGxhdGVyIGNvZGVcclxuICAgICAgZGVsZXRlIG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbm9uIHByaW1pdGl2ZSB2YWx1ZSBoYXMgY2hhbmdlZFxyXG4gICAgaWYgKCFpc0VxdWFsKG5ld1ZhbHVlLCB2YWx1ZSkgJiYgaXNBcnJheSh2YWxOb2RlLnZhbHVlKSkge1xyXG5cclxuICAgICAgLy8gYXJyYXkgdmFsdWUgaGFzIGNoYW5nZWRcclxuICAgICAgaWYgKGlzQXJyYXkobmV3VmFsdWUpKSB7XHJcblxyXG4gICAgICAgIC8vIHJlY3Vyc2VcclxuICAgICAgICBjb25zdCBuZXdZYW1sID0gdXBkYXRlU2VxKHZhbE5vZGUsIG5ld1ZhbHVlLCB5YW1sLCBvZmZzZXQpO1xyXG4gICAgICAgIG9mZnNldCA9IG9mZnNldCArIG5ld1lhbWwubGVuZ3RoIC0geWFtbC5sZW5ndGg7XHJcbiAgICAgICAgeWFtbCA9IG5ld1lhbWw7XHJcblxyXG4gICAgICAvLyBtYXAgdmFsdWUgaGFzIGNoYW5nZWRcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gcmVjdXJzZVxyXG4gICAgICAgIGNvbnN0IG5ld1lhbWwgPSB1cGRhdGVNYXAodmFsTm9kZSwgbmV3VmFsdWUsIHZhbHVlLCB5YW1sLCBvZmZzZXQpO1xyXG4gICAgICAgIG9mZnNldCA9IG9mZnNldCArIG5ld1lhbWwubGVuZ3RoIC0geWFtbC5sZW5ndGg7XHJcbiAgICAgICAgeWFtbCA9IG5ld1lhbWw7XHJcblxyXG4gICAgICAgIC8vIGFzdCA9IGNvbXBvc2UoeWFtbCk7XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB0aGUga2V5L3ZhbHVlIGZyb20gbmV3SnNvbiBzbyBpdCdzIG5vdCBkZXRlY3RlZCBhcyBuZXcgcGFpciBpblxyXG4gICAgICAgIC8vIGxhdGVyIGNvZGVcclxuICAgICAgICBkZWxldGUgbmV3SnNvbltrZXlOb2RlLnZhbHVlXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBsb29rIGZvciBuZXcgaXRlbXMgdG8gYWRkXHJcbiAgZWFjaChuZXdKc29uLCAodmFsdWUsIGtleSk9PiB7XHJcblxyXG4gICAgLy8gaXRlbSBpcyBuZXdcclxuICAgIGlmIChpc1VuZGVmaW5lZChqc29uW2tleV0pKSB7XHJcbiAgICAgIGxldCBuZXdWYWx1ZSA9IGNsZWFuRHVtcCh7W2tleV06IHZhbHVlfSk7XHJcblxyXG4gICAgICBjb25zdCBuZXdZYW1sID0gaW5zZXJ0QWZ0ZXJOb2RlKGFzdCwgbmV3VmFsdWUsIHlhbWwsIG9mZnNldCk7XHJcbiAgICAgIG9mZnNldCA9IG9mZnNldCArIG5ld1lhbWwubGVuZ3RoIC0geWFtbC5sZW5ndGg7XHJcbiAgICAgIHlhbWwgPSBuZXdZYW1sO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4geWFtbDtcclxufVxyXG5cclxuLypcclxuICogUGxhY2UgdmFsdWUgaW4gbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xyXG4gKlxyXG4gKiBAcGFyYW0gbm9kZSB7Tm9kZX1cclxuICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XHJcbiAqIEBwYXJhbSB5YW1sIHtzdHJpbmd9XHJcbiAqXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiovXHJcbmZ1bmN0aW9uIHJlcGxhY2VQcmltaXRpdmUobm9kZSwgdmFsdWUsIHlhbWwsIG9mZnNldCkge1xyXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBub2RlLnN0YXJ0X21hcmsucG9pbnRlciArIG9mZnNldCkgK1xyXG4gICAgU3RyaW5nKHZhbHVlKSArXHJcbiAgICB5YW1sLnN1YnN0cmluZyhub2RlLmVuZF9tYXJrLnBvaW50ZXIgKyBvZmZzZXQpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBQbGFjZSB2YWx1ZSBpbiBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXHJcbiAqXHJcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxyXG4gKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cclxuICogQHBhcmFtIHlhbWwge3N0cmluZ31cclxuICpcclxuICogQHJldHVybnMge3N0cmluZ31cclxuKi9cclxuZnVuY3Rpb24gcmVwbGFjZU5vZGUobm9kZSwgdmFsdWUsIHlhbWwsIG9mZnNldCkge1xyXG4gIGxldCBpbmRlbnRlZFZhbHVlID0gaW5kZW50KHZhbHVlLCBub2RlLnN0YXJ0X21hcmsuY29sdW1uKTtcclxuICBsZXQgbGluZVN0YXJ0ID0gbm9kZS5zdGFydF9tYXJrLnBvaW50ZXIgLSBub2RlLnN0YXJ0X21hcmsuY29sdW1uICsgb2Zmc2V0O1xyXG5cclxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgbGluZVN0YXJ0KSArXHJcbiAgICBpbmRlbnRlZFZhbHVlICtcclxuICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIgKyBvZmZzZXQpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBQbGFjZSB2YWx1ZSBhZnRlciBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXHJcbiAqXHJcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxyXG4gKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cclxuICogQHBhcmFtIHlhbWwge3N0cmluZ31cclxuICpcclxuICogQHJldHVybnMge3N0cmluZ31cclxuKi9cclxuZnVuY3Rpb24gaW5zZXJ0QWZ0ZXJOb2RlKG5vZGUsIHZhbHVlLCB5YW1sLCBvZmZzZXQpIHtcclxuICBsZXQgaW5kZW50ZWRWYWx1ZSA9IGluZGVudCh2YWx1ZSwgbm9kZS5zdGFydF9tYXJrLmNvbHVtbik7XHJcblxyXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyICsgb2Zmc2V0KSArXHJcbiAgICBFT0wgK1xyXG4gICAgaW5kZW50ZWRWYWx1ZSArXHJcbiAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyICsgb2Zmc2V0KTtcclxufVxyXG5cclxuLypcclxuICogUmVtb3ZlcyBhIG5vZGUgZnJvbSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcclxuICpcclxuICogQHJldHVybnMge3N0cmluZ31cclxuKi9cclxuZnVuY3Rpb24gcmVtb3ZlQXJyYXlFbGVtZW50KG5vZGUsIHlhbWwsIG9mZnNldCkge1xyXG4gIGxldCBpbmRleCA9IG5vZGUuc3RhcnRfbWFyay5wb2ludGVyIC0gbm9kZS5zdGFydF9tYXJrLmNvbHVtbiAtIDEgKyBvZmZzZXQ7XHJcblxyXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBpbmRleCkgK1xyXG4gICAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyICsgb2Zmc2V0KTtcclxufVxyXG5cclxuLypcclxuICogQ2hhbmdlcyBhIG5vZGUgZnJvbSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcclxuICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB5YW1sXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiovXHJcbmZ1bmN0aW9uIGNoYW5nZUFycmF5RWxlbWVudChub2RlLCB2YWx1ZSwgeWFtbCwgb2Zmc2V0KSB7XHJcbiAgbGV0IGluZGVudGVkVmFsdWUgPSBpbmRlbnQodmFsdWUsIG5vZGUuc3RhcnRfbWFyay5jb2x1bW4pO1xyXG5cclxuICAvLyBmaW5kIGluZGV4IG9mIERBU0goYC1gKSBjaGFyYWN0ZXIgZm9yIHRoaXMgYXJyYXlcclxuICBsZXQgaW5kZXggPSBub2RlLnN0YXJ0X21hcmsucG9pbnRlciArIG9mZnNldDtcclxuICB3aGlsZSAoaW5kZXggPiAwICYmIHlhbWxbaW5kZXhdICE9PSBEQVNIKSB7XHJcbiAgICBpbmRleC0tO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGluZGV4ICsgMikgK1xyXG4gICAgICBpbmRlbnRlZFZhbHVlLnN1YnN0cihub2RlLnN0YXJ0X21hcmsuY29sdW1uKSArXHJcbiAgICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIgKyBvZmZzZXQpO1xyXG59XHJcblxyXG4vKlxyXG4gKiBHZXRzIGVuZCBtYXJrIG9mIGFuIEFTVFxyXG4gKlxyXG4gKiBAcGFyYW0ge05vZGV9IGFzdFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7TWFya31cclxuKi9cclxuZnVuY3Rpb24gZ2V0Tm9kZUVuZE1hcmsoYXN0KSB7XHJcbiAgaWYgKGlzQXJyYXkoYXN0LnZhbHVlKSAmJiBhc3QudmFsdWUubGVuZ3RoKSB7XHJcbiAgICBsZXQgbGFzdEl0ZW0gPSBsYXN0KGFzdC52YWx1ZSk7XHJcblxyXG4gICAgaWYgKGlzQXJyYXkobGFzdEl0ZW0pICYmIGxhc3RJdGVtLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4gZ2V0Tm9kZUVuZE1hcmsobGFzdChsYXN0SXRlbSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnZXROb2RlRW5kTWFyayhsYXN0SXRlbSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXN0LmVuZF9tYXJrO1xyXG59XHJcblxyXG4vKlxyXG4gKiBJbmRlbnRzIGEgc3RyaW5nIHdpdGggbnVtYmVyIG9mIGNoYXJhY3RlcnNcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGRlcHRoIC0gY2FuIGJlIG5lZ2F0aXZlIGFsc29cclxuICpcclxuICogQHJldHVybnMge3N0cmluZ31cclxuKi9cclxuZnVuY3Rpb24gaW5kZW50KHN0ciwgZGVwdGgpIHtcclxuICByZXR1cm4gc3RyXHJcbiAgICAuc3BsaXQoRU9MKVxyXG4gICAgLmZpbHRlcihsaW5lID0+IGxpbmUpXHJcbiAgICAubWFwKGxpbmUgPT4gcmVwZWF0KFNQQUNFLCBkZXB0aCkgKyBsaW5lKVxyXG4gICAgLmpvaW4oRU9MKTtcclxufVxyXG5cclxuLypcclxuICogRHVtcCBhIHZhbHVlIHRvIFlBTUwgc3Rpbmcgd2l0aG91dCB0aGUgdHJhaWxpbmcgbmV3IGxpbmVcclxuICpcclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqXHJcbiovXHJcbmZ1bmN0aW9uIGNsZWFuRHVtcCh2YWx1ZSkge1xyXG4gIGxldCB5YW1sID0gZHVtcCh2YWx1ZSkucmVwbGFjZSgvXFxuJC8sICcnKTtcclxuXHJcbiAgaWYgKEVPTCAhPT0gJ1xcbicpIHtcclxuICAgIHlhbWwgPSB5YW1sLnJlcGxhY2UoL1xcbi9nLCBFT0wpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHlhbWw7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEdldHMgcmVtYXJrIG9mIGFuIEFTVFxyXG4gKlxyXG4gKiBAcGFyYW0ge05vZGV9IGFzdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxyXG4gKlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4qL1xyXG5mdW5jdGlvbiBnZXROb2RlUmVtYXJrKGFzdCwgeWFtbCkge1xyXG4gIGxldCBpbmRleCA9IGdldE5vZGVFbmRNYXJrKGFzdCkucG9pbnRlcjtcclxuICB3aGlsZSAoaW5kZXggPCB5YW1sLmxlbmd0aCAmJiB5YW1sW2luZGV4XSAhPT0gJyMnICYmIHlhbWxbaW5kZXhdICE9PSBFT0wpIHtcclxuICAgICsraW5kZXg7XHJcbiAgfVxyXG5cclxuICBpZiAoRU9MID09PSB5YW1sW2luZGV4XSB8fCBpbmRleCA9PT0geWFtbC5sZW5ndGgpIHtcclxuICAgIHJldHVybiAnJztcclxuICB9IGVsc2Uge1xyXG4gICAgd2hpbGUgKGluZGV4IDwgeWFtbC5sZW5ndGggJiYgKHlhbWxbaW5kZXhdID09PSAnIycgfHwgeWFtbFtpbmRleF0gPT09ICcgJykpIHtcclxuICAgICAgKytpbmRleDtcclxuICAgIH1cclxuICAgIGxldCBlbmQgPSBpbmRleDtcclxuICAgIHdoaWxlIChlbmQgPCB5YW1sLmxlbmd0aCAmJiB5YW1sW2VuZF0gIT09IEVPTCkge1xyXG4gICAgICArK2VuZDtcclxuICAgIH1cclxuICAgIHJldHVybiB5YW1sLnN1YnN0cmluZyhpbmRleCwgZW5kKTtcclxuICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqIFNldHMgcmVtYXJrIG9mIGFuIEFTVFxyXG4gKlxyXG4gKiBAcGFyYW0ge05vZGV9IGFzdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVtYXJrXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB5YW1sXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4qL1xyXG5mdW5jdGlvbiBzZXROb2RlUmVtYXJrKGFzdCwgcmVtYXJrLCB5YW1sKSB7XHJcbiAgbGV0IGluZGV4ID0gZ2V0Tm9kZUVuZE1hcmsoYXN0KS5wb2ludGVyO1xyXG4gIHdoaWxlIChpbmRleCA8IHlhbWwubGVuZ3RoICYmIHlhbWxbaW5kZXhdICE9PSAnIycgJiYgeWFtbFtpbmRleF0gIT09IEVPTCkge1xyXG4gICAgKytpbmRleDtcclxuICB9XHJcblxyXG4gIGlmIChFT0wgPT09IHlhbWxbaW5kZXhdIHx8IGluZGV4ID09PSB5YW1sLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGluZGV4KSArICcgIyAnICsgcmVtYXJrICtcclxuICAgICAgICB5YW1sLnN1YnN0cmluZyhpbmRleCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdoaWxlIChpbmRleCA8IHlhbWwubGVuZ3RoICYmICh5YW1sW2luZGV4XSA9PT0gJyMnIHx8IHlhbWxbaW5kZXhdID09PSAnICcpKSB7XHJcbiAgICAgICsraW5kZXg7XHJcbiAgICB9XHJcbiAgICBsZXQgZW5kID0gaW5kZXg7XHJcbiAgICB3aGlsZSAoZW5kIDwgeWFtbC5sZW5ndGggJiYgeWFtbFtlbmRdICE9PSBFT0wpIHtcclxuICAgICAgKytlbmQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4geWFtbC5zdWJzdHIoMCwgaW5kZXgpICsgcmVtYXJrICtcclxuICAgICAgICB5YW1sLnN1YnN0cmluZyhlbmQpO1xyXG4gIH1cclxufVxyXG5cclxuLypcclxuICogR2V0cyBub2RlIG9mIGFuIEFTVCB3aGljaCBwYXRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7Tm9kZX0gYXN0XHJcbiAqIEBwYXJhbSB7YXJyYXl9IHBhdGhcclxuICpcclxuICogQHJldHVybnMge05vZGV9XHJcbiovXHJcbmZ1bmN0aW9uIGdldE5vZGUoYXN0LCBwYXRoKSB7XHJcbiAgaWYgKHBhdGgubGVuZ3RoKSB7XHJcbiAgICBpZiAoYXN0LnRhZyA9PT0gTUFQX1RBRykge1xyXG4gICAgICBsZXQgdmFsdWUgPSBhc3QudmFsdWU7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBsZXQgW2tleU5vZGUsIHZhbE5vZGVdID0gdmFsdWVbaV07XHJcbiAgICAgICAgaWYgKHBhdGhbMF0gPT09IGtleU5vZGUudmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybiBnZXROb2RlKHZhbE5vZGUsIHBhdGguc2xpY2UoMSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfSBlbHNlIGlmIChhc3QudGFnID09PSBTRVFfVEFHKSB7XHJcbiAgICAgIHJldHVybiBhc3QudmFsdWVbcGF0aFswXV0gJiYgZ2V0Tm9kZShhc3QudmFsdWVbcGF0aFswXV0sIHBhdGguc2xpY2UoMSkpO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gYXN0O1xyXG59XHJcbiJdfQ==
