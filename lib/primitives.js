var e = require('./eval'),
    _ = require('underscore');

var drop_stack_table = function (orig_args, drop_n) {
  drop_n = drop_n || 1;
  var args = Array.prototype.slice.call(orig_args);
  _.times(drop_n, function () { args.shift(); });
  return args;
}

e.define('+', function (_s) {
  var args = drop_stack_table(arguments);
  return _.reduce(args, function (sum, val) {
    return sum + e.eval(val, _s);
  }, 0);
});

e.define('-', function (_s, x, y) {
  return e.eval(x, _s) - e.eval(y, _s);
});

e.define('*', function (_s) {
  var args = drop_stack_table(arguments);
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
  var args = drop_stack_table(arguments);
  return _.reduce(args, function (mem, val) {
    return mem && e.eval(val, _s);
  }, true);
});

e.special_form('or', function (_s) {
  var args = drop_stack_table(arguments);
  return _.reduce(args, function (mem, val) {
    return mem || e.eval(val, _s);
  }, false);
});

e.special_form('begin', function (_s) {
  var args = drop_stack_table(arguments);
  return e.evalAll(args, _s);
});

e.special_form('define', function (_s, sym, val) {
  val = e.eval(val, _s);
  e.define(sym.name, val);
  return val;
});

e.special_form('let', function (_s, bindings) {
  var body = drop_stack_table(arguments, 2);
  var let_env = _.reduce(bindings, function (map, val) {
    map[val[0].name] = e.eval(val[1], _s);
    return map;
  }, _s);
  return e.evalAll(body, let_env);
});
