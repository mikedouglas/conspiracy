var e = require('./eval');
var print = require('./print');

WEB = true;

require('./lambda');
require('./macro');
require('./primitives');

function onValidate(input) {
  return (input != "");
}

// returns the number of right parens missing from the input
// if negative, the number of left parens
var missing_rp = function (str) {
  var lp = /\(/g;
  var rp = /\)/g;
  for (var lc = 0; lp.exec(str); lc++);
  for (var rc = 0; rp.exec(str); rc++);

  return lc - rc;
}

function isMissingParens(str) {
  return missing_rp(str) !== 0;
}

function onHandle(line, report) {
  var input = line.trim();

  if (isMissingParens(input)) {
    controller.continuedPrompt = true;
    return;
  }
  else {
    controller.continuedPrompt = false;
  }

  try {
    return [{msg: print.print(e.evalAll(parser.parse(input))),
      className: "jquery-console-message-value"}];
  } catch (e) {
    if (typeof e == 'string') {
      return [{msg: e, className: "jquery-console-message-error"}];
    }
  }
}

var controller,
    parser;

$(document).ready(function () {
  $.get("/lib/lisp.pegjs", function (parser_data) {
    parser = PEG.buildParser(parser_data);
    $.get("/lib/scheme/stdlib.scm", function (stdlib) {
      e.evalAll(parser.parse(stdlib));
      controller = $("#console").console({
        welcomeMessage: "Enter some code, and it will be evaluated.",
        promptLabel: '> ',
        continuedPromptLabel: ' ... ',
        commandHandle: onHandle,
        commandValidate: onValidate,
        autofocus: true,
        animateScroll: true,
        promptHistory: true
      });
    });
  });
});
