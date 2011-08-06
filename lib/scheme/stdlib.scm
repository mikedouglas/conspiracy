(define defmacro (macro (args & body)
  (let ((sym (first args))
        (args (rest args)))
    `(define ,sym (macro ,args
                    (begin ,@body))))))

(defmacro (when test & body)
  `(if ,test
     (begin
       ,@body)))

(define (not val)
  (if val #f #t))

(define else true)

(defmacro (cond & body)
  (let ((test (first (first body)))
        (result (rest (first body)))
        (rest (rest body)))
    (if (not (empty? rest))
      `(if ,test
         (begin ,@result)
         (cond ,@rest))
      `(if ,test
         (begin ,@result)))))

(define (list & more)
  more)

(define (zero? n)
  (eq? n 0))

(define (null? n)
  (eq? n null))

(define (inc n)
  (+ n 1))

(define (dec n)
  (- n 1))

(define (length n)
  (let ((f (lambda (n acm)
             (if (empty? n)
               acm
               (recur (rest n) (inc acm))))))
    (f n 0)))
