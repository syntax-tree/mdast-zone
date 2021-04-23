import fs from 'fs'
import path from 'path'
import test from 'tape'
import remark from 'remark'
import {isHidden} from 'is-hidden'
import {zone} from '../index.js'

test('mdast-zone', async function (t) {
  var root = path.join('test', 'fixtures')
  var fixtures = fs.readdirSync(root)
  var index = -1
  var output
  var name
  var mod

  while (++index < fixtures.length) {
    name = fixtures[index]
    output = null

    if (isHidden(name)) continue

    try {
      output = fs.readFileSync(path.join(root, name, 'output.md'))
    } catch {}

    mod =
      /* eslint-disable-next-line no-await-in-loop */
      (await import(new URL('fixtures/' + name + '/index.js', import.meta.url)))
        .default

    remark()
      .use(() => (tree) => {
        mod(t, zone, tree)
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
