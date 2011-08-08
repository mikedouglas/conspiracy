var vows = require('vows'),
  assert = require('assert'),
       e = require('../lib/eval'),
       r = require('../lib/reader');

require('../lib/lambda');
require('../lib/primitives');

assert.evalEqual = function (str, expected) {
  assert.equal(e.evalAll(r.parse(str)), expected);
};

assert.evalThrows = function (str) {
  assert.throws(function () {
    e.evalAll(r.parse(str));
  });
};

vows.describe("Lambda").addBatch({
  "should optimize tail recursion when explicitly told to": function () {
    assert.evalEqual("((lambda (n a b) (if (eq? n 0) b (recur (- n 1) b (+ a b)))) 2000 0 1)", Infinity);
    assert.evalEqual("(define (f n a b) (if (eq? n 0) b (recur (- n 1) b (+ a b)))) (f 2000 0 1)", Infinity);
    assert.evalThrows("(define (f n a b) (if (eq? n 0) b (f (- n 1) b (+ a b)))) (f 2000 0 1)");
  },

  "should throw if arity mismatch": function () {
    assert.evalThrows("((lambda (x) x))");
  }
}).export(module);
