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

var LINE_SEPARATOR = _os.EOL;
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
      this.yaml = this.yaml.split(LINE_SEPARATOR).map(function (line) {
        return line.replace(/[ \t]+$/, '');
      }).join(LINE_SEPARATOR);
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

  return yaml.substr(0, getNodeEndMark(node).pointer) + LINE_SEPARATOR + indentedValue + yaml.substring(getNodeEndMark(node).pointer);
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
  return str.split(LINE_SEPARATOR).filter(function (line) {
    return line;
  }).map(function (line) {
    return (0, _lodash.repeat)(SPACE, depth) + line;
  }).join(LINE_SEPARATOR);
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
  return (0, _jsYaml.dump)(value).replace(/\n$/, '');
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

},{"./error.js":2,"os":1}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvb3MtYnJvd3NlcmlmeS9icm93c2VyLmpzIiwic3JjL2Vycm9yLmpzIiwic3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7O0lBRVEsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixPQUFPLEVBQUU7MEJBREYsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRXBCLE9BQU8sRUFBRTtBQUNmLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0dBQ3pCOztTQUxrQixTQUFTO0dBQVMsS0FBSzs7cUJBQXZCLFNBQVM7Ozs7QUNGOUIsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O2tCQUVPLElBQUk7O3NCQUNTLFNBQVM7O3NCQUNqQixTQUFTOztzQkFhM0IsUUFBUTs7dUJBRU8sWUFBWTs7OztBQUVsQyxJQUFNLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQztBQUMxQyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4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LE9BQU8sRUFBRztBQUMxQixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBQSxRQUFRLEVBQUc7QUFDM0IsYUFBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbkMsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0cy5lbmRpYW5uZXNzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0xFJyB9O1xuXG5leHBvcnRzLmhvc3RuYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgbG9jYXRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGlvbi5ob3N0bmFtZVxuICAgIH1cbiAgICBlbHNlIHJldHVybiAnJztcbn07XG5cbmV4cG9ydHMubG9hZGF2ZyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdIH07XG5cbmV4cG9ydHMudXB0aW1lID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMCB9O1xuXG5leHBvcnRzLmZyZWVtZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE51bWJlci5NQVhfVkFMVUU7XG59O1xuXG5leHBvcnRzLnRvdGFsbWVtID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBOdW1iZXIuTUFYX1ZBTFVFO1xufTtcblxuZXhwb3J0cy5jcHVzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW10gfTtcblxuZXhwb3J0cy50eXBlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0Jyb3dzZXInIH07XG5cbmV4cG9ydHMucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci5hcHBWZXJzaW9uO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG59O1xuXG5leHBvcnRzLm5ldHdvcmtJbnRlcmZhY2VzXG49IGV4cG9ydHMuZ2V0TmV0d29ya0ludGVyZmFjZXNcbj0gZnVuY3Rpb24gKCkgeyByZXR1cm4ge30gfTtcblxuZXhwb3J0cy5hcmNoID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ2phdmFzY3JpcHQnIH07XG5cbmV4cG9ydHMucGxhdGZvcm0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnYnJvd3NlcicgfTtcblxuZXhwb3J0cy50bXBkaXIgPSBleHBvcnRzLnRtcERpciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJy90bXAnO1xufTtcblxuZXhwb3J0cy5FT0wgPSAnXFxuJztcbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWUFXTkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLm5hbWUgPSAnWUFXTkVycm9yJztcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBFT0wgfSBmcm9tICdvcyc7XG5pbXBvcnQge2NvbXBvc2UsIHNlcmlhbGl6ZX0gZnJvbSAneWFtbC1qcyc7XG5pbXBvcnQge2xvYWQsIGR1bXB9IGZyb20gJ2pzLXlhbWwnO1xuaW1wb3J0IHtcbiAgaXNBcnJheSxcbiAgaXNTdHJpbmcsXG4gIGlzT2JqZWN0LFxuICBpc1VuZGVmaW5lZCxcbiAgaXNOdWxsLFxuICBpc051bWJlcixcbiAgaXNFcXVhbCxcbiAgcmVwZWF0LFxuICBlYWNoLFxuICBjb250YWlucyxcbiAgbGFzdFxufSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgWUFXTkVycm9yIGZyb20gJy4vZXJyb3IuanMnO1xuXG5jb25zdCBOVUxMX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpudWxsJztcbmNvbnN0IFNUUl9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6c3RyJztcbmNvbnN0IElOVF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6aW50JztcbmNvbnN0IEZMT0FUX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCc7XG5jb25zdCBNQVBfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOm1hcCc7XG5jb25zdCBTRVFfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOnNlcSc7XG5cbmNvbnN0IExJTkVfU0VQQVJBVE9SID0gRU9MO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5jb25zdCBEQVNIID0gJy0nO1xuXG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBZQVdOIHtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV04ge1xuXG4gIGNvbnN0cnVjdG9yKHN0cikge1xuICAgIGlmICghaXNTdHJpbmcoc3RyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyIHNob3VsZCBiZSBhIHN0cmluZycpO1xuICAgIH1cblxuICAgIHRoaXMueWFtbCA9IHN0cjtcbiAgfVxuXG4gIGdldCBqc29uKCkge1xuICAgIHJldHVybiBsb2FkKHRoaXMueWFtbCk7XG4gIH1cblxuICBzZXQganNvbihuZXdKc29uKSB7XG5cbiAgICAvLyBpZiBqc29uIGlzIG5vdCBjaGFuZ2VkIGRvIG5vdGhpbmdcbiAgICBpZiAoaXNFcXVhbCh0aGlzLmpzb24sIG5ld0pzb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXN0ID0gY29tcG9zZSh0aGlzLnlhbWwpO1xuXG4gICAgaWYgKGlzVW5kZWZpbmVkKG5ld0pzb24pKSB7XG4gICAgICB0aGlzLnlhbWwgPSAnJztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY2hlY2sgaWYgZW50aXJlIGpzb24gaXMgY2hhbmdlZFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgbmV3VGFnID0gZ2V0VGFnKG5ld0pzb24pO1xuXG4gICAgaWYgKGFzdC50YWcgIT09IG5ld1RhZykge1xuICAgICAgbGV0IG5ld1lhbWwgPSBjbGVhbkR1bXAobmV3SnNvbik7XG5cbiAgICAgIC8vIHJlcGxhY2UgdGhpcy55YW1sIHZhbHVlIGZyb20gc3RhcnQgdG8gZW5kIG1hcmsgd2l0aCBuZXdZYW1sIGlmIG5vZGUgaXNcbiAgICAgIC8vIHByaW1pdGl2ZVxuICAgICAgaWYgKCFpc09iamVjdChuZXdKc29uKSkge1xuICAgICAgICB0aGlzLnlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKGFzdCwgbmV3WWFtbCwgdGhpcy55YW1sKTtcblxuICAgICAgLy8gaWYgbm9kZSBpcyBub3QgcHJpbWl0aXZlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnlhbWwgPSByZXBsYWNlTm9kZShhc3QsIG5ld1lhbWwsIHRoaXMueWFtbCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTlVMTF9UQUcsIFNUUl9UQUcsIElOVF9UQUcsIEZMT0FUX1RBR1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpZiAoY29udGFpbnMoW05VTExfVEFHLCBTVFJfVEFHLCBJTlRfVEFHLCBGTE9BVF9UQUddLCBhc3QudGFnKSkge1xuICAgICAgdGhpcy55YW1sID0gcmVwbGFjZVByaW1pdGl2ZShhc3QsIG5ld0pzb24sIHRoaXMueWFtbCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBNQVBfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChhc3QudGFnID09PSBNQVBfVEFHKSB7XG4gICAgICBsZXQganNvbiA9IHRoaXMuanNvbjtcblxuICAgICAgdGhpcy55YW1sID0gdXBkYXRlTWFwKGFzdCwgbmV3SnNvbiwganNvbiwgdGhpcy55YW1sKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU0VRX1RBR1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpZiAoYXN0LnRhZyA9PT0gU0VRX1RBRykge1xuICAgICAgdGhpcy55YW1sID0gdXBkYXRlU2VxKGFzdCwgbmV3SnNvbiwgdGhpcy55YW1sKTtcbiAgICB9XG5cbiAgICAvLyBUcmltIHRyYWlsaW5nIHdoaXRlc3BhY2VzXG4gICAgdGhpcy55YW1sID0gdGhpcy55YW1sXG4gICAgICAuc3BsaXQoTElORV9TRVBBUkFUT1IpXG4gICAgICAubWFwKGxpbmU9PiBsaW5lLnJlcGxhY2UoL1sgXFx0XSskLywgJycpKVxuICAgICAgLmpvaW4oTElORV9TRVBBUkFUT1IpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMueWFtbDtcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcy5qc29uO1xuICB9XG59XG5cbi8qXG4gKiBEZXRlcm1pbmVzIHRoZSBBU1QgdGFnIG9mIGEgSlNPTiBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge2FueX0gLSBqc29uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqIEB0aHJvd3Mge1lBV05FcnJvcn0gLSBpZiBqc29uIGhhcyB3ZWlyZCB0eXBlXG4qL1xuZnVuY3Rpb24gZ2V0VGFnKGpzb24pIHtcbiAgbGV0IHRhZyA9IG51bGw7XG5cbiAgaWYgKGlzQXJyYXkoanNvbikpIHtcbiAgICB0YWcgPSBTRVFfVEFHO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGpzb24pKSB7XG4gICAgdGFnID0gTUFQX1RBRztcbiAgfSBlbHNlIGlmIChpc051bGwoanNvbikpIHtcbiAgICB0YWcgPSBOVUxMX1RBRztcbiAgfSBlbHNlIGlmIChpc051bWJlcihqc29uKSkge1xuICAgIGlmIChqc29uICUgMTAgPT09IDApIHtcbiAgICAgIHRhZyA9IElOVF9UQUc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhZyA9IEZMT0FUX1RBRztcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNTdHJpbmcoanNvbikpIHtcbiAgICB0YWcgPSBTVFJfVEFHO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBZQVdORXJyb3IoJ1Vua25vd24gdHlwZScpO1xuICB9XG4gIHJldHVybiB0YWc7XG59XG5cbi8qXG4gKiBVcGRhdGUgYSBzZXF1ZW5jZSB3aXRoIG5ldyBKU09OXG4gKlxuICogQHBhcmFtIHtOb2RlfSBhc3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBuZXdKc29uXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKlxuKi9cbmZ1bmN0aW9uIHVwZGF0ZVNlcShhc3QsIG5ld0pzb24sIHlhbWwpIHtcbiAgbGV0IHZhbHVlcyA9IGxvYWQoc2VyaWFsaXplKGFzdCkpO1xuXG4gIC8vIG5ldyBpdGVtcyBpbiBuZXdKc29uXG4gIGxldCBuZXdJdGVtcyA9IGRpZmZlcmVuY2VXaXRoKG5ld0pzb24sIHZhbHVlcywgaXNFcXVhbCkucmV2ZXJzZSgpO1xuXG4gIGlmIChuZXdJdGVtcy5sZW5ndGgpIHtcbiAgICB5YW1sID0gaW5zZXJ0QWZ0ZXJOb2RlKGFzdCwgY2xlYW5EdW1wKG5ld0l0ZW1zKSwgeWFtbCk7XG4gIH1cblxuICAvLyBkZWxldGVkIGl0ZW1zIGluIG5ld0pzb25cbiAgbGV0IGRlbGV0ZWRJdGVtcyA9IGRpZmZlcmVuY2VXaXRoKHZhbHVlcywgbmV3SnNvbiwgaXNFcXVhbCk7XG5cbiAgZGVsZXRlZEl0ZW1zLmZvckVhY2goZGVsZXRlZEl0ZW09PiB7XG5cbiAgICAvLyBmaW5kIHRoZSBub2RlIGZvciB0aGlzIGl0ZW1cbiAgICBlYWNoKGFzdC52YWx1ZSwgbm9kZSA9PiB7XG4gICAgICBpZiAoaXNFcXVhbChsb2FkKHNlcmlhbGl6ZShub2RlKSksIGRlbGV0ZWRJdGVtKSkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBpdCBmcm9tIHlhbWxcbiAgICAgICAgeWFtbCA9IHJlbW92ZUFycmF5RWxlbWVudChub2RlLCB5YW1sKTtcblxuICAgICAgICAvLyByZS1jb21wb3NlIHRoZSBBU1QgZm9yIGFjY3VyYXRlIHJlbW92YWxzIGFmdGVyXG4gICAgICAgIGFzdCA9IGNvbXBvc2UoeWFtbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB5YW1sO1xufVxuXG4vKlxuICogdXBkYXRlIGEgbWFwIHN0cnVjdHVyZSB3aXRoIG5ldyB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge0FTVH0gYXN0IC0gYSBtYXAgQVNUXG4gKiBAcGFyYW0ge2FueX0gbmV3SnNvblxuICogQHBhcmFtIHthbnl9IC0ganNvblxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICogQHRocm93cyB7WUFXTkVycm9yfSAtIGlmIGpzb24gaGFzIHdlaXJkIHR5cGVcbiovXG5mdW5jdGlvbiB1cGRhdGVNYXAoYXN0LCBuZXdKc29uLCBqc29uLCB5YW1sKSB7XG5cbiAgLy8gbG9vayBmb3IgY2hhbmdlc1xuICBlYWNoKGFzdC52YWx1ZSwgcGFpciA9PiB7XG4gICAgbGV0IFtrZXlOb2RlLCB2YWxOb2RlXSA9IHBhaXI7XG5cbiAgICAvLyBub2RlIGlzIGRlbGV0ZWRcbiAgICBpZiAoaXNVbmRlZmluZWQobmV3SnNvbltrZXlOb2RlLnZhbHVlXSkpIHtcblxuICAgICAgLy8gVE9ETzogY2FuIHdlIHVzZSBvZiB0aGUgbWV0aG9kcyBiZWxvdz9cbiAgICAgIHlhbWwgPSB5YW1sLnN1YnN0cigwLCBrZXlOb2RlLnN0YXJ0X21hcmsucG9pbnRlcikgK1xuICAgICAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayh2YWxOb2RlKS5wb2ludGVyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdmFsdWUgPSBqc29uW2tleU5vZGUudmFsdWVdO1xuICAgIGxldCBuZXdWYWx1ZSA9IG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XG5cbiAgICAvLyBwcmltaXRpdmUgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICBpZiAobmV3VmFsdWUgIT09IHZhbHVlICYmICFpc0FycmF5KHZhbE5vZGUudmFsdWUpKSB7XG5cbiAgICAgIC8vIHJlcGxhY2UgdGhlIHZhbHVlIG5vZGVcbiAgICAgIHlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKHZhbE5vZGUsIG5ld1ZhbHVlLCB5YW1sKTtcblxuICAgICAgLy8gcmVtb3ZlIHRoZSBrZXkvdmFsdWUgZnJvbSBuZXdKc29uIHNvIGl0J3Mgbm90IGRldGVjdGVkIGFzIG5ldyBwYWlyIGluXG4gICAgICAvLyBsYXRlciBjb2RlXG4gICAgICBkZWxldGUgbmV3SnNvbltrZXlOb2RlLnZhbHVlXTtcbiAgICB9XG5cbiAgICAvLyBub24gcHJpbWl0aXZlIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgaWYgKCFpc0VxdWFsKG5ld1ZhbHVlLCB2YWx1ZSkgJiYgaXNBcnJheSh2YWxOb2RlLnZhbHVlKSkge1xuXG4gICAgICAvLyBhcnJheSB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgICAgaWYgKGlzQXJyYXkobmV3VmFsdWUpKSB7XG5cbiAgICAgICAgLy8gcmVjdXJzZVxuICAgICAgICB5YW1sID0gdXBkYXRlU2VxKHZhbE5vZGUsIG5ld1ZhbHVlLCB5YW1sKTtcblxuICAgICAgLy8gbWFwIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIHJlY3Vyc2VcbiAgICAgICAgeWFtbCA9IHVwZGF0ZU1hcCh2YWxOb2RlLCBuZXdWYWx1ZSwgdmFsdWUsIHlhbWwpO1xuXG4gICAgICAgIGFzdCA9IGNvbXBvc2UoeWFtbCk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBrZXkvdmFsdWUgZnJvbSBuZXdKc29uIHNvIGl0J3Mgbm90IGRldGVjdGVkIGFzIG5ldyBwYWlyIGluXG4gICAgICAgIC8vIGxhdGVyIGNvZGVcbiAgICAgICAgZGVsZXRlIG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBsb29rIGZvciBuZXcgaXRlbXMgdG8gYWRkXG4gIGVhY2gobmV3SnNvbiwgKHZhbHVlLCBrZXkpPT4ge1xuXG4gICAgLy8gaXRlbSBpcyBuZXdcbiAgICBpZiAoaXNVbmRlZmluZWQoanNvbltrZXldKSkge1xuICAgICAgbGV0IG5ld1ZhbHVlID0gY2xlYW5EdW1wKHtba2V5XTogdmFsdWV9KTtcblxuICAgICAgeWFtbCA9IGluc2VydEFmdGVyTm9kZShhc3QsIG5ld1ZhbHVlLCB5YW1sKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB5YW1sO1xufVxuXG4vKlxuICogUGxhY2UgdmFsdWUgaW4gbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xuICpcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxuICogQHBhcmFtIHZhbHVlIHthbnl9XG4gKiBAcGFyYW0geWFtbCB7c3RyaW5nfVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVwbGFjZVByaW1pdGl2ZShub2RlLCB2YWx1ZSwgeWFtbCkge1xuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgbm9kZS5zdGFydF9tYXJrLnBvaW50ZXIpICtcbiAgICBTdHJpbmcodmFsdWUpICtcbiAgICB5YW1sLnN1YnN0cmluZyhub2RlLmVuZF9tYXJrLnBvaW50ZXIpO1xufVxuXG4vKlxuICogUGxhY2UgdmFsdWUgaW4gbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xuICpcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxuICogQHBhcmFtIHZhbHVlIHthbnl9XG4gKiBAcGFyYW0geWFtbCB7c3RyaW5nfVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVwbGFjZU5vZGUobm9kZSwgdmFsdWUsIHlhbWwpIHtcbiAgbGV0IGluZGVudGVkVmFsdWUgPSBpbmRlbnQodmFsdWUsIG5vZGUuc3RhcnRfbWFyay5jb2x1bW4pO1xuICBsZXQgbGluZVN0YXJ0ID0gbm9kZS5zdGFydF9tYXJrLnBvaW50ZXIgLSBub2RlLnN0YXJ0X21hcmsuY29sdW1uO1xuXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBsaW5lU3RhcnQpICtcbiAgICBpbmRlbnRlZFZhbHVlICtcbiAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyKTtcbn1cblxuLypcbiAqIFBsYWNlIHZhbHVlIGFmdGVyIG5vZGUgcmFuZ2UgaW4geWFtbCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gbm9kZSB7Tm9kZX1cbiAqIEBwYXJhbSB2YWx1ZSB7YW55fVxuICogQHBhcmFtIHlhbWwge3N0cmluZ31cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGluc2VydEFmdGVyTm9kZShub2RlLCB2YWx1ZSwgeWFtbCkge1xuICBsZXQgaW5kZW50ZWRWYWx1ZSA9IGluZGVudCh2YWx1ZSwgbm9kZS5zdGFydF9tYXJrLmNvbHVtbik7XG5cbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIpICtcbiAgICBMSU5FX1NFUEFSQVRPUiArXG4gICAgaW5kZW50ZWRWYWx1ZSArXG4gICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcik7XG59XG5cbi8qXG4gKiBSZW1vdmVzIGEgbm9kZSBmcm9tIGFycmF5XG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVtb3ZlQXJyYXlFbGVtZW50KG5vZGUsIHlhbWwpIHtcblxuICAvLyBGSVhNRTogUmVtb3ZpbmcgZWxlbWVudCBmcm9tIGEgWUFNTCBsaWtlIGBbYSxiXWAgd29uJ3Qgd29yayB3aXRoIHRoaXMuXG5cbiAgLy8gZmluZCBpbmRleCBvZiBEQVNIKGAtYCkgY2hhcmFjdGVyIGZvciB0aGlzIGFycmF5XG4gIGxldCBpbmRleCA9IG5vZGUuc3RhcnRfbWFyay5wb2ludGVyO1xuICB3aGlsZSAoaW5kZXggPiAwICYmIHlhbWxbaW5kZXhdICE9PSBEQVNIKSB7XG4gICAgaW5kZXgtLTtcbiAgfVxuXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBpbmRleCkgK1xuICAgICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcik7XG59XG5cblxuLypcbiAqIEdldHMgZW5kIG1hcmsgb2YgYW4gQVNUXG4gKlxuICogQHBhcmFtIHtOb2RlfSBhc3RcbiAqXG4gKiBAcmV0dXNucyB7TWFya31cbiovXG5mdW5jdGlvbiBnZXROb2RlRW5kTWFyayhhc3QpIHtcbiAgaWYgKGlzQXJyYXkoYXN0LnZhbHVlKSAmJiBhc3QudmFsdWUubGVuZ3RoKSB7XG4gICAgbGV0IGxhc3RJdGVtID0gbGFzdChhc3QudmFsdWUpO1xuXG4gICAgaWYgKGlzQXJyYXkobGFzdEl0ZW0pICYmIGxhc3RJdGVtLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGdldE5vZGVFbmRNYXJrKGxhc3QobGFzdEl0ZW0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0Tm9kZUVuZE1hcmsobGFzdEl0ZW0pO1xuICB9XG5cbiAgcmV0dXJuIGFzdC5lbmRfbWFyaztcbn1cblxuLypcbiAqIEluZGVudHMgYSBzdHJpbmcgd2l0aCBudW1iZXIgb2YgY2hhcmFjdGVyc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7aW50ZWdlcn0gZGVwdGggLSBjYW4gYmUgbmVnYXRpdmUgYWxzb1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gaW5kZW50KHN0ciwgZGVwdGgpIHtcbiAgcmV0dXJuIHN0clxuICAgIC5zcGxpdChMSU5FX1NFUEFSQVRPUilcbiAgICAuZmlsdGVyKGxpbmUgPT4gbGluZSlcbiAgICAubWFwKGxpbmUgPT4gcmVwZWF0KFNQQUNFLCBkZXB0aCkgKyBsaW5lKVxuICAgIC5qb2luKExJTkVfU0VQQVJBVE9SKTtcbn1cblxuLypcbiAqIER1bXAgYSB2YWx1ZSB0byBZQU1MIHN0aW5nIHdpdGhvdXQgdGhlIHRyYWlsaW5nIG5ldyBsaW5lXG4gKlxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqXG4qL1xuZnVuY3Rpb24gY2xlYW5EdW1wKHZhbHVlKSB7XG4gIHJldHVybiBkdW1wKHZhbHVlKS5yZXBsYWNlKC9cXG4kLywgJycpO1xufVxuXG4vKlxuICogZmluZCBkaWZmZXJlbmNlIGJldHdlZW4gdHdvIGFycmF5cyBieSB1c2luZyBhIGNvbXBhcmlzb24gZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge2FycmF5PGFueT59IHNyY1xuICogQHBhcmFtIHthcnJheTxhbnk+fSBkZXN0XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wRm5cbiAqXG4gKiBAcmV0dXJucyB7YXJyYXl9XG4qL1xuZnVuY3Rpb24gZGlmZmVyZW5jZVdpdGgoc3JjLCBkZXN0LCBjb21wRm4pIHtcbiAgcmV0dXJuIHNyYy5maWx0ZXIoc3JjSXRlbT0+IHtcbiAgICByZXR1cm4gZGVzdC5ldmVyeShkZXN0SXRlbT0+IHtcbiAgICAgIHJldHVybiAhY29tcEZuKHNyY0l0ZW0sIGRlc3RJdGVtKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=
