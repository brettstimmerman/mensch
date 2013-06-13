var assert = require('assert');
var mensch = require('..');

describe('Comments', function () {
  var options = { comments: true };

  describe('are supported when', function () {
    it('solo', function () {
      var css = '/* filibuster! */';
      var ast = mensch.parse(css, options);

      assert.deepEqual(ast, {
        stylesheet: {
          rules: [{
            type: 'comment',
            text: ' filibuster! '
          }]
        }
      });
    });

    it('before a rule', function () {
      var css = '/* filibuster! */ body { color: black; }';
      var ast = mensch.parse(css, options);

      assert.deepEqual(ast, {
        stylesheet: {
          rules: [{
            type: 'comment',
            text: ' filibuster! '
          }, {
            type: 'rule',
            selectors: ['body'],
            declarations: [{
              type: 'property',
              name: 'color',
              value: 'black'
            }]
          }]
        }
      });
    });

    it('after a rule', function () {
      var css = 'body { color: black; } /* filibuster! */';
      var ast = mensch.parse(css, options);

      assert.deepEqual(ast, {
        stylesheet: {
          rules: [{
            type: 'rule',
            selectors: ['body'],
            declarations: [{
              type: 'property',
              name: 'color',
              value: 'black'
            }]
          }, {
            type: 'comment',
            text: ' filibuster! '
          }]
        }
      });
    });

    it('before a declaration', function () {
      var css = 'body { /* filibuster! */ color: black; }';
      var ast = mensch.parse(css, options);

      assert.deepEqual(ast, {
        stylesheet: {
          rules: [{
            type: 'rule',
            selectors: ['body'],
            declarations: [{
              type: 'comment',
              text: ' filibuster! '
            }, {
              type: 'property',
              name: 'color',
              value: 'black'
            }]
          }]
        }
      });
    });

    it('after a declaration', function () {
      var css = 'body { color: black; /* filibuster! */ }';
      var ast = mensch.parse(css, options);

      assert.deepEqual(ast, {
        stylesheet: {
          rules: [{
            type: 'rule',
            selectors: ['body'],
            declarations: [{
              type: 'property',
              name: 'color',
              value: 'black'
            }, {
              type: 'comment',
              text: ' filibuster! '
            }]
          }]
        }
      });
    });
  });

  describe('are not supported when', function () {
    var expect = {
      stylesheet: {
        rules: [{
          type: 'rule',
          selectors: ['body'],
          declarations: [{
            type: 'property',
            name: 'color',
            value: 'black'
          }]
        }]
      }
    };

    var tests = {
      'between a block and its identifier': 'body /* #sadtuba */ { color: black; }',
      'after a property': 'body { color /* #sadtuba */: black; }',
      'before a value': 'body { color: /* #sadtuba */ black; }',
      'after a value': 'body { color: black /* #sadtuba */; }'
    };

    function test(label, css) {
      it(label, function () {
        var ast = mensch.parse(css, options);
        assert.deepEqual(ast, expect);
      });
    }

    Object.keys(tests).forEach(function (key) {
      test(key, tests[key]);
    });
  });
});
