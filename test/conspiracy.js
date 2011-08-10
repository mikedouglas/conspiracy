var  fs = require('fs'),
 assert = require('assert');

global.WEB = false;

var reader = require('../lib/reader'),
      eval = require('../lib/eval');

require('../lib/lambda');
require('../lib/macro');
require('../lib/primitives');

var readFile = function (fname) {
  var file = fs.readFileSync(fname, 'utf8');
  eval.evalAll(reader.parse(file));
}

readFile(__dirname + "/../lib/scheme/stdlib.scm");

assert.evalEqual = function (str, expected) {
  assert.equal(eval.evalAll(reader.parse(str)), expected);
};

assert.evalThrows = function (str) {
  assert.throws(function () {
    eval.evalAll(reader.parse(str));
  });
}

assert.evalOk = function (str, expected) {
  assert.ok(eval.evalAll(reader.parse(str)), expected);
}
