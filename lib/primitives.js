var e = require('./eval'),
    _ = require('underscore');

e.define('+', function (_s) {
  var args = Array.prototype.slice.call(arguments);
  args.shift(); // drop stack table
  return _.reduce(args, function (sum, val) {
    return sum + e.eval(val, _s);
  }, 0);
});

e.define('-', function (_s, x, y) {
  return e.eval(x, _s) - e.eval(y, _s);
});

e.define('*', function (_s) {
  var args = Array.prototype.slice.call(arguments);
  args.shift(); // drop stack table
  return _.reduce(args, function (prod, val) {
    return prod * e.eval(val, _s);
  }, 1);
});

e.define('/', function (_s, x, y) {
  if (isNaN(e.eval(x, _s)/e.eval(y, _s)))
    throw "Not a number."
  return x / y;
});

e.special_form('if', function (_s, cond, t, f) {
  if (e.eval(cond) !== false) {
    return e.eval(t, _s);
  }
  else {
    return e.eval(f, _s);
  }
});

e.special_form('quote', function (_s, arg) {
  return arg;
});

e.special_form('and', function (_s) {
  var args = Array.prototype.slice.call(arguments);
  args.shift(); // drop stack table
  return _.reduce(args, function (mem, val) {
    return mem && e.eval(val, _s);
  }, true);
});

e.special_form('or', function (_s) {
  var args = Array.prototype.slice.call(arguments);
  args.shift(); // drop stack table
  return _.reduce(args, function (mem, val) {
    return mem || e.eval(val, _s);
  }, false);
});
