var assert = require('assert');
var mensch = require('..');

describe('Parse with options.position=true', function () {
  describe('with comments', function () {
    it('should count comment length', function() {
      var css = 'body p {}';
      var ast = mensch.parse(css, { comment: true, position: true });
      assert.deepEqual(ast.stylesheet.rules[0].position, { start: { line: 1, col: 1 }, end: { line: 1, col: 8 } });
      var css = 'body /* comment */p {}';
      var ast = mensch.parse(css, { comment: true, position: true });
      assert.deepEqual(ast.stylesheet.rules[0].position, { start: { line: 1, col: 1 }, end: { line: 1, col: 21 } });
      var css = 'body /* multiline \n comment */p {}';
      var ast = mensch.parse(css, { comment: true, position: true });
      assert.deepEqual(ast.stylesheet.rules[0].position, { start: { line: 1, col: 1 }, end: { line: 2, col: 14 } });
    });
  });
  describe('with atrules', function () {
    it('should count rule length', function() {
      var css = '@media screen {}';
      var ast = mensch.parse(css, { comment: true, position: true });
      assert.deepEqual(ast.stylesheet.rules[0].position, { start: { line: 1, col: 1 }, end: { line: 1, col: 15 } });
    });
  });
  describe('positions should be consistents between lines', function() {
    it('should have same column numbering in first and second line', function() {
      var css = 'selector { prop: val }\nselector { prop: val }';
      var ast = mensch.parse(css, { comment: true, position: true });
      assert.deepEqual(ast.stylesheet.rules[0].position, { start: { line: 1, col: 1 }, end: { line: 1, col: 10 } });
      assert.deepEqual(ast.stylesheet.rules[1].position, { start: { line: 2, col: 1 }, end: { line: 2, col: 10 } });
    })
    it('should have same column numbering in first and second line and for selector/properties', function() {
      var css = 'selector {\nprop: val;\n}\nselector {\nprop: val;\n}';
      var ast = mensch.parse(css, { comment: true, position: true });
      assert.deepEqual(ast.stylesheet.rules[0].position, { start: { line: 1, col: 1 }, end: { line: 1, col: 10 } });
      assert.deepEqual(ast.stylesheet.rules[0].declarations[0].position, { start: { line: 2, col: 1 }, end: { line: 2, col: 10 } });
      assert.deepEqual(ast.stylesheet.rules[1].position, { start: { line: 4, col: 1 }, end: { line: 4, col: 10 } });
      assert.deepEqual(ast.stylesheet.rules[1].declarations[0].position, { start: { line: 5, col: 1 }, end: { line: 5, col: 10 } });
    })
  });
});
