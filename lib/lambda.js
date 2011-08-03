var e = require('./eval'),
    _ = require('underscore');

// lex_frame: frame at definition
// dyn_frame: frame at evocation
// stack_frame: frame in which body is evaluated
e.special_form('lambda', function (lex_frame, args) {
  var body = Array.prototype.slice.call(arguments, 2);
  return function (dyn_frame) {
    var vals = Array.prototype.slice.call(arguments, 1);
    var stack_frame = _(args).chain()
      .zip(vals)
      .reduce(function(map, val) {
        map[val[0].name] = e.eval(val[1], dyn_frame);
        return map;
      }, Object.create(lex_frame)).value();
    return e.evalAll(body, stack_frame);
  };
});
