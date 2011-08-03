var vows = require('vows'),
  assert = require('assert'),
       e = require('../lib/eval'),
  reader = require('../lib/reader');

e.define('sym', 'val');
e.define('two', function () { return 2; });
e.define('double', function (x) { return x*2; });

e.special_form('define', function (sym, val) {
  e.define(sym.name, e.eval(val));
});

vows.describe("EVAL").addBatch({
  "should find pre-defined symbols": function () {
    assert.equal(e.eval({type: 'id', name: 'sym'}), 'val');
    assert.equal(e.evalAll([{type: 'id', name: 'sym'}]), 'val');
    assert.equal(e.evalAll(reader.parse('sym')), 'val');
  },

  "should be able to apply builtin functions": function () {
    assert.equal(e.evalAll(reader.parse('(two)')), 2);
    assert.equal(e.evalAll(reader.parse('(double 5)')), 10);
  },

  "should be able to define symbols": function () {
    assert.equal(e.evalAll(reader.parse('(define answer 42) answer')), 42);
  }
}).export(module);
