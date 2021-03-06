 var r = require('../lib/reader'),
     e = require('../lib/eval'),
assert = require('assert'),
  vows = require('vows');

require('./conspiracy');

vows.describe("Primitives").addBatch({
	"should perform basic num ops": function () {
		assert.evalEqual("(+ 2 3 2)", 7);
    assert.evalEqual("(- 5 3)", 2);
	},

  "should correctly handle if/and/or": function () {
    assert.evalEqual("(if #t 5 3)", 5);
    // lazy eval
    assert.evalEqual("(if #t 5 (/ 3 \"hello\"))", 5);
    assert.evalThrows("(if #t (/ 3 \"hello\") 5)");

    assert.evalEqual("(and #t #t)", true);
    assert.evalEqual("(and #t #f)", false);
    assert.evalEqual("(and #f #t)", false);
    assert.evalEqual("(and #f #f)", false);
    assert.evalEqual("(and #f (/ 3 \"hello\"))", false);
    assert.evalThrows("(and #t (/ 3 \"hello\"))");

    assert.evalEqual("(or #t #t)", true);
    assert.evalEqual("(or #t #f)", true);
    assert.evalEqual("(or #f #t)", true);
    assert.evalEqual("(or #f #f)", false);
    assert.evalEqual("(or #t (/ 3 \"hello\"))", true);
    assert.evalThrows("(or #f (/ 3 \"hello\"))");
  },

  "should correctly quote": function () {
    assert.deepEqual(e.evalAll(r.parse("(quote hello)")), r.parse("hello")[0]);
  },

  "should implement begin": function () {
    assert.evalEqual("(begin 1 2 3)", 3);
  },

  "should implement let": function () {
    assert.evalEqual("(let ((x 1)) x)", 1);
    assert.evalEqual("(define x 2) (let ((x 1)) x)", 1);
  },

  "should be able to define functions": function () {
    assert.evalEqual("(define (fn x) (* x x)) (fn 5)", 25);
  },

  "should be able to name lets": function () {
    // while depends on named lets
    assert.evalEqual("(define a 5) (while (> a 0) (set! a (dec a))) a", 0);
  }
}).export(module);
