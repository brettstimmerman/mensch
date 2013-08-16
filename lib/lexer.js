var DEBUG = false; // `true` to print debugging info.
var TIMER = false; // `true` to time calls to `lex()` and print the results.

var debug = require('./debug')('lex');

exports = module.exports = lex;

/**
 * Convert a CSS string into an array of lexical tokens.
 *
 * @param {String} css CSS
 * @returns {Array} lexical tokens
 */
function lex(css) {
  var start; // Debug timer start.

  var buffer = '';      // Character accumulator
  var ch;               // Current character
  var column = 0;       // Current source column number
  var cursor = -1;      // Current source cursor position
  var depth = 0;        // Current nesting depth
  var line = 1;         // Current source line number
  var state = 'before-selector'; // Current state
  var stack = [state];  // State stack
  var token = {};       // Current token
  var tokens = [];      // Token accumulator

  // Supported @-rules, in roughly descending order of usage probability.
  var atRules = [
    'media',
    'keyframes',
    { name: '-webkit-keyframes', type: 'keyframes', prefix: '-webkit-' },
    { name: '-moz-keyframes', type: 'keyframes', prefix: '-moz-' },
    { name: '-o-keyframes', type: 'keyframes', prefix: '-o-' },
    'font-face',
    { name: 'import', state: 'before-at-value' },
    { name: 'charset', state: 'before-at-value' },
    'supports',
    'viewport'
  ];

  // -- Functions ------------------------------------------------------------

  /**
   * Advance the character cursor and return the next character.
   *
   * @returns {String} The next character.
   */
  //ANGUS - camel case getch
  function getCh() {
    skip();
    return css[cursor];
  }

  /**
   * Return the state at the given index in the stack.
   * The stack is LIFO so indexing is from the right.
   *
   * @param {Number} [index=0] Index to return.
   * @returns {String} state
   */
  function getState(index) {
    return index ? stack[stack.length - 1 - index] : state;
  }

  /**
   * Look ahead for a string beginning from the next position. The string
   * being looked for must start at the next position.
   *
   * @param {String} str The string to look for.
   * @returns {Boolean} Whether the string was found.
   */
  function isNextString(str) {
    var start = cursor + 1;
    return (str === css.slice(start, start + str.length));
  }

  /**
   * Find the start position of a substring beginning from the next
   * position. The string being looked for may begin anywhere.
   *
   * @param {String} str The substring to look for.
   * @returns {Number|false} The position, or `false` if not found.
   */
  function find(str) {
    var pos = css.slice(cursor).indexOf(str);

    return pos > 0 ? pos : false;
  }

  /**
   * Determine whether a character is next.
   *
   * @param {String} ch Character.
   * @returns {Boolean} Whether the character is next.
   */
  function isNextChar(ch) {
    return ch === peek(1);
  }

  /**
   * Return the character at the given cursor offset. The offset is relative
   * to the cursor, so negative values move backwards.
   *
   * @param {Number} [offset=1] Cursor offset.
   * @returns {String} Character.
   */
  function peek(offset) {
    return css[cursor + (offset || 1)];
  }

  /**
   * Remove the current state from the stack and set the new current state.
   *
   * @returns {String} The removed state.
   */
  function popState() {
    var removed = stack.pop();
    state = stack[stack.length - 1];

    return removed;
  }

  /**
   * Set the current state and add it to the stack.
   *
   * @param {String} newState The new state.
   */
  function pushState(newState) {
    state = newState;
    stack.push(state);
    return stack.length;
  }

  /**
   * Replace the current state with a new state.
   *
   * @param {String} newState The new state.
   * @returns {String} The replaced state.
   */
  function replaceState(newState) {
    var previousState = state;
    stack[stack.length - 1] = state = newState;

    return previousState;
  }

  /**
   * Move the character cursor. Positive numbers move the cursor forward,
   * negative numbers move the cursor backward.
   *
   * @param {Number} [n=1] Number of characters to skip.
   */
  function skip(n) {
    cursor = cursor + (n || 1);
  }

  /**
   * Add the current token to the pile and reset the buffer.
   */
  function addToken() {

    token.end = {
      line: line,
      col: column
    };

    DEBUG && debug('addToken:', JSON.stringify(token, null, 2));

    tokens.push(token);

    buffer = '';
    token = {};
  }

  /**
   * Set the current token.
   *
   * @param {String} type Token type.
   */
  function initializeToken(type) {
    token = {
      type: type,
      start: {
        line: line,
        col : column
      }
    };
  }

  // -- Main Loop ------------------------------------------------------------

  /*
  The main loop is a state machine that reads in one character at a time,
  and determines what to do based on the current state and character.
  This is implemented as a series of nested `switch` statements and the
  case orders have been mildly optimized based on rough probabilities
  calculated by processing a small sample of real-world CSS.

  Further optimization (such as a dispatch table) shouldn't be necessary
  since the total number of cases is very low.
  */

  TIMER && (start = Date.now());

  while (ch = getCh()) {
    DEBUG && debug(ch, getState());

    column += 1;

    switch (ch) {
    // Space
    case ' ':
      switch (getState()) {
      case 'selector':
      case 'value':
      case 'value-paren':
      case 'at-group':
      case 'at-value':
      case 'comment':
      case 'double-string':
      case 'single-string':
        buffer += ch;
        break;
      }
      break;

    // Newline or tab
    case '\n':
    case '\t':
    case '\r':
    case '\f':
      switch (getState()) {
      case 'comment':
      case 'single-string':
      case 'double-string':
        buffer += ch;
        break;

      case 'at-value':
        // Tokenize an @-rule if a semi-colon was omitted.
        if ('\n' === ch) {
          token.value = buffer.trim();
          addToken();
          popState();
        }
        break;
      }

      if ('\n' === ch) {
        column = 0;
        line += 1;
      }
      break;

    case ':':
      switch (getState()) {
      case 'name':
        token.name = buffer.trim();
        buffer = '';

        replaceState('before-value');
        break;

      case 'before-selector':
        buffer += ch;

        initializeToken('selector');
        pushState('selector');
        break;

      default:
        buffer += ch;
        break;
      }
      break;

    case ';':
      switch (getState()) {
      case 'name':
      case 'value':
        // Tokenize a declaration
        token.value = buffer.trim(),
        addToken();
        replaceState('before-name');
        break;

      case 'value-paren':
        // Insignificant semi-colon
        buffer += ch;
        break;

      case 'at-value':
        // Tokenize an @-rule
        token.value = buffer.trim();
        addToken();
        popState();
        break;

      case 'before-name':
        // Extraneous semi-colon
        break;

      default:
        buffer += ch;
        break;
      }
      break;

    case '{':
      switch (getState()) {
      case 'selector':
        // If the sequence is `\{` then assume that the brace should be escaped.
        if (peek(-1) === '\\') {
            buffer += ch;
            break;
        }

        // Tokenize a selector
        token.text = buffer.trim();
        addToken();
        replaceState('before-name');
        break;

      case 'at-group':
        // Tokenize an @-group
        token.name = buffer.trim();

        // XXX: @-rules are starting to get hairy
        if (token.type === 'font-face' || token.type === 'viewport') {
          pushState('before-name');
        } else {
          pushState('before-selector');
        }

        addToken();
        break;

      case 'name':
      case 'at-rule':
        // Tokenize a declaration or an @-rule
        token.name = buffer.trim();
        addToken();
        pushState('before-name');
        break;

      case 'comment':
      case 'double-string':
      case 'single-string':
        // Ignore braces in comments and strings
        buffer += ch;
        break;
      }

      // Increment nesting depth if not in a comment
      if ('comment' !== getState()) {
        depth = depth + 1;
      }

      break;

    case '}':
      switch (getState()) {
      case 'before-name':
      case 'name':
      case 'value':
        // If the buffer contains anything, it is a value
        if (buffer) {
          token.value = buffer.trim();
        }

        // If the current token has a name and a value it should be tokenized.
        if (token.name && token.value) {
          addToken();
        }

        // Leave the block
        initializeToken('end');
        addToken();
        popState();

        // We might need to leave again.
        // XXX: What about 3 levels deep?
        if ('at-group' === getState()) {
          initializeToken('at-group-end');
          addToken();
          popState();
        }

        break;

      case 'at-group':
      case 'before-selector':
      case 'selector':
        // If the sequence is `\}` then assume that the brace should be escaped.
        if (peek(-1) === '\\') {
            buffer += ch;
            break;
        }

        if (depth > 0) {
          // Leave block if in an at-group
          if ('at-group' === getState(1)) {
            initializeToken('at-group-end');
            addToken();
          }
        }

        if (depth > 1) {
          popState();
        }

        break;

      case 'double-string':
      case 'single-string':
      case 'comment':
        // Ignore braces in comments and strings.
        buffer += ch;
        break;
      }

      if (depth > 0 && 'comment' !== getState()) {
        depth = depth - 1;
      }

      break;

    // Strings
    case '"':
    case "'":
      switch (getState()) {
      case 'double-string':
        if ('"' === ch) {
          popState();
        }
        break;

      case 'single-string':
        if ("'" === ch) {
          popState();
        }
        break;

      case 'before-at-value':
        replaceState('at-value');
        pushState('"' === ch ? 'double-string' : 'single-string');
        break;

      case 'before-value':
        replaceState('value');
        pushState('"' === ch ? 'double-string' : 'single-string');
        break;

      case 'comment':
        // Ignore strings within comments.
        break;

      default:
        pushState('"' === ch ? 'double-string' : 'single-string');
      }

      buffer += ch;
      break;

    // Comments
    case '/':
      switch (getState()) {
      case 'comment':
      case 'double-string':
      case 'single-string':
        // Ignore
        buffer += ch;
        break;

      case 'before-value':
      case 'selector':
      case 'name':
      case 'value':
        if (isNextChar('*')) {
          // Ignore comments in selectors, properties and values. They are
          // difficult to represent in the AST.
          var pos = find('*/');

          if (pos) {
            skip(pos + 1);
          }
        } else {
          buffer += ch;
        }
        break;

      default:
        if (isNextChar('*')) {
          // Create a comment token
          skip();
          initializeToken('comment');
          pushState('comment');
        }
        else {
          buffer += ch;
        }
        break;
      }
      break;

    // Comment end or universal selector
    case '*':
      switch (getState()) {
      case 'comment':
        if (isNextChar('/')) {
          // Tokenize a comment
          token.text = buffer; // Don't trim()!
          skip();
          addToken();
          popState();
        }
        else {
          buffer += ch;
        }
        break;

      case 'before-selector':
        buffer += ch;
        initializeToken('selector');
        pushState('selector');
        break;

      default:
        buffer += ch;
      }
      break;

    // @-rules
    case '@':
      switch (getState()) {
      case 'comment':
      case 'double-string':
      case 'single-string':
        buffer += ch;
        break;

      default:
        // Iterate over the supported @-rules and attempt to tokenize one.
        var tokenized = false;
        var name;
        var rule;

        for (var j = 0, len = atRules.length; !tokenized && j < len; ++j) {
          rule = atRules[j];
          name = rule.name || rule;

          if (!isNextString(name)) { continue; }

          tokenized = true;

          skip(name.length);
          initializeToken(name);
          pushState(rule.state || 'at-group');

          if (rule.prefix) {
            token.prefix = rule.prefix;
          }

          if (rule.type) {
            token.type = rule.type;
          }
        }

        if (!tokenized) {
          // Keep on truckin' America!
          buffer += ch;
        }
        break;
      }
      break;

    // Parentheses are tracked to disambiguate semi-colons, such as within a
    // data URI.
    case '(':
      switch (getState()) {
      case 'value':
        pushState('value-paren');
        break;
      }

      buffer += ch;
      break;

    case ')':
      switch (getState()) {
      case 'value-paren':
        popState();
        break;
      }

      buffer += ch;
      break;

    default:
      switch (getState()) {
      case 'before-selector':
        initializeToken('selector');
        pushState('selector');
        break;

      case 'before-name':
        initializeToken('property');
        replaceState('name');
        break;

      case 'before-value':
        replaceState('value');
        break;

      case 'before-at-value':
        replaceState('at-value');
        break;
      }

      buffer += ch;
      break;
    }
  }

  TIMER && debug('ran in', (Date.now() - start) + 'ms');

  return tokens;
}
