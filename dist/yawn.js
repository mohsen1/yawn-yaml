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
module.exports = exports['default'];

},{"./error.js":2,"os":1}]},{},[3])(3)
});

//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvb3MtYnJvd3NlcmlmeS9icm93c2VyLmpzIiwic3JjL2Vycm9yLmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7O0lBRVEsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixPQUFPLEVBQUU7MEJBREYsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCLE9BQU8sRUFBRTtBQUNmLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0dBQ3pCOztTQUxrQixTQUFTO0dBQVMsS0FBSzs7cUJBQXZCLFNBQVM7Ozs7QUNGOUIsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O2tCQUVPLElBQUk7O3NCQUNTLFNBQVM7O3NCQUNqQixTQUFTOztzQkFhM0IsUUFBUTs7dUJBRU8sWUFBWTs7OztBQUVsQyxJQUFNLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQztBQUMxQyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4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V0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDO0dBQ3JCO0NBQUE7Ozs7Ozs7Ozs7QUFVRCxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQzFCLFNBQU8sR0FBRyxDQUNQLEtBQUssU0FBSyxDQUNWLE1BQU0sQ0FBQyxVQUFBLElBQUk7V0FBSSxJQUFJO0dBQUEsQ0FBQyxDQUNwQixHQUFHLENBQUMsVUFBQSxJQUFJO1dBQUksb0JBQU8sS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLElBQUk7R0FBQSxDQUFDLENBQ3hDLElBQUksU0FBSyxDQUFDO0NBQ2Q7Ozs7Ozs7Ozs7QUFVRCxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDeEIsTUFBSSxJQUFJLEdBQUcsa0JBQUssS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFMUMsTUFBSSxZQUFRLElBQUksRUFBRTtBQUNoQixRQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQU0sQ0FBQztHQUNqQzs7QUFFRCxTQUFPLElBQUksQ0FBQztDQUNiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMuZW5kaWFubmVzcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdMRScgfTtcblxuZXhwb3J0cy5ob3N0bmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gbG9jYXRpb24uaG9zdG5hbWVcbiAgICB9XG4gICAgZWxzZSByZXR1cm4gJyc7XG59O1xuXG5leHBvcnRzLmxvYWRhdmcgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbXSB9O1xuXG5leHBvcnRzLnVwdGltZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDAgfTtcblxuZXhwb3J0cy5mcmVlbWVtID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBOdW1iZXIuTUFYX1ZBTFVFO1xufTtcblxuZXhwb3J0cy50b3RhbG1lbSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTnVtYmVyLk1BWF9WQUxVRTtcbn07XG5cbmV4cG9ydHMuY3B1cyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdIH07XG5cbmV4cG9ydHMudHlwZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdCcm93c2VyJyB9O1xuXG5leHBvcnRzLnJlbGVhc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IuYXBwVmVyc2lvbjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufTtcblxuZXhwb3J0cy5uZXR3b3JrSW50ZXJmYWNlc1xuPSBleHBvcnRzLmdldE5ldHdvcmtJbnRlcmZhY2VzXG49IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHt9IH07XG5cbmV4cG9ydHMuYXJjaCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdqYXZhc2NyaXB0JyB9O1xuXG5leHBvcnRzLnBsYXRmb3JtID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ2Jyb3dzZXInIH07XG5cbmV4cG9ydHMudG1wZGlyID0gZXhwb3J0cy50bXBEaXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcvdG1wJztcbn07XG5cbmV4cG9ydHMuRU9MID0gJ1xcbic7XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV05FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5uYW1lID0gJ1lBV05FcnJvcic7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHsgRU9MIH0gZnJvbSAnb3MnO1xuaW1wb3J0IHtjb21wb3NlLCBzZXJpYWxpemV9IGZyb20gJ3lhbWwtanMnO1xuaW1wb3J0IHtsb2FkLCBkdW1wfSBmcm9tICdqcy15YW1sJztcbmltcG9ydCB7XG4gIGlzQXJyYXksXG4gIGlzU3RyaW5nLFxuICBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQsXG4gIGlzTnVsbCxcbiAgaXNOdW1iZXIsXG4gIGlzRXF1YWwsXG4gIHJlcGVhdCxcbiAgZWFjaCxcbiAgY29udGFpbnMsXG4gIGxhc3Rcbn0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IFlBV05FcnJvciBmcm9tICcuL2Vycm9yLmpzJztcblxuY29uc3QgTlVMTF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6bnVsbCc7XG5jb25zdCBTVFJfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOnN0cic7XG5jb25zdCBJTlRfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOmludCc7XG5jb25zdCBGTE9BVF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnO1xuY29uc3QgTUFQX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjptYXAnO1xuY29uc3QgU0VRX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpzZXEnO1xuXG5jb25zdCBTUEFDRSA9ICcgJztcbmNvbnN0IERBU0ggPSAnLSc7XG5cbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV04ge1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWUFXTiB7XG5cbiAgY29uc3RydWN0b3Ioc3RyKSB7XG4gICAgaWYgKCFpc1N0cmluZyhzdHIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHIgc2hvdWxkIGJlIGEgc3RyaW5nJyk7XG4gICAgfVxuXG4gICAgdGhpcy55YW1sID0gc3RyO1xuICB9XG5cbiAgZ2V0IGpzb24oKSB7XG4gICAgcmV0dXJuIGxvYWQodGhpcy55YW1sKTtcbiAgfVxuXG4gIHNldCBqc29uKG5ld0pzb24pIHtcblxuICAgIC8vIGlmIGpzb24gaXMgbm90IGNoYW5nZWQgZG8gbm90aGluZ1xuICAgIGlmIChpc0VxdWFsKHRoaXMuanNvbiwgbmV3SnNvbikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhc3QgPSBjb21wb3NlKHRoaXMueWFtbCk7XG5cbiAgICBpZiAoaXNVbmRlZmluZWQobmV3SnNvbikpIHtcbiAgICAgIHRoaXMueWFtbCA9ICcnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBjaGVjayBpZiBlbnRpcmUganNvbiBpcyBjaGFuZ2VkXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxldCBuZXdUYWcgPSBnZXRUYWcobmV3SnNvbik7XG5cbiAgICBpZiAoYXN0LnRhZyAhPT0gbmV3VGFnKSB7XG4gICAgICBsZXQgbmV3WWFtbCA9IGNsZWFuRHVtcChuZXdKc29uKTtcblxuICAgICAgLy8gcmVwbGFjZSB0aGlzLnlhbWwgdmFsdWUgZnJvbSBzdGFydCB0byBlbmQgbWFyayB3aXRoIG5ld1lhbWwgaWYgbm9kZSBpc1xuICAgICAgLy8gcHJpbWl0aXZlXG4gICAgICBpZiAoIWlzT2JqZWN0KG5ld0pzb24pKSB7XG4gICAgICAgIHRoaXMueWFtbCA9IHJlcGxhY2VQcmltaXRpdmUoYXN0LCBuZXdZYW1sLCB0aGlzLnlhbWwpO1xuXG4gICAgICAvLyBpZiBub2RlIGlzIG5vdCBwcmltaXRpdmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMueWFtbCA9IHJlcGxhY2VOb2RlKGFzdCwgbmV3WWFtbCwgdGhpcy55YW1sKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBOVUxMX1RBRywgU1RSX1RBRywgSU5UX1RBRywgRkxPQVRfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChjb250YWlucyhbTlVMTF9UQUcsIFNUUl9UQUcsIElOVF9UQUcsIEZMT0FUX1RBR10sIGFzdC50YWcpKSB7XG4gICAgICB0aGlzLnlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKGFzdCwgbmV3SnNvbiwgdGhpcy55YW1sKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIE1BUF9UQUdcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaWYgKGFzdC50YWcgPT09IE1BUF9UQUcpIHtcbiAgICAgIGxldCBqc29uID0gdGhpcy5qc29uO1xuXG4gICAgICB0aGlzLnlhbWwgPSB1cGRhdGVNYXAoYXN0LCBuZXdKc29uLCBqc29uLCB0aGlzLnlhbWwpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTRVFfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChhc3QudGFnID09PSBTRVFfVEFHKSB7XG4gICAgICB0aGlzLnlhbWwgPSB1cGRhdGVTZXEoYXN0LCBuZXdKc29uLCB0aGlzLnlhbWwpO1xuICAgIH1cblxuICAgIC8vIFRyaW0gdHJhaWxpbmcgd2hpdGVzcGFjZXNcbiAgICB0aGlzLnlhbWwgPSB0aGlzLnlhbWxcbiAgICAgIC5zcGxpdChFT0wpXG4gICAgICAubWFwKGxpbmU9PiBsaW5lLnJlcGxhY2UoL1sgXFx0XSskLywgJycpKVxuICAgICAgLmpvaW4oRU9MKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnlhbWw7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMuanNvbjtcbiAgfVxufVxuXG4vKlxuICogRGV0ZXJtaW5lcyB0aGUgQVNUIHRhZyBvZiBhIEpTT04gb2JqZWN0XG4gKlxuICogQHBhcmFtIHthbnl9IC0ganNvblxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAdGhyb3dzIHtZQVdORXJyb3J9IC0gaWYganNvbiBoYXMgd2VpcmQgdHlwZVxuKi9cbmZ1bmN0aW9uIGdldFRhZyhqc29uKSB7XG4gIGxldCB0YWcgPSBudWxsO1xuXG4gIGlmIChpc0FycmF5KGpzb24pKSB7XG4gICAgdGFnID0gU0VRX1RBRztcbiAgfSBlbHNlIGlmIChpc09iamVjdChqc29uKSkge1xuICAgIHRhZyA9IE1BUF9UQUc7XG4gIH0gZWxzZSBpZiAoaXNOdWxsKGpzb24pKSB7XG4gICAgdGFnID0gTlVMTF9UQUc7XG4gIH0gZWxzZSBpZiAoaXNOdW1iZXIoanNvbikpIHtcbiAgICBpZiAoanNvbiAlIDEwID09PSAwKSB7XG4gICAgICB0YWcgPSBJTlRfVEFHO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWcgPSBGTE9BVF9UQUc7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzU3RyaW5nKGpzb24pKSB7XG4gICAgdGFnID0gU1RSX1RBRztcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgWUFXTkVycm9yKCdVbmtub3duIHR5cGUnKTtcbiAgfVxuICByZXR1cm4gdGFnO1xufVxuXG4vKlxuICogVXBkYXRlIGEgc2VxdWVuY2Ugd2l0aCBuZXcgSlNPTlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gYXN0XG4gKiBAcGFyYW0ge29iamVjdH0gbmV3SnNvblxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICpcbiovXG5mdW5jdGlvbiB1cGRhdGVTZXEoYXN0LCBuZXdKc29uLCB5YW1sKSB7XG4gIGxldCB2YWx1ZXMgPSBsb2FkKHNlcmlhbGl6ZShhc3QpKTtcbiAgbGV0IG1pbiA9IE1hdGgubWluKHZhbHVlcy5sZW5ndGgsIG5ld0pzb24ubGVuZ3RoKTtcblxuICBpZiAodmFsdWVzLmxlbmd0aCA+IG1pbikge1xuICAgIGZvciAobGV0IGkgPSB2YWx1ZXMubGVuZ3RoIC0gMTsgaSA+PSBtaW47IC0taSkge1xuICAgICAgeWFtbCA9IHJlbW92ZUFycmF5RWxlbWVudChhc3QudmFsdWVbaV0sIHlhbWwpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChuZXdKc29uLmxlbmd0aCA+IG1pbikge1xuICAgIHlhbWwgPSBpbnNlcnRBZnRlck5vZGUoYXN0LCBjbGVhbkR1bXAobmV3SnNvbi5zbGljZShtaW4pKSwgeWFtbCk7XG4gIH1cblxuICBmb3IgKGxldCBpID0gbWluIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICB5YW1sID0gY2hhbmdlQXJyYXlFbGVtZW50KGFzdC52YWx1ZVtpXSwgY2xlYW5EdW1wKG5ld0pzb25baV0pLCB5YW1sKTtcbiAgfVxuXG4gIHJldHVybiB5YW1sO1xufVxuXG4vKlxuICogdXBkYXRlIGEgbWFwIHN0cnVjdHVyZSB3aXRoIG5ldyB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge0FTVH0gYXN0IC0gYSBtYXAgQVNUXG4gKiBAcGFyYW0ge2FueX0gbmV3SnNvblxuICogQHBhcmFtIHthbnl9IC0ganNvblxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICogQHRocm93cyB7WUFXTkVycm9yfSAtIGlmIGpzb24gaGFzIHdlaXJkIHR5cGVcbiovXG5mdW5jdGlvbiB1cGRhdGVNYXAoYXN0LCBuZXdKc29uLCBqc29uLCB5YW1sKSB7XG5cbiAgLy8gbG9vayBmb3IgY2hhbmdlc1xuICBlYWNoKGFzdC52YWx1ZSwgcGFpciA9PiB7XG4gICAgbGV0IFtrZXlOb2RlLCB2YWxOb2RlXSA9IHBhaXI7XG5cbiAgICAvLyBub2RlIGlzIGRlbGV0ZWRcbiAgICBpZiAoaXNVbmRlZmluZWQobmV3SnNvbltrZXlOb2RlLnZhbHVlXSkpIHtcblxuICAgICAgLy8gVE9ETzogY2FuIHdlIHVzZSBvZiB0aGUgbWV0aG9kcyBiZWxvdz9cbiAgICAgIHlhbWwgPSB5YW1sLnN1YnN0cigwLCBrZXlOb2RlLnN0YXJ0X21hcmsucG9pbnRlcikgK1xuICAgICAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayh2YWxOb2RlKS5wb2ludGVyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdmFsdWUgPSBqc29uW2tleU5vZGUudmFsdWVdO1xuICAgIGxldCBuZXdWYWx1ZSA9IG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XG5cbiAgICAvLyBwcmltaXRpdmUgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICBpZiAobmV3VmFsdWUgIT09IHZhbHVlICYmICFpc0FycmF5KHZhbE5vZGUudmFsdWUpKSB7XG5cbiAgICAgIC8vIHJlcGxhY2UgdGhlIHZhbHVlIG5vZGVcbiAgICAgIHlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKHZhbE5vZGUsIG5ld1ZhbHVlLCB5YW1sKTtcblxuICAgICAgLy8gcmVtb3ZlIHRoZSBrZXkvdmFsdWUgZnJvbSBuZXdKc29uIHNvIGl0J3Mgbm90IGRldGVjdGVkIGFzIG5ldyBwYWlyIGluXG4gICAgICAvLyBsYXRlciBjb2RlXG4gICAgICBkZWxldGUgbmV3SnNvbltrZXlOb2RlLnZhbHVlXTtcbiAgICB9XG5cbiAgICAvLyBub24gcHJpbWl0aXZlIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgaWYgKCFpc0VxdWFsKG5ld1ZhbHVlLCB2YWx1ZSkgJiYgaXNBcnJheSh2YWxOb2RlLnZhbHVlKSkge1xuXG4gICAgICAvLyBhcnJheSB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgICAgaWYgKGlzQXJyYXkobmV3VmFsdWUpKSB7XG5cbiAgICAgICAgLy8gcmVjdXJzZVxuICAgICAgICB5YW1sID0gdXBkYXRlU2VxKHZhbE5vZGUsIG5ld1ZhbHVlLCB5YW1sKTtcblxuICAgICAgLy8gbWFwIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIHJlY3Vyc2VcbiAgICAgICAgeWFtbCA9IHVwZGF0ZU1hcCh2YWxOb2RlLCBuZXdWYWx1ZSwgdmFsdWUsIHlhbWwpO1xuXG4gICAgICAgIGFzdCA9IGNvbXBvc2UoeWFtbCk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBrZXkvdmFsdWUgZnJvbSBuZXdKc29uIHNvIGl0J3Mgbm90IGRldGVjdGVkIGFzIG5ldyBwYWlyIGluXG4gICAgICAgIC8vIGxhdGVyIGNvZGVcbiAgICAgICAgZGVsZXRlIG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBsb29rIGZvciBuZXcgaXRlbXMgdG8gYWRkXG4gIGVhY2gobmV3SnNvbiwgKHZhbHVlLCBrZXkpPT4ge1xuXG4gICAgLy8gaXRlbSBpcyBuZXdcbiAgICBpZiAoaXNVbmRlZmluZWQoanNvbltrZXldKSkge1xuICAgICAgbGV0IG5ld1ZhbHVlID0gY2xlYW5EdW1wKHtba2V5XTogdmFsdWV9KTtcblxuICAgICAgeWFtbCA9IGluc2VydEFmdGVyTm9kZShhc3QsIG5ld1ZhbHVlLCB5YW1sKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB5YW1sO1xufVxuXG4vKlxuICogUGxhY2UgdmFsdWUgaW4gbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xuICpcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxuICogQHBhcmFtIHZhbHVlIHthbnl9XG4gKiBAcGFyYW0geWFtbCB7c3RyaW5nfVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVwbGFjZVByaW1pdGl2ZShub2RlLCB2YWx1ZSwgeWFtbCkge1xuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgbm9kZS5zdGFydF9tYXJrLnBvaW50ZXIpICtcbiAgICBTdHJpbmcodmFsdWUpICtcbiAgICB5YW1sLnN1YnN0cmluZyhub2RlLmVuZF9tYXJrLnBvaW50ZXIpO1xufVxuXG4vKlxuICogUGxhY2UgdmFsdWUgaW4gbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xuICpcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxuICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gKiBAcGFyYW0geWFtbCB7c3RyaW5nfVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVwbGFjZU5vZGUobm9kZSwgdmFsdWUsIHlhbWwpIHtcbiAgbGV0IGluZGVudGVkVmFsdWUgPSBpbmRlbnQodmFsdWUsIG5vZGUuc3RhcnRfbWFyay5jb2x1bW4pO1xuICBsZXQgbGluZVN0YXJ0ID0gbm9kZS5zdGFydF9tYXJrLnBvaW50ZXIgLSBub2RlLnN0YXJ0X21hcmsuY29sdW1uO1xuXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBsaW5lU3RhcnQpICtcbiAgICBpbmRlbnRlZFZhbHVlICtcbiAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyKTtcbn1cblxuLypcbiAqIFBsYWNlIHZhbHVlIGFmdGVyIG5vZGUgcmFuZ2UgaW4geWFtbCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gbm9kZSB7Tm9kZX1cbiAqIEBwYXJhbSB2YWx1ZSB7YW55fVxuICogQHBhcmFtIHlhbWwge3N0cmluZ31cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGluc2VydEFmdGVyTm9kZShub2RlLCB2YWx1ZSwgeWFtbCkge1xuICBsZXQgaW5kZW50ZWRWYWx1ZSA9IGluZGVudCh2YWx1ZSwgbm9kZS5zdGFydF9tYXJrLmNvbHVtbik7XG5cbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIpICtcbiAgICBFT0wgK1xuICAgIGluZGVudGVkVmFsdWUgK1xuICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIpO1xufVxuXG4vKlxuICogUmVtb3ZlcyBhIG5vZGUgZnJvbSBhcnJheVxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIHJlbW92ZUFycmF5RWxlbWVudChub2RlLCB5YW1sKSB7XG4gIGxldCBpbmRleCA9IG5vZGUuc3RhcnRfbWFyay5wb2ludGVyIC0gbm9kZS5zdGFydF9tYXJrLmNvbHVtbiAtIDE7XG5cbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGluZGV4KSArXG4gICAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyKTtcbn1cblxuLypcbiAqIENoYW5nZXMgYSBub2RlIGZyb20gYXJyYXlcbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB2YWx1ZSB7c3RyaW5nfVxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGNoYW5nZUFycmF5RWxlbWVudChub2RlLCB2YWx1ZSwgeWFtbCkge1xuICBsZXQgaW5kZW50ZWRWYWx1ZSA9IGluZGVudCh2YWx1ZSwgbm9kZS5zdGFydF9tYXJrLmNvbHVtbik7XG5cbiAgLy8gZmluZCBpbmRleCBvZiBEQVNIKGAtYCkgY2hhcmFjdGVyIGZvciB0aGlzIGFycmF5XG4gIGxldCBpbmRleCA9IG5vZGUuc3RhcnRfbWFyay5wb2ludGVyO1xuICB3aGlsZSAoaW5kZXggPiAwICYmIHlhbWxbaW5kZXhdICE9PSBEQVNIKSB7XG4gICAgaW5kZXgtLTtcbiAgfVxuXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBpbmRleCArIDIpICsgXG4gICAgICBpbmRlbnRlZFZhbHVlLnN1YnN0cihub2RlLnN0YXJ0X21hcmsuY29sdW1uKSArXG4gICAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyKTtcbn1cblxuLypcbiAqIEdldHMgZW5kIG1hcmsgb2YgYW4gQVNUXG4gKlxuICogQHBhcmFtIHtOb2RlfSBhc3RcbiAqXG4gKiBAcmV0dXNucyB7TWFya31cbiovXG5mdW5jdGlvbiBnZXROb2RlRW5kTWFyayhhc3QpIHtcbiAgaWYgKGlzQXJyYXkoYXN0LnZhbHVlKSAmJiBhc3QudmFsdWUubGVuZ3RoKSB7XG4gICAgbGV0IGxhc3RJdGVtID0gbGFzdChhc3QudmFsdWUpO1xuXG4gICAgaWYgKGlzQXJyYXkobGFzdEl0ZW0pICYmIGxhc3RJdGVtLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGdldE5vZGVFbmRNYXJrKGxhc3QobGFzdEl0ZW0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0Tm9kZUVuZE1hcmsobGFzdEl0ZW0pO1xuICB9XG5cbiAgcmV0dXJuIGFzdC5lbmRfbWFyaztcbn1cblxuLypcbiAqIEluZGVudHMgYSBzdHJpbmcgd2l0aCBudW1iZXIgb2YgY2hhcmFjdGVyc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7aW50ZWdlcn0gZGVwdGggLSBjYW4gYmUgbmVnYXRpdmUgYWxzb1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gaW5kZW50KHN0ciwgZGVwdGgpIHtcbiAgcmV0dXJuIHN0clxuICAgIC5zcGxpdChFT0wpXG4gICAgLmZpbHRlcihsaW5lID0+IGxpbmUpXG4gICAgLm1hcChsaW5lID0+IHJlcGVhdChTUEFDRSwgZGVwdGgpICsgbGluZSlcbiAgICAuam9pbihFT0wpO1xufVxuXG4vKlxuICogRHVtcCBhIHZhbHVlIHRvIFlBTUwgc3Rpbmcgd2l0aG91dCB0aGUgdHJhaWxpbmcgbmV3IGxpbmVcbiAqXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICpcbiovXG5mdW5jdGlvbiBjbGVhbkR1bXAodmFsdWUpIHtcbiAgbGV0IHlhbWwgPSBkdW1wKHZhbHVlKS5yZXBsYWNlKC9cXG4kLywgJycpO1xuXG4gIGlmIChFT0wgIT09ICdcXG4nKSB7XG4gICAgeWFtbCA9IHlhbWwucmVwbGFjZSgvXFxuL2csIEVPTCk7XG4gIH1cblxuICByZXR1cm4geWFtbDtcbn1cbiJdfQ==
