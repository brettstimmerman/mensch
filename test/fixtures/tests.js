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
      type: "stylesheet",
      stylesheet: {
        rules: [{
          type: 'comment',
          text: ' body { color: black; } '
        }]
      }
    }
  }, {
    options: {},
    expect: {
      type: "stylesheet",
      stylesheet: {
        rules: []
      }
    }
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
  type: "stylesheet",
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
      type: "stylesheet",
      stylesheet: {
        rules: [{
          type: 'charset',
          value: '"UTF-8"'
        }]
      }
    }
  }]
};

// -- @document ----------------------------------------------------------------

exports['@document'] = {
      css: ['@document url(http://www.w3.org/),' +
                'url-prefix(http://www.w3.org/Style/),' +
                'domain(mozilla.org),' +
                'regexp("https:.*") {',
            'body {',
              'color: purple;',
              'background: yellow;',
            '}',
          '}'].join(' '),

      lex: [{
        type: 'document',
        name: 'url(http://www.w3.org/),' +
                'url-prefix(http://www.w3.org/Style/),' +
                'domain(mozilla.org),' +
                'regexp("https:.*")',
        start: { col: 1, line: 1 },
        end: { col: 103, line: 1 }
      }, {
        type: 'selector',
        start: { line: 1, col: 105 },
        text: 'body',
        end: { line: 1, col: 110 }
      }, {
        type: 'property',
        start: { line: 1, col: 112 },
        name: 'color',
        value: 'purple',
        end: { line: 1, col: 125 }
      }, {
        type: 'property',
        start: { line: 1, col: 127 },
        name: 'background',
        value: 'yellow',
        end: { line: 1, col: 145 }
      }, {
        type: 'end',
        start: { line: 1, col: 147 },
        end: { line: 1, col: 147 }
      }, {
        type: 'at-group-end',
        start: { line: 1, col: 149 },
        end: { line: 1, col: 149 }
      }],

      parse: [{
        expect: {
          type: "stylesheet",
          stylesheet: {
            rules: [{
              type: 'document',
              name: 'url(http://www.w3.org/),url-prefix(http://www.w3.org/Style/),domain(mozilla.org),regexp("https:.*")',
              prefix: undefined,
              rules: [{
                type: 'rule',
                selectors: ['body'],
                declarations: [{
                  type: 'property',
                  name: 'color',
                  value: 'purple',
                }, {
                  type: 'property',
                  name: 'background',
                  value: 'yellow',
                }]
              }]
            }]
          }
        }
      }, {
        css: ['@-moz-document url(http://www.w3.org/),' +
                  'url-prefix(http://www.w3.org/Style/),' +
                  'domain(mozilla.org),' +
                  'regexp("https:.*") {',
                'body {',
                  'color: purple;',
                  'background: yellow;',
                '}',
              '}'].join(' '),

        expect: {
          type: "stylesheet",
          stylesheet: {
            rules: [{
              type: 'document',
              name: 'url(http://www.w3.org/),url-prefix(http://www.w3.org/Style/),domain(mozilla.org),regexp("https:.*")',
              prefix: '-moz-',
              rules: [{
                type: 'rule',
                selectors: ['body'],
                declarations: [{
                  type: 'property',
                  name: 'color',
                  value: 'purple',
                }, {
                  type: 'property',
                  name: 'background',
                  value: 'yellow',
                }]
              }]
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
      type: "stylesheet",
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
  css: '@font-face { font-family: Gentium; src: url(http://example.com/fonts/Gentium.ttf);}',

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
    start: { col: 74, line: 1 },
    end: { col: 74, line: 1 }
  }, {
    type: 'at-group-end',
    start: { col: 74, line: 1 },
    end: { col: 74, line: 1 }
  }],

  parse: [{
    expect: {
      type: "stylesheet",
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
      type: "stylesheet",
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
      type: "stylesheet",
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
  }, {
    css: [
      '@-ms-keyframes boom {',
        'from {',
          'background-position: 0 0;',
        '}',
        'to {',
          'background-position: 100% 100%;',
        '}',
      '}'
    ].join(' '),

    expect: {
      type: "stylesheet",
      stylesheet: {
        rules: [{
          type: 'keyframes',
          name: 'boom',
          prefix: '-ms-',
          rules: [{
            type: 'rule',
            selectors: ['from'],
            declarations: [{
                name: 'background-position',
                type: 'property',
                value: '0 0'
            }]
          }, {
            type: 'rule',
            selectors: ['to'],
            declarations: [{
              name: 'background-position',
              type: 'property',
              value: '100% 100%'
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
      type: "stylesheet",
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

// -- @namespace ---------------------------------------------------------------

exports['@namespace'] = {
  css: '@namespace url(http://www.w3.org/1999/xhtml); ' +
       '@namespace svg url(http://www.w3.org/2000/svg); ' +
       '@namespace "booga";',

  lex: [{
    type: 'namespace',
    start: { line: 1, col: 1 },
    value: 'url(http://www.w3.org/1999/xhtml)',
    end: { line: 1, col: 36 }
  }, {
    type: 'namespace',
    start: { line: 1, col: 38 },
    value: 'svg url(http://www.w3.org/2000/svg)',
    end: { line: 1, col: 75 }
  }, {
    type: 'namespace',
    start: { line: 1, col: 77 },
    value: '"booga"',
    end: { line: 1, col: 86 }
  }],

  parse: [{
    expect: {
      type: "stylesheet",
      stylesheet: {
        rules: [{
          type: "namespace",
          value: "url(http://www.w3.org/1999/xhtml)"
        }, {
          type: "namespace",
          value: "svg url(http://www.w3.org/2000/svg)"
        }, {
          type: "namespace",
          value: "\"booga\""
        }]
      }
    }
  }]
};

// -- @page --------------------------------------------------------------------

exports['@page'] = {
  css: '@page :pseudo-class { margin: 2in; }',

  lex: [{
    type: 'page',
    start: { line: 1, col: 1 },
    name: ':pseudo-class',
    end: { line: 1, col: 17 }
  }, { type: 'property',
    start: { line: 1, col: 19 },
    name: 'margin',
    value: '2in',
    end: { line: 1, col: 30 }
  }, { type: 'end',
    start: { line: 1, col: 32 },
    end: { line: 1, col: 32 }
  }, { type: 'at-group-end',
    start: { line: 1, col: 32 },
    end: { line: 1, col: 32 }
  }],

  parse: [{
    expect: {
      type: "stylesheet",
      stylesheet: {
        rules: [{
          type: "page",
          name: ":pseudo-class",
          prefix: undefined,
          declarations: [{
            type: "property",
            name: "margin",
            value: "2in"
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
      type: "stylesheet",
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
  css: '@viewport { width: 320px auto;}',

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
    start: { col: 23, line: 1 },
    end: { col: 23, line: 1 }
  }, {
    type: 'at-group-end',
    start: { col: 23, line: 1 },
    end: { col: 23, line: 1 }
  }],

  parse: [{
    expect: {
      type: "stylesheet",
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
      type: "stylesheet",
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


// -- Position -----------------------------------------------------------------

exports.position = {
  css: '.foo { color: black; }',

  lex: [{
    type: "selector",
    start: { line: 1, col: 1 },
    text: ".foo",
    end: { line: 1, col: 6}
  },
  {
    type: "property",
    name: "color",
    value: "black",
    start: { line :1, col: 8 },
    end: { line: 1, col: 20 }
  }, {
    type: 'end',
    start: { line: 1, col: 22 },
    end: { line: 1, col: 22 }
  }],

  parse: [{
    options: { position: true },

    expect: {
      type: "stylesheet",
      stylesheet: {
        rules: [{
          type: 'rule',
          selectors: ['.foo'],
          declarations: [{
            type: 'property',
            name: 'color',
            value: 'black',
            position: {
              start: { line: 1, col: 8 },
              end: { line: 1, col: 20 }
            }
          }],
          position: {
            start: { line: 1, col: 1 },
            end: { line: 1, col: 6 }
          }
        }]
      }
    }
  }]
};