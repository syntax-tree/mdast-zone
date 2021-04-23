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
 * @param {Node|undefined} start
 * @param {Array.<Node>} between
 * @param {Node|undefined} end
 * @param {ZoneInfo} info
 */

import {commentMarker} from 'mdast-comment-marker'
import {visit} from 'unist-util-visit'

/**
 * @param {Node} node
 * @param {string} name
 * @param {Handler} callback
 */
export function zone(node, name, callback) {
  /** @type {number} */
  var level
  /** @type {Node} */
  var marker
  /** @type {Parent} */
  var scope

  visit(node, gather)

  /**
   * Gather one dimensional zones.
   * @type {Visitor}
   */
  function gather(node, index, parent) {
    var info = commentMarker(node)
    var match =
      info && info.name === name && info.attributes.match(/(start|end)\b/)
    var type = match && match[0]
    /** @type {number} */
    var start
    /** @type {Array.<Node>} */
    var result

    if (type) {
      if (!scope && type === 'start') {
        level = 0
        marker = node
        scope = parent
      }

      if (scope && parent === scope) {
        if (type === 'start') {
          level++
        } else {
          level--
        }

        if (type === 'end' && !level) {
          start = scope.children.indexOf(marker)

          result = callback(
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
