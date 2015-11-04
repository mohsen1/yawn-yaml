(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.YAWN = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

var LINE_SEPERATOR = '\n';
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
      this.yaml = this.yaml.split(LINE_SEPERATOR).map(function (line) {
        return line.replace(/[ \t]+$/, '');
      }).join(LINE_SEPERATOR);
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

  return yaml.substr(0, getNodeEndMark(node).pointer) + LINE_SEPERATOR + indentedValue + yaml.substring(getNodeEndMark(node).pointer);
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
    lastItem = undefined;
    _again = false;

    if ((0, _lodash.isArray)(ast.value) && ast.value.length) {
      var lastItem = (0, _lodash.last)(ast.value);

      if ((0, _lodash.isArray)(lastItem) && lastItem.length) {
        _x = (0, _lodash.last)(lastItem);
        _again = true;
        continue _function;
      }

      _x = lastItem;
      _again = true;
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
  return str.split(LINE_SEPERATOR).filter(function (line) {
    return line;
  }).map(function (line) {
    return (0, _lodash.repeat)(SPACE, depth) + line;
  }).join(LINE_SEPERATOR);
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

},{"./error.js":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZXJyb3IuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7OztJQUVRLFNBQVM7WUFBVCxTQUFTOztBQUNqQixXQURRLFNBQVMsQ0FDaEIsT0FBTyxFQUFFOzBCQURGLFNBQVM7O0FBRTFCLCtCQUZpQixTQUFTLDZDQUVwQixPQUFPLEVBQUU7QUFDZixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztHQUN6Qjs7U0FMa0IsU0FBUztHQUFTLEtBQUs7O3FCQUF2QixTQUFTOzs7O0FDRjlCLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztzQkFFb0IsU0FBUzs7c0JBQ2pCLFNBQVM7O3NCQWEzQixRQUFROzt1QkFFTyxZQUFZOzs7O0FBRWxDLElBQU0sUUFBUSxHQUFHLHdCQUF3QixDQUFDO0FBQzFDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDO0FBQ3hDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDO0FBQ3hDLElBQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFDO0FBQzVDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDO0FBQ3hDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDOztBQUV4QyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDNUIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQzs7O0lBR0ksSUFBSTtBQUVaLFdBRlEsSUFBSSxDQUVYLEdBQUcsRUFBRTswQkFGRSxJQUFJOztBQUdyQixRQUFJLENBQUMsc0JBQVMsR0FBRyxDQUFDLEVBQUU7QUFDbEIsWUFBTSxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tB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RyxrQkFBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRS9CLFVBQUkscUJBQVEsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTthQUNsQixrQkFBSyxRQUFRLENBQUM7OztPQUNyQzs7V0FFcUIsUUFBUTs7O0tBQy9COztBQUVELFdBQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQztHQUNyQjtDQUFBOzs7Ozs7Ozs7O0FBVUQsU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUMxQixTQUFPLEdBQUcsQ0FDUCxLQUFLLENBQUMsY0FBYyxDQUFDLENBQ3JCLE1BQU0sQ0FBQyxVQUFBLElBQUk7V0FBSSxJQUFJO0dBQUEsQ0FBQyxDQUNwQixHQUFHLENBQUMsVUFBQSxJQUFJO1dBQUksb0JBQU8sS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLElBQUk7R0FBQSxDQUFDLENBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztDQUN6Qjs7Ozs7Ozs7OztBQVVELFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtBQUN4QixTQUFPLGtCQUFLLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDdkM7Ozs7Ozs7Ozs7O0FBV0QsU0FBUyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDekMsU0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTyxFQUFHO0FBQzFCLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFBLFFBQVEsRUFBRztBQUMzQixhQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNuQyxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV05FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5uYW1lID0gJ1lBV05FcnJvcic7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjb21wb3NlLCBzZXJpYWxpemV9IGZyb20gJ3lhbWwtanMnO1xuaW1wb3J0IHtsb2FkLCBkdW1wfSBmcm9tICdqcy15YW1sJztcbmltcG9ydCB7XG4gIGlzQXJyYXksXG4gIGlzU3RyaW5nLFxuICBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQsXG4gIGlzTnVsbCxcbiAgaXNOdW1iZXIsXG4gIGlzRXF1YWwsXG4gIHJlcGVhdCxcbiAgZWFjaCxcbiAgY29udGFpbnMsXG4gIGxhc3Rcbn0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IFlBV05FcnJvciBmcm9tICcuL2Vycm9yLmpzJztcblxuY29uc3QgTlVMTF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6bnVsbCc7XG5jb25zdCBTVFJfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOnN0cic7XG5jb25zdCBJTlRfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOmludCc7XG5jb25zdCBGTE9BVF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnO1xuY29uc3QgTUFQX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjptYXAnO1xuY29uc3QgU0VRX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpzZXEnO1xuXG5jb25zdCBMSU5FX1NFUEVSQVRPUiA9ICdcXG4nO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5jb25zdCBEQVNIID0gJy0nO1xuXG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBZQVdOIHtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV04ge1xuXG4gIGNvbnN0cnVjdG9yKHN0cikge1xuICAgIGlmICghaXNTdHJpbmcoc3RyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyIHNob3VsZCBiZSBhIHN0cmluZycpO1xuICAgIH1cblxuICAgIHRoaXMueWFtbCA9IHN0cjtcbiAgfVxuXG4gIGdldCBqc29uKCkge1xuICAgIHJldHVybiBsb2FkKHRoaXMueWFtbCk7XG4gIH1cblxuICBzZXQganNvbihuZXdKc29uKSB7XG5cbiAgICAvLyBpZiBqc29uIGlzIG5vdCBjaGFuZ2VkIGRvIG5vdGhpbmdcbiAgICBpZiAoaXNFcXVhbCh0aGlzLmpzb24sIG5ld0pzb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXN0ID0gY29tcG9zZSh0aGlzLnlhbWwpO1xuXG4gICAgaWYgKGlzVW5kZWZpbmVkKG5ld0pzb24pKSB7XG4gICAgICB0aGlzLnlhbWwgPSAnJztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY2hlY2sgaWYgZW50aXJlIGpzb24gaXMgY2hhbmdlZFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgbmV3VGFnID0gZ2V0VGFnKG5ld0pzb24pO1xuXG4gICAgaWYgKGFzdC50YWcgIT09IG5ld1RhZykge1xuICAgICAgbGV0IG5ld1lhbWwgPSBjbGVhbkR1bXAobmV3SnNvbik7XG5cbiAgICAgIC8vIHJlcGxhY2UgdGhpcy55YW1sIHZhbHVlIGZyb20gc3RhcnQgdG8gZW5kIG1hcmsgd2l0aCBuZXdZYW1sIGlmIG5vZGUgaXNcbiAgICAgIC8vIHByaW1pdGl2ZVxuICAgICAgaWYgKCFpc09iamVjdChuZXdKc29uKSkge1xuICAgICAgICB0aGlzLnlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKGFzdCwgbmV3WWFtbCwgdGhpcy55YW1sKTtcblxuICAgICAgLy8gaWYgbm9kZSBpcyBub3QgcHJpbWl0aXZlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnlhbWwgPSByZXBsYWNlTm9kZShhc3QsIG5ld1lhbWwsIHRoaXMueWFtbCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTlVMTF9UQUcsIFNUUl9UQUcsIElOVF9UQUcsIEZMT0FUX1RBR1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpZiAoY29udGFpbnMoW05VTExfVEFHLCBTVFJfVEFHLCBJTlRfVEFHLCBGTE9BVF9UQUddLCBhc3QudGFnKSkge1xuICAgICAgdGhpcy55YW1sID0gcmVwbGFjZVByaW1pdGl2ZShhc3QsIG5ld0pzb24sIHRoaXMueWFtbCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBNQVBfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChhc3QudGFnID09PSBNQVBfVEFHKSB7XG4gICAgICBsZXQganNvbiA9IHRoaXMuanNvbjtcblxuICAgICAgdGhpcy55YW1sID0gdXBkYXRlTWFwKGFzdCwgbmV3SnNvbiwganNvbiwgdGhpcy55YW1sKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU0VRX1RBR1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpZiAoYXN0LnRhZyA9PT0gU0VRX1RBRykge1xuICAgICAgdGhpcy55YW1sID0gdXBkYXRlU2VxKGFzdCwgbmV3SnNvbiwgdGhpcy55YW1sKTtcbiAgICB9XG5cbiAgICAvLyBUcmltIHRyYWlsaW5nIHdoaXRlc3BhY2VzXG4gICAgdGhpcy55YW1sID0gdGhpcy55YW1sXG4gICAgICAuc3BsaXQoTElORV9TRVBFUkFUT1IpXG4gICAgICAubWFwKGxpbmU9PiBsaW5lLnJlcGxhY2UoL1sgXFx0XSskLywgJycpKVxuICAgICAgLmpvaW4oTElORV9TRVBFUkFUT1IpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMueWFtbDtcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcy5qc29uO1xuICB9XG59XG5cbi8qXG4gKiBEZXRlcm1pbmVzIHRoZSBBU1QgdGFnIG9mIGEgSlNPTiBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge2FueX0gLSBqc29uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqIEB0aHJvd3Mge1lBV05FcnJvcn0gLSBpZiBqc29uIGhhcyB3ZWlyZCB0eXBlXG4qL1xuZnVuY3Rpb24gZ2V0VGFnKGpzb24pIHtcbiAgbGV0IHRhZyA9IG51bGw7XG5cbiAgaWYgKGlzQXJyYXkoanNvbikpIHtcbiAgICB0YWcgPSBTRVFfVEFHO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGpzb24pKSB7XG4gICAgdGFnID0gTUFQX1RBRztcbiAgfSBlbHNlIGlmIChpc051bGwoanNvbikpIHtcbiAgICB0YWcgPSBOVUxMX1RBRztcbiAgfSBlbHNlIGlmIChpc051bWJlcihqc29uKSkge1xuICAgIGlmIChqc29uICUgMTAgPT09IDApIHtcbiAgICAgIHRhZyA9IElOVF9UQUc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhZyA9IEZMT0FUX1RBRztcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNTdHJpbmcoanNvbikpIHtcbiAgICB0YWcgPSBTVFJfVEFHO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBZQVdORXJyb3IoJ1Vua25vd24gdHlwZScpO1xuICB9XG4gIHJldHVybiB0YWc7XG59XG5cbi8qXG4gKiBVcGRhdGUgYSBzZXF1ZW5jZSB3aXRoIG5ldyBKU09OXG4gKlxuICogQHBhcmFtIHtOb2RlfSBhc3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBuZXdKc29uXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKlxuKi9cbmZ1bmN0aW9uIHVwZGF0ZVNlcShhc3QsIG5ld0pzb24sIHlhbWwpIHtcbiAgbGV0IHZhbHVlcyA9IGxvYWQoc2VyaWFsaXplKGFzdCkpO1xuXG4gIC8vIG5ldyBpdGVtcyBpbiBuZXdKc29uXG4gIGxldCBuZXdJdGVtcyA9IGRpZmZlcmVuY2VXaXRoKG5ld0pzb24sIHZhbHVlcywgaXNFcXVhbCkucmV2ZXJzZSgpO1xuXG4gIGlmIChuZXdJdGVtcy5sZW5ndGgpIHtcbiAgICB5YW1sID0gaW5zZXJ0QWZ0ZXJOb2RlKGFzdCwgY2xlYW5EdW1wKG5ld0l0ZW1zKSwgeWFtbCk7XG4gIH1cblxuICAvLyBkZWxldGVkIGl0ZW1zIGluIG5ld0pzb25cbiAgbGV0IGRlbGV0ZWRJdGVtcyA9IGRpZmZlcmVuY2VXaXRoKHZhbHVlcywgbmV3SnNvbiwgaXNFcXVhbCk7XG5cbiAgZGVsZXRlZEl0ZW1zLmZvckVhY2goZGVsZXRlZEl0ZW09PiB7XG5cbiAgICAvLyBmaW5kIHRoZSBub2RlIGZvciB0aGlzIGl0ZW1cbiAgICBlYWNoKGFzdC52YWx1ZSwgbm9kZSA9PiB7XG4gICAgICBpZiAoaXNFcXVhbChsb2FkKHNlcmlhbGl6ZShub2RlKSksIGRlbGV0ZWRJdGVtKSkge1xuXG4gICAgICAgIC8vIHJlbW92ZSBpdCBmcm9tIHlhbWxcbiAgICAgICAgeWFtbCA9IHJlbW92ZUFycmF5RWxlbWVudChub2RlLCB5YW1sKTtcblxuICAgICAgICAvLyByZS1jb21wb3NlIHRoZSBBU1QgZm9yIGFjY3VyYXRlIHJlbW92YWxzIGFmdGVyXG4gICAgICAgIGFzdCA9IGNvbXBvc2UoeWFtbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB5YW1sO1xufVxuXG4vKlxuICogdXBkYXRlIGEgbWFwIHN0cnVjdHVyZSB3aXRoIG5ldyB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge0FTVH0gYXN0IC0gYSBtYXAgQVNUXG4gKiBAcGFyYW0ge2FueX0gbmV3SnNvblxuICogQHBhcmFtIHthbnl9IC0ganNvblxuICogQHBhcmFtIHtzdHJpbmd9IHlhbWxcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICogQHRocm93cyB7WUFXTkVycm9yfSAtIGlmIGpzb24gaGFzIHdlaXJkIHR5cGVcbiovXG5mdW5jdGlvbiB1cGRhdGVNYXAoYXN0LCBuZXdKc29uLCBqc29uLCB5YW1sKSB7XG5cbiAgLy8gbG9vayBmb3IgY2hhbmdlc1xuICBlYWNoKGFzdC52YWx1ZSwgcGFpciA9PiB7XG4gICAgbGV0IFtrZXlOb2RlLCB2YWxOb2RlXSA9IHBhaXI7XG5cbiAgICAvLyBub2RlIGlzIGRlbGV0ZWRcbiAgICBpZiAoaXNVbmRlZmluZWQobmV3SnNvbltrZXlOb2RlLnZhbHVlXSkpIHtcblxuICAgICAgLy8gVE9ETzogY2FuIHdlIHVzZSBvZiB0aGUgbWV0aG9kcyBiZWxvdz9cbiAgICAgIHlhbWwgPSB5YW1sLnN1YnN0cigwLCBrZXlOb2RlLnN0YXJ0X21hcmsucG9pbnRlcikgK1xuICAgICAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayh2YWxOb2RlKS5wb2ludGVyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdmFsdWUgPSBqc29uW2tleU5vZGUudmFsdWVdO1xuICAgIGxldCBuZXdWYWx1ZSA9IG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XG5cbiAgICAvLyBwcmltaXRpdmUgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICBpZiAobmV3VmFsdWUgIT09IHZhbHVlICYmICFpc0FycmF5KHZhbE5vZGUudmFsdWUpKSB7XG5cbiAgICAgIC8vIHJlcGxhY2UgdGhlIHZhbHVlIG5vZGVcbiAgICAgIHlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKHZhbE5vZGUsIG5ld1ZhbHVlLCB5YW1sKTtcblxuICAgICAgLy8gcmVtb3ZlIHRoZSBrZXkvdmFsdWUgZnJvbSBuZXdKc29uIHNvIGl0J3Mgbm90IGRldGVjdGVkIGFzIG5ldyBwYWlyIGluXG4gICAgICAvLyBsYXRlciBjb2RlXG4gICAgICBkZWxldGUgbmV3SnNvbltrZXlOb2RlLnZhbHVlXTtcbiAgICB9XG5cbiAgICAvLyBub24gcHJpbWl0aXZlIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgaWYgKCFpc0VxdWFsKG5ld1ZhbHVlLCB2YWx1ZSkgJiYgaXNBcnJheSh2YWxOb2RlLnZhbHVlKSkge1xuXG4gICAgICAvLyBhcnJheSB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgICAgaWYgKGlzQXJyYXkobmV3VmFsdWUpKSB7XG5cbiAgICAgICAgLy8gcmVjdXJzZVxuICAgICAgICB5YW1sID0gdXBkYXRlU2VxKHZhbE5vZGUsIG5ld1ZhbHVlLCB5YW1sKTtcblxuICAgICAgLy8gbWFwIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vIHJlY3Vyc2VcbiAgICAgICAgeWFtbCA9IHVwZGF0ZU1hcCh2YWxOb2RlLCBuZXdWYWx1ZSwgdmFsdWUsIHlhbWwpO1xuXG4gICAgICAgIGFzdCA9IGNvbXBvc2UoeWFtbCk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBrZXkvdmFsdWUgZnJvbSBuZXdKc29uIHNvIGl0J3Mgbm90IGRldGVjdGVkIGFzIG5ldyBwYWlyIGluXG4gICAgICAgIC8vIGxhdGVyIGNvZGVcbiAgICAgICAgZGVsZXRlIG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBsb29rIGZvciBuZXcgaXRlbXMgdG8gYWRkXG4gIGVhY2gobmV3SnNvbiwgKHZhbHVlLCBrZXkpPT4ge1xuXG4gICAgLy8gaXRlbSBpcyBuZXdcbiAgICBpZiAoaXNVbmRlZmluZWQoanNvbltrZXldKSkge1xuICAgICAgbGV0IG5ld1ZhbHVlID0gY2xlYW5EdW1wKHtba2V5XTogdmFsdWV9KTtcblxuICAgICAgeWFtbCA9IGluc2VydEFmdGVyTm9kZShhc3QsIG5ld1ZhbHVlLCB5YW1sKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB5YW1sO1xufVxuXG4vKlxuICogUGxhY2UgdmFsdWUgaW4gbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xuICpcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxuICogQHBhcmFtIHZhbHVlIHthbnl9XG4gKiBAcGFyYW0geWFtbCB7c3RyaW5nfVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVwbGFjZVByaW1pdGl2ZShub2RlLCB2YWx1ZSwgeWFtbCkge1xuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgbm9kZS5zdGFydF9tYXJrLnBvaW50ZXIpICtcbiAgICBTdHJpbmcodmFsdWUpICtcbiAgICB5YW1sLnN1YnN0cmluZyhub2RlLmVuZF9tYXJrLnBvaW50ZXIpO1xufVxuXG4vKlxuICogUGxhY2UgdmFsdWUgaW4gbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xuICpcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxuICogQHBhcmFtIHZhbHVlIHthbnl9XG4gKiBAcGFyYW0geWFtbCB7c3RyaW5nfVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVwbGFjZU5vZGUobm9kZSwgdmFsdWUsIHlhbWwpIHtcbiAgbGV0IGluZGVudGVkVmFsdWUgPSBpbmRlbnQodmFsdWUsIG5vZGUuc3RhcnRfbWFyay5jb2x1bW4pO1xuICBsZXQgbGluZVN0YXJ0ID0gbm9kZS5zdGFydF9tYXJrLnBvaW50ZXIgLSBub2RlLnN0YXJ0X21hcmsuY29sdW1uO1xuXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBsaW5lU3RhcnQpICtcbiAgICBpbmRlbnRlZFZhbHVlICtcbiAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyKTtcbn1cblxuLypcbiAqIFBsYWNlIHZhbHVlIGFmdGVyIG5vZGUgcmFuZ2UgaW4geWFtbCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gbm9kZSB7Tm9kZX1cbiAqIEBwYXJhbSB2YWx1ZSB7YW55fVxuICogQHBhcmFtIHlhbWwge3N0cmluZ31cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGluc2VydEFmdGVyTm9kZShub2RlLCB2YWx1ZSwgeWFtbCkge1xuICBsZXQgaW5kZW50ZWRWYWx1ZSA9IGluZGVudCh2YWx1ZSwgbm9kZS5zdGFydF9tYXJrLmNvbHVtbik7XG5cbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIpICtcbiAgICBMSU5FX1NFUEVSQVRPUiArXG4gICAgaW5kZW50ZWRWYWx1ZSArXG4gICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcik7XG59XG5cbi8qXG4gKiBSZW1vdmVzIGEgbm9kZSBmcm9tIGFycmF5XG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gcmVtb3ZlQXJyYXlFbGVtZW50KG5vZGUsIHlhbWwpIHtcblxuICAvLyBGSVhNRTogUmVtb3ZpbmcgZWxlbWVudCBmcm9tIGEgWUFNTCBsaWtlIGBbYSxiXWAgd29uJ3Qgd29yayB3aXRoIHRoaXMuXG5cbiAgLy8gZmluZCBpbmRleCBvZiBEQVNIKGAtYCkgY2hhcmFjdGVyIGZvciB0aGlzIGFycmF5XG4gIGxldCBpbmRleCA9IG5vZGUuc3RhcnRfbWFyay5wb2ludGVyO1xuICB3aGlsZSAoaW5kZXggPiAwICYmIHlhbWxbaW5kZXhdICE9PSBEQVNIKSB7XG4gICAgaW5kZXgtLTtcbiAgfVxuXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBpbmRleCkgK1xuICAgICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcik7XG59XG5cblxuLypcbiAqIEdldHMgZW5kIG1hcmsgb2YgYW4gQVNUXG4gKlxuICogQHBhcmFtIHtOb2RlfSBhc3RcbiAqXG4gKiBAcmV0dXNucyB7TWFya31cbiovXG5mdW5jdGlvbiBnZXROb2RlRW5kTWFyayhhc3QpIHtcbiAgaWYgKGlzQXJyYXkoYXN0LnZhbHVlKSAmJiBhc3QudmFsdWUubGVuZ3RoKSB7XG4gICAgbGV0IGxhc3RJdGVtID0gbGFzdChhc3QudmFsdWUpO1xuXG4gICAgaWYgKGlzQXJyYXkobGFzdEl0ZW0pICYmIGxhc3RJdGVtLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGdldE5vZGVFbmRNYXJrKGxhc3QobGFzdEl0ZW0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0Tm9kZUVuZE1hcmsobGFzdEl0ZW0pO1xuICB9XG5cbiAgcmV0dXJuIGFzdC5lbmRfbWFyaztcbn1cblxuLypcbiAqIEluZGVudHMgYSBzdHJpbmcgd2l0aCBudW1iZXIgb2YgY2hhcmFjdGVyc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7aW50ZWdlcn0gZGVwdGggLSBjYW4gYmUgbmVnYXRpdmUgYWxzb1xuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gaW5kZW50KHN0ciwgZGVwdGgpIHtcbiAgcmV0dXJuIHN0clxuICAgIC5zcGxpdChMSU5FX1NFUEVSQVRPUilcbiAgICAuZmlsdGVyKGxpbmUgPT4gbGluZSlcbiAgICAubWFwKGxpbmUgPT4gcmVwZWF0KFNQQUNFLCBkZXB0aCkgKyBsaW5lKVxuICAgIC5qb2luKExJTkVfU0VQRVJBVE9SKTtcbn1cblxuLypcbiAqIER1bXAgYSB2YWx1ZSB0byBZQU1MIHN0aW5nIHdpdGhvdXQgdGhlIHRyYWlsaW5nIG5ldyBsaW5lXG4gKlxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqXG4qL1xuZnVuY3Rpb24gY2xlYW5EdW1wKHZhbHVlKSB7XG4gIHJldHVybiBkdW1wKHZhbHVlKS5yZXBsYWNlKC9cXG4kLywgJycpO1xufVxuXG4vKlxuICogZmluZCBkaWZmZXJlbmNlIGJldHdlZW4gdHdvIGFycmF5cyBieSB1c2luZyBhIGNvbXBhcmlzb24gZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0ge2FycmF5PGFueT59IHNyY1xuICogQHBhcmFtIHthcnJheTxhbnk+fSBkZXN0XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wRm5cbiAqXG4gKiBAcmV0dXJucyB7YXJyYXl9XG4qL1xuZnVuY3Rpb24gZGlmZmVyZW5jZVdpdGgoc3JjLCBkZXN0LCBjb21wRm4pIHtcbiAgcmV0dXJuIHNyYy5maWx0ZXIoc3JjSXRlbT0+IHtcbiAgICByZXR1cm4gZGVzdC5ldmVyeShkZXN0SXRlbT0+IHtcbiAgICAgIHJldHVybiAhY29tcEZuKHNyY0l0ZW0sIGRlc3RJdGVtKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=
