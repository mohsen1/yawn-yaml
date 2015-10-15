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
      yaml = updateMap(valNode, newValue, value, yaml);

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZXJyb3IuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7OztJQUVRLFNBQVM7WUFBVCxTQUFTOztBQUNqQixXQURRLFNBQVMsQ0FDaEIsT0FBTyxFQUFFOzBCQURGLFNBQVM7O0FBRTFCLCtCQUZpQixTQUFTLDZDQUVwQixPQUFPLEVBQUU7QUFDZixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztHQUN6Qjs7U0FMa0IsU0FBUztHQUFTLEtBQUs7O3FCQUF2QixTQUFTOzs7O0FDRjlCLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztzQkFFUyxTQUFTOztzQkFDTixTQUFTOztzQkFjM0IsUUFBUTs7dUJBRU8sWUFBWTs7OztBQUVsQyxJQUFNLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQztBQUMxQyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQztBQUM1QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztBQUN4QyxJQUFNLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQzs7QUFFeEMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzVCLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUNsQixJQUFNLElBQUksR0FBRyxHQUFHLENBQUM7OztJQUdJLElBQUk7QUFFWixXQUZRLElBQUksQ0FFWCxHQUFHLEVBQUU7MEJBRkUsSUFBSTs7QUFHckIsUUFBSSxDQUFDLHNCQUFTLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLFlBQU0sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUMv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QUFJLEdBQUcsSUFBSSxDQUFDO0NBQ3BCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWUFXTkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLm5hbWUgPSAnWUFXTkVycm9yJztcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NvbXBvc2V9IGZyb20gJ3lhbWwtanMnO1xuaW1wb3J0IHtsb2FkLCBkdW1wfSBmcm9tICdqcy15YW1sJztcbmltcG9ydCB7XG4gIGlzQXJyYXksXG4gIGlzU3RyaW5nLFxuICBpc09iamVjdCxcbiAgaXNVbmRlZmluZWQsXG4gIGlzTnVsbCxcbiAgaXNOdW1iZXIsXG4gIGlzRXF1YWwsXG4gIHJlcGVhdCxcbiAgZWFjaCxcbiAgY29udGFpbnMsXG4gIGxhc3QsXG4gIGRpZmZlcmVuY2Vcbn0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IFlBV05FcnJvciBmcm9tICcuL2Vycm9yLmpzJztcblxuY29uc3QgTlVMTF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6bnVsbCc7XG5jb25zdCBTVFJfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOnN0cic7XG5jb25zdCBJTlRfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOmludCc7XG5jb25zdCBGTE9BVF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnO1xuY29uc3QgTUFQX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjptYXAnO1xuY29uc3QgU0VRX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpzZXEnO1xuXG5jb25zdCBMSU5FX1NFUEVSQVRPUiA9ICdcXG4nO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5jb25zdCBEQVNIID0gJy0nO1xuXG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBZQVdOIHtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV04ge1xuXG4gIGNvbnN0cnVjdG9yKHN0cikge1xuICAgIGlmICghaXNTdHJpbmcoc3RyKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignc3RyIHNob3VsZCBiZSBhIHN0cmluZycpO1xuICAgIH1cblxuICAgIHRoaXMueWFtbCA9IHN0cjtcbiAgfVxuXG4gIGdldCBqc29uKCkge1xuICAgIHJldHVybiBsb2FkKHRoaXMueWFtbCk7XG4gIH1cblxuICBzZXQganNvbihuZXdKc29uKSB7XG5cbiAgICAvLyBpZiBqc29uIGlzIG5vdCBjaGFuZ2VkIGRvIG5vdGhpbmdcbiAgICBpZiAoaXNFcXVhbCh0aGlzLmpzb24sIG5ld0pzb24pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYXN0ID0gY29tcG9zZSh0aGlzLnlhbWwpO1xuXG4gICAgaWYgKGlzVW5kZWZpbmVkKG5ld0pzb24pKSB7XG4gICAgICB0aGlzLnlhbWwgPSAnJztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY2hlY2sgaWYgZW50aXJlIGpzb24gaXMgY2hhbmdlZFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBsZXQgbmV3VGFnID0gZ2V0VGFnKG5ld0pzb24pO1xuXG4gICAgaWYgKGFzdC50YWcgIT09IG5ld1RhZykge1xuICAgICAgbGV0IG5ld1lhbWwgPSBjbGVhbkR1bXAobmV3SnNvbik7XG5cbiAgICAgIC8vIHJlcGxhY2UgdGhpcy55YW1sIHZhbHVlIGZyb20gc3RhcnQgdG8gZW5kIG1hcmsgd2l0aCBuZXdZYW1sIGlmIG5vZGUgaXNcbiAgICAgIC8vIHByaW1pdGl2ZVxuICAgICAgaWYgKCFpc09iamVjdChuZXdKc29uKSkge1xuICAgICAgICB0aGlzLnlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKGFzdCwgbmV3WWFtbCwgdGhpcy55YW1sKTtcblxuICAgICAgLy8gaWYgbm9kZSBpcyBub3QgcHJpbWl0aXZlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnlhbWwgPSByZXBsYWNlTm9kZShhc3QsIG5ld1lhbWwsIHRoaXMueWFtbCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gTlVMTF9UQUcsIFNUUl9UQUcsIElOVF9UQUcsIEZMT0FUX1RBR1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpZiAoY29udGFpbnMoW05VTExfVEFHLCBTVFJfVEFHLCBJTlRfVEFHLCBGTE9BVF9UQUddLCBhc3QudGFnKSkge1xuICAgICAgdGhpcy55YW1sID0gcmVwbGFjZVByaW1pdGl2ZShhc3QsIG5ld0pzb24sIHRoaXMueWFtbCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBNQVBfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChhc3QudGFnID09PSBNQVBfVEFHKSB7XG4gICAgICBsZXQganNvbiA9IHRoaXMuanNvbjtcblxuICAgICAgdGhpcy55YW1sID0gdXBkYXRlTWFwKGFzdCwgbmV3SnNvbiwganNvbiwgdGhpcy55YW1sKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU0VRX1RBR1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpZiAoYXN0LnRhZyA9PT0gU0VRX1RBRykge1xuICAgICAgbGV0IHZhbHVlcyA9IGFzdC52YWx1ZS5tYXAoaXRlbSA9PiBpdGVtLnZhbHVlKTtcblxuICAgICAgLy8gbmV3IGl0ZW1zIGluIG5ld0pzb25cbiAgICAgIGRpZmZlcmVuY2UobmV3SnNvbiwgdmFsdWVzKS5mb3JFYWNoKChuZXdJdGVtKT0+IHtcbiAgICAgICAgdGhpcy55YW1sID0gaW5zZXJ0QWZ0ZXJOb2RlKGFzdCwgY2xlYW5EdW1wKFtuZXdJdGVtXSksIHRoaXMueWFtbCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gZGVsZXRlZCBpdGVtcyBpbiBuZXdKc29uXG4gICAgICBkaWZmZXJlbmNlKHZhbHVlcywgbmV3SnNvbikuZm9yRWFjaCgoZGVsZXRlZEl0ZW0pPT4ge1xuXG4gICAgICAgIC8vIGZpbmQgdGhlIG5vZGUgZm9yIHRoaXMgaXRlbVxuICAgICAgICBlYWNoKGFzdC52YWx1ZSwgbm9kZSA9PiB7XG4gICAgICAgICAgaWYgKGlzRXF1YWwobm9kZS52YWx1ZSwgZGVsZXRlZEl0ZW0pKSB7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBpdCBmcm9tIHlhbWxcbiAgICAgICAgICAgIHRoaXMueWFtbCA9IHJlbW92ZUFycmF5RWxlbWVudChhc3QsIG5vZGUsIHRoaXMueWFtbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnlhbWw7XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMuanNvbjtcbiAgfVxufVxuXG4vKlxuICogRGV0ZXJtaW5lcyB0aGUgQVNUIHRhZyBvZiBhIEpTT04gb2JqZWN0XG4gKlxuICogQHBhcmFtIHthbnl9IC0ganNvblxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAdGhyb3dzIHtZQVdORXJyb3J9IC0gaWYganNvbiBoYXMgd2VpcmQgdHlwZVxuKi9cbmZ1bmN0aW9uIGdldFRhZyhqc29uKSB7XG4gIGxldCB0YWcgPSBudWxsO1xuXG4gIGlmIChpc0FycmF5KGpzb24pKSB7XG4gICAgdGFnID0gU0VRX1RBRztcbiAgfSBlbHNlIGlmIChpc09iamVjdChqc29uKSkge1xuICAgIHRhZyA9IE1BUF9UQUc7XG4gIH0gZWxzZSBpZiAoaXNOdWxsKGpzb24pKSB7XG4gICAgdGFnID0gTlVMTF9UQUc7XG4gIH0gZWxzZSBpZiAoaXNOdW1iZXIoanNvbikpIHtcbiAgICBpZiAoanNvbiAlIDEwID09PSAwKSB7XG4gICAgICB0YWcgPSBJTlRfVEFHO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWcgPSBGTE9BVF9UQUc7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzU3RyaW5nKGpzb24pKSB7XG4gICAgdGFnID0gU1RSX1RBRztcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgWUFXTkVycm9yKCdVbmtub3duIHR5cGUnKTtcbiAgfVxuICByZXR1cm4gdGFnO1xufVxuXG4vKlxuICogdXBkYXRlIGEgbWFwIHN0cnVjdHVyZSB3aXRoIG5ldyB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge2FueX0gLSBqc29uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqIEB0aHJvd3Mge1lBV05FcnJvcn0gLSBpZiBqc29uIGhhcyB3ZWlyZCB0eXBlXG4qL1xuZnVuY3Rpb24gdXBkYXRlTWFwKGFzdCwgbmV3SnNvbiwganNvbiwgeWFtbCkge1xuXG4gIC8vIGxvb2sgZm9yIGNoYW5nZXNcbiAgZWFjaChhc3QudmFsdWUsIHBhaXIgPT4ge1xuICAgIGxldCBba2V5Tm9kZSwgdmFsTm9kZV0gPSBwYWlyO1xuXG4gICAgLy8gbm9kZSBpcyBkZWxldGVkXG4gICAgaWYgKGlzVW5kZWZpbmVkKG5ld0pzb25ba2V5Tm9kZS52YWx1ZV0pKSB7XG5cbiAgICAgIC8vIFRPRE86IGNhbiB3ZSB1c2Ugb2YgdGhlIG1ldGhvZHMgYmVsb3c/XG4gICAgICB5YW1sID0geWFtbC5zdWJzdHIoMCwga2V5Tm9kZS5zdGFydF9tYXJrLnBvaW50ZXIpICtcbiAgICAgICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsodmFsTm9kZSkucG9pbnRlcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHZhbHVlID0ganNvbltrZXlOb2RlLnZhbHVlXTtcbiAgICBsZXQgbmV3VmFsdWUgPSBuZXdKc29uW2tleU5vZGUudmFsdWVdO1xuXG4gICAgLy8gcHJpbWl0aXZlIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB2YWx1ZSAmJiAhaXNBcnJheSh2YWxOb2RlLnZhbHVlKSkge1xuXG4gICAgICAvLyByZXBsYWNlIHRoZSB2YWx1ZSBub2RlXG4gICAgICB5YW1sID0gcmVwbGFjZVByaW1pdGl2ZSh2YWxOb2RlLCBuZXdWYWx1ZSwgeWFtbCk7XG5cbiAgICAgIC8vIHJlbW92ZSB0aGUga2V5L3ZhbHVlIGZyb20gbmV3SnNvbiBzbyBpdCdzIG5vdCBkZXRlY3RlZCBhcyBuZXcgcGFpciBpblxuICAgICAgLy8gbGF0ZXIgY29kZVxuICAgICAgZGVsZXRlIG5ld0pzb25ba2V5Tm9kZS52YWx1ZV07XG4gICAgfVxuXG4gICAgLy8gbm9uIHByaW1pdGl2ZSB2YWx1ZSBoYWQgY2hhbmdlZFxuICAgIGlmICghaXNFcXVhbChuZXdWYWx1ZSwgdmFsdWUpICYmIGlzQXJyYXkodmFsTm9kZS52YWx1ZSkpIHtcblxuICAgICAgLy8gcmVjdXJzZVxuICAgICAgeWFtbCA9IHVwZGF0ZU1hcCh2YWxOb2RlLCBuZXdWYWx1ZSwgdmFsdWUsIHlhbWwpO1xuXG4gICAgICAvLyByZW1vdmUgdGhlIGtleS92YWx1ZSBmcm9tIG5ld0pzb24gc28gaXQncyBub3QgZGV0ZWN0ZWQgYXMgbmV3IHBhaXIgaW5cbiAgICAgIC8vIGxhdGVyIGNvZGVcbiAgICAgIGRlbGV0ZSBuZXdKc29uW2tleU5vZGUudmFsdWVdO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gbG9vayBmb3IgbmV3IGl0ZW1zIHRvIGFkZFxuICBlYWNoKG5ld0pzb24sICh2YWx1ZSwga2V5KT0+IHtcblxuICAgIC8vIGl0ZW0gaXMgbmV3XG4gICAgaWYgKGlzVW5kZWZpbmVkKGpzb25ba2V5XSkpIHtcbiAgICAgIGxldCBuZXdWYWx1ZSA9IGNsZWFuRHVtcCh7W2tleV06IHZhbHVlfSk7XG5cbiAgICAgIHlhbWwgPSBpbnNlcnRBZnRlck5vZGUoYXN0LCBuZXdWYWx1ZSwgeWFtbCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4geWFtbDtcbn1cblxuLypcbiAqIFBsYWNlIHZhbHVlIGluIG5vZGUgcmFuZ2UgaW4geWFtbCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gbm9kZSB7Tm9kZX1cbiAqIEBwYXJhbSB2YWx1ZSB7YW55fVxuICogQHBhcmFtIHlhbWwge3N0cmluZ31cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIHJlcGxhY2VQcmltaXRpdmUobm9kZSwgdmFsdWUsIHlhbWwpIHtcbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIG5vZGUuc3RhcnRfbWFyay5wb2ludGVyKSArXG4gICAgU3RyaW5nKHZhbHVlKSArXG4gICAgeWFtbC5zdWJzdHJpbmcobm9kZS5lbmRfbWFyay5wb2ludGVyKTtcbn1cblxuLypcbiAqIFBsYWNlIHZhbHVlIGluIG5vZGUgcmFuZ2UgaW4geWFtbCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0gbm9kZSB7Tm9kZX1cbiAqIEBwYXJhbSB2YWx1ZSB7YW55fVxuICogQHBhcmFtIHlhbWwge3N0cmluZ31cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIHJlcGxhY2VOb2RlKG5vZGUsIHZhbHVlLCB5YW1sKSB7XG4gIGxldCBpbmRlbnRlZFZhbHVlID0gaW5kZW50KHZhbHVlLCBub2RlLnN0YXJ0X21hcmsuY29sdW1uKTtcbiAgbGV0IGxpbmVTdGFydCA9IG5vZGUuc3RhcnRfbWFyay5wb2ludGVyIC0gbm9kZS5zdGFydF9tYXJrLmNvbHVtbjtcblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgbGluZVN0YXJ0KSArXG4gICAgaW5kZW50ZWRWYWx1ZSArXG4gICAgeWFtbC5zdWJzdHJpbmcoZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcik7XG59XG5cbi8qXG4gKiBQbGFjZSB2YWx1ZSBhZnRlciBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXG4gKlxuICogQHBhcmFtIG5vZGUge05vZGV9XG4gKiBAcGFyYW0gdmFsdWUge2FueX1cbiAqIEBwYXJhbSB5YW1sIHtzdHJpbmd9XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiBpbnNlcnRBZnRlck5vZGUobm9kZSwgdmFsdWUsIHlhbWwpIHtcbiAgbGV0IGluZGVudGVkVmFsdWUgPSBpbmRlbnQodmFsdWUsIG5vZGUuc3RhcnRfbWFyay5jb2x1bW4pO1xuXG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyKSArXG4gICAgTElORV9TRVBFUkFUT1IgK1xuICAgIGluZGVudGVkVmFsdWUgK1xuICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIpO1xufVxuXG4vKlxuICogUmVtb3ZlcyBhbiBlbGVtZW50IGZyb20gYXJyYXlcbiAqXG4gKiBAcGFyYW0ge0FTVH0gYXN0XG4gKiBAcGFyYW0ge05vZGV9IGVsZW1lbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSB5YW1sXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiByZW1vdmVBcnJheUVsZW1lbnQoYXN0LCBlbGVtZW50LCB5YW1sKSB7XG5cbiAgLy8gRklYTUU6IFJlbW92aW5nIGVsZW1lbnQgZnJvbSBhIFlBTUwgbGlrZSBgW2EsYl1gIHdvbid0IHdvcmsgd2l0aCB0aGlzLlxuXG4gIC8vIGZpbmQgaW5kZXggb2YgREFTSChgLWApIGNoYXJhY3RlciBmb3IgdGhpcyBhcnJheVxuICBsZXQgaW5kZXggPSBlbGVtZW50LnN0YXJ0X21hcmsucG9pbnRlcjtcbiAgd2hpbGUgKGluZGV4ID4gMCAmJiB5YW1sW2luZGV4XSAhPT0gREFTSCkge1xuICAgIGluZGV4LS07XG4gIH1cblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgaW5kZXgpICtcbiAgICB5YW1sLnN1YnN0cmluZyhlbGVtZW50LmVuZF9tYXJrLnBvaW50ZXIpO1xufVxuXG5cbi8qXG4gKiBHZXRzIGVuZCBtYXJrIG9mIGFuIEFTVFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gYXN0XG4gKlxuICogQHJldHVzbnMge01hcmt9XG4qL1xuZnVuY3Rpb24gZ2V0Tm9kZUVuZE1hcmsoYXN0KSB7XG4gIGlmIChpc0FycmF5KGFzdC52YWx1ZSkpIHtcbiAgICBsZXQgbGFzdEl0ZW0gPSBsYXN0KGFzdC52YWx1ZSk7XG5cbiAgICBpZiAoaXNBcnJheShsYXN0SXRlbSkpIHtcbiAgICAgIHJldHVybiBnZXROb2RlRW5kTWFyayhsYXN0KGxhc3RJdGVtKSk7XG4gICAgfVxuICAgIHJldHVybiBnZXROb2RlRW5kTWFyayhsYXN0SXRlbSk7XG4gIH1cblxuICByZXR1cm4gYXN0LmVuZF9tYXJrO1xufVxuXG4vKlxuICogSW5kZW50cyBhIHN0cmluZyB3aXRoIG51bWJlciBvZiBjaGFyYWN0ZXJzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHBhcmFtIHtpbnRlZ2VyfSBkZXB0aCAtIGNhbiBiZSBuZWdhdGl2ZSBhbHNvXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiBpbmRlbnQoc3RyLCBkZXB0aCkge1xuICByZXR1cm4gc3RyXG4gICAgLnNwbGl0KExJTkVfU0VQRVJBVE9SKVxuICAgIC5maWx0ZXIobGluZSA9PiBsaW5lKVxuICAgIC5tYXAobGluZSA9PiByZXBlYXQoU1BBQ0UsIGRlcHRoKSArIGxpbmUpXG4gICAgLmpvaW4oTElORV9TRVBFUkFUT1IpO1xufVxuXG5mdW5jdGlvbiBjbGVhbkR1bXAodmFsdWUpIHtcbiAgcmV0dXJuIGR1bXAodmFsdWUpLnJlcGxhY2UoL1xcbiQvLCAnJyk7XG59XG5cbi8vIFRPRE86IGZpeCBVTUQgZXhwb3J0cy4uLlxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHdpbmRvdy5ZQVdOID0gWUFXTjtcbn1cbiJdfQ==
