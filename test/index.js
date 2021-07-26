/**
 * @typedef {import('tape').Test} Test
 * @typedef {import('unist').Node} Node
 * @typedef {import('../index.js').zone} Zone
 */

import fs from 'fs'
import path from 'path'
import test from 'tape'
import remark from 'remark'
import {isHidden} from 'is-hidden'
import {zone} from '../index.js'

test('mdast-zone', async (t) => {
  const root = path.join('test', 'fixtures')
  const fixtures = fs.readdirSync(root)
  let index = -1
  /** @type {string} */
  let output
  /** @type {string} */
  let name
  /** @type {(t: Test, zone: Zone, node: Node) => void} */
  let mod

  while (++index < fixtures.length) {
    name = fixtures[index]
    output = null

    if (isHidden(name)) continue

    try {
      output = String(fs.readFileSync(path.join(root, name, 'output.md')))
    } catch {}

    /* eslint-disable no-await-in-loop */
    mod =
      // @ts-ignore hush.
      (await import(new URL('fixtures/' + name + '/index.js', import.meta.url)))
        .default // type-coverage:ignore-line
    /* eslint-enable no-await-in-loop */

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
