var fs = require('fs');
var peg = require('pegjs');
var readline = require('readline');

var io = readline.createInterface(process.stdin, process.stdout, null);

fs.readFile('lib/lisp.pegjs', 'utf-8', function (err, data) {
  if (err) throw err;
  var parser = peg.buildParser(data);

  io.prompt();
  io.on('line', function (input) {
    if (input !== "")
      console.log(parser.parse(input));
    io.prompt();
  });
});
