# jsonpath-object-transform
> Transform an object literal using JSONPath.

[![npm](https://badge.fury.io/js/jsonpath-object-transform.png)](http://badge.fury.io/js/jsonpath-object-transform)

Pulls data from an object literal using JSONPath and generate a new objects based on a template. Each of the template's properties can pull a single property from the source data or an array of all results found by its JSONPath. When pulling an array of data you can also supply a subtemplate to transform each item in the array.

JSONPath is like XPath for JavaScript objects. To learn the syntax, read the documentation for the [JSONPath](https://www.npmjs.org/package/JSONPath) package on npm and the [original article](http://goessner.net/articles/JsonPath/) by Stefan Goessner.

## Usage
```js
var transform = require('jsonpath-object-transform');

var template = {
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

var result = transform(data, template);
```
Result:
```js
{
  foo: [
    {
      bar: 'A'
    },
    {
      bar: 'B'
    }
  ]
}
```

## Method
```js
jsonPathObjectTransform(data, template);
```
Where `data` and `template` are both a plain `Object`. Returns the transformed `Object`.

## Template Objects
Your template will be an object literal that outlines what the resulting object should look like. Each property will contain a JSONPath `String` or `Array` depending on how many properties from the source data you want to assign to the generated object.

### Pulling a Single Property
```js
{ destination: '$.path.to.source' }
```
Use a `String` on your template property to assign a single object returned from your JSONPath. If your path returns multiple results then only the first is used.

#### Example
```js
var template = {
  foo: '$.example'
};

var data = {
  example: 'bar'
};
```
Result:
```js
{
  foo: 'bar'
}
```

### Pulling an Array of Properties
```js
{ destination: ['$.path.to.sources'] }
```
Use an `Array` containing a single `String` to assign all results returned from your JSONPath.

#### Example
```js
var tempalte = {
  foo: ['$..example']
};

var data = {
  a: {
    example: 'bar'
  },
  b: {
    example: 'baz'
  }
};
```
Result:
```js
{
  foo: ['bar', 'baz']
}
```

### Transform Items Returned in Array
```js
{ destination: ['$.path.to.sources', { item: '$.item.path' }] }
```
Use an `Array` with a `String` and an `Object` to assign all results returned from your JSONPath and transform each of the objects with a subtemplate.

#### Example
```js
var template = {
  foo: [$..example, {
    bar: '$.demo'
  }]
};

var data = {
  a: {
    example: {
      demo: 'baz'
    }
  },
  b: {
    example: {
      demo: 'qux'
    }
  }
};
```
Result:
```js
{
  foo: [
    { bar: 'baz' },
    { bar: 'qux' }
  ]
}
```
