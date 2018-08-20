'use strict'

var test = require('tape')
var remark = require('remark')
var zone = require('..')
var fixtures = require('./fixtures')

test('mdast-zone', function(t) {
  fixtures.forEach(each)

  t.end()

  function each(fixture) {
    remark()
      .use(plugin)
      .process(fixture.input, done)

    function done(err, file) {
      t.ifError(err, 'should not fail (' + fixture.name + ')')

      if (fixture.output) {
        t.equal(
          String(file),
          String(fixture.output),
          'should stringify ' + fixture.name
        )
      }
    }

    function plugin() {
      return transform
    }

    function transform(tree) {
      fixture.test(t, zone, tree)
    }
  }
})
