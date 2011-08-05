var fs = require('fs');
var peg = require('pegjs');

var parser = peg.buildParser(fs.readFileSync('lib/lisp.pegjs', 'utf8'));

exports.parse = function (input) {
  return parser.parse(input);
};
