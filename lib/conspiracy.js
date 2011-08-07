var fs = require('fs');

global.WEB = false;

var reader = require('./reader'),
      eval = require('./eval');

require('./lambda');
require('./macro');
require('./primitives');

var readFile = function (fname) {
  var file = fs.readFileSync(fname, 'utf8');
  eval.evalAll(reader.parse(file));
}

readFile(__dirname + "/scheme/stdlib.scm");

var arguments = process.argv.splice(2);
if (arguments.length > 0) {
  readFile(arguments[0]);
}
else {
  var repl = require('./repl');
  repl.repl();
}
