var vows = require('vows'),
  assert = require('assert'),
       e = require('../lib/eval'),
  reader = require('../lib/reader');

require('./conspiracy');

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
  },

  "should sub in quasiquotes": function () {
    assert.evalEqual("(let ((m (macro (f x) `(f x))) " +
                           "(f (lambda (x) (* x x))) " +
                           "(x 3)) " +
                       "(m (lambda (x) x) 5))", 9);
    assert.evalEqual("(let ((f (lambda (x) (* x x)))) " +
                        "((macro (f x) `(f ,x)) (lambda (x) x) 5))", 25);
  },

  "should expand lists in quasiquotes": function () {
    assert.evalEqual("((macro (x & more) `(begin ,@more)) 1 2 3)", 3);
  },

  "should not expand recursively": function () {
    assert.evalEqual("(define defmacro (macro (args & body) " +
                       "(let ((sym (first args)) " +
                             "(args (rest args))) " +
                         "`(define ,sym (macro ,args " +
                                         "(begin ,@body)))))) " +
                     "(defmacro (when test & body) `(if ,test (begin ,@body))) " +
                     "(when #t 3)", 3);
  }
}).export(module);
