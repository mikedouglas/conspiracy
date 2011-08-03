var _ = require('underscore');

SYMBOL_TABLE = {}

function isArray(a) {
  return Object.prototype.toString.apply(a) === '[object Array]';
}

exports.special_form = function (sym, val) {
  SYMBOL_TABLE[sym] = val;
}

exports.define = function (sym, val) {
  SYMBOL_TABLE[sym] = exports.eval(val);
}

// lex_frame: frame at definition
// dyn_frame: frame at evocation
// stack_frame: frame in which body is evaluated
exports.special_form('lambda', function (lex_frame, args) {
  var body = Array.prototype.slice.call(arguments, 2);
  return function (dyn_frame) {
    var vals = Array.prototype.slice.call(arguments, 1);
    var stack_frame = _(args).chain()
      .zip(vals)
      .reduce(function(map, val) {
        map[val[0].name] = exports.eval(val[1], dyn_frame);
        return map;
      }, Object.create(lex_frame)).value();
    return exports.evalAll(body, stack_frame);
  };
});

exports.eval = function eval(form, stack_frame) {
  if (typeof stack_frame == 'undefined') {
    stack_frame = SYMBOL_TABLE;
  }

  if (form.type == 'id')
    return stack_frame[form.name];
  else if (isArray(form)) {
    var func = eval(form[0], stack_frame);
    var args = form.slice(1);
    args.unshift(stack_frame);
    return func.apply(undefined, args);
  }
  else {
    return form;
  }
}

exports.evalAll = function (forms, stack_frame) {
  if (typeof stack_frame == 'undefined') {
    stack_frame = SYMBOL_TABLE;
  }

  for (var i = 0; i < forms.length; i++) {
    forms[i] = exports.eval(forms[i], stack_frame);
  }
  return forms[forms.length - 1]; // return last form
}
