(define defmacro (macro (args & body)
  (let ((sym (first args))
        (args (rest args)))
    `(define ,sym (macro ,args
                    (begin ,@body))))))

(defmacro (when test & body)
  `(if ,test
     (begin
       ,@body)))

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
