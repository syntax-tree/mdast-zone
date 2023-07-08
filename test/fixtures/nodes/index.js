/**
 * @typedef {import('mdast').Root} Root
 */

import assert from 'node:assert/strict'
import {zone} from '../../../index.js'

/**
 * @param {Root} tree
 */
export default function assertion(tree) {
  let count = 0

  zone(tree, 'foo', function (_, nodes) {
    assert.equal(nodes.length, 1)
    const head = nodes[0]
    assert.equal(head.type, 'paragraph')
    assert(head.type === 'paragraph')
    assert.equal(head.children.length, 1)
    const headHead = head.children[0]
    assert.equal(headHead.type, 'text')
    assert(headHead.type === 'text')
    assert.equal(headHead.value, 'Foo.')
    assert.equal(count, 0, 'expected handle to be called once')
    count++
  })

  assert.equal(count, 1, 'expected handle to be called')
}
