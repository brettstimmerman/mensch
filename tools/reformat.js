/*
Attempt to make minified CSS more test-friendly by reformatting it a bit.
The idea is to replicated mensch output so that a test like the following is
possible:

  css === mensch.stringify(mensch.parse(css));

Example:

  $ node reformat.js example.com.css
  => example.com.reformat.css
*/

var fs = require('fs');
var path = require('path');

var file = path.join(__dirname, process.argv[2]);

var src = fs.readFileSync(file, 'utf8');

fs.writeFileSync(file.replace('.css', '.reformat.css'),
  src
  // Inject missing semi-colons.
  .replace(/([^;])\s*\}/gm, '$1;}')

  // Fix up whitespace around braces and semi-colons.
  .replace(/;(?!base64)\s*/g, ';\n')
  .replace(/\s*\{(?!\})\s*/g, ' {\n')
  .replace(/([^\n])\}/g, '$1\n}')
  .replace(/\}()/g, '}\n$1')

  // Fix up whitespace between properties and values.
  .replace(/:(?!\s+|image|hover|visited|link|focus|after|before|last-child|first-child|nth-child)/g, ': ')

   // Undo whitespace after http: because no lookbehind.
  .replace(/http: /g, 'http:')

   // Remove lines containing only a semi-colon.
  .replace(/^\s*;\s*$/gm, '')

   // Strip leading whitespace.
  .replace(/^\s+(\S)/gm, '$1')

  // Remove whitespace from empty rules.
  .replace(/\{\s+\}/gm, '{}')
);
