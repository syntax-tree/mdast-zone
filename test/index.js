/**
 * @typedef {import('mdast').Root} Root
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {isHidden} from 'is-hidden'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from 'mdast-util-to-markdown'

test('zone', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('../index.js')).sort(), ['zone'])
  })

  const root = new URL('fixtures/', import.meta.url)
  const folders = await fs.readdir(root)
  let index = -1

  while (++index < folders.length) {
    const folder = folders[index]

    if (isHidden(folder)) continue

    await t.test('should work on `' + folder + '`', async function () {
      /** @type {string | undefined} */
      let expected

      try {
        expected = String(
          await fs.readFile(new URL(folder + '/output.md', root))
        )
      } catch {}

      /** @type {{default: (tree: Root) => undefined}} */
      const mod = await import(new URL(folder + '/index.js', root).href)
      const check = mod.default
      // To do: remove cast when `from-markdown` is released.
      const tree = /** @type {Root} */ (
        fromMarkdown(await fs.readFile(new URL(folder + '/input.md', root)))
      )

      check(tree)

      // @ts-expect-error: remove cast when `to-markdown` is released.
      const result = toMarkdown(tree)

      assert.equal(result, expected)
    })
  }
})
