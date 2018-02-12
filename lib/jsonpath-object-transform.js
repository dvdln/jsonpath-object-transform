/*jshint evil:true*/
/*global module, require, define*/

(function (root, factory) {
  'use strict';

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('jsonpathObjectTransform', ['JSONPath'], function(jsonPath) {
      return (root.jsonpathObjectTransform = factory(jsonPath));
    });
  }

  // Node
  else if (typeof exports === 'object') {
    module.exports = factory(require('JSONPath'));
  }

  // Browser global
  else {
    root.jsonpathObjectTransform = factory(root.jsonPath);
  }
}(this, function(jsonPath) {
  'use strict';

  /**
   * Step through data object and apply path transforms.
   *
   * @param {object} data
   * @param {object} path
   * @param {object} result
   * @param {string} key
   */
  function walk(data, path, result, key) {
    var fn;
    // if the key starts with $., assume that it's dynamic and should be evaluated
    if (key && key.toString().indexOf('$.')>-1) {
      key = jsonPath.eval(data, key);
    }
    
    switch (type(path)) {
      case 'string':
        fn = seekSingle;
        break;

      case 'array':
        fn = seekArray;
        break;

      case 'object':
        fn = seekObject;
        break;
    }

    if (fn) {
      fn(data, path, result, key);
    }
  }

  /**
   * Determine type of object.
   *
   * @param {object} obj
   * @returns {string}
   */
  function type(obj) {
    return Array.isArray(obj) ? 'array' : typeof obj;
  }

  /**
   * Get single property from data object.
   *
   * @param {object} data
   * @param {string} pathStr
   * @param {object} result
   * @param {string} key
   */
  function seekSingle(data, pathStr, result, key) {
    var seek = jsonPath.eval(data, pathStr) || [];

    result[key] = seek.length ? seek[0] : undefined;
  }

  /**
   * Get array of properties from data object.
   *
   * @param {object} data
   * @param {array} pathArr
   * @param {object} result
   * @param {string} key
   */
  function seekArray(data, pathArr, result, key) {
    var subpath = pathArr[1];
    var path = pathArr[0];
    var seek = jsonPath.eval(data, path) || [];
    var mergeArray = pathArr[2] && pathArr[2].merge;

    if (seek.length && subpath) {
      result[key] = [];
      seek.forEach(function(items, seekIndex) {
        items.forEach((item, itemIndex) => {
          // itemIndex/seekIndex + 1 is so we are never multiplying by 0 which would throw off where the items should go
          // subtract one after getting the index to rebase to 0
          walk(item, subpath, result[key], (itemIndex + 1) * (seekIndex + 1) - 1);
        });
      });
      if(mergeArray) {
        // merge the individual objects in the array into one big object if the merge option is set to true
        result[key] = result[key].reduce((reduced, el) => {
          return Object.assign(reduced, el);
        }, {});
      }
    } else {
      result[key] = seek;
    }
  }

  /**
   * Get object property from data object.
   *
   * @param {object} data
   * @param {object} pathObj
   * @param {object} result
   * @param {string} key
   */
  function seekObject(data, pathObj, result, key) {
    if (typeof key !== 'undefined') {
      result = result[key] = {};
    }

    Object.keys(pathObj).forEach(function(name) {
      walk(data, pathObj[name], result, name);
    });
  }

  /**
   * @module jsonpath-object-transform
   * @param {object} data
   * @param {object} path
   * @returns {object}
   */
  return function(data, path) {
    var result = {},
        needsWrapper = Array.isArray(data) && Array.isArray(path);
    // wrap the data and path in a temp variable that will serve as the key for our initial iteration
    // this is to resolve the fact that the code doesn't handle root level arrays natively
    if (needsWrapper) {
      data = { temp: data };
      path = { temp: path };
    }
    
    walk(data, path, result);

    // unwrap the data before returning it
    if (needsWrapper) {
      result = result.temp;
    }
    return result;
  };

}));
