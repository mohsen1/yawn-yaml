(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
      var _this = this;

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
        var values = ast.value.map(function (item) {
          return item.value;
        });

        // new items in newJson
        (0, _lodash.difference)(newJson, values).forEach(function (newItem) {
          _this.yaml = insertAfterNode(ast, cleanDump([newItem]), _this.yaml);
        });

        // deleted items in newJson
        (0, _lodash.difference)(values, newJson).forEach(function (deletedItem) {

          // find the node for this item
          (0, _lodash.each)(ast.value, function (node) {
            if ((0, _lodash.isEqual)(node.value, deletedItem)) {

              // remove it from yaml
              _this.yaml = removeArrayElement(ast, node, _this.yaml);
            }
          });
        });
      }
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
 * update a map structure with new values
 *
 * @param {any} - json
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

    // non primitive value had changed
    if (!(0, _lodash.isEqual)(newValue, value) && (0, _lodash.isArray)(valNode.value)) {

      // recurse
      yaml = updateMap(valNode, newValue, valNode.value, yaml);

      // remove the key/value from newJson so it's not detected as new pair in
      // later code
      delete newJson[keyNode.value];
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
 * Removes an element from array
 *
 * @param {AST} ast
 * @param {Node} element
 * @param {string} yaml
 *
 * @returns {string}
*/
function removeArrayElement(ast, element, yaml) {

  // FIXME: Removing element from a YAML like `[a,b]` won't work with this.

  // find index of DASH(`-`) character for this array
  var index = element.start_mark.pointer;
  while (index > 0 && yaml[index] !== DASH) {
    index--;
  }

  return yaml.substr(0, index) + yaml.substring(element.end_mark.pointer);
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

    if ((0, _lodash.isArray)(ast.value)) {
      var lastItem = (0, _lodash.last)(ast.value);

      if ((0, _lodash.isArray)(lastItem)) {
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

function cleanDump(value) {
  return (0, _jsYaml.dump)(value).replace(/\n$/, '');
}

// TODO: fix UMD exports...
if (typeof window !== 'undefined') {
  window.YAWN = YAWN;
}
module.exports = exports['default'];

},{"./error.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZXJyb3IuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7OztJQUVRLFNBQVM7WUFBVCxTQUFTOztBQUNqQixXQURRLFNBQVMsQ0FDaEIsT0FBTyxFQUFFOzBCQURGLFNBQVM7O0FBRTFCLCtCQUZpQixTQUFTLDZDQUVwQixPQUFPLEVBQUU7QUFDZixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztHQUN6Qjs7U0FMa0IsU0FBUztHQUFTLEtBQUs7O3FCQUF2QixTQUFTOzs7O0FDRjlCLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztzQkFFUyxTQUFTOztzQkFDTixTQUFTOztzQkFjM0IsUUFBUTs7dUJBRU8sWUFBWTs7OztBQUVsQyxJQUFNLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQztBQUMxQyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQzs7QUFFeEMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNsQixJQUFNLElBQUksR0FBRyxHQUFHLENBQUM7OztJQUdJLElBQUk7QUFFWixXQUZRLElBQUksQ0FFWCxHQUFHLEVBQUU7MEJBRkUsSUFBSTs7QUFHckIsUUFBSSxDQUFDLHNCQUFTLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLFlBQU0sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUMv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QUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztDQUNwQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV05FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5uYW1lID0gJ1lBV05FcnJvcic7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjb21wb3NlfSBmcm9tICd5YW1sLWpzJztcbmltcG9ydCB7bG9hZCwgZHVtcH0gZnJvbSAnanMteWFtbCc7XG5pbXBvcnQge1xuICBpc0FycmF5LFxuICBpc1N0cmluZyxcbiAgaXNPYmplY3QsXG4gIGlzVW5kZWZpbmVkLFxuICBpc051bGwsXG4gIGlzTnVtYmVyLFxuICBpc0VxdWFsLFxuICByZXBlYXQsXG4gIGVhY2gsXG4gIGNvbnRhaW5zLFxuICBsYXN0LFxuICBkaWZmZXJlbmNlXG59IGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCBZQVdORXJyb3IgZnJvbSAnLi9lcnJvci5qcyc7XG5cbmNvbnN0IE5VTExfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOm51bGwnO1xuY29uc3QgU1RSX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpzdHInO1xuY29uc3QgSU5UX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnO1xuY29uc3QgRkxPQVRfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JztcbmNvbnN0IE1BUF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6bWFwJztcbmNvbnN0IFNFUV9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6c2VxJztcblxuY29uc3QgTElORV9TRVBFUkFUT1IgPSAnXFxuJztcbmNvbnN0IFNQQUNFID0gJyAnO1xuY29uc3QgREFTSCA9ICctJztcblxuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgWUFXTiB7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBZQVdOIHtcblxuICBjb25zdHJ1Y3RvcihzdHIpIHtcbiAgICBpZiAoIWlzU3RyaW5nKHN0cikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0ciBzaG91bGQgYmUgYSBzdHJpbmcnKTtcbiAgICB9XG5cbiAgICB0aGlzLnlhbWwgPSBzdHI7XG4gIH1cblxuICBnZXQganNvbigpIHtcbiAgICByZXR1cm4gbG9hZCh0aGlzLnlhbWwpO1xuICB9XG5cbiAgc2V0IGpzb24obmV3SnNvbikge1xuXG4gICAgLy8gaWYganNvbiBpcyBub3QgY2hhbmdlZCBkbyBub3RoaW5nXG4gICAgaWYgKGlzRXF1YWwodGhpcy5qc29uLCBuZXdKc29uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGFzdCA9IGNvbXBvc2UodGhpcy55YW1sKTtcblxuICAgIGlmIChpc1VuZGVmaW5lZChuZXdKc29uKSkge1xuICAgICAgdGhpcy55YW1sID0gJyc7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGNoZWNrIGlmIGVudGlyZSBqc29uIGlzIGNoYW5nZWRcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgbGV0IG5ld1RhZyA9IGdldFRhZyhuZXdKc29uKTtcblxuICAgIGlmIChhc3QudGFnICE9PSBuZXdUYWcpIHtcbiAgICAgIGxldCBuZXdZYW1sID0gY2xlYW5EdW1wKG5ld0pzb24pO1xuXG4gICAgICAvLyByZXBsYWNlIHRoaXMueWFtbCB2YWx1ZSBmcm9tIHN0YXJ0IHRvIGVuZCBtYXJrIHdpdGggbmV3WWFtbCBpZiBub2RlIGlzXG4gICAgICAvLyBwcmltaXRpdmVcbiAgICAgIGlmICghaXNPYmplY3QobmV3SnNvbikpIHtcbiAgICAgICAgdGhpcy55YW1sID0gcmVwbGFjZVByaW1pdGl2ZShhc3QsIG5ld1lhbWwsIHRoaXMueWFtbCk7XG5cbiAgICAgIC8vIGlmIG5vZGUgaXMgbm90IHByaW1pdGl2ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy55YW1sID0gcmVwbGFjZU5vZGUoYXN0LCBuZXdZYW1sLCB0aGlzLnlhbWwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIE5VTExfVEFHLCBTVFJfVEFHLCBJTlRfVEFHLCBGTE9BVF9UQUdcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaWYgKGNvbnRhaW5zKFtOVUxMX1RBRywgU1RSX1RBRywgSU5UX1RBRywgRkxPQVRfVEFHXSwgYXN0LnRhZykpIHtcbiAgICAgIHRoaXMueWFtbCA9IHJlcGxhY2VQcmltaXRpdmUoYXN0LCBuZXdKc29uLCB0aGlzLnlhbWwpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTUFQX1RBR1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpZiAoYXN0LnRhZyA9PT0gTUFQX1RBRykge1xuICAgICAgbGV0IGpzb24gPSB0aGlzLmpzb247XG5cbiAgICAgIHRoaXMueWFtbCA9IHVwZGF0ZU1hcChhc3QsIG5ld0pzb24sIGpzb24sIHRoaXMueWFtbCk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFNFUV9UQUdcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaWYgKGFzdC50YWcgPT09IFNFUV9UQUcpIHtcbiAgICAgIGxldCB2YWx1ZXMgPSBhc3QudmFsdWUubWFwKGl0ZW0gPT4gaXRlbS52YWx1ZSk7XG5cbiAgICAgIC8vIG5ldyBpdGVtcyBpbiBuZXdKc29uXG4gICAgICBkaWZmZXJlbmNlKG5ld0pzb24sIHZhbHVlcykuZm9yRWFjaCgobmV3SXRlbSk9PiB7XG4gICAgICAgIHRoaXMueWFtbCA9IGluc2VydEFmdGVyTm9kZShhc3QsIGNsZWFuRHVtcChbbmV3SXRlbV0pLCB0aGlzLnlhbWwpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGRlbGV0ZWQgaXRlbXMgaW4gbmV3SnNvblxuICAgICAgZGlmZmVyZW5jZSh2YWx1ZXMsIG5ld0pzb24pLmZvckVhY2goKGRlbGV0ZWRJdGVtKT0+IHtcblxuICAgICAgICAvLyBmaW5kIHRoZSBub2RlIGZvciB0aGlzIGl0ZW1cbiAgICAgICAgZWFjaChhc3QudmFsdWUsIG5vZGUgPT4ge1xuICAgICAgICAgIGlmIChpc0VxdWFsKG5vZGUudmFsdWUsIGRlbGV0ZWRJdGVtKSkge1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgaXQgZnJvbSB5YW1sXG4gICAgICAgICAgICB0aGlzLnlhbWwgPSByZW1vdmVBcnJheUVsZW1lbnQoYXN0LCBub2RlLCB0aGlzLnlhbWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy55YW1sO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLmpzb247XG4gIH1cbn1cblxuLypcbiAqIERldGVybWluZXMgdGhlIEFTVCB0YWcgb2YgYSBKU09OIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7YW55fSAtIGpzb25cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICogQHRocm93cyB7WUFXTkVycm9yfSAtIGlmIGpzb24gaGFzIHdlaXJkIHR5cGVcbiovXG5mdW5jdGlvbiBnZXRUYWcoanNvbikge1xuICBsZXQgdGFnID0gbnVsbDtcblxuICBpZiAoaXNBcnJheShqc29uKSkge1xuICAgIHRhZyA9IFNFUV9UQUc7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoanNvbikpIHtcbiAgICB0YWcgPSBNQVBfVEFHO1xuICB9IGVsc2UgaWYgKGlzTnVsbChqc29uKSkge1xuICAgIHRhZyA9IE5VTExfVEFHO1xuICB9IGVsc2UgaWYgKGlzTnVtYmVyKGpzb24pKSB7XG4gICAgaWYgKGpzb24gJSAxMCA9PT0gMCkge1xuICAgICAgdGFnID0gSU5UX1RBRztcbiAgICB9IGVsc2Uge1xuICAgICAgdGFnID0gRkxPQVRfVEFHO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc1N0cmluZyhqc29uKSkge1xuICAgIHRhZyA9IFNUUl9UQUc7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFlBV05FcnJvcignVW5rbm93biB0eXBlJyk7XG4gIH1cbiAgcmV0dXJuIHRhZztcbn1cblxuLypcbiAqIHVwZGF0ZSBhIG1hcCBzdHJ1Y3R1cmUgd2l0aCBuZXcgdmFsdWVzXG4gKlxuICogQHBhcmFtIHthbnl9IC0ganNvblxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAdGhyb3dzIHtZQVdORXJyb3J9IC0gaWYganNvbiBoYXMgd2VpcmQgdHlwZVxuKi9cbmZ1bmN0aW9uIHVwZGF0ZU1hcChhc3QsIG5ld0pzb24sIGpzb24sIHlhbWwpIHtcblxuICAvLyBsb29rIGZvciBjaGFuZ2VzXG4gIGVhY2goYXN0LnZhbHVlLCBwYWlyID0+IHtcbiAgICBsZXQgW2tleU5vZGUsIHZhbE5vZGVdID0gcGFpcjtcblxuICAgIC8vIG5vZGUgaXMgZGVsZXRlZFxuICAgIGlmIChpc1VuZGVmaW5lZChuZXdKc29uW2tleU5vZGUudmFsdWVdKSkge1xuXG4gICAgICAvLyBUT0RPOiBjYW4gd2UgdXNlIG9mIHRoZSBtZXRob2RzIGJlbG93P1xuICAgICAgeWFtbCA9IHlhbWwuc3Vic3RyKDAsIGtleU5vZGUuc3RhcnRfbWFyay5wb2ludGVyKSArXG4gICAgICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKHZhbE5vZGUpLnBvaW50ZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB2YWx1ZSA9IGpzb25ba2V5Tm9kZS52YWx1ZV07XG4gICAgbGV0IG5ld1ZhbHVlID0gbmV3SnNvbltrZXlOb2RlLnZhbHVlXTtcblxuICAgIC8vIHByaW1pdGl2ZSB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUgJiYgIWlzQXJyYXkodmFsTm9kZS52YWx1ZSkpIHtcblxuICAgICAgLy8gcmVwbGFjZSB0aGUgdmFsdWUgbm9kZVxuICAgICAgeWFtbCA9IHJlcGxhY2VQcmltaXRpdmUodmFsTm9kZSwgbmV3VmFsdWUsIHlhbWwpO1xuXG4gICAgICAvLyByZW1vdmUgdGhlIGtleS92YWx1ZSBmcm9tIG5ld0pzb24gc28gaXQncyBub3QgZGV0ZWN0ZWQgYXMgbmV3IHBhaXIgaW5cbiAgICAgIC8vIGxhdGVyIGNvZGVcbiAgICAgIGRlbGV0ZSBuZXdKc29uW2tleU5vZGUudmFsdWVdO1xuICAgIH1cblxuICAgIC8vIG5vbiBwcmltaXRpdmUgdmFsdWUgaGFkIGNoYW5nZWRcbiAgICBpZiAoIWlzRXF1YWwobmV3VmFsdWUsIHZhbHVlKSAmJiBpc0FycmF5KHZhbE5vZGUudmFsdWUpKSB7XG5cbiAgICAgIC8vIHJlY3Vyc2VcbiAgICAgIHlhbWwgPSB1cGRhdGVNYXAodmFsTm9kZSwgbmV3VmFsdWUsIHZhbE5vZGUudmFsdWUsIHlhbWwpO1xuXG4gICAgICAvLyByZW1vdmUgdGhlIGtleS92YWx1ZSBmcm9tIG5ld0pzb24gc28gaXQncyBub3QgZGV0ZWN0ZWQgYXMgbmV3IHBhaXIgaW5cbiAgICAgIC8vIGxhdGVyIGNvZGVcbiAgICAgIGRlbGV0ZSBuZXdKc29uW2tleU5vZGUudmFsdWVdO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gbG9vayBmb3IgbmV3IGl0ZW1zIHRvIGFkZFxuICBlYWNoKG5ld0pzb24sICh2YWx1ZSwga2V5KT0+IHtcblxuICAgIC8vIGl0ZW0gaXMgbmV3XG4gICAgaWYgKGlzVW5kZWZpbmVkKGpzb25ba2V5XSkpIHtcbiAgICAgIGxldCBuZXdWYWx1ZSA9IGNsZWFuRHVtcCh7W2tleV06IHZhbHVlfSk7XG5cbiAgICAgIHlhbWwgPSBpbnNlcnRBZnRlck5vZGUoYXN0LCBuZXdWYWx1ZSwgeWFtbCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4geWFtbDtcbn1cblxuLypcbiAqIFBsYWNlIHZhbHVlIGluIG5vZGUgcmFuZ2UgaW4geWFtbCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gbm9kZSB7Tm9kZX1cbiAqIEBwYXJhbSB2YWx1ZSB7YW55fVxuICogQHBhcmFtIHlhbWwge3N0cmluZ31cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIHJlcGxhY2VQcmltaXRpdmUobm9kZSwgdmFsdWUsIHlhbWwpIHtcbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIG5vZGUuc3RhcnRfbWFyay5wb2ludGVyKSArXG4gICAgU3RyaW5nKHZhbHVlKSArXG4gICAgeWFtbC5zdWJzdHJpbmcobm9kZS5lbmRfbWFyay5wb2ludGVyKTtcbn1cblxuLypcbiAqIFBsYWNlIHZhbHVlIGluIG5vZGUgcmFuZ2UgaW4geWFtbCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gbm9kZSB7Tm9kZX1cbiAqIEBwYXJhbSB2YWx1ZSB7YW55fVxuICogQHBhcmFtIHlhbWwge3N0cmluZ31cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIHJlcGxhY2VOb2RlKG5vZGUsIHZhbHVlLCB5YW1sKSB7XG4gIGxldCBpbmRlbnRlZFZhbHVlID0gaW5kZW50KHZhbHVlLCBub2RlLnN0YXJ0X21hcmsuY29sdW1uKTtcbiAgbGV0IGxpbmVTdGFydCA9IG5vZGUuc3RhcnRfbWFyay5wb2ludGVyIC0gbm9kZS5zdGFydF9tYXJrLmNvbHVtbjtcblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgbGluZVN0YXJ0KSArXG4gICAgaW5kZW50ZWRWYWx1ZSArXG4gICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcik7XG59XG5cbi8qXG4gKiBQbGFjZSB2YWx1ZSBhZnRlciBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXG4gKlxuICogQHBhcmFtIG5vZGUge05vZGV9XG4gKiBAcGFyYW0gdmFsdWUge2FueX1cbiAqIEBwYXJhbSB5YW1sIHtzdHJpbmd9XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiBpbnNlcnRBZnRlck5vZGUobm9kZSwgdmFsdWUsIHlhbWwpIHtcbiAgbGV0IGluZGVudGVkVmFsdWUgPSBpbmRlbnQodmFsdWUsIG5vZGUuc3RhcnRfbWFyay5jb2x1bW4pO1xuXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyKSArXG4gICAgTElORV9TRVBFUkFUT1IgK1xuICAgIGluZGVudGVkVmFsdWUgK1xuICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIpO1xufVxuXG4vKlxuICogUmVtb3ZlcyBhbiBlbGVtZW50IGZyb20gYXJyYXlcbiAqXG4gKiBAcGFyYW0ge0FTVH0gYXN0XG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSB5YW1sXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiByZW1vdmVBcnJheUVsZW1lbnQoYXN0LCBlbGVtZW50LCB5YW1sKSB7XG5cbiAgLy8gRklYTUU6IFJlbW92aW5nIGVsZW1lbnQgZnJvbSBhIFlBTUwgbGlrZSBgW2EsYl1gIHdvbid0IHdvcmsgd2l0aCB0aGlzLlxuXG4gIC8vIGZpbmQgaW5kZXggb2YgREFTSChgLWApIGNoYXJhY3RlciBmb3IgdGhpcyBhcnJheVxuICBsZXQgaW5kZXggPSBlbGVtZW50LnN0YXJ0X21hcmsucG9pbnRlcjtcbiAgd2hpbGUgKGluZGV4ID4gMCAmJiB5YW1sW2luZGV4XSAhPT0gREFTSCkge1xuICAgIGluZGV4LS07XG4gIH1cblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgaW5kZXgpICtcbiAgICB5YW1sLnN1YnN0cmluZyhlbGVtZW50LmVuZF9tYXJrLnBvaW50ZXIpO1xufVxuXG5cbi8qXG4gKiBHZXRzIGVuZCBtYXJrIG9mIGFuIEFTVFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gYXN0XG4gKlxuICogQHJldHVzbnMge01hcmt9XG4qL1xuZnVuY3Rpb24gZ2V0Tm9kZUVuZE1hcmsoYXN0KSB7XG4gIGlmIChpc0FycmF5KGFzdC52YWx1ZSkpIHtcbiAgICBsZXQgbGFzdEl0ZW0gPSBsYXN0KGFzdC52YWx1ZSk7XG5cbiAgICBpZiAoaXNBcnJheShsYXN0SXRlbSkpIHtcbiAgICAgIHJldHVybiBnZXROb2RlRW5kTWFyayhsYXN0KGxhc3RJdGVtKSk7XG4gICAgfVxuICAgIHJldHVybiBnZXROb2RlRW5kTWFyayhsYXN0SXRlbSk7XG4gIH1cblxuICByZXR1cm4gYXN0LmVuZF9tYXJrO1xufVxuXG4vKlxuICogSW5kZW50cyBhIHN0cmluZyB3aXRoIG51bWJlciBvZiBjaGFyYWN0ZXJzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHBhcmFtIHtpbnRlZ2VyfSBkZXB0aCAtIGNhbiBiZSBuZWdhdGl2ZSBhbHNvXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiBpbmRlbnQoc3RyLCBkZXB0aCkge1xuICByZXR1cm4gc3RyXG4gICAgLnNwbGl0KExJTkVfU0VQRVJBVE9SKVxuICAgIC5maWx0ZXIobGluZSA9PiBsaW5lKVxuICAgIC5tYXAobGluZSA9PiByZXBlYXQoU1BBQ0UsIGRlcHRoKSArIGxpbmUpXG4gICAgLmpvaW4oTElORV9TRVBFUkFUT1IpO1xufVxuXG5mdW5jdGlvbiBjbGVhbkR1bXAodmFsdWUpIHtcbiAgcmV0dXJuIGR1bXAodmFsdWUpLnJlcGxhY2UoL1xcbiQvLCAnJyk7XG59XG5cbi8vIFRPRE86IGZpeCBVTUQgZXhwb3J0cy4uLlxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5ZQVdOID0gWUFXTjtcbn1cbiJdfQ==
