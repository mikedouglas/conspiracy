var e = require('./eval'),
    _ = require('underscore');

// lex_frame: frame at definition
// dyn_frame: frame at evocation
// stack_frame: frame in which body is evaluated
exports.lambda = function (lex_frame, args) {
  var body = Array.prototype.slice.call(arguments, 2);
  return function (dyn_frame) {
    var vals = Array.prototype.slice.call(arguments, 1);

    // only loops if `recur' exception is thrown
    while (true) {
      try {
        var stack_frame = _(args).chain()
          .zip(vals)
          .reduce(function(map, val) {
            map[val[0].name] = e.eval(val[1], dyn_frame);
            return map;
          }, Object.create(lex_frame)).value();

        // create an explicit tail recursive function
        stack_frame.recur = function (_s) {
          var args = Array.prototype.slice.call(arguments, 1);
          vals = _(args).map(function (elem) {
            return e.eval(elem, _s);
          });
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
