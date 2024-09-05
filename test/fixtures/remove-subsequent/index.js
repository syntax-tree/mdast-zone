/**
 * @import {Root} from 'mdast'
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
