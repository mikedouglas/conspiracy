var e = require('./eval'),
    _ = require('underscore');

// lex_frame: frame at definition
// dyn_frame: frame at evocation
// stack_frame: frame in which body is evaluated
exports.lambda = function (lex_frame, args) {
  var varval;
  var varargs = args.map(function (e) { return e.name}).lastIndexOf('&');
  if (varargs != -1) {
    varval = args[varargs+1].name;
    args = args.slice(0, varargs);
  }

  var body = Array.prototype.slice.call(arguments, 2);
  return function (dyn_frame) {
    var vals = Array.prototype.slice.call(arguments, 1);

    // only loops if `recur' exception is thrown
    while (true) {
      try {
        var named_vals = varargs == -1 ? vals : vals.slice(0, varargs);

        if (named_vals.length != args.length)
          throw "Arity mismatch.";

        var stack_frame = _(args).chain()
          .zip(named_vals)
          .reduce(function(map, val) {
            map[val[0].name] = e.eval(val[1], dyn_frame);
            return map;
          }, Object.create(lex_frame)).value();

        // set varargs
        if (varargs != -1) {
          stack_frame[varval] = vals.slice(varargs).map(function (elem) {
            return e.eval(elem, dyn_frame);
          });
        }

        // create an explicit tail recursive function
        stack_frame.recur = function (_s) {
          vals = Array.prototype.slice.call(arguments, 1);
          dyn_frame = _s;
          throw {name: "Recur"};
        }

        return e.evalAll(body, stack_frame);
      }
      catch (e) {
        if (e.name != "Recur")
          throw e;
      }
    }
  };
};

e.define('lambda', exports.lambda);
