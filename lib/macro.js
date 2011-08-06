var _ = require('underscore'),
    e = require('./eval');

var gensym_count = 0;

var gensym = function (params) {
  if (params === undefined) {
    params = "";
  }
  gensym_count++;
  return {type: 'id', name: params+'$'+gensym_count};
}

exports.macro = function(lex_frame, args) {
  var varval;
  var varargs = args.map(function (e) { return e.name}).lastIndexOf('&');
  if (varargs != -1) {
    varval = args[varargs+1].name;
    args = args.slice(0, varargs);
  }

  var body = Array.prototype.slice.call(arguments, 2);
  return function (dyn_frame) {
    var vals = Array.prototype.slice.call(arguments, 1);

    // named_vals needs to be sliced if varargs are present
    var named_vals = varargs == -1 ? vals : vals.slice(0, varargs);
    var stack_frame = _(args).chain()
      .zip(named_vals)
      .reduce(function (map, val) {
        map[val[0].name] = val[1]; // don't eval args
        return map;
      }, Object.create(lex_frame)).value();

    // set varargs
    if (varargs != -1) {
      stack_frame[varval] = vals.slice(varargs);
    }

    return e.eval(e.evalAll(body, stack_frame), dyn_frame);
  }
}

e.define('macro', exports.macro);

e.define('quasiquote', function subs(_s, elem) {
  if (elem && elem.name && elem.name[0] == ',') {
    return _s[elem.name.slice(1)];
  }
  else if (_.isArray(elem)) {
    return _.map(elem, function (e) {
      return subs(_s, e);
    });
  }
  else {
    return elem;
  }
});
