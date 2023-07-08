/**
 * @typedef {import('mdast').Root} Root
 */

import assert from 'node:assert/strict'
import {zone} from 'mdast-zone'

/**
 * @param {Root} tree
 */
export default function assertion(tree) {
  let count = 0

  zone(tree, 'foo', function (_, nodes) {
    assert.equal(nodes.length, 1)
    assert.equal(nodes[0].type, 'blockquote')
    assert.equal(count, 0, 'expected handle to be called once')
    count++
  })

  assert.equal(count, 1, 'expected handle to be called')
}
