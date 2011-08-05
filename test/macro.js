var vows = require('vows'),
  assert = require('assert'),
       e = require('../lib/eval'),
  reader = require('../lib/reader');

require('../lib/lambda');
require('../lib/primitives');
require('../lib/macro');

assert.evalEqual = function (str, expected) {
  assert.equal(e.evalAll(reader.parse(str)), expected);
};

assert.evalOk = function (str, expected) {
  assert.ok(e.evalAll(reader.parse(str)), expected);
};

vows.describe("Macro System").addBatch({
  "should not eval arguments": function () {
    assert.evalOk("(eq? ((macro (x) x) hello) 'hello)");
  }
}).export(module);
