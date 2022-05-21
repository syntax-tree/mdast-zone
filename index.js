/**
 * @typedef {import('mdast').Root|import('mdast').Content} Node
 * @typedef {Extract<Node, import('mdast').Parent>} Parent
 *
 * @typedef ZoneInfo
 *   Extra info.
 * @property {Parent} parent
 *   Parent of the range.
 * @property {number} start
 *   Index of `start` in `parent`
 * @property {number} end
 *   Index of `end` in `parent`
 *
 * @callback Handler
 *   Callback called when a range is found.
 * @param {Node} start
 *   Start of range.
 * @param {Array<Node>} between
 *   Nodes between `start` and `end`.
 * @param {Node} end
 *   End of range.
 * @param {ZoneInfo} info
 *   Extra info.
 * @returns {Array<Node>|null|undefined|void}
 *   Nodes to replace.
 */

import {commentMarker} from 'mdast-comment-marker'
import {visit} from 'unist-util-visit'

/**
 * @param {Node} node
 *   Tree to search.
 * @param {string} name
 *   Comment name to look for.
 * @param {Handler} callback
 *   Callback called when a range is found.
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
