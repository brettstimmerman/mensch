// Benchmark lexing, parsing and stringifying about 1.5 kb of real-world CSS.
// Borrowed from TJ Holowaychuk:
//   https://github.com/visionmedia/css/blob/master/benchmark.js

var fs = require('fs');
var path = require('path');

var mensch = require('..');
var fixturePath = path.join(__dirname, '..', 'test', 'fixtures');

function read(file) {
  return fs.readFileSync(path.join(fixturePath, file), 'utf-8');
}

var str = [
  read('cnn.com.css'),
  read('espn.com.css'),
  read('plus.google.com.css'),
  read('twitter.com.css'),
  read('yahoo.com.css')
].join('\n');

var n = 500;
var ops = 50;
var t = process.hrtime();
var results = [];

while (n--) {
  mensch.stringify(mensch.parse(str));

  if (n % ops === 0) {
    t = process.hrtime(t);

    var ms = t[1] / 1000 / 1000;
    var persec = (ops * (1000 / ms) | 0);

    results.push(persec);
    process.stdout.write('\r  [' + persec + ' ops/s] [' + n + ']');
    t = process.hrtime();
  }
}

function sum(arr) {
  return arr.reduce(function(sum, n) {
    return sum + n;
  });
}

function mean(arr) {
  return sum(arr) / (arr.length || 0);
}

console.log();
console.log('   avg: %d ops/s', mean(results));
console.log('  size: %d kb', (str.length / 1024).toFixed(2));
