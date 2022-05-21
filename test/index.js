/**
 * @typedef {import('tape').Test} Test
 * @typedef {import('mdast').Root} Root
 * @typedef {import('../index.js').zone} Zone
 */

import fs from 'node:fs'
import path from 'node:path'
import test from 'tape'
import {remark} from 'remark'
import {isHidden} from 'is-hidden'
import {zone} from '../index.js'

test('mdast-zone', async (t) => {
  const root = path.join('test', 'fixtures')
  const fixtures = fs.readdirSync(root)
  let index = -1

  while (++index < fixtures.length) {
    const name = fixtures[index]
    /** @type {string|undefined} */
    let output

    if (isHidden(name)) continue

    try {
      output = String(fs.readFileSync(path.join(root, name, 'output.md')))
    } catch {}

    /* eslint-disable no-await-in-loop */
    /** @type {{default: (t: Test, zone: Zone, node: Root) => void}} */
    const {default: mod} =
      // @ts-expect-error hush.
      await import(new URL('fixtures/' + name + '/index.js', import.meta.url)) // type-coverage:ignore-line
    /* eslint-enable no-await-in-loop */

    remark()
      .use(() => (tree) => {
        mod(t, zone, /** @type {Root} */ (tree))
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
