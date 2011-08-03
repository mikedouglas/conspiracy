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
  var body = arguments.slice(1);
  var lambda = function () {
    // TODO
  };
});

exports.eval = function eval(form) {
  if (form.type == 'id')
    return SYMBOL_TABLE[form.name];
  else if (isArray(form)) {
    var func = eval(form[0]);
    return func.apply(undefined, form.slice(1));
  }
  else {
    return form;
  }
}

exports.evalAll = function (forms) {
  for (var i = 0; i < forms.length; i++) {
    forms[i] = exports.eval(forms[i]);
  }
  return forms[forms.length - 1]; // return last form
}
