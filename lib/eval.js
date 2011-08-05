var _ = require('underscore');

SYMBOL_TABLE = {}

exports.define = function (sym, val) {
  SYMBOL_TABLE[sym] = val;
}

exports.eval = function eval(form, stack_frame) {
  if (typeof stack_frame == 'undefined') {
    stack_frame = SYMBOL_TABLE;
  }

  if (_.isEqual(form, null)) {
    return null;
  }

  if (form.type == 'id')
    return stack_frame[form.name];
  else if (_.isArray(form)) {
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
