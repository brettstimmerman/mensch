exports = module.exports = {};

// -- Comment ------------------------------------------------------------------

exports.comment = {
  css: '/* body { color: black; } */',

  lex: [{
    type: 'comment',
    text: ' body { color: black; } ',
    start: { line: 1, col: 1 },
    end: { line: 1, col: 26 }
  }],

  parse: [{
    options: { comments: true },

    expect : {
      stylesheet: {
        rules: [{
          type: 'comment',
          text: ' body { color: black; } '
        }]
      }
    }
  }, {
    options: {},
    expect: { stylesheet: { rules: [] } }
  }],

  stringify: {
    options: { comments: true }
  }
};

// -- Rule ---------------------------------------------------------------------

var lexTokens = [{
    type: 'selector',
    text: 'body',
    start: { col: 1, line: 1 },
    end: { col: 6, line: 1 }
  }, {
    type: 'property',
    name: 'color',
    value: 'black',
    start: { col: 8, line: 1 },
    end: { col: 20, line: 1 }
  }, {
    type: 'end',
    start: { col: 22, line: 1 },
    end: { col: 22, line: 1 }
  }];

var stylesheet = {
  stylesheet: {
    rules: [{
      selectors: ['body'],
      type: 'rule',
      declarations: [{
        type: 'property',
        name: 'color',
        value: 'black'
      }]
    }]
  }
};

exports.rule = {
  css: 'body { color: black; }',

  lex: lexTokens,

  parse: [{
    expect: stylesheet
  }, {
    css: lexTokens,
    expect: stylesheet
  }]
};

// -- @charset -----------------------------------------------------------------

exports['@charset'] = {
  css: '@charset "UTF-8";',

  lex: [{
    type: 'charset',
    value: '"UTF-8"',
    start: { col: 1, line: 1 },
    end: { col: 10, line: 1 }
  }],

  parse: [{
    expect: {
      stylesheet: {
        rules: [{
          type: 'charset',
          value: '"UTF-8"'
        }]
      }
    }
  }]
};

// -- @import ------------------------------------------------------------------

exports['@import'] = {
  css: '@import "foo.css" print;',

  lex: [{
    type: 'import',
    value: '"foo.css" print',
    start: { col: 1, line: 1 },
    end: { col: 18, line: 1 }
  }],

  parse: [{
    expect: {
      stylesheet: {
        rules: [{
          type: 'import',
          value: '"foo.css" print'
        }]
      }
    }
  }]
};

// -- @font-face ---------------------------------------------------------------

exports['@font-face'] = {
  css: '@font-face { font-family: Gentium; src: url(http://example.com/fonts/Gentium.ttf); }',

  lex: [{
    type: 'font-face',
    name: '',
    start: { col: 1, line: 1 },
    end: { col: 3, line: 1 }
  }, {
    type: 'property',
    name: 'font-family',
    value: 'Gentium',
    start: { col: 5, line: 1 },
    end: { col: 25, line: 1 }
  }, {
    type: 'property',
    name: 'src',
    value: 'url(http://example.com/fonts/Gentium.ttf)',
    start: { col: 27, line: 1 },
    end: { col: 73, line: 1 }
  }, {
    type: 'end',
    start: { col: 75, line: 1 },
    end: { col: 75, line: 1 }
  }, {
    type: 'at-group-end',
    start: { col: 75, line: 1 },
    end: { col: 75, line: 1 }
  }],

  parse: [{
    expect: {
      stylesheet: {
        rules: [{
          type: 'font-face',
          declarations: [{
            type: 'property',
            name: 'font-family',
            value: 'Gentium'
          }, {
            type: 'property',
            name: 'src',
            value: 'url(http://example.com/fonts/Gentium.ttf)'
          }]
        }]
      }
    }
  }]
};

// -- @keyframes ---------------------------------------------------------------

