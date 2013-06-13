var assert = require('assert');
var fs = require('fs');
var path = require('path');

var mensch = require('..');

// http://mathiasbynens.be/notes/css-escapes
describe('CSS Escape Sequences', function () {
  it('should be supported', function () {
    var file = path.join(__dirname, 'fixtures', 'escapes.css');
    var css = fs.readFileSync(file, 'utf-8');

    var ast = mensch.parse(css, {comments: true});
    var out = mensch.stringify(ast, {comments: true, compress: true});

    assert.equal(out, css);
  });
});