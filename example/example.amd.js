/*global window, require*/

require.config({
  paths: {
    'jsonpathObjectTransform': '../lib/jsonpath-object-transform',
    'JSONPath': '../bower_components/jsonpath/lib/jsonpath'
  },
  shim: {
    'JSONPath': {
      exports: 'jsonPath'
    }
  }
});

require(['jsonpathObjectTransform'], function(transform) {
  var path = {
    foo: ['$.some.crazy', {
      bar: '$.example'
    }]
  };

  var data = {
    some: {
      crazy: [
        {
          example: 'A'
        },
        {
          example: 'B'
        }
      ]
    }
  };

  var result = transform(data, path);

  window.console.log(JSON.stringify(result, null, 2));
});
