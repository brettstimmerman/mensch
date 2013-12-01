var assert = require('assert');
var mensch = require('..');

function ensure(css, expect, options) {
  if (typeof expect != 'string') {
    options = expect;
    expect = null;
  }

  expect || (expect = css.trim());
  options || (options = {});

  var ast = mensch.parse(css, options);
  var out = mensch.stringify(ast, options).trim();

  assert.equal(out, expect);
}

describe('General Syntax', function () {
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

  describe('strings in values', function () {
    it('should work', function () {
      var css = [
        '.sele {',
          'content: "hel\\"lo";',
        '}'
      ].join('\n');

      ensure(css);

      css = [
        '.sele {',
          'voice-family: "\\"}\\"";',
          'voice-family: inherit;',
        '}'
      ].join('\n');

      ensure(css);

      css = [
        '.klass {',
          '/* " */',
          '/*  \' */',
          '/* \\\' \\" \\*/',
          "content: '\"';",
          "content: '\\\"';",
          'content: "\'";',
          'content: "\\\'";',
          "content: '/* dude \\*/';",
          "content: '/* ';",
          "background: url('\\\"');",
          'content: "du\\\nde";',
        '}'
      ].join('\n');

      var ast = mensch.parse(css, {comments: true});
      var out = mensch.stringify(ast, {comments: true}).trim();

      // Normalize extra newlines for comparison.
      out = out.replace(/\n\n/g, '\n');

      var expect = css.trim();
      assert.equal(out, expect);

      css = [
        '.onemore {',
          'content: "\\\"";',
          'content: "\\\'";',
          'content: "{}";',
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

  describe('whitespace within selectors', function () {
    it('should be retained', function () {
      var css = [
        'body \t ',
        'div \r ',
        'span \f ',
        'a {',
          'color: red;',
        '}'
      ].join('\n');

      ensure(css);
    });
  });

});
