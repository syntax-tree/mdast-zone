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

  zone(tree, 'foo', function (start, nodes, end) {
    assert.equal(start.type, 'html')
    assert(start.type === 'html')
    assert.equal(start.value, '<!--foo start bar="baz"-->')
    assert.deepEqual(nodes, [])
    assert.equal(end.type, 'html')
    assert(end.type === 'html')
    assert.equal(end.value, '<!--foo end qux="quux"-->')
    count++
  })

  assert.equal(count, 1, 'expected handle to be called')
}
