/*jshint node:true*/

var translate = require('../lib/jsonpath-object-transform');

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

var result = translate(data, path);

console.log(JSON.stringify(result, null, 2));
