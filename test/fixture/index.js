'use strict';

var fs = require('fs');
var path = require('path');

var join = path.join;
var read = fs.readFileSync;
var exists = fs.existsSync;

var tests = fs
    .readdirSync(join(__dirname))
    .filter(function (filepath) {
        return filepath.indexOf('.') === -1;
    }).map(function (filepath) {
        var output = join(__dirname, filepath, 'Output.md');

        return {
            'name': filepath,
            'input': read(join(__dirname, filepath, 'Input.md'), 'utf-8'),
            'output': exists(output) ? read(output, 'utf-8') : null,
            'test': require(join(__dirname, filepath, 'index.js'))
        };
    });

module.exports = tests;
