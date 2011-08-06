*Conspiracy* is a Scheme-like Lisp built on Javascript.

Features
--------
* first-class macros

  ```scheme
(let ((when (macro (test & more)
              `(if ,test
                 (begin ,@more)))))
  (when #t (print "hello")))
  ```

* explicit tail call optimization with `recur`

  ```scheme
(define (length n)
  (let ((f (lambda (n acm)
             (if (empty? n)
               acm
               (recur (rest n) (inc acm))))))
    (f n 0)))
  ```

* type integration with Javascript (strings, numbers, lists)

  ```scheme
(eq? (js-eval "3 + 4") 7) ; => true
(rest (js-eval "[1,2,3]")) ; => [2,3]
(js-eval (first "process.argv")) ; => "node"
  ```

Use
---

To start a REPL: `node lib/conspiracy.js`.

To eval a file: `node lib/conspiracy.js <FILE>`.
