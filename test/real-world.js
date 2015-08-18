var DEBUG = true;

var assert = require('assert');
var mensch = require('..');

describe('Real world CSS', function () {
  var fs = require('fs');
  var path = require('path');

  ['cnn', 'espn', 'plus.google', 'twitter', 'yahoo'].forEach(function (name) {
    var file = path.join(__dirname, 'fixtures', name + '.com.css');
    var css = fs.readFileSync(file, 'utf-8').trim().replace(/\r\n/g, '\n');
    var size = (css.length / 1024).toFixed();

    it(name + '.com [' + size + ' kb]', function () {
      var ast = mensch.parse(css, {comments: true});
      var out = mensch.stringify(ast, {comments: true}).replace(/\r\n/g, '\n');

      DEBUG && debug(css, out);

      assert.strictEqual(out, css, 'Result does not match input (' + name + ')');
    });
  });
});

function debug(css, out) {
  var line = 1;
  css.split('').some(function (c, i) {
    var equal = (c === out[i]);

    if (c === '\n') { line++; }

    if (!equal) {
      process.stderr.write('Line ' + line + '\n');
      process.stderr.write('========\n');
      process.stderr.write(JSON.stringify(css.slice(i - 6, i + 6)) + '\n');
      process.stderr.write('--------\n');
      process.stderr.write(JSON.stringify(out.slice(i - 6, i + 6)) + '\n');
      process.stderr.write('========\n');
    }

    return !equal;
  });
}