exports['@keyframes'] = {
  css: '@keyframes foo { from { opacity: 0; } to { opacity: 1; } }',

  lex: [{
    type: 'keyframes',
    name: 'foo',
    start: { line: 1, col: 1 },
    end: { line: 1, col: 7 }
  }, {
    type: 'selector',
    text: 'from',
    start: { line: 1, col: 9 },
    end: { line: 1, col: 14 }
  }, {
    type: 'property',
    name: 'opacity',
    value: '0',
    start: { line: 1, col: 16 },
    end: { line: 1, col: 26 }
  }, {
    type: 'end',
    start: { line: 1, col: 28 },
    end: { line: 1, col: 28 }
  }, {
    type: 'selector',
    text: 'to',
    start: { line: 1, col: 30 },
    end: { line: 1, col: 33 }
  }, {
    type: 'property',
    name: 'opacity',
    value: '1',
    start: { line: 1, col: 35 },
    end: { line: 1, col: 45 }
  }, {
    type: 'end',
    start: { line: 1, col: 47 },
    end: { line: 1, col: 47 }
  }, {
    type: 'at-group-end',
    start: { line: 1, col: 49 },
    end: { line: 1, col: 49 }
  }],

  parse: [{
    expect: {
      stylesheet: {
        rules: [{
          type: 'keyframes',
          name: 'foo',
          prefix: undefined,
          rules: [{
            type: 'rule',
            selectors: ['from'],
            declarations: [{
                name: 'opacity',
                type: 'property',
                value: '0'
            }]
          }, {
            type: 'rule',
            selectors: ['to'],
            declarations: [{
              name: 'opacity',
              type: 'property',
              value: '1'
            }]
          }]
        }]
      }
    }
  }, {
    css: '@-webkit-keyframes foo { from { opacity: 0; } to { opacity: 1; } }',

    expect: {
      stylesheet: {
        rules: [{
          type: 'keyframes',
          name: 'foo',
          prefix: '-webkit-',
          rules: [{
            type: 'rule',
            selectors: ['from'],
            declarations: [{
                name: 'opacity',
                type: 'property',
                value: '0'
            }]
          }, {
            type: 'rule',
            selectors: ['to'],
            declarations: [{
              name: 'opacity',
              type: 'property',
              value: '1'
            }]
          }]
        }]
      }
    }
  }]
};

// -- @media -------------------------------------------------------------------

exports['@media'] = {
  css: '@media screen and (min-width: 700px) { body { color: black; } }',

  lex: [{
    type: 'media',
    name: 'screen and (min-width: 700px)',
    start: { line: 1, col: 1 },
    end: { line: 1, col: 33 }
  }, {
    type: 'selector',
    text: 'body',
    start: { line: 1, col: 35 },
    end: { line: 1, col: 40 }
  }, {
    type: 'property',
    name: 'color',
    value: 'black',
    start: { line: 1, col: 42 },
    end: { line: 1, col: 54 }
  }, {
    type: 'end',
    start: { line: 1, col: 56 },
    end: { line: 1, col: 56 }
  }, {
    type: 'at-group-end',
    start: { line: 1, col: 58 },
    end: { line: 1, col: 58 }
  }],

  parse: [{
    expect: {
      stylesheet: {
        rules: [{
          name: 'screen and (min-width: 700px)',
          type: 'media',
          prefix: undefined,
          rules: [{
            type: 'rule',
            selectors: ['body'],
            declarations: [{
              name: 'color',
              value: 'black',
              type: 'property'
            }]
          }]
        }]
      }
    }
  }]
};

// -- @supports ----------------------------------------------------------------

