/**
 * @typedef {import('mdast').Root} Root
 */

import {zone} from 'mdast-zone'

/**
 * @param {Root} tree
 */
export default function assertion(tree) {
  zone(tree, 'foo', function () {
    return []
  })
}
