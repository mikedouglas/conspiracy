var e = require('./eval'),
    _ = require('underscore'),
    l = require('./lambda');

var drop_stack_table = function (orig_args, drop_n) {
  var args = Array.prototype.slice.call(orig_args, drop_n || 1);
  return args;
}

e.define('null', null);

e.define('+', function (_s) {
  var args = drop_stack_table(arguments);
  return _.reduce(args, function (sum, val) {
    return sum + e.eval(val, _s);
  }, 0);
});

e.define('print', function (_s, expr) {
  var val = e.eval(expr, _s);
  console.log(val);
  return val;
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
  x = e.eval(x, _s);
  y = e.eval(y, _s);
  if (isNaN(x/y))
    throw "Not a number."
  return x / y;
});

e.define('eq?', function (_s, x, y) {
  return _.isEqual(e.eval(x, _s), e.eval(y, _s));
});

e.define('eval', function (_s, expr) {
  return e.eval(e.eval(expr, _s), _s);
});

e.define('if', function (_s, cond, t, f) {
  if (e.eval(cond, _s) !== false) {
    return e.eval(t, _s);
  }
  else if (! _.isEqual(f, undefined)) {
    return e.eval(f, _s);
  }
  else {
    return null;
  }
});

e.define('quote', function (_s, arg) {
  return arg;
});

e.define('and', function (_s) {
  var args = drop_stack_table(arguments);
  return _.reduce(args, function (mem, val) {
    return mem && e.eval(val, _s);
  }, true);
});

e.define('or', function (_s) {
  var args = drop_stack_table(arguments);
  return _.reduce(args, function (mem, val) {
    return mem || e.eval(val, _s);
  }, false);
});

e.define('begin', function (_s) {
  var args = drop_stack_table(arguments);
  return e.evalAll(args, _s);
});

e.define('define', function (_s, sym, val) {
  var name;
  if (_.isArray(sym)) {
    name = sym.shift().name;
    var body = Array.prototype.slice.call(arguments, 2);
    val = l.lambda.apply(undefined, [_s, sym].concat(body));
  }
  else {
    name = sym.name;
    val = e.eval(val, _s);
  }
  e.define(name, val);
  return val;
});

e.define('let', function (_s, bindings) {
  var body = drop_stack_table(arguments, 2);
  var let_env = _.reduce(bindings, function (map, val) {
    map[val[0].name] = e.eval(val[1], _s);
    return map;
  }, Object.create(_s));
  return e.evalAll(body, let_env);
});

e.define('empty?', function (_s, arg) {
  arg = e.eval(arg, _s);
  return arg.length === 0
});

e.define('rest', function (_s, arg) {
  return e.eval(arg, _s).slice(1);
});
