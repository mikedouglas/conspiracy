(define (fibonacci n)
  (let ((fib (lambda (n a b)
               (if (eq? n 0)
                 a
                 (recur (- n 1) b (+ a b))))))
    (fib n 0 1)))

(print (fibonacci 20))
