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

exports.special_form('lambda', function (args) {
  var body = Array.prototype.slice.call(arguments, 1);
  return function () {
    var stack_frame = _(args).chain()
      .zip(arguments)
      .reduce(function(map, val) {
        map[val[0].name] = val[1];
        return map;
      }, Object.create(SYMBOL_TABLE)).value();
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
    return func.apply(undefined, form.slice(1));
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
