var assert = require('assert');
var mensch = require('..');

function testLex(name) {
  var data = tests[name];

  it(name, function () {
    var tokens = mensch.lex(data.css);
    assert.deepEqual(tokens, data.lex);
  });
}

function testParse(name) {
  var data = tests[name];

  it(name, function () {
    data.parse.forEach(function (parse) {
      var ast = mensch.parse(parse.css || data.css, parse.options);
      assert.deepEqual(ast, parse.expect);
    });
  });
}

function testStringify(name) {
  var data = tests[name];
  var options = data.stringify && data.stringify.options;

  it(name, function () {
    var css = mensch.stringify(mensch.parse(data.css, options), options);
    assert.equal(fixup(css), data.css);
  });
}

function fixup(css) {
  return css.replace(/\n+/g, ' ').replace(/[ ]{2,}/g, '').trim();
}

// -----------------------------------------------------------------------------

var tests = require('./fixtures/tests');
var testNames = Object.keys(tests);

describe('API', function () {
  describe('.lex(css)', function () {
    testNames.forEach(testLex);
  });

  describe('.parse(css)', function () {
    testNames.forEach(testParse);
  });

  describe('.stringify(ast)', function () {
    testNames.forEach(testStringify);
  });

  describe('.stringify(ast, {compress: true}', function () {
    it('should compress whitespace', function () {
      var css = [
          'body {',
          '  color:black;',
          '  font-weight:bold;',
          '}'
      ].join('\n');

      var ast = mensch.parse(css);
      var expect = css.replace(/\s/g, '');

      assert.equal(mensch.stringify(ast, {compress: true}), expect);
    });
  });

  describe('.stringify(ast, {indent: \'  \'})', function () {
    it('should indent two spaces', function () {
      var css = [
          'body {',
          '  color: black;',
          '  font-weight: bold;',
          '}'
      ].join('\n');

      var ast = mensch.parse(css);
      var out = mensch.stringify(ast, {indentation: '  '});

      assert.equal(out, css);
    });
  });
});
