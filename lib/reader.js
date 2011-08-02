var fs = require('fs');
var peg = require('pegjs');
var readline = require('readline');

var parser = peg.buildParser(fs.readFileSync('lib/lisp.pegjs', 'utf8'));

exports.parse = function (input) {
  return parser.parse(input);
};

exports.repl = function () {
  var io = readline.createInterface(process.stdin, process.stdout, null);
  io.prompt();
  io.on('line', function (input) {
    if (input !== "")
      console.log(parser.parse(input));
    io.prompt();
  });
};
