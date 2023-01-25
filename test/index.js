/**
 * @typedef {import('mdast').Root} Root
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from 'mdast-util-to-markdown'
import {isHidden} from 'is-hidden'
import * as mod from '../index.js'

test('zone', async () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['zone'],
    'should expose the public api'
  )

  const root = new URL('fixtures/', import.meta.url)
  const folders = await fs.readdir(root)
  let index = -1

  while (++index < folders.length) {
    const folder = folders[index]

    if (isHidden(folder)) continue

    /** @type {string | undefined} */
    let expected

    try {
      expected = String(await fs.readFile(new URL(folder + '/output.md', root)))
    } catch {}

    /** @type {{default: (tree: Root) => void}} */
    const mod = await import(new URL(folder + '/index.js', root).href)
    const check = mod.default
    const tree = fromMarkdown(
      await fs.readFile(new URL(folder + '/input.md', root))
    )

    check(tree)

    assert.equal(toMarkdown(tree), expected, folder)
  }
})
