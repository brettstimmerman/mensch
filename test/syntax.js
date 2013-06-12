var assert = require('assert');
var mensch = require('..');

function ensure(css, expect) {
  var ast = mensch.parse(css);
  assert.equal(mensch.stringify(ast), expect || css);
}

describe('Syntax', function () {
  describe('unexpected braces and semi-colons', function () {
    it('should be ignored', function () {
      var css = [
        'body {',
          'font-size: small;',
        '}',
        '}', // <- unexpected
        'h2 {',
          '{', // <- unexpected
          'color: red;;', // <- extra semi-colon
        '}'
      ].join('\n');

      var expect = css
        .replace('{\n{', '{')
        .replace('}\n}', '}')
        .replace(';;', ';');

      ensure(css, expect);
    });
  });

  describe('a missing semi-colon after an @-rule', function () {
    it('should be injected', function () {
      var css = [
        '@import "foo.css" print', // <- missing semi-colon
        'body {',
          'color: black;',
        '}'
      ].join('\n');

      var expect = css.replace('print', 'print;');

      ensure(css, expect);

      css = [
        '@charset "utf-8"', // <- missing semi-colon
        'body {',
          'color: black;',
        '}'
      ].join('\n');

      expect = css.replace('8"', '8";');

      ensure(css, expect);
    });
  });

  describe('a missing semi-colon after the final declaration in a block', function () {
    it('should be injected', function () {
      var css = [
        'body {',
          'color: black;',
          'font-weight: bold', // <- missing semi-colon
        '}'
      ].join('\n');

      var expect = css.replace('bold', 'bold;');

      ensure(css, expect);
    });
  });
});
