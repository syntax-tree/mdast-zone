/**
 * @typedef {import('mdast').Root} Root
 */

import {zone} from '../../../index.js'

/**
 * @param {Root} tree
 */
export default function assertion(tree) {
  zone(tree, 'foo', () => [
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Bar'}]
    }
  ])
}
