var e = require('./eval');

require('./lambda');
require('./macro');
require('./primitives');

var parser;

(function() {
var nScripts, loaded = 0;

function checkForAllLoaded() {
  console.log("nscripts: " + nScripts);
  console.log("loaded: " + loaded);
  if (nScripts === loaded) {
    $(document).trigger("conspiracy_loaded");
  }
}

function loadFile(src) {
  console.log(src);
  $.get(src, function (contents) {
    console.log("STARTING");
    e.evalAll(parser.parse(contents));
    loaded++;
    checkForAllLoaded();
    console.log("FILE");
  });
}

console.log("BEFORE");
$.get("/lib/lisp.pegjs", function (parser_data) {
  parser = PEG.buildParser(parser_data);
  console.log("PARSER");
  $.get("/lib/scheme/stdlib.scm", function (stdlib) {
    e.evalAll(parser.parse(stdlib));
    console.log("STDLIB");
    var scripts = $("script[type=\"text/conspiracy\"]")
    nScripts = scripts.length;
    scripts.each(function (i, e) {
      if (e.src) {
        loadFile(e.src);
      }
      else {
        e.evalAll(parser.parse(e.innerHTML));
        loaded++;
      }
    });
    checkForAllLoaded();
  });
});
})();
