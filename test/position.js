var assert = require('assert');
var mensch = require('..');

describe('Parse with options.position=true', function () {
  describe('with comments', function () {
  	it('should count comment length', function() {
  		var css = 'body p {}';
  		var ast = mensch.parse(css, { comment: true, position: true });
  		assert.equal(ast.stylesheet.rules[0].position.end.line, 1);
  		assert.equal(ast.stylesheet.rules[0].position.end.col, 8);
  		var css = 'body /* comment */p {}';
  		var ast = mensch.parse(css, { comment: true, position: true });
  		assert.equal(ast.stylesheet.rules[0].position.end.line, 1);
  		assert.equal(ast.stylesheet.rules[0].position.end.col, 21);
  		var css = 'body /* multiline \n comment */p {}';
  		var ast = mensch.parse(css, { comment: true, position: true });
  		assert.equal(ast.stylesheet.rules[0].position.end.line, 2);
  		assert.equal(ast.stylesheet.rules[0].position.end.col, 13);
  	});
  });
  describe('with atrules', function () {
  	it('should count rule length', function() {
  		var css = '@media screen {}';
  		var ast = mensch.parse(css, { comment: true, position: true });
  		assert.equal(ast.stylesheet.rules[0].position.end.line, 1);
  		assert.equal(ast.stylesheet.rules[0].position.end.col, 15);
  	});
  });
});
