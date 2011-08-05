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
    assert.evalOk("(eq? ((macro (x) (if (eq? x 'hello) 5)) hello) 5)");
  },

  "should eval results": function () {
    assert.evalEqual("((macro () '(+ 3 4)))", 7);
    assert.evalEqual("(let ((f (macro (x) " +
                                "(if (eq? x 'foo) 100 " +
                                "(if (eq? x 'bar) 200))))) " +
                       "(+ (f foo) (f bar)))", 300);
  }
}).export(module);
