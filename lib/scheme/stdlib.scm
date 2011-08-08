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

(define else #t)

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

(define (member? x lst)
  (cond ((empty? lst) #f)
        ((eq? (first lst) x) #t)
        (else (recur x (rest lst)))))

(define (reverse lst)
  (let ((rev (lambda (lst rev-lst)
               (if (empty? lst)
                 rev-lst
                 (recur (rest lst) (cons (first lst) rev-lst))))))
    (rev lst '())))
