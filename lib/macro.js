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
    var named_vals = varval ? vals.slice(0, varargs) : vals;

    if (named_vals.length != args.length)
      throw "Arity mismatch.";

    var stack_frame = _(args).chain()
      .zip(named_vals)
      .reduce(function (map, val) {
        map[val[0].name] = val[1]; // don't eval args
        return map;
      }, Object.create(lex_frame)).value();

    // set varargs
    if (varval) {
      stack_frame[varval] = vals.slice(varargs);
    }
    return e.eval(e.evalAll(body, stack_frame), dyn_frame);
  }
}

e.define('macro', exports.macro);

var includes_splice = function (list, start) {
  for (var i = start+1; i < list.length; i++) {
    if (list[i] && list[i].name && list[i].name[0] == ','
        && list[i].name[1] == '@') {
      return i;
    }
  }
  return false;
}

var merge_splice = function (list, i, _s) {
  var before = list.slice(0, i),
      after = list.slice(i+1);
  return before.concat(_s[list[i].name.slice(2)]).concat(after);
}

e.define('quasiquote', function subs(_s, elem) {
  if (elem && elem.name && elem.name[0] == ',' && elem.name[1] != '@') {
    return _s[elem.name.slice(1)];
  }
  else if (_.isArray(elem)) {
    elem = _.map(elem, function (e) {
      return subs(_s, e);
    });

    var i = 0;
    var l = elem.length;
    while ( (i = includes_splice(elem, i)) !== false) {
      elem = merge_splice(elem, i, _s);
      i += (elem.length - l); // fastforward past spliced in elements
    }
    return elem;
  }
  else {
    return elem;
  }
});
