var e = require('./eval'),
    _ = require('underscore'),
    l = require('./lambda');

var drop_stack_table = function (orig_args, drop_n) {
  var args = Array.prototype.slice.call(orig_args, drop_n || 1);
  return args;
}

e.define('get', function (_s, obj, key) {
  return e.eval(obj, _s)[e.eval(key, _s).toString()];
});

e.define('set!', function (_s, obj, val) {
  // (set! (obj key) val) ;=> obj[key] = val
  if (_.isArray(obj)) {
    if (obj[0].name == 'get')
      obj.shift();
    o = e.eval(obj[0], _s);
    key = e.eval(obj[1], _s).toString();
    o[key] = e.eval(val, _s);
    return o;
  }
  // (set! x val) ;=> SYMBOL_TABLE[x] = val
  else if (obj && obj.name) {
    if (e.isDefined(obj.name, _s)) {
      val = e.eval(val, _s);
      e.define(obj.name, val);
      return val;
    }
    else
      throw "set! requires that '" + obj.name + "' is already defined globally";
  }
  else
    throw "set! can only modify symbols or hashmap access (ie. (hash key))";
});

e.define('+', function (_s) {
  var args = drop_stack_table(arguments);
  return _.reduce(args, function (sum, val) {
    val = e.eval(val, _s);
    if (typeof val != 'number')
      throw "(+) accepts only numbers";

    return sum + val;
  }, 0);
});

e.define('concat', function (_s) {
  var args = drop_stack_table(arguments);
  return _.reduce(args, function (sum, val) {
    return sum.concat(e.eval(val, _s));
  }, "");
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

e.define('>', function (_s, x, y) {
  return e.eval(x, _s) > e.eval(y, _s);
});

e.define('<', function (_s, x, y) {
  return e.eval(x, _s) < e.eval(y, _s);
});

e.define('eq?', function (_s, x, y) {
  return _.isEqual(e.eval(x, _s), e.eval(y, _s));
});

e.define('eval', function (_s, expr) {
  return e.eval(e.eval(expr, _s), _s);
});

e.define('if', function (_s, cond, t) {
  var f = arguments[3]; // optional

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

e.define('empty?', function (_s, arg) {
  arg = e.eval(arg, _s);
  return arg.length === 0
});

e.define('first', function (_s, arg) {
  arg = e.eval(arg, _s);
  if (_.isArray(arg) && arg.length > 0)
    return arg[0];
  else
    return null;
});

e.define('rest', function (_s, arg) {
  return e.eval(arg, _s).slice(1);
});

e.define('js-eval', function (_s) {
  var args = drop_stack_table(arguments);
  args = _(args).chain()
    .map(function (elem) {
      return e.eval(elem, _s);
    }).reduce(function (str, elem) {
      return str+elem;
    }, '').value();

  if (typeof args != 'string')
    throw "js-eval requires a string";

  return eval(args);
});

e.define('eval', function (_s, arg) {
  arg = e.eval(arg, _s);
  return e.eval(arg, _s);
});

// TODO: what does scheme's read look like?
//e.define('read', function (_s, str) {
//  return r.parse(str)[0];
//});

e.define('apply', function (_s, fn, list) {
  fn = e.eval(fn, _s);
  list = e.eval(list, _s);
  return e.apply(fn, list);
});

e.define('cons', function (_s, x, list) {
  x = e.eval(x, _s);
  list = e.eval(list, _s);
  return [x].concat(list);
});

e.define('list?', function (_s, x) {
  x = e.eval(x, _s);
  return _.isArray(x);
});

e.define('sym?', function (_s, x) {
  x = e.eval(x, _s);
  return typeof(x) == 'object' && x.type == 'id';
});

e.define('obj?', function (_s, x) {
  x = e.eval(x, _s);
  return typeof(x) == 'object' && x.type != 'id';
});

e.define('number?', function (_s, x) {
  x = e.eval(x, _s);
  return typeof(x) == 'number';
});

e.define('arithmetic-shift', function (_s, n, count) {
  count = e.eval(count, _s);
  if (count >= 0) {
    return e.eval(n, _s) << count;
  }
  else {
    return e.eval(n, _s) >> -count;
  }
});

e.define('bitwise-and', function (_s, x1, x2) {
  return e.eval(x1, _s) & e.eval(x2, _s);
});

e.define('bitwise-or', function (_s, x1, x2) {
  return e.eval(x1, _s) | e.eval(x2, _s);
});

e.define('pow', function (_s, n, base) {
  return e.eval(n, _s) ^ e.eval(base, _s);
});
