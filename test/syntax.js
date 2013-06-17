var assert = require('assert');
var mensch = require('..');

function ensure(css, expect) {
  var ast = mensch.parse(css);
  var out = mensch.stringify(ast).trim();

  expect || (expect = css.trim());

  assert.equal(out, expect);
}

describe('Syntax', function () {
  describe('strings in selectors, and braces in strings', function () {
    it('should work', function () {
      var css = [
        'abbr[title*="{"] {',
          'color: black;',
        '}',
        '',
        'abbr[title^="}"] {',
          'color: red;',
        '}'
      ].join('\n');

      ensure(css);
    });
  });

  describe('unexpected braces and semi-colons', function () {
    it('should be ignored', function () {
      var css = [
        'body {',
          'font-size: small;',
        '}',
        '}', // <- unexpected
        '',
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
        '',
        'body {',
          'color: black;',
        '}'
      ].join('\n');

      var expect = css.replace('print', 'print;');

      ensure(css, expect);

      css = [
        '@charset "utf-8"', // <- missing semi-colon
        '',
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

  describe('deep nesting of @-groups', function () {
    it('is invalid, but should work', function () {
      var css = [
        '@supports (display: border-box) {',
          '.foo {',
            'color: red;',
          '}',
          '',
          '@media print {',
            '.foo {',
              'color: black;',
            '}',
            '',
            '@supports (display: table) {',
              '.foo {',
                'color: blue;',
              '}',
              '',
            '}',
            '',
          '}',
        '}'
      ].join('\n');

      ensure(css);
    });
  });


  describe('pseudo-classes within @media blocks', function () {
    it('should work', function () {
      var css = [
        '@media screen and (max-width: 700px) {',
          '.nav a {',
            'display: block;',
          '}',
          '',
          '.nav a:hover {',
            'text-decoration: none;',
          '}',
          '',
          '.nav a:focus {',
            'text-decoration: underline;',
          '}',
        '}'
      ].join('\n');

      ensure(css);
    });
  });

});