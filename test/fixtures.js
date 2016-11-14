'use strict';

/* eslint-disable import/no-dynamic-require */

var fs = require('fs');
var path = require('path');
var negate = require('negate');
var hidden = require('is-hidden');

var root = path.join(__dirname, 'fixtures');

module.exports = fs.readdirSync(root)
  .filter(negate(hidden))
  .map(function (basename) {
    var output = path.join(root, basename, 'output.md');

    return {
      name: basename,
      input: fs.readFileSync(path.join(root, basename, 'input.md'), 'utf8'),
      output: fs.existsSync(output) ? fs.readFileSync(output, 'utf8') : null,
      test: require(path.join(root, basename, 'index.js'))
    };
  });
