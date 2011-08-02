var reader = require("../lib/reader"),
    assert = require('assert'),
    vows   = require("vows");

assert.objEqual = function(str, expected) {
  assert.deepEqual(reader.parse(str), [expected]);
};

vows.describe("The Reader").addBatch({
  "should read booleans": function () {
    assert.objEqual("#t", true);
    assert.objEqual("#f", false);
    assert.objEqual("#T", true);
    assert.objEqual("#F", false);
    assert.throws(function () {
      reader.parse("#h");
    });
  },

  "should read characters": function () {
    assert.objEqual("#\\a", {type: "character", char: "a"});
    assert.throws(function () {
      reader.parse("#\\5");
    });
  },

  "should read integers": function () {
    assert.objEqual("5", 5);
    assert.objEqual("42", 42);
    assert.throws(function () {
      reader.parse("05");
    });
  },

  "should read lists": function () {
    assert.objEqual("(1 2 3)", [1, 2, 3]);
    assert.objEqual(" ( 1 2   3 ) ", [1, 2, 3]);
    assert.objEqual("(1 (2 3))", [1, [2, 3]]);
    assert.throws(function () {
      reader.parse("(1 2");
    });
  },

  "should read identifiers": function () {
    assert.objEqual("hello_world", {type: "id", name: "hello_world"});
    assert.objEqual("h3ll0_w0rld", {type: "id", name: "h3ll0_w0rld"});
    assert.throws(function () {
      reader.parse("37signals");
    });
  },

  "should read strings": function () {
    assert.objEqual("\"hello world\"", "hello world");
  }
}).export(module);

