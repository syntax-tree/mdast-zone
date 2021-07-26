/**
 * @typedef {import('mdast').Root|import('mdast').Content} Node
 * @typedef {Extract<Node, import('mdast').Parent>} Parent
 *
 * @typedef ZoneInfo
 * @property {number} start
 * @property {number} end
 * @property {Parent|null} parent
 *
 * @callback Handler
 * @param {Node} start
 * @param {Array.<Node>} between
 * @param {Node} end
 * @param {ZoneInfo} info
 * @returns {Array.<Node>|null|undefined|void}
 */

import {commentMarker} from 'mdast-comment-marker'
import {visit} from 'unist-util-visit'

/**
 * @param {Node} node
 * @param {string} name
 * @param {Handler} callback
 */
export function zone(node, name, callback) {
  /** @type {number|undefined} */
  let level
  /** @type {Node|undefined} */
  let marker
  /** @type {Parent|undefined} */
  let scope

  visit(
    node,
    /**
     * Gather one dimensional zones.
     */
    (node, index, parent) => {
      const info = commentMarker(node)
      const match =
        info && info.name === name && info.attributes.match(/(start|end)\b/)
      const type = match && match[0]

      if (parent && index !== null && type) {
        if (!scope && type === 'start') {
          level = 0
          marker = node
          scope = /** @type {Parent} */ (parent)
        }

        if (typeof level === 'number' && marker && scope && parent === scope) {
          if (type === 'start') {
            level++
          } else {
            level--
          }

          if (type === 'end' && !level) {
            // @ts-expect-error: Assume `scope` is a valid parent of `node`.
            const start = scope.children.indexOf(marker)

            const result = callback(
              marker,
              scope.children.slice(start + 1, index),
              node,
              {start, end: index, parent: scope}
            )

            if (result) {
              // @ts-expect-error: Assume the correct children are passed.
              scope.children.splice(start, index - start + 1, ...result)
            }

            marker = undefined
            scope = undefined
          }
        }
      }
    }
  )
}
