'use strict'

var fs = require('fs')
var path = require('path')
var negate = require('negate')
var hidden = require('is-hidden')

var root = path.join(__dirname, 'fixtures')

module.exports = fs
  .readdirSync(root)
  .filter(negate(hidden))
  .map(map)

function map(basename) {
  var output = null

  try {
    output = fs.readFileSync(path.join(root, basename, 'output.md'))
  } catch (error) {}

  return {
    name: basename,
    input: fs.readFileSync(path.join(root, basename, 'input.md')),
    output: output,
    test: require(path.join(root, basename))
  }
}
