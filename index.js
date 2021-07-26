/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('unist-util-visit').Visitor<Node>} Visitor
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

  visit(node, gather)

  /**
   * Gather one dimensional zones.
   * @type {Visitor}
   */
  function gather(node, index, parent) {
    const info = commentMarker(node)
    const match =
      info && info.name === name && info.attributes.match(/(start|end)\b/)
    const type = match && match[0]

    if (parent && index !== null && type) {
      if (!scope && type === 'start') {
        level = 0
        marker = node
        scope = parent
      }

      if (typeof level === 'number' && marker && scope && parent === scope) {
        if (type === 'start') {
          level++
        } else {
          level--
        }

        if (type === 'end' && !level) {
          const start = scope.children.indexOf(marker)

          const result = callback(
            marker,
            scope.children.slice(start + 1, index),
            node,
            {start, end: index, parent}
          )

          if (result) {
            scope.children.splice(start, index - start + 1, ...result)
          }

          marker = undefined
          scope = undefined
        }
      }
    }
  }
}
