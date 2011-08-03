var vows = require('vows'),
  assert = require('assert'),
       e = require('../lib/eval'),
  reader = require('../lib/reader');

e.define('sym', 'val');
e.define('two', function () { return 2; });
e.define('double', function (_, x) { return x*2; });

e.special_form('define', function (_, sym, val) {
  e.define(sym.name, e.eval(val));
});

vows.describe("EVAL").addBatch({
  "should find pre-defined symbols": function () {
    assert.equal(e.eval({type: 'id', name: 'sym'}), 'val');
    assert.equal(e.evalAll([{type: 'id', name: 'sym'}]), 'val');
    assert.equal(e.evalAll(reader.parse('sym')), 'val');
  },

  "should find dynamically-defined symbols": function () {
    assert.equal(e.evalAll(reader.parse('hello'), {hello: 'world'}), 'world');
  },

  "should be able to apply builtin functions": function () {
    assert.equal(e.evalAll(reader.parse('(two)')), 2);
    assert.equal(e.evalAll(reader.parse('(double 5)')), 10);
  },

  "should be able to apply lambdas": function () {
    assert.equal(typeof e.evalAll(reader.parse('(lambda (x) x)')), 'function');
    assert.equal(e.evalAll(reader.parse('(lambda (x) x)')).apply(undefined, [{}, 5]), 5);

    var val = "((lambda (x) x) 5)";
    //assert.equal(e.evalAll(reader.parse(val)), 5);

    // yo dawg...
    var val2 = '((lambda (x) ((lambda (x) x) x)) 5)';
    //assert.equal(e.evalAll(reader.parse(val2)), 5);
  },

  "should be able to define symbols": function () {
    assert.equal(e.evalAll(reader.parse('(define answer 42) answer')), 42);
    assert.equal(e.evalAll(reader.parse('(define id (lambda (x) x)) (id 5)')), 5);
  },

  "should scope properly": function () {
    // shadow variables
    var val = "(define x 6) ((lambda (x) x) 5)";
    assert.equal(e.evalAll(reader.parse(val)), 5);

    // lambda does not use dynamic scoping
    var val2 = "(define x 5) (define f (lambda () x)) ((lambda (x) (f)) 6)";
    assert.equal(e.evalAll(reader.parse(val2)), 5);
  }
}).export(module);
