var e = require('./eval');

require('./lambda');
require('./macro');
require('./primitives');

var parser;

(function() {
var nScripts, loaded = 0;

function checkForAllLoaded() {
  if (nScripts === loaded) {
    $(document).trigger("conspiracy_loaded");
  }
}

function loadFile(src) {
  $.get(src, function (contents) {
    e.evalAll(parser.parse(contents));
    loaded++;
    checkForAllLoaded();
  });
}

$.get("/lib/lisp.pegjs", function (parser_data) {
  parser = PEG.buildParser(parser_data);
  $.get("/lib/scheme/stdlib.scm", function (stdlib) {
    e.evalAll(parser.parse(stdlib));
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