exports['@supports'] = {
  css: '@supports (display: table-cell) { body { color: black; } }',

  lex: [{
    type: 'supports',
    name: '(display: table-cell)',
    start: { line: 1, col: 1 },
    end: { line: 1, col: 25 }
  }, {
    type: 'selector',
    text: 'body',
    start: { line: 1, col: 27 },
    end: { line: 1, col: 32 }
  }, {
    type: 'property',
    name: 'color',
    value: 'black',
    start: { line: 1, col: 34 },
    end: { line: 1, col: 46 }
  }, {
    type: 'end',
    start: { line: 1, col: 48 },
    end: { line: 1, col: 48 }
  }, {
    type: 'at-group-end',
    start: { line: 1, col: 50 },
    end: { line: 1, col: 50 }
  }],

  parse: [{
    expect: {
      stylesheet: {
        rules: [{
          name: '(display: table-cell)',
          type: 'supports',
          prefix: undefined,
          rules: [{
            type: 'rule',
            selectors: ['body'],
            declarations: [{
              name: 'color',
              value: 'black',
              type: 'property'
            }]
          }]
        }]
      }
    }
  }]
};

// -- @viewport ----------------------------------------------------------------

exports['@viewport'] = {
  css: '@viewport { width: 320px auto; }',

  lex: [{
    type: 'viewport',
    name: '',
    start: { col: 1, line: 1 },
    end: { col: 3, line: 1 }
  }, {
    type: 'property',
    name: 'width',
    value: '320px auto',
    start: { col: 5, line: 1 },
    end: { col: 22, line: 1 }
  }, {
    type: 'end',
    start: { col: 24, line: 1 },
    end: { col: 24, line: 1 }
  }, {
    type: 'at-group-end',
    start: { col: 24, line: 1 },
    end: { col: 24, line: 1 }
  }],

  parse: [{
    expect: {
      stylesheet: {
        rules: [{
          type: 'viewport',
          declarations: [{
            type: 'property',
            name: 'width',
            value: '320px auto'
          }]
        }]
      }
    }
  }]
};


// -- nested @-groups ----------------------------------------------------------

exports['nested @-groups'] = {
  css: [
    '@media print {',
      '@font-face {',
        'font-family: Gentium;',
        'src: url(http://example.com/fonts/Gentium.ttf);',
      '}',
      '@viewport {',
        'width: 320px auto;',
      '}',
    '}'
  ].join(' '),

  lex: [{
    type: 'media',
    name: 'print',
    start: { line: 1, col: 1 },
    end: { line: 1, col: 9 }
  }, {
    type: 'font-face',
    name: '',
    start: { line: 1, col: 11 },
    end: { line: 1, col: 13 }
  }, {
    type: 'property',
    name: 'font-family',
    value: 'Gentium',
    start: { line: 1, col: 15 },
    end: { line: 1, col: 35 }
  }, {
    type: 'property',
    name: 'src',
    value: 'url(http://example.com/fonts/Gentium.ttf)',
    start: { line: 1, col: 37 },
    end: { line: 1, col: 83 }
  }, {
    type: 'end',
    start: { line: 1, col: 85 },
    end: { line: 1, col: 85 }
  }, {
    type: 'at-group-end',
    start: { line: 1, col: 85 },
    end: { line: 1, col: 85 }
  }, {
    type: 'viewport',
    name: '',
    start: { line: 1, col: 87 },
    end: { line: 1, col: 89 }
  }, {
    type: 'property',
    name: 'width',
    value: '320px auto',
    start: { line: 1, col: 91 },
    end: { line: 1, col: 108 }
  }, {
    type: 'end',
    start: { line: 1, col: 110 },
    end: { line: 1, col: 110 }
  }, {
    type: 'at-group-end',
    start: { line: 1, col: 110 },
    end: { line: 1, col: 110 }
  }, {
    type: 'at-group-end',
    start: { line: 1, col: 112 },
    end: { line: 1, col: 112 }
  }],

  parse: [{
    expect: {
      stylesheet: {
        rules: [{
          type: 'media',
          name: 'print',
          prefix: undefined,
          rules: [{
            type: 'font-face',
            declarations: [{
              type: 'property',
              name: 'font-family',
              value: 'Gentium'
            }, {
              type: 'property',
              name: 'src',
              value: 'url(http://example.com/fonts/Gentium.ttf)'
            }]
          }, {
            type: 'viewport',
            declarations: [{
              type: 'property',
              name: 'width',
              value: '320px auto'
            }]
          }]
        }]
      }
    }
  }]
};