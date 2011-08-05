   var r = require('./reader'),
       e = require('./eval'),
     peg = require('pegjs'),
    util = require('util'),
       _ = require('underscore'),
readline = require('readline');

require('./lambda');
require('./primitives');
require('./macro');

PROMPT = '> ';
INCOMPLETE_PROMPT = ' ... ';

// returns the number of right parens missing from the input
// if negative, the number of left parens
var missing_rp = function (str) {
  var lp = /\(/g;
  var rp = /\)/g;
  for (var lc = 0; lp.exec(str); lc++);
  for (var rc = 0; rp.exec(str); rc++);

  return lc - rc;
}

var buffer = "";
var buf_missing_rp = 0; // number of rp's missing in buffer

var print = function (obj) {
  if (_.isArray(obj) || (obj && _.isEqual(obj.type, 'id'))) {
    process.stdout.write("'" + print_expr(obj));
  }
  else {
    process.stdout.write(print_expr(obj));
  }
  process.stdout.write("\n");
}

var print_expr = function (obj) {
  if (obj && _.isEqual(obj.type, 'id')) {
    return "\033[36m" + obj.name + "\033[39m";
  }
  else if (_.isArray(obj)) {
    var strs = _.map(obj, function (o) {
      return print_expr(o);
    });
    return "(" + strs.join(' ') + ")";
  }
  else {
    return util.inspect(obj, false, 0, true).replace(/'/g, '"');
  }
}

exports.repl = function () {
  var io = readline.createInterface(process.stdin, process.stdout, null);
  io.prompt();
  io.on('line', function (input) {
    if (buffer !== "") {
      buffer += "\n" + input;
      if (buf_missing_rp + missing_rp(input) <= 0) {
        print(e.evalAll(r.parse(buffer)));
        buffer = "";
        io.setPrompt(PROMPT, PROMPT.length);
      }
      else {
        buf_missing_rp += missing_rp(input);
      }
    }
    else if (input !== "") {
      if (missing_rp(input) <= 0)
        print(e.evalAll(r.parse(input)));
      else {
        io.setPrompt(INCOMPLETE_PROMPT, INCOMPLETE_PROMPT.length);
        buffer = input;
        buf_missing_rp = missing_rp(input);
      }
    }
    io.prompt();
  });
};

exports.repl();
