/**
 * @typedef {import('mdast').Root} Root
 */

import {zone} from '../../../index.js'

/**
 * @param {Root} tree
 */
export default function assertion(tree) {
  console.log('mism')
  zone(tree, 'foo', handle)

  function handle() {
    throw new Error('Should not be invoked')
  }
}
