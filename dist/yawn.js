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
      if ((0, _lodash.includes)([NULL_TAG, STR_TAG, INT_TAG, FLOAT_TAG], ast.tag)) {
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
  var min = Math.min(values.length, newJson.length);

  if (values.length > min) {
    for (var i = values.length - 1; i >= min; --i) {
      yaml = removeArrayElement(ast.value[i], yaml);
    }
  } else if (newJson.length > min) {
    yaml = insertAfterNode(ast, cleanDump(newJson.slice(min)), yaml);
  }

  for (var i = min - 1; i >= 0; --i) {
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
 * @param value {string}
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
 * @param value {string}
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
 * @param value {string}
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
  var index = node.start_mark.pointer - node.start_mark.column - 1;

  return yaml.substr(0, index) + yaml.substring(getNodeEndMark(node).pointer);
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
  var indentedValue = indent(value, node.start_mark.column);

  // find index of DASH(`-`) character for this array
  var index = node.start_mark.pointer;
  while (index > 0 && yaml[index] !== DASH) {
    index--;
  }

  return yaml.substr(0, index + 2) + indentedValue.substr(node.start_mark.column) + yaml.substring(getNodeEndMark(node).pointer);
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

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvb3MtYnJvd3NlcmlmeS9icm93c2VyLmpzIiwic3JjL2Vycm9yLmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7O0lBRVEsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixPQUFPLEVBQUU7MEJBREYsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCLE9BQU8sRUFBRTtBQUNmLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0dBQ3pCOztTQUxrQixTQUFTO0dBQVMsS0FBSzs7cUJBQXZCLFNBQVM7Ozs7QUNGOUIsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O2tCQUVPLElBQUk7O3NCQUNTLFNBQVM7O3NCQUNqQixTQUFTOztzQkFhM0IsUUFBUTs7dUJBRU8sWUFBWTs7OztBQUVsQyxJQUFNLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQztBQUMxQyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQzs7QUFFeEMsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQzs7O0lBR0ksSUFBSTtBQUVaLFdBRlEsSUFBSSxDQUVYLEdBQUcsRUFBRTswQkFGRSxJQUFJOztBQUdyQixRQUFJLENBQUMsc0JBQVMsR0FBRyxDQUFDLEVBQUU7QUFDbEIsWUFBTSxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQy9DOztBQUVELFFBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0dBQ2pCOzs7Ozs7Ozs7O2VBUmtCLElBQUk7O1dBa0ZmLG9CQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2xCOzs7V0FFSyxrQkFBRztBQUNQLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUNsQjs7O1dBRVEsbUJBQUMsSUFBSSxFQUFFO0FBQ2QsVUFBTSxHQUFHLEdBQUcscUJBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsVUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsQyxhQUFPLElBQUksSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQzs7O1dBRVEsbUJBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUN0QixVQUFNLEdBQUcsR0FBRyxxQkFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixVQUFJLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2xDLGFBQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUEsQUFBQyxDQUFDO0tBQ3pFOzs7U0E1Rk8sZUFBRztBQUNULGFBQU8sa0JBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hCO1NBRU8sYUFBQyxPQUFPLEVBQUU7OztBQUdoQixVQUFJLHFCQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUU7QUFDL0IsZUFBTztPQUNSOztBQUVELFVBQU0sR0FBRyxHQUFHLHFCQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFL0IsVUFBSSx5QkFBWSxPQUFPLENBQUMsRUFBRTtBQUN4QixZQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLGVBQU87T0FDUjs7Ozs7QUFLRCxVQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTdCLFVBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxNQUFNLEVBQUU7QUFDdEIsWUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7O0FBSWpDLFlBQUksQ0FBQyxzQkFBUyxPQUFPLENBQUMsRUFBRTtBQUN0QixjQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7U0FHdkQsTUFBTTtBQUNMLGdCQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUNsRDs7QUFFRCxlQUFPO09BQ1I7Ozs7O0FBS0QsVUFBSSxzQkFBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUM5RCxZQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV0RCxlQUFPO09BQ1I7Ozs7O0FBTUQsVUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLE9BQU8sRUFBRTtBQUN2QixZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDOztBQUVyQixZQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEQ7Ozs7O0FBS0QsVUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLE9BQU8sRUFBRTtBQUN2QixZQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNoRDs7O0FBR0QsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUNsQixLQUFLLFNBQUssQ0FDVixHQUFHLENBQUMsVUFBQSxJQUFJO2VBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO09BQUEsQ0FBQyxDQUN2QyxJQUFJLFNBQUssQ0FBQztLQUNkOzs7U0FoRmtCLElBQUk7OztxQkFBSixJQUFJO0FBZ0h6QixTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDcEIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDOztBQUVmLE1BQUkscUJBQVEsSUFBSSxDQUFDLEVBQUU7QUFDakIsT0FBRyxHQUFHLE9BQU8sQ0FBQztHQUNmLE1BQU0sSUFBSSxzQkFBUyxJQUFJLENBQUMsRUFBRTtBQUN6QixPQUFHLEdBQUcsT0FBTyxDQUFDO0dBQ2YsTUFBTSxJQUFJLG9CQUFPLElBQUksQ0FBQyxFQUFFO0FBQ3ZCLE9BQUcsR0FBRyxRQUFRLENBQUM7R0FDaEIsTUFBTSxJQUFJLHNCQUFTLElBQUksQ0FBQyxFQUFFO0FBQ3pCLFFBQUksSUFBSSxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDbkIsU0FBRyxHQUFHLE9BQU8sQ0FBQztLQUNmLE1BQU07QUFDTCxTQUFHLEdBQUcsU0FBUyxDQUFDO0tBQ2pCO0dBQ0YsTUFBTSxJQUFJLHNCQUFTLElBQUksQ0FBQyxFQUFFO0FBQ3pCLE9BQUcsR0FBRyxPQUFPLENBQUM7R0FDZixNQUFNO0FBQ0wsVUFBTSx5QkFBYyxjQUFjLENBQUMsQ0FBQztHQUNyQztBQUNELFNBQU8sR0FBRyxDQUFDO0NBQ1o7Ozs7Ozs7Ozs7OztBQVlELFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQ3JDLE1BQUksTUFBTSxHQUFHLGtCQUFLLHVCQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEMsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsTUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtBQUN2QixTQUFLLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDN0MsVUFBSSxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDL0M7R0FDRixNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7QUFDL0IsUUFBSSxHQUFHLGVBQWUsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztHQUNsRTs7QUFFRCxPQUFLLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUNqQyxRQUFJLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDdEU7O0FBRUQsU0FBTyxJQUFJLENBQUM7Q0FDYjs7Ozs7Ozs7Ozs7O0FBWUQsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFOzs7QUFHM0Msb0JBQUssR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFBLElBQUksRUFBSTsrQkFDRyxJQUFJOztRQUF4QixPQUFPO1FBQUUsT0FBTzs7O0FBR3JCLFFBQUkseUJBQVksT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFOzs7QUFHdkMsVUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQy9DLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xELGFBQU87S0FDUjs7QUFFRCxRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLFFBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUd0QyxRQUFJLFFBQVEsS0FBSyxLQUFLLElBQUksQ0FBQyxxQkFBUSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7OztBQUdqRCxVQUFJLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQzs7OztBQUlqRCxhQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDL0I7OztBQUdELFFBQUksQ0FBQyxxQkFBUSxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUkscUJBQVEsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFOzs7QUFHdkQsVUFBSSxxQkFBUSxRQUFRLENBQUMsRUFBRTs7O0FBR3JCLFlBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQzs7O09BRzNDLE1BQU07OztBQUdMLGNBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRWpELGFBQUcsR0FBRyxxQkFBUSxJQUFJLENBQUMsQ0FBQzs7OztBQUlwQixpQkFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO0tBQ0Y7R0FDRixDQUFDLENBQUM7OztBQUdILG9CQUFLLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBRSxHQUFHLEVBQUk7OztBQUczQixRQUFJLHlCQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzFCLFVBQUksUUFBUSxHQUFHLFNBQVMscUJBQUcsR0FBRyxFQUFHLEtBQUssRUFBRSxDQUFDOztBQUV6QyxVQUFJLEdBQUcsZUFBZSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDN0M7R0FDRixDQUFDLENBQUM7O0FBRUgsU0FBTyxJQUFJLENBQUM7Q0FDYjs7Ozs7Ozs7Ozs7QUFXRCxTQUFTLGdCQUFnQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQzNDLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FDNUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUNiLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUN6Qzs7Ozs7Ozs7Ozs7QUFXRCxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN0QyxNQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUQsTUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7O0FBRWpFLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQzlCLGFBQWEsR0FDYixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNoRDs7Ozs7Ozs7Ozs7QUFXRCxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUMxQyxNQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTFELFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUM5QyxHQUNILGFBQWEsR0FDYixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNoRDs7Ozs7Ozs7OztBQVVELFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUN0QyxNQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7O0FBRWpFLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ2xEOzs7Ozs7Ozs7OztBQVdELFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDN0MsTUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7QUFHMUQsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7QUFDcEMsU0FBTyxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDeEMsU0FBSyxFQUFFLENBQUM7R0FDVDs7QUFFRCxTQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsR0FDNUIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUNsRDs7Ozs7Ozs7O0FBU0QsU0FBUyxjQUFjOzs7NEJBQU07UUFBTCxHQUFHOzs7QUFDekIsUUFBSSxxQkFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDMUMsVUFBSSxRQUFRLEdBQUcsa0JBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQixVQUFJLHFCQUFRLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7YUFDbEIsa0JBQUssUUFBUSxDQUFDOztBQUhsQyxnQkFBUTs7T0FJWDs7V0FFcUIsUUFBUTs7QUFOMUIsY0FBUTs7S0FPYjs7QUFFRCxXQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUM7R0FDckI7Q0FBQTs7Ozs7Ozs7OztBQVVELFNBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDMUIsU0FBTyxHQUFHLENBQ1AsS0FBSyxTQUFLLENBQ1YsTUFBTSxDQUFDLFVBQUEsSUFBSTtXQUFJLElBQUk7R0FBQSxDQUFDLENBQ3BCLEdBQUcsQ0FBQyxVQUFBLElBQUk7V0FBSSxvQkFBTyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSTtHQUFBLENBQUMsQ0FDeEMsSUFBSSxTQUFLLENBQUM7Q0FDZDs7Ozs7Ozs7OztBQVVELFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtBQUN4QixNQUFJLElBQUksR0FBRyxrQkFBSyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUUxQyxNQUFJLFlBQVEsSUFBSSxFQUFFO0FBQ2hCLFFBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssVUFBTSxDQUFDO0dBQ2pDOztBQUVELFNBQU8sSUFBSSxDQUFDO0NBQ2I7Ozs7Ozs7Ozs7QUFVRCxTQUFTLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ2hDLE1BQUksS0FBSyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDeEMsU0FBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBUSxFQUFFO0FBQ3hFLE1BQUUsS0FBSyxDQUFDO0dBQ1Q7O0FBRUQsTUFBSSxZQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNoRCxXQUFPLEVBQUUsQ0FBQztHQUNYLE1BQU07QUFDTCxXQUFPLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQSxBQUFDLEVBQUU7QUFDMUUsUUFBRSxLQUFLLENBQUM7S0FDVDtBQUNELFFBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNoQixXQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBUSxFQUFFO0FBQzdDLFFBQUUsR0FBRyxDQUFDO0tBQ1A7QUFDRCxXQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0dBQ25DO0NBQ0Y7Ozs7Ozs7Ozs7O0FBV0QsU0FBUyxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDeEMsTUFBSSxLQUFLLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUN4QyxTQUFPLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFRLEVBQUU7QUFDeEUsTUFBRSxLQUFLLENBQUM7R0FDVDs7QUFFRCxNQUFJLFlBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2hELFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU0sR0FDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMzQixNQUFNO0FBQ0wsV0FBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUEsQUFBQyxFQUFFO0FBQzFFLFFBQUUsS0FBSyxDQUFDO0tBQ1Q7QUFDRCxRQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDaEIsV0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVEsRUFBRTtBQUM3QyxRQUFFLEdBQUcsQ0FBQztLQUNQO0FBQ0QsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLEdBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDekI7Q0FDRjs7Ozs7Ozs7OztBQVVELFNBQVMsT0FBTzs7Ozs7OEJBQVk7UUFBWCxHQUFHO1FBQUUsSUFBSTs7O0FBQ3hCLFFBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFVBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxPQUFPLEVBQUU7QUFDdkIsWUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUN0QixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTt3Q0FDWixLQUFLLENBQUMsQ0FBQyxDQUFDOztjQUE1QixPQUFPO2NBQUUsT0FBTzs7QUFDckIsY0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLEtBQUssRUFBRTtrQkFDZCxPQUFPO2tCQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUpyQyxpQkFBSyxHQUNBLENBQUMsY0FDSCxPQUFPLEdBQUUsT0FBTzs7V0FHcEI7U0FDRjtBQUNELGVBQU8sU0FBUyxDQUFDO09BQ2xCLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLE9BQU8sRUFBRTtzQkFDdkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Y0FBWSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQVRsRSxhQUFLLEdBQ0EsQ0FBQyxjQUNILE9BQU8sR0FBRSxPQUFPOztPQVF4QjtLQUNGO0FBQ0QsV0FBTyxHQUFHLENBQUM7R0FDWjtDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMuZW5kaWFubmVzcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdMRScgfTtcblxuZXhwb3J0cy5ob3N0bmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gbG9jYXRpb24uaG9zdG5hbWVcbiAgICB9XG4gICAgZWxzZSByZXR1cm4gJyc7XG59O1xuXG5leHBvcnRzLmxvYWRhdmcgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXSB9O1xuXG5leHBvcnRzLnVwdGltZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDAgfTtcblxuZXhwb3J0cy5mcmVlbWVtID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBOdW1iZXIuTUFYX1ZBTFVFO1xufTtcblxuZXhwb3J0cy50b3RhbG1lbSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTnVtYmVyLk1BWF9WQUxVRTtcbn07XG5cbmV4cG9ydHMuY3B1cyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdIH07XG5cbmV4cG9ydHMudHlwZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdCcm93c2VyJyB9O1xuXG5leHBvcnRzLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IuYXBwVmVyc2lvbjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufTtcblxuZXhwb3J0cy5uZXR3b3JrSW50ZXJmYWNlc1xuPSBleHBvcnRzLmdldE5ldHdvcmtJbnRlcmZhY2VzXG49IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHt9IH07XG5cbmV4cG9ydHMuYXJjaCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdqYXZhc2NyaXB0JyB9O1xuXG5leHBvcnRzLnBsYXRmb3JtID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ2Jyb3dzZXInIH07XG5cbmV4cG9ydHMudG1wZGlyID0gZXhwb3J0cy50bXBEaXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcvdG1wJztcbn07XG5cbmV4cG9ydHMuRU9MID0gJ1xcbic7XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV05FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5uYW1lID0gJ1lBV05FcnJvcic7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHsgRU9MIH0gZnJvbSAnb3MnO1xuaW1wb3J0IHtjb21wb3NlLCBzZXJpYWxpemV9IGZyb20gJ3lhbWwtanMnO1xuaW1wb3J0IHtsb2FkLCBkdW1wfSBmcm9tICdqcy15YW1sJztcbmltcG9ydCB7XG4gIGlzQXJyYXksXG4gIGlzU3RyaW5nLFxuICBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQsXG4gIGlzTnVsbCxcbiAgaXNOdW1iZXIsXG4gIGlzRXF1YWwsXG4gIHJlcGVhdCxcbiAgZWFjaCxcbiAgaW5jbHVkZXMsXG4gIGxhc3Rcbn0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IFlBV05FcnJvciBmcm9tICcuL2Vycm9yLmpzJztcblxuY29uc3QgTlVMTF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6bnVsbCc7XG5jb25zdCBTVFJfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOnN0cic7XG5jb25zdCBJTlRfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOmludCc7XG5jb25zdCBGTE9BVF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnO1xuY29uc3QgTUFQX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjptYXAnO1xuY29uc3QgU0VRX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpzZXEnO1xuXG5jb25zdCBTUEFDRSA9ICcgJztcbmNvbnN0IERBU0ggPSAnLSc7XG5cbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV04ge1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWUFXTiB7XG5cbiAgY29uc3RydWN0b3Ioc3RyKSB7XG4gICAgaWYgKCFpc1N0cmluZyhzdHIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHIgc2hvdWxkIGJlIGEgc3RyaW5nJyk7XG4gICAgfVxuXG4gICAgdGhpcy55YW1sID0gc3RyO1xuICB9XG5cbiAgZ2V0IGpzb24oKSB7XG4gICAgcmV0dXJuIGxvYWQodGhpcy55YW1sKTtcbiAgfVxuXG4gIHNldCBqc29uKG5ld0pzb24pIHtcblxuICAgIC8vIGlmIGpzb24gaXMgbm90IGNoYW5nZWQgZG8gbm90aGluZ1xuICAgIGlmIChpc0VxdWFsKHRoaXMuanNvbiwgbmV3SnNvbikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhc3QgPSBjb21wb3NlKHRoaXMueWFtbCk7XG5cbiAgICBpZiAoaXNVbmRlZmluZWQobmV3SnNvbikpIHtcbiAgICAgIHRoaXMueWFtbCA9ICcnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBjaGVjayBpZiBlbnRpcmUganNvbiBpcyBjaGFuZ2VkXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxldCBuZXdUYWcgPSBnZXRUYWcobmV3SnNvbik7XG5cbiAgICBpZiAoYXN0LnRhZyAhPT0gbmV3VGFnKSB7XG4gICAgICBsZXQgbmV3WWFtbCA9IGNsZWFuRHVtcChuZXdKc29uKTtcblxuICAgICAgLy8gcmVwbGFjZSB0aGlzLnlhbWwgdmFsdWUgZnJvbSBzdGFydCB0byBlbmQgbWFyayB3aXRoIG5ld1lhbWwgaWYgbm9kZSBpc1xuICAgICAgLy8gcHJpbWl0aXZlXG4gICAgICBpZiAoIWlzT2JqZWN0KG5ld0pzb24pKSB7XG4gICAgICAgIHRoaXMueWFtbCA9IHJlcGxhY2VQcmltaXRpdmUoYXN0LCBuZXdZYW1sLCB0aGlzLnlhbWwpO1xuXG4gICAgICAvLyBpZiBub2RlIGlzIG5vdCBwcmltaXRpdmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMueWFtbCA9IHJlcGxhY2VOb2RlKGFzdCwgbmV3WWFtbCwgdGhpcy55YW1sKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBOVUxMX1RBRywgU1RSX1RBRywgSU5UX1RBRywgRkxPQVRfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChpbmNsdWRlcyhbTlVMTF9UQUcsIFNUUl9UQUcsIElOVF9UQUcsIEZMT0FUX1RBR10sIGFzdC50YWcpKSB7XG4gICAgICB0aGlzLnlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKGFzdCwgbmV3SnNvbiwgdGhpcy55YW1sKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIE1BUF9UQUdcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaWYgKGFzdC50YWcgPT09IE1BUF9UQUcpIHtcbiAgICAgIGxldCBqc29uID0gdGhpcy5qc29uO1xuXG4gICAgICB0aGlzLnlhbWwgPSB1cGRhdGVNYXAoYXN0LCBuZXdKc29uLCBqc29uLCB0aGlzLnlhbWwpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTRVFfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChhc3QudGFnID09PSBTRVFfVEFHKSB7XG4gICAgICB0aGlzLnlhbWwgPSB1cGRhdGVTZXEoYXN0LCBuZXdKc29uLCB0aGlzLnlhbWwpO1xuICAgIH1cblxuICAgIC8vIFRyaW0gdHJhaWxpbmcgd2hpdGVzcGFjZXNcbiAgICB0aGlzLnlhbWwgPSB0aGlzLnlhbWxcbiAgICAgIC5zcGxpdChFT0wpXG4gICAgICAubWFwKGxpbmU9PiBsaW5lLnJlcGxhY2UoL1sgXFx0XSskLywgJycpKVxuICAgICAgLmpvaW4oRU9MKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnlhbWw7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMuanNvbjtcbiAgfVxuXG4gIGdldFJlbWFyayhwYXRoKSB7XG4gICAgY29uc3QgYXN0ID0gY29tcG9zZSh0aGlzLnlhbWwpO1xuICAgIGxldCBwYXRobGlzdCA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBsZXQgbm9kZSA9IGdldE5vZGUoYXN0LCBwYXRobGlzdCk7XG4gICAgcmV0dXJuIG5vZGUgJiYgZ2V0Tm9kZVJlbWFyayhub2RlLCB0aGlzLnlhbWwpO1xuICB9XG5cbiAgc2V0UmVtYXJrKHBhdGgsIHJlbWFyaykge1xuICAgIGNvbnN0IGFzdCA9IGNvbXBvc2UodGhpcy55YW1sKTtcbiAgICBsZXQgcGF0aGxpc3QgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgbGV0IG5vZGUgPSBnZXROb2RlKGFzdCwgcGF0aGxpc3QpO1xuICAgIHJldHVybiAhIW5vZGUgJiYgISEodGhpcy55YW1sID0gc2V0Tm9kZVJlbWFyayhub2RlLCByZW1hcmssIHRoaXMueWFtbCkpO1xuICB9XG59XG5cbi8qXG4gKiBEZXRlcm1pbmVzIHRoZSBBU1QgdGFnIG9mIGEgSlNPTiBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge2FueX0gLSBqc29uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqIEB0aHJvd3Mge1lBV05FcnJvcn0gLSBpZiBqc29uIGhhcyB3ZWlyZCB0eXBlXG4qL1xuZnVuY3Rpb24gZ2V0VGFnKGpzb24pIHtcbiAgbGV0IHRhZyA9IG51bGw7XG5cbiAgaWYgKGlzQXJyYXkoanNvbikpIHtcbiAgICB0YWcgPSBTRVFfVEFHO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGpzb24pKSB7XG4gICAgdGFnID0gTUFQX1RBRztcbiAgfSBlbHNlIGlmIChpc051bGwoanNvbikpIHtcbiAgICB0YWcgPSBOVUxMX1RBRztcbiAgfSBlbHNlIGlmIChpc051bWJlcihqc29uKSkge1xuICAgIGlmIChqc29uICUgMTAgPT09IDApIHtcbiAgICAgIHRhZyA9IElOVF9UQUc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhZyA9IEZMT0FUX1RBRztcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNTdHJpbmcoanNvbikpIHtcbiAgICB0YWcgPSBTVFJfVEFHO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBZQVdORXJyb3IoJ1Vua25vd24gdHlwZScpO1xuICB9XG4gIHJldHVybiB0YWc7XG59XG5cbi8qXG4gKiBVcGRhdGUgYSBzZXF1ZW5jZSB3aXRoIG5ldyBKU09OXG4gKlxuICogQHBhcmFtIHtOb2RlfSBhc3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBuZXdKc29uXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKlxuKi9cbmZ1bmN0aW9uIHVwZGF0ZVNlcShhc3QsIG5ld0pzb24sIHlhbWwpIHtcbiAgbGV0IHZhbHVlcyA9IGxvYWQoc2VyaWFsaXplKGFzdCkpO1xuICBsZXQgbWluID0gTWF0aC5taW4odmFsdWVzLmxlbmd0aCwgbmV3SnNvbi5sZW5ndGgpO1xuXG4gIGlmICh2YWx1ZXMubGVuZ3RoID4gbWluKSB7XG4gICAgZm9yIChsZXQgaSA9IHZhbHVlcy5sZW5ndGggLSAxOyBpID49IG1pbjsgLS1pKSB7XG4gICAgICB5YW1sID0gcmVtb3ZlQXJyYXlFbGVtZW50KGFzdC52YWx1ZVtpXSwgeWFtbCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKG5ld0pzb24ubGVuZ3RoID4gbWluKSB7XG4gICAgeWFtbCA9IGluc2VydEFmdGVyTm9kZShhc3QsIGNsZWFuRHVtcChuZXdKc29uLnNsaWNlKG1pbikpLCB5YW1sKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSBtaW4gLSAxOyBpID49IDA7IC0taSkge1xuICAgIHlhbWwgPSBjaGFuZ2VBcnJheUVsZW1lbnQoYXN0LnZhbHVlW2ldLCBjbGVhbkR1bXAobmV3SnNvbltpXSksIHlhbWwpO1xuICB9XG5cbiAgcmV0dXJuIHlhbWw7XG59XG5cbi8qXG4gKiB1cGRhdGUgYSBtYXAgc3RydWN0dXJlIHdpdGggbmV3IHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7QVNUfSBhc3QgLSBhIG1hcCBBU1RcbiAqIEBwYXJhbSB7YW55fSBuZXdKc29uXG4gKiBAcGFyYW0ge2FueX0gLSBqc29uXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAdGhyb3dzIHtZQVdORXJyb3J9IC0gaWYganNvbiBoYXMgd2VpcmQgdHlwZVxuKi9cbmZ1bmN0aW9uIHVwZGF0ZU1hcChhc3QsIG5ld0pzb24sIGpzb24sIHlhbWwpIHtcblxuICAvLyBsb29rIGZvciBjaGFuZ2VzXG4gIGVhY2goYXN0LnZhbHVlLCBwYWlyID0+IHtcbiAgICBsZXQgW2tleU5vZGUsIHZhbE5vZGVdID0gcGFpcjtcblxuICAgIC8vIG5vZGUgaXMgZGVsZXRlZFxuICAgIGlmIChpc1VuZGVmaW5lZChuZXdKc29uW2tleU5vZGUudmFsdWVdKSkge1xuXG4gICAgICAvLyBUT0RPOiBjYW4gd2UgdXNlIG9mIHRoZSBtZXRob2RzIGJlbG93P1xuICAgICAgeWFtbCA9IHlhbWwuc3Vic3RyKDAsIGtleU5vZGUuc3RhcnRfbWFyay5wb2ludGVyKSArXG4gICAgICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKHZhbE5vZGUpLnBvaW50ZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB2YWx1ZSA9IGpzb25ba2V5Tm9kZS52YWx1ZV07XG4gICAgbGV0IG5ld1ZhbHVlID0gbmV3SnNvbltrZXlOb2RlLnZhbHVlXTtcblxuICAgIC8vIHByaW1pdGl2ZSB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUgJiYgIWlzQXJyYXkodmFsTm9kZS52YWx1ZSkpIHtcblxuICAgICAgLy8gcmVwbGFjZSB0aGUgdmFsdWUgbm9kZVxuICAgICAgeWFtbCA9IHJlcGxhY2VQcmltaXRpdmUodmFsTm9kZSwgbmV3VmFsdWUsIHlhbWwpO1xuXG4gICAgICAvLyByZW1vdmUgdGhlIGtleS92YWx1ZSBmcm9tIG5ld0pzb24gc28gaXQncyBub3QgZGV0ZWN0ZWQgYXMgbmV3IHBhaXIgaW5cbiAgICAgIC8vIGxhdGVyIGNvZGVcbiAgICAgIGRlbGV0ZSBuZXdKc29uW2tleU5vZGUudmFsdWVdO1xuICAgIH1cblxuICAgIC8vIG5vbiBwcmltaXRpdmUgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICBpZiAoIWlzRXF1YWwobmV3VmFsdWUsIHZhbHVlKSAmJiBpc0FycmF5KHZhbE5vZGUudmFsdWUpKSB7XG5cbiAgICAgIC8vIGFycmF5IHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICBpZiAoaXNBcnJheShuZXdWYWx1ZSkpIHtcblxuICAgICAgICAvLyByZWN1cnNlXG4gICAgICAgIHlhbWwgPSB1cGRhdGVTZXEodmFsTm9kZSwgbmV3VmFsdWUsIHlhbWwpO1xuXG4gICAgICAvLyBtYXAgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy8gcmVjdXJzZVxuICAgICAgICB5YW1sID0gdXBkYXRlTWFwKHZhbE5vZGUsIG5ld1ZhbHVlLCB2YWx1ZSwgeWFtbCk7XG5cbiAgICAgICAgYXN0ID0gY29tcG9zZSh5YW1sKTtcblxuICAgICAgICAvLyByZW1vdmUgdGhlIGtleS92YWx1ZSBmcm9tIG5ld0pzb24gc28gaXQncyBub3QgZGV0ZWN0ZWQgYXMgbmV3IHBhaXIgaW5cbiAgICAgICAgLy8gbGF0ZXIgY29kZVxuICAgICAgICBkZWxldGUgbmV3SnNvbltrZXlOb2RlLnZhbHVlXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIGxvb2sgZm9yIG5ldyBpdGVtcyB0byBhZGRcbiAgZWFjaChuZXdKc29uLCAodmFsdWUsIGtleSk9PiB7XG5cbiAgICAvLyBpdGVtIGlzIG5ld1xuICAgIGlmIChpc1VuZGVmaW5lZChqc29uW2tleV0pKSB7XG4gICAgICBsZXQgbmV3VmFsdWUgPSBjbGVhbkR1bXAoe1trZXldOiB2YWx1ZX0pO1xuXG4gICAgICB5YW1sID0gaW5zZXJ0QWZ0ZXJOb2RlKGFzdCwgbmV3VmFsdWUsIHlhbWwpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHlhbWw7XG59XG5cbi8qXG4gKiBQbGFjZSB2YWx1ZSBpbiBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXG4gKlxuICogQHBhcmFtIG5vZGUge05vZGV9XG4gKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cbiAqIEBwYXJhbSB5YW1sIHtzdHJpbmd9XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiByZXBsYWNlUHJpbWl0aXZlKG5vZGUsIHZhbHVlLCB5YW1sKSB7XG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBub2RlLnN0YXJ0X21hcmsucG9pbnRlcikgK1xuICAgIFN0cmluZyh2YWx1ZSkgK1xuICAgIHlhbWwuc3Vic3RyaW5nKG5vZGUuZW5kX21hcmsucG9pbnRlcik7XG59XG5cbi8qXG4gKiBQbGFjZSB2YWx1ZSBpbiBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXG4gKlxuICogQHBhcmFtIG5vZGUge05vZGV9XG4gKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cbiAqIEBwYXJhbSB5YW1sIHtzdHJpbmd9XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiByZXBsYWNlTm9kZShub2RlLCB2YWx1ZSwgeWFtbCkge1xuICBsZXQgaW5kZW50ZWRWYWx1ZSA9IGluZGVudCh2YWx1ZSwgbm9kZS5zdGFydF9tYXJrLmNvbHVtbik7XG4gIGxldCBsaW5lU3RhcnQgPSBub2RlLnN0YXJ0X21hcmsucG9pbnRlciAtIG5vZGUuc3RhcnRfbWFyay5jb2x1bW47XG5cbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGxpbmVTdGFydCkgK1xuICAgIGluZGVudGVkVmFsdWUgK1xuICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIpO1xufVxuXG4vKlxuICogUGxhY2UgdmFsdWUgYWZ0ZXIgbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xuICpcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxuICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gKiBAcGFyYW0geWFtbCB7c3RyaW5nfVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gaW5zZXJ0QWZ0ZXJOb2RlKG5vZGUsIHZhbHVlLCB5YW1sKSB7XG4gIGxldCBpbmRlbnRlZFZhbHVlID0gaW5kZW50KHZhbHVlLCBub2RlLnN0YXJ0X21hcmsuY29sdW1uKTtcblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcikgK1xuICAgIEVPTCArXG4gICAgaW5kZW50ZWRWYWx1ZSArXG4gICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcik7XG59XG5cbi8qXG4gKiBSZW1vdmVzIGEgbm9kZSBmcm9tIGFycmF5XG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVtb3ZlQXJyYXlFbGVtZW50KG5vZGUsIHlhbWwpIHtcbiAgbGV0IGluZGV4ID0gbm9kZS5zdGFydF9tYXJrLnBvaW50ZXIgLSBub2RlLnN0YXJ0X21hcmsuY29sdW1uIC0gMTtcblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgaW5kZXgpICtcbiAgICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIpO1xufVxuXG4vKlxuICogQ2hhbmdlcyBhIG5vZGUgZnJvbSBhcnJheVxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gY2hhbmdlQXJyYXlFbGVtZW50KG5vZGUsIHZhbHVlLCB5YW1sKSB7XG4gIGxldCBpbmRlbnRlZFZhbHVlID0gaW5kZW50KHZhbHVlLCBub2RlLnN0YXJ0X21hcmsuY29sdW1uKTtcblxuICAvLyBmaW5kIGluZGV4IG9mIERBU0goYC1gKSBjaGFyYWN0ZXIgZm9yIHRoaXMgYXJyYXlcbiAgbGV0IGluZGV4ID0gbm9kZS5zdGFydF9tYXJrLnBvaW50ZXI7XG4gIHdoaWxlIChpbmRleCA+IDAgJiYgeWFtbFtpbmRleF0gIT09IERBU0gpIHtcbiAgICBpbmRleC0tO1xuICB9XG5cbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGluZGV4ICsgMikgK1xuICAgICAgaW5kZW50ZWRWYWx1ZS5zdWJzdHIobm9kZS5zdGFydF9tYXJrLmNvbHVtbikgK1xuICAgICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcik7XG59XG5cbi8qXG4gKiBHZXRzIGVuZCBtYXJrIG9mIGFuIEFTVFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gYXN0XG4gKlxuICogQHJldHVybnMge01hcmt9XG4qL1xuZnVuY3Rpb24gZ2V0Tm9kZUVuZE1hcmsoYXN0KSB7XG4gIGlmIChpc0FycmF5KGFzdC52YWx1ZSkgJiYgYXN0LnZhbHVlLmxlbmd0aCkge1xuICAgIGxldCBsYXN0SXRlbSA9IGxhc3QoYXN0LnZhbHVlKTtcblxuICAgIGlmIChpc0FycmF5KGxhc3RJdGVtKSAmJiBsYXN0SXRlbS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBnZXROb2RlRW5kTWFyayhsYXN0KGxhc3RJdGVtKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldE5vZGVFbmRNYXJrKGxhc3RJdGVtKTtcbiAgfVxuXG4gIHJldHVybiBhc3QuZW5kX21hcms7XG59XG5cbi8qXG4gKiBJbmRlbnRzIGEgc3RyaW5nIHdpdGggbnVtYmVyIG9mIGNoYXJhY3RlcnNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge2ludGVnZXJ9IGRlcHRoIC0gY2FuIGJlIG5lZ2F0aXZlIGFsc29cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGluZGVudChzdHIsIGRlcHRoKSB7XG4gIHJldHVybiBzdHJcbiAgICAuc3BsaXQoRU9MKVxuICAgIC5maWx0ZXIobGluZSA9PiBsaW5lKVxuICAgIC5tYXAobGluZSA9PiByZXBlYXQoU1BBQ0UsIGRlcHRoKSArIGxpbmUpXG4gICAgLmpvaW4oRU9MKTtcbn1cblxuLypcbiAqIER1bXAgYSB2YWx1ZSB0byBZQU1MIHN0aW5nIHdpdGhvdXQgdGhlIHRyYWlsaW5nIG5ldyBsaW5lXG4gKlxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqXG4qL1xuZnVuY3Rpb24gY2xlYW5EdW1wKHZhbHVlKSB7XG4gIGxldCB5YW1sID0gZHVtcCh2YWx1ZSkucmVwbGFjZSgvXFxuJC8sICcnKTtcblxuICBpZiAoRU9MICE9PSAnXFxuJykge1xuICAgIHlhbWwgPSB5YW1sLnJlcGxhY2UoL1xcbi9nLCBFT0wpO1xuICB9XG5cbiAgcmV0dXJuIHlhbWw7XG59XG5cbi8qXG4gKiBHZXRzIHJlbWFyayBvZiBhbiBBU1RcbiAqXG4gKiBAcGFyYW0ge05vZGV9IGFzdFxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGdldE5vZGVSZW1hcmsoYXN0LCB5YW1sKSB7XG4gIGxldCBpbmRleCA9IGdldE5vZGVFbmRNYXJrKGFzdCkucG9pbnRlcjtcbiAgd2hpbGUgKGluZGV4IDwgeWFtbC5sZW5ndGggJiYgeWFtbFtpbmRleF0gIT09ICcjJyAmJiB5YW1sW2luZGV4XSAhPT0gRU9MKSB7XG4gICAgKytpbmRleDtcbiAgfVxuXG4gIGlmIChFT0wgPT09IHlhbWxbaW5kZXhdIHx8IGluZGV4ID09PSB5YW1sLmxlbmd0aCkge1xuICAgIHJldHVybiAnJztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoaW5kZXggPCB5YW1sLmxlbmd0aCAmJiAoeWFtbFtpbmRleF0gPT09ICcjJyB8fCB5YW1sW2luZGV4XSA9PT0gJyAnKSkge1xuICAgICAgKytpbmRleDtcbiAgICB9XG4gICAgbGV0IGVuZCA9IGluZGV4O1xuICAgIHdoaWxlIChlbmQgPCB5YW1sLmxlbmd0aCAmJiB5YW1sW2VuZF0gIT09IEVPTCkge1xuICAgICAgKytlbmQ7XG4gICAgfVxuICAgIHJldHVybiB5YW1sLnN1YnN0cmluZyhpbmRleCwgZW5kKTtcbiAgfVxufVxuXG4vKlxuICogU2V0cyByZW1hcmsgb2YgYW4gQVNUXG4gKlxuICogQHBhcmFtIHtOb2RlfSBhc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSByZW1hcmtcbiAqIEBwYXJhbSB7c3RyaW5nfSB5YW1sXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4qL1xuZnVuY3Rpb24gc2V0Tm9kZVJlbWFyayhhc3QsIHJlbWFyaywgeWFtbCkge1xuICBsZXQgaW5kZXggPSBnZXROb2RlRW5kTWFyayhhc3QpLnBvaW50ZXI7XG4gIHdoaWxlIChpbmRleCA8IHlhbWwubGVuZ3RoICYmIHlhbWxbaW5kZXhdICE9PSAnIycgJiYgeWFtbFtpbmRleF0gIT09IEVPTCkge1xuICAgICsraW5kZXg7XG4gIH1cblxuICBpZiAoRU9MID09PSB5YW1sW2luZGV4XSB8fCBpbmRleCA9PT0geWFtbC5sZW5ndGgpIHtcbiAgICByZXR1cm4geWFtbC5zdWJzdHIoMCwgaW5kZXgpICsgJyAjICcgKyByZW1hcmsgK1xuICAgICAgICB5YW1sLnN1YnN0cmluZyhpbmRleCk7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKGluZGV4IDwgeWFtbC5sZW5ndGggJiYgKHlhbWxbaW5kZXhdID09PSAnIycgfHwgeWFtbFtpbmRleF0gPT09ICcgJykpIHtcbiAgICAgICsraW5kZXg7XG4gICAgfVxuICAgIGxldCBlbmQgPSBpbmRleDtcbiAgICB3aGlsZSAoZW5kIDwgeWFtbC5sZW5ndGggJiYgeWFtbFtlbmRdICE9PSBFT0wpIHtcbiAgICAgICsrZW5kO1xuICAgIH1cbiAgICByZXR1cm4geWFtbC5zdWJzdHIoMCwgaW5kZXgpICsgcmVtYXJrICtcbiAgICAgICAgeWFtbC5zdWJzdHJpbmcoZW5kKTtcbiAgfVxufVxuXG4vKlxuICogR2V0cyBub2RlIG9mIGFuIEFTVCB3aGljaCBwYXRoXG4gKlxuICogQHBhcmFtIHtOb2RlfSBhc3RcbiAqIEBwYXJhbSB7YXJyYXl9IHBhdGhcbiAqXG4gKiBAcmV0dXJucyB7Tm9kZX1cbiovXG5mdW5jdGlvbiBnZXROb2RlKGFzdCwgcGF0aCkge1xuICBpZiAocGF0aC5sZW5ndGgpIHtcbiAgICBpZiAoYXN0LnRhZyA9PT0gTUFQX1RBRykge1xuICAgICAgbGV0IHZhbHVlID0gYXN0LnZhbHVlO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7ICsraSkge1xuICAgICAgICBsZXQgW2tleU5vZGUsIHZhbE5vZGVdID0gdmFsdWVbaV07XG4gICAgICAgIGlmIChwYXRoWzBdID09PSBrZXlOb2RlLnZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGdldE5vZGUodmFsTm9kZSwgcGF0aC5zbGljZSgxKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmIChhc3QudGFnID09PSBTRVFfVEFHKSB7XG4gICAgICByZXR1cm4gYXN0LnZhbHVlW3BhdGhbMF1dICYmIGdldE5vZGUoYXN0LnZhbHVlW3BhdGhbMF1dLCBwYXRoLnNsaWNlKDEpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFzdDtcbn1cbiJdfQ==
