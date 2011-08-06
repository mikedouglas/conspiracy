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
