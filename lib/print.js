var _ = require('underscore'),
 util = require('util');

var print = function (obj, color) {
  var str;
  if (_.isArray(obj) || (obj && _.isEqual(obj.type, 'id'))) {
    str = "'" + print_expr(obj, color);
  }
  else {
    str = print_expr(obj, color);
  }
  if (!WEB) {
    process.stdout.write(str + "\n");
  }
  return str;
}
exports.print = print;

var print_expr = function (obj, color) {
  if (obj && _.isEqual(obj.type, 'id')) {
    if (color) {
      return "\033[36m" + obj.name + "\033[39m";
    }
    else {
      return obj.name;
    }
  }
  else if (obj && obj.err) {
    if (color) {
      return "\033[1m\033[31m" + obj.err + "\033[39m\033[22m";
    }
    else {
      return obj.err;
    }
  }
  else if (_.isArray(obj)) {
    var strs = _.map(obj, function (o) {
      return print_expr(o, color);
    });
    return "(" + strs.join(' ') + ")";
  }
  else if (typeof obj == 'function') {
    return '[Function]';
  }
  else {
    if (!WEB) {
      return util.inspect(obj, false, 0, color).replace(/'/g, '"');
    }
    else {
      return (obj+'').toString().replace(/'/g, '"');
    }
  }
}
exports.print_expr = print_expr;
