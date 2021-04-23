'use strict'

var fs = require('fs')
var path = require('path')
var test = require('tape')
var remark = require('remark')
var hidden = require('is-hidden')
var zone = require('..')

test('mdast-zone', function (t) {
  var root = path.join(__dirname, 'fixtures')
  var fixtures = fs.readdirSync(root)
  var index = -1
  var output
  var name
  var test

  while (++index < fixtures.length) {
    name = fixtures[index]
    output = null

    if (hidden(name)) continue

    try {
      output = fs.readFileSync(path.join(root, name, 'output.md'))
    } catch (_) {}

    test = require(path.join(root, name))

    remark()
      .use(() => (tree) => {
        test(t, zone, tree)
      })
      .process(
        fs.readFileSync(path.join(root, name, 'input.md')),
        (error, file) => {
          t.ifError(error, 'should not fail (' + name + ')')

          if (output) {
            t.equal(String(file), String(output), 'should stringify ' + name)
          }
        }
      )
  }

  t.end()
})
