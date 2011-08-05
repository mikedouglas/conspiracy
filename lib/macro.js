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
  var body = Array.prototype.slice.call(arguments, 2);
  return function (dyn_frame) {
    var vals = Array.prototype.slice.call(arguments, 1);
    var stack_frame = _(args).chain()
      .zip(vals)
      .reduce(function (map, val) {
        map[val[0].name] = val[1]; // don't eval args
        return map;
      }, Object.create(lex_frame)).value();
    return e.evalAll(body, stack_frame);
  }
}

e.define('macro', exports.macro);
