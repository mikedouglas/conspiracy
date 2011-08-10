(define (second lst)
  (first (rest lst)))

(define (map fn lst)
  (if (empty? lst)
    '()
    (cons (fn (first lst)) (map fn (rest lst)))))

(define let (macro (bindings & body)
  (if (list? bindings)
    ((lambda (vars vals)
       `((lambda ,vars
           ,@body)
         ,@vals))
     (map first bindings)
     (map second bindings))
    ((lambda (name vars vals r-body)
       `((lambda ,name ,vars
           ,@r-body)
         ,@vals))
     bindings
     (map first (first body))
     (map second (first body))
     (rest body)))))

(define (map-indexed fn lst)
  (let ((map-i (lambda map-i (fn lst idx)
                 (if (empty? lst)
                   '()
                   (cons (fn (first lst) idx) (map-i fn (rest lst) (inc idx)))))))
    (map-i fn lst 0)))

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

(define (>= val1 val2)
  (or (> val1 val2) (eq? val1 val2)))

(define (range start end)
  (let ((r (lambda (lst end)
             (if (> start end)
               lst
               (recur (cons end lst) (dec end))))))
    (r '() (dec end))))

(define (second lst)
  (first (rest lst)))

(define (split list)
  (let ((split-h (lambda (ls ls1 ls2)
                   (if (or (empty? ls) (empty? (rest ls)))
                      (cons (reverse ls2) ls1)
                      (recur (rest (rest ls)) (rest ls1) (cons (first ls1) ls2))))))
    (split-h list list '())))


(define (merge pred ls1 ls2)
  (cond
    ((empty? ls1) ls2)
    ((empty? ls2) ls1)
    ((pred (first ls1) (first ls2))
     (cons (first ls1) (merge pred (rest ls1) ls2)))
    (else
      (cons (first ls2) (merge pred ls1 (rest ls2))))))

(define (merge-sort pred lst)
  (cond
    ((empty? lst) lst)
    ((empty? (rest lst)) lst)
    (else (let ((splits (split lst)))
            (merge pred
                   (merge-sort pred (first splits))
                   (merge-sort pred (rest splits)))))))

(define sort merge-sort)

(defmacro (while test & body)
  `(let loop ()
     (if ,test
       (begin
         ,@body
         (loop)))))
