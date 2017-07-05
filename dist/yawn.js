(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.YAWN = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZXJyb3IuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7OztJQUVRLFNBQVM7WUFBVCxTQUFTOztBQUNqQixXQURRLFNBQVMsQ0FDaEIsT0FBTyxFQUFFOzBCQURGLFNBQVM7O0FBRTFCLCtCQUZpQixTQUFTLDZDQUVwQixPQUFPLEVBQUU7QUFDZixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztHQUN6Qjs7U0FMa0IsU0FBUztHQUFTLEtBQUs7O3FCQUF2QixTQUFTOzs7O0FDRjlCLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztzQkFFb0IsU0FBUzs7c0JBQ2pCLFNBQVM7O3NCQWEzQixRQUFROzt1QkFFTyxZQUFZOzs7O0FBRWxDLElBQU0sUUFBUSxHQUFHLHdCQUF3QixDQUFDO0FBQzFDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDO0FBQ3hDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDO0FBQ3hDLElBQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFDO0FBQzVDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDO0FBQ3hDLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDOztBQUV4QyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDNUIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQzs7O0lBR0ksSUFBSTtBQUVaLFdBRlEsSUFBSSxDQUVYLEdBQUcsRUFBRTswQkFGRSxJQUFJOztBQUdyQixRQUFJLENBQUMsc0JBQVMsR0FBRyxDQUFDLEVBQUU7QUFDbEIsWUFBTSxJQUFJLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQy9DOztBQUVELFFBQUksQ0FBQyxJQUFJ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QUFFL0IsVUFBSSxxQkFBUSxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO2FBQ2xCLGtCQUFLLFFBQVEsQ0FBQzs7QUFIbEMsZ0JBQVE7O09BSVg7O1dBRXFCLFFBQVE7O0FBTjFCLGNBQVE7O0tBT2I7O0FBRUQsV0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDO0dBQ3JCO0NBQUE7Ozs7Ozs7Ozs7QUFVRCxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQzFCLFNBQU8sR0FBRyxDQUNQLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FDckIsTUFBTSxDQUFDLFVBQUEsSUFBSTtXQUFJLElBQUk7R0FBQSxDQUFDLENBQ3BCLEdBQUcsQ0FBQyxVQUFBLElBQUk7V0FBSSxvQkFBTyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSTtHQUFBLENBQUMsQ0FDeEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0NBQ3pCOzs7Ozs7Ozs7O0FBVUQsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFO0FBQ3hCLFNBQU8sa0JBQUssS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztDQUN2Qzs7Ozs7Ozs7Ozs7QUFXRCxTQUFTLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUN6QyxTQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBQSxPQUFPLEVBQUc7QUFDMUIsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQUEsUUFBUSxFQUFHO0FBQzNCLGFBQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ25DLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWUFXTkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLm5hbWUgPSAnWUFXTkVycm9yJztcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NvbXBvc2UsIHNlcmlhbGl6ZX0gZnJvbSAneWFtbC1qcyc7XG5pbXBvcnQge2xvYWQsIGR1bXB9IGZyb20gJ2pzLXlhbWwnO1xuaW1wb3J0IHtcbiAgaXNBcnJheSxcbiAgaXNTdHJpbmcsXG4gIGlzT2JqZWN0LFxuICBpc1VuZGVmaW5lZCxcbiAgaXNOdWxsLFxuICBpc051bWJlcixcbiAgaXNFcXVhbCxcbiAgcmVwZWF0LFxuICBlYWNoLFxuICBpbmNsdWRlcyxcbiAgbGFzdFxufSBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgWUFXTkVycm9yIGZyb20gJy4vZXJyb3IuanMnO1xuXG5jb25zdCBOVUxMX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpudWxsJztcbmNvbnN0IFNUUl9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6c3RyJztcbmNvbnN0IElOVF9UQUcgPSAndGFnOnlhbWwub3JnLDIwMDI6aW50JztcbmNvbnN0IEZMT0FUX1RBRyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCc7XG5jb25zdCBNQVBfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOm1hcCc7XG5jb25zdCBTRVFfVEFHID0gJ3RhZzp5YW1sLm9yZywyMDAyOnNlcSc7XG5cbmNvbnN0IExJTkVfU0VQRVJBVE9SID0gJ1xcbic7XG5jb25zdCBTUEFDRSA9ICcgJztcbmNvbnN0IERBU0ggPSAnLSc7XG5cbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFlBV04ge1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWUFXTiB7XG5cbiAgY29uc3RydWN0b3Ioc3RyKSB7XG4gICAgaWYgKCFpc1N0cmluZyhzdHIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzdHIgc2hvdWxkIGJlIGEgc3RyaW5nJyk7XG4gICAgfVxuXG4gICAgdGhpcy55YW1sID0gc3RyO1xuICB9XG5cbiAgZ2V0IGpzb24oKSB7XG4gICAgcmV0dXJuIGxvYWQodGhpcy55YW1sKTtcbiAgfVxuXG4gIHNldCBqc29uKG5ld0pzb24pIHtcblxuICAgIC8vIGlmIGpzb24gaXMgbm90IGNoYW5nZWQgZG8gbm90aGluZ1xuICAgIGlmIChpc0VxdWFsKHRoaXMuanNvbiwgbmV3SnNvbikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhc3QgPSBjb21wb3NlKHRoaXMueWFtbCk7XG5cbiAgICBpZiAoaXNVbmRlZmluZWQobmV3SnNvbikpIHtcbiAgICAgIHRoaXMueWFtbCA9ICcnO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBjaGVjayBpZiBlbnRpcmUganNvbiBpcyBjaGFuZ2VkXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxldCBuZXdUYWcgPSBnZXRUYWcobmV3SnNvbik7XG5cbiAgICBpZiAoYXN0LnRhZyAhPT0gbmV3VGFnKSB7XG4gICAgICBsZXQgbmV3WWFtbCA9IGNsZWFuRHVtcChuZXdKc29uKTtcblxuICAgICAgLy8gcmVwbGFjZSB0aGlzLnlhbWwgdmFsdWUgZnJvbSBzdGFydCB0byBlbmQgbWFyayB3aXRoIG5ld1lhbWwgaWYgbm9kZSBpc1xuICAgICAgLy8gcHJpbWl0aXZlXG4gICAgICBpZiAoIWlzT2JqZWN0KG5ld0pzb24pKSB7XG4gICAgICAgIHRoaXMueWFtbCA9IHJlcGxhY2VQcmltaXRpdmUoYXN0LCBuZXdZYW1sLCB0aGlzLnlhbWwpO1xuXG4gICAgICAvLyBpZiBub2RlIGlzIG5vdCBwcmltaXRpdmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMueWFtbCA9IHJlcGxhY2VOb2RlKGFzdCwgbmV3WWFtbCwgdGhpcy55YW1sKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBOVUxMX1RBRywgU1RSX1RBRywgSU5UX1RBRywgRkxPQVRfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChpbmNsdWRlcyhbTlVMTF9UQUcsIFNUUl9UQUcsIElOVF9UQUcsIEZMT0FUX1RBR10sIGFzdC50YWcpKSB7XG4gICAgICB0aGlzLnlhbWwgPSByZXBsYWNlUHJpbWl0aXZlKGFzdCwgbmV3SnNvbiwgdGhpcy55YW1sKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIE1BUF9UQUdcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaWYgKGFzdC50YWcgPT09IE1BUF9UQUcpIHtcbiAgICAgIGxldCBqc29uID0gdGhpcy5qc29uO1xuXG4gICAgICB0aGlzLnlhbWwgPSB1cGRhdGVNYXAoYXN0LCBuZXdKc29uLCBqc29uLCB0aGlzLnlhbWwpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTRVFfVEFHXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlmIChhc3QudGFnID09PSBTRVFfVEFHKSB7XG4gICAgICB0aGlzLnlhbWwgPSB1cGRhdGVTZXEoYXN0LCBuZXdKc29uLCB0aGlzLnlhbWwpO1xuICAgIH1cblxuICAgIC8vIFRyaW0gdHJhaWxpbmcgd2hpdGVzcGFjZXNcbiAgICB0aGlzLnlhbWwgPSB0aGlzLnlhbWxcbiAgICAgIC5zcGxpdChMSU5FX1NFUEVSQVRPUilcbiAgICAgIC5tYXAobGluZT0+IGxpbmUucmVwbGFjZSgvWyBcXHRdKyQvLCAnJykpXG4gICAgICAuam9pbihMSU5FX1NFUEVSQVRPUik7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy55YW1sO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLmpzb247XG4gIH1cbn1cblxuLypcbiAqIERldGVybWluZXMgdGhlIEFTVCB0YWcgb2YgYSBKU09OIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7YW55fSAtIGpzb25cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICogQHRocm93cyB7WUFXTkVycm9yfSAtIGlmIGpzb24gaGFzIHdlaXJkIHR5cGVcbiovXG5mdW5jdGlvbiBnZXRUYWcoanNvbikge1xuICBsZXQgdGFnID0gbnVsbDtcblxuICBpZiAoaXNBcnJheShqc29uKSkge1xuICAgIHRhZyA9IFNFUV9UQUc7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoanNvbikpIHtcbiAgICB0YWcgPSBNQVBfVEFHO1xuICB9IGVsc2UgaWYgKGlzTnVsbChqc29uKSkge1xuICAgIHRhZyA9IE5VTExfVEFHO1xuICB9IGVsc2UgaWYgKGlzTnVtYmVyKGpzb24pKSB7XG4gICAgaWYgKGpzb24gJSAxMCA9PT0gMCkge1xuICAgICAgdGFnID0gSU5UX1RBRztcbiAgICB9IGVsc2Uge1xuICAgICAgdGFnID0gRkxPQVRfVEFHO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc1N0cmluZyhqc29uKSkge1xuICAgIHRhZyA9IFNUUl9UQUc7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFlBV05FcnJvcignVW5rbm93biB0eXBlJyk7XG4gIH1cbiAgcmV0dXJuIHRhZztcbn1cblxuLypcbiAqIFVwZGF0ZSBhIHNlcXVlbmNlIHdpdGggbmV3IEpTT05cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGFzdFxuICogQHBhcmFtIHtvYmplY3R9IG5ld0pzb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB5YW1sXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqXG4qL1xuZnVuY3Rpb24gdXBkYXRlU2VxKGFzdCwgbmV3SnNvbiwgeWFtbCkge1xuICBsZXQgdmFsdWVzID0gbG9hZChzZXJpYWxpemUoYXN0KSk7XG5cbiAgLy8gbmV3IGl0ZW1zIGluIG5ld0pzb25cbiAgbGV0IG5ld0l0ZW1zID0gZGlmZmVyZW5jZVdpdGgobmV3SnNvbiwgdmFsdWVzLCBpc0VxdWFsKS5yZXZlcnNlKCk7XG5cbiAgaWYgKG5ld0l0ZW1zLmxlbmd0aCkge1xuICAgIHlhbWwgPSBpbnNlcnRBZnRlck5vZGUoYXN0LCBjbGVhbkR1bXAobmV3SXRlbXMpLCB5YW1sKTtcbiAgfVxuXG4gIC8vIGRlbGV0ZWQgaXRlbXMgaW4gbmV3SnNvblxuICBsZXQgZGVsZXRlZEl0ZW1zID0gZGlmZmVyZW5jZVdpdGgodmFsdWVzLCBuZXdKc29uLCBpc0VxdWFsKTtcblxuICBkZWxldGVkSXRlbXMuZm9yRWFjaChkZWxldGVkSXRlbT0+IHtcblxuICAgIC8vIGZpbmQgdGhlIG5vZGUgZm9yIHRoaXMgaXRlbVxuICAgIGVhY2goYXN0LnZhbHVlLCBub2RlID0+IHtcbiAgICAgIGlmIChpc0VxdWFsKGxvYWQoc2VyaWFsaXplKG5vZGUpKSwgZGVsZXRlZEl0ZW0pKSB7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGl0IGZyb20geWFtbFxuICAgICAgICB5YW1sID0gcmVtb3ZlQXJyYXlFbGVtZW50KG5vZGUsIHlhbWwpO1xuXG4gICAgICAgIC8vIHJlLWNvbXBvc2UgdGhlIEFTVCBmb3IgYWNjdXJhdGUgcmVtb3ZhbHMgYWZ0ZXJcbiAgICAgICAgYXN0ID0gY29tcG9zZSh5YW1sKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHlhbWw7XG59XG5cbi8qXG4gKiB1cGRhdGUgYSBtYXAgc3RydWN0dXJlIHdpdGggbmV3IHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7QVNUfSBhc3QgLSBhIG1hcCBBU1RcbiAqIEBwYXJhbSB7YW55fSBuZXdKc29uXG4gKiBAcGFyYW0ge2FueX0gLSBqc29uXG4gKiBAcGFyYW0ge3N0cmluZ30geWFtbFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiBAdGhyb3dzIHtZQVdORXJyb3J9IC0gaWYganNvbiBoYXMgd2VpcmQgdHlwZVxuKi9cbmZ1bmN0aW9uIHVwZGF0ZU1hcChhc3QsIG5ld0pzb24sIGpzb24sIHlhbWwpIHtcblxuICAvLyBsb29rIGZvciBjaGFuZ2VzXG4gIGVhY2goYXN0LnZhbHVlLCBwYWlyID0+IHtcbiAgICBsZXQgW2tleU5vZGUsIHZhbE5vZGVdID0gcGFpcjtcblxuICAgIC8vIG5vZGUgaXMgZGVsZXRlZFxuICAgIGlmIChpc1VuZGVmaW5lZChuZXdKc29uW2tleU5vZGUudmFsdWVdKSkge1xuXG4gICAgICAvLyBUT0RPOiBjYW4gd2UgdXNlIG9mIHRoZSBtZXRob2RzIGJlbG93P1xuICAgICAgeWFtbCA9IHlhbWwuc3Vic3RyKDAsIGtleU5vZGUuc3RhcnRfbWFyay5wb2ludGVyKSArXG4gICAgICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKHZhbE5vZGUpLnBvaW50ZXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB2YWx1ZSA9IGpzb25ba2V5Tm9kZS52YWx1ZV07XG4gICAgbGV0IG5ld1ZhbHVlID0gbmV3SnNvbltrZXlOb2RlLnZhbHVlXTtcblxuICAgIC8vIHByaW1pdGl2ZSB2YWx1ZSBoYXMgY2hhbmdlZFxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUgJiYgIWlzQXJyYXkodmFsTm9kZS52YWx1ZSkpIHtcblxuICAgICAgLy8gcmVwbGFjZSB0aGUgdmFsdWUgbm9kZVxuICAgICAgeWFtbCA9IHJlcGxhY2VQcmltaXRpdmUodmFsTm9kZSwgbmV3VmFsdWUsIHlhbWwpO1xuXG4gICAgICAvLyByZW1vdmUgdGhlIGtleS92YWx1ZSBmcm9tIG5ld0pzb24gc28gaXQncyBub3QgZGV0ZWN0ZWQgYXMgbmV3IHBhaXIgaW5cbiAgICAgIC8vIGxhdGVyIGNvZGVcbiAgICAgIGRlbGV0ZSBuZXdKc29uW2tleU5vZGUudmFsdWVdO1xuICAgIH1cblxuICAgIC8vIG5vbiBwcmltaXRpdmUgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICBpZiAoIWlzRXF1YWwobmV3VmFsdWUsIHZhbHVlKSAmJiBpc0FycmF5KHZhbE5vZGUudmFsdWUpKSB7XG5cbiAgICAgIC8vIGFycmF5IHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgICBpZiAoaXNBcnJheShuZXdWYWx1ZSkpIHtcblxuICAgICAgICAvLyByZWN1cnNlXG4gICAgICAgIHlhbWwgPSB1cGRhdGVTZXEodmFsTm9kZSwgbmV3VmFsdWUsIHlhbWwpO1xuXG4gICAgICAvLyBtYXAgdmFsdWUgaGFzIGNoYW5nZWRcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy8gcmVjdXJzZVxuICAgICAgICB5YW1sID0gdXBkYXRlTWFwKHZhbE5vZGUsIG5ld1ZhbHVlLCB2YWx1ZSwgeWFtbCk7XG5cbiAgICAgICAgYXN0ID0gY29tcG9zZSh5YW1sKTtcblxuICAgICAgICAvLyByZW1vdmUgdGhlIGtleS92YWx1ZSBmcm9tIG5ld0pzb24gc28gaXQncyBub3QgZGV0ZWN0ZWQgYXMgbmV3IHBhaXIgaW5cbiAgICAgICAgLy8gbGF0ZXIgY29kZVxuICAgICAgICBkZWxldGUgbmV3SnNvbltrZXlOb2RlLnZhbHVlXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIGxvb2sgZm9yIG5ldyBpdGVtcyB0byBhZGRcbiAgZWFjaChuZXdKc29uLCAodmFsdWUsIGtleSk9PiB7XG5cbiAgICAvLyBpdGVtIGlzIG5ld1xuICAgIGlmIChpc1VuZGVmaW5lZChqc29uW2tleV0pKSB7XG4gICAgICBsZXQgbmV3VmFsdWUgPSBjbGVhbkR1bXAoe1trZXldOiB2YWx1ZX0pO1xuXG4gICAgICB5YW1sID0gaW5zZXJ0QWZ0ZXJOb2RlKGFzdCwgbmV3VmFsdWUsIHlhbWwpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHlhbWw7XG59XG5cbi8qXG4gKiBQbGFjZSB2YWx1ZSBpbiBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXG4gKlxuICogQHBhcmFtIG5vZGUge05vZGV9XG4gKiBAcGFyYW0gdmFsdWUge2FueX1cbiAqIEBwYXJhbSB5YW1sIHtzdHJpbmd9XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiByZXBsYWNlUHJpbWl0aXZlKG5vZGUsIHZhbHVlLCB5YW1sKSB7XG4gIHJldHVybiB5YW1sLnN1YnN0cigwLCBub2RlLnN0YXJ0X21hcmsucG9pbnRlcikgK1xuICAgIFN0cmluZyh2YWx1ZSkgK1xuICAgIHlhbWwuc3Vic3RyaW5nKG5vZGUuZW5kX21hcmsucG9pbnRlcik7XG59XG5cbi8qXG4gKiBQbGFjZSB2YWx1ZSBpbiBub2RlIHJhbmdlIGluIHlhbWwgc3RyaW5nXG4gKlxuICogQHBhcmFtIG5vZGUge05vZGV9XG4gKiBAcGFyYW0gdmFsdWUge2FueX1cbiAqIEBwYXJhbSB5YW1sIHtzdHJpbmd9XG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiByZXBsYWNlTm9kZShub2RlLCB2YWx1ZSwgeWFtbCkge1xuICBsZXQgaW5kZW50ZWRWYWx1ZSA9IGluZGVudCh2YWx1ZSwgbm9kZS5zdGFydF9tYXJrLmNvbHVtbik7XG4gIGxldCBsaW5lU3RhcnQgPSBub2RlLnN0YXJ0X21hcmsucG9pbnRlciAtIG5vZGUuc3RhcnRfbWFyay5jb2x1bW47XG5cbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGxpbmVTdGFydCkgK1xuICAgIGluZGVudGVkVmFsdWUgK1xuICAgIHlhbWwuc3Vic3RyaW5nKGdldE5vZGVFbmRNYXJrKG5vZGUpLnBvaW50ZXIpO1xufVxuXG4vKlxuICogUGxhY2UgdmFsdWUgYWZ0ZXIgbm9kZSByYW5nZSBpbiB5YW1sIHN0cmluZ1xuICpcbiAqIEBwYXJhbSBub2RlIHtOb2RlfVxuICogQHBhcmFtIHZhbHVlIHthbnl9XG4gKiBAcGFyYW0geWFtbCB7c3RyaW5nfVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gaW5zZXJ0QWZ0ZXJOb2RlKG5vZGUsIHZhbHVlLCB5YW1sKSB7XG4gIGxldCBpbmRlbnRlZFZhbHVlID0gaW5kZW50KHZhbHVlLCBub2RlLnN0YXJ0X21hcmsuY29sdW1uKTtcblxuICByZXR1cm4geWFtbC5zdWJzdHIoMCwgZ2V0Tm9kZUVuZE1hcmsobm9kZSkucG9pbnRlcikgK1xuICAgIExJTkVfU0VQRVJBVE9SICtcbiAgICBpbmRlbnRlZFZhbHVlICtcbiAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyKTtcbn1cblxuLypcbiAqIFJlbW92ZXMgYSBub2RlIGZyb20gYXJyYXlcbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB5YW1sXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiByZW1vdmVBcnJheUVsZW1lbnQobm9kZSwgeWFtbCkge1xuXG4gIC8vIEZJWE1FOiBSZW1vdmluZyBlbGVtZW50IGZyb20gYSBZQU1MIGxpa2UgYFthLGJdYCB3b24ndCB3b3JrIHdpdGggdGhpcy5cblxuICAvLyBmaW5kIGluZGV4IG9mIERBU0goYC1gKSBjaGFyYWN0ZXIgZm9yIHRoaXMgYXJyYXlcbiAgbGV0IGluZGV4ID0gbm9kZS5zdGFydF9tYXJrLnBvaW50ZXI7XG4gIHdoaWxlIChpbmRleCA+IDAgJiYgeWFtbFtpbmRleF0gIT09IERBU0gpIHtcbiAgICBpbmRleC0tO1xuICB9XG5cbiAgcmV0dXJuIHlhbWwuc3Vic3RyKDAsIGluZGV4KSArXG4gICAgICB5YW1sLnN1YnN0cmluZyhnZXROb2RlRW5kTWFyayhub2RlKS5wb2ludGVyKTtcbn1cblxuXG4vKlxuICogR2V0cyBlbmQgbWFyayBvZiBhbiBBU1RcbiAqXG4gKiBAcGFyYW0ge05vZGV9IGFzdFxuICpcbiAqIEByZXR1c25zIHtNYXJrfVxuKi9cbmZ1bmN0aW9uIGdldE5vZGVFbmRNYXJrKGFzdCkge1xuICBpZiAoaXNBcnJheShhc3QudmFsdWUpICYmIGFzdC52YWx1ZS5sZW5ndGgpIHtcbiAgICBsZXQgbGFzdEl0ZW0gPSBsYXN0KGFzdC52YWx1ZSk7XG5cbiAgICBpZiAoaXNBcnJheShsYXN0SXRlbSkgJiYgbGFzdEl0ZW0ubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZ2V0Tm9kZUVuZE1hcmsobGFzdChsYXN0SXRlbSkpO1xuICAgIH1cblxuICAgIHJldHVybiBnZXROb2RlRW5kTWFyayhsYXN0SXRlbSk7XG4gIH1cblxuICByZXR1cm4gYXN0LmVuZF9tYXJrO1xufVxuXG4vKlxuICogSW5kZW50cyBhIHN0cmluZyB3aXRoIG51bWJlciBvZiBjaGFyYWN0ZXJzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHBhcmFtIHtpbnRlZ2VyfSBkZXB0aCAtIGNhbiBiZSBuZWdhdGl2ZSBhbHNvXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiovXG5mdW5jdGlvbiBpbmRlbnQoc3RyLCBkZXB0aCkge1xuICByZXR1cm4gc3RyXG4gICAgLnNwbGl0KExJTkVfU0VQRVJBVE9SKVxuICAgIC5maWx0ZXIobGluZSA9PiBsaW5lKVxuICAgIC5tYXAobGluZSA9PiByZXBlYXQoU1BBQ0UsIGRlcHRoKSArIGxpbmUpXG4gICAgLmpvaW4oTElORV9TRVBFUkFUT1IpO1xufVxuXG4vKlxuICogRHVtcCBhIHZhbHVlIHRvIFlBTUwgc3Rpbmcgd2l0aG91dCB0aGUgdHJhaWxpbmcgbmV3IGxpbmVcbiAqXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICpcbiovXG5mdW5jdGlvbiBjbGVhbkR1bXAodmFsdWUpIHtcbiAgcmV0dXJuIGR1bXAodmFsdWUpLnJlcGxhY2UoL1xcbiQvLCAnJyk7XG59XG5cbi8qXG4gKiBmaW5kIGRpZmZlcmVuY2UgYmV0d2VlbiB0d28gYXJyYXlzIGJ5IHVzaW5nIGEgY29tcGFyaXNvbiBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7YXJyYXk8YW55Pn0gc3JjXG4gKiBAcGFyYW0ge2FycmF5PGFueT59IGRlc3RcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBGblxuICpcbiAqIEByZXR1cm5zIHthcnJheX1cbiovXG5mdW5jdGlvbiBkaWZmZXJlbmNlV2l0aChzcmMsIGRlc3QsIGNvbXBGbikge1xuICByZXR1cm4gc3JjLmZpbHRlcihzcmNJdGVtPT4ge1xuICAgIHJldHVybiBkZXN0LmV2ZXJ5KGRlc3RJdGVtPT4ge1xuICAgICAgcmV0dXJuICFjb21wRm4oc3JjSXRlbSwgZGVzdEl0ZW0pO1xuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==
