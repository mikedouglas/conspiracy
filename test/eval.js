var vows = require('vows'),
  assert = require('assert'),
       e = require('../lib/eval'),
  reader = require('../lib/reader');

require('../lib/lambda');
require('../lib/primitives');

e.define('sym', 'val');
e.define('two', function () { return 2; });
e.define('double', function (_, x) { return x*2; });

assert.evalEqual = function (str, expected) {
  assert.equal(e.evalAll(reader.parse(str)), expected);
};

vows.describe("EVAL").addBatch({
  "should find pre-defined symbols": function () {
    assert.equal(e.eval({type: 'id', name: 'sym'}), 'val');
    assert.equal(e.evalAll([{type: 'id', name: 'sym'}]), 'val');
    assert.evalEqual('sym', 'val');
  },

  "should find dynamically-defined symbols": function () {
    assert.equal(e.evalAll(reader.parse('hello'), {hello: 'world'}), 'world');
  },

  "should be able to apply builtin functions": function () {
    assert.evalEqual('(two)', 2);
    assert.evalEqual('(double 5)', 10);
  },

  "should be able to apply lambdas": function () {
    assert.equal(typeof e.evalAll(reader.parse('(lambda (x) x)')), 'function');
    assert.equal(e.evalAll(reader.parse('(lambda (x) x)')).apply(undefined, [{}, 5]), 5);

    assert.evalEqual('((lambda (x) x) 5)', 5);

    // yo dawg...
    assert.evalEqual('((lambda (x) ((lambda (x) x) x)) 5)', 5);
  },

  "should be able to define symbols": function () {
    assert.evalEqual('(define answer 42) answer', 42);
    assert.evalEqual('(define id (lambda (x) x)) (id 5)', 5);
  },

  "should scope properly": function () {
    // shadow variables
    assert.evalEqual("(define x 6) ((lambda (x) x) 5)", 5);

    // lambda does not use dynamic scoping
    val2 = "(define x 5) (define f (lambda () x)) ((lambda (x) (f)) 6)";
    assert.evalEqual(val2, 5);
  }
}).export(module);
