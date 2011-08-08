var _ = require('underscore');

SYMBOL_TABLE = {}

exports.define = function (sym, val) {
  SYMBOL_TABLE[sym] = val;
}

exports.apply = function (fn, args, stack_frame) {
  if (typeof fn != 'function')
    throw "cannot evaluate non-function value: " + fn;
  args.unshift(stack_frame);

  // sanity check. If a variable is named, it should be provided.
  if (args.length < fn.length) {
    throw "Arity mismatch.";
  }

  return fn.apply(undefined, args);
}

exports.eval = function eval(form, stack_frame) {
  if (typeof stack_frame == 'undefined') {
    stack_frame = SYMBOL_TABLE;
  }

  if (_.isEqual(form, null)) {
    return null;
  }

  if (form.type == 'id') {
    var val = stack_frame[form.name];
    if (val == undefined)
      throw "cannot evaluate undefined symbol: " + form.name;
    else
      return stack_frame[form.name];
  }
  else if (_.isArray(form)) {
    var func = eval(form[0], stack_frame);
    var args = form.slice(1);

    return exports.apply(func, args, stack_frame);
  }
  else {
    return form;
  }
}

exports.evalAll = function (forms, stack_frame) {
  if (typeof stack_frame == 'undefined') {
    stack_frame = SYMBOL_TABLE;
  }

  var results = [];
  for (var i = 0; i < forms.length; i++) {
    results[i] = exports.eval(forms[i], stack_frame);
  }
  return results[results.length - 1]; // return last form
}

exports.define('stack', function (_s) {
  console.log(_s);
});

exports.define('sym', function () {
  console.log(SYMBOL_TABLE);
});
