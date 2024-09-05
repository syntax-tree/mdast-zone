/**
 * @import {Nodes, Parents} from 'mdast'
 */

/**
 * @typedef Info
 *   Extra info.
 * @property {Parents} parent
 *   Parent of the section.
 * @property {number} start
 *   Index of `start` in `parent`.
 * @property {number} end
 *   Index of `end` in `parent`.
 *
 * @callback Handler
 *   Callback called when a section is found.
 * @param {Nodes} start
 *   Start of section.
 * @param {Array<Nodes>} between
 *   Nodes between `start` and `end`.
 * @param {Nodes} end
 *   End of section.
 * @param {Info} info
 *   Extra info.
 * @returns {Array<Nodes | null | undefined> | null | undefined | void}
 *   Results.
 *
 *   If nothing is returned, nothing will be changed.
 *   If an array of nodes (can include `null` and `undefined`) is returned, the
 *   original section will be replaced by those nodes.
 */

import {commentMarker} from 'mdast-comment-marker'
import {visit} from 'unist-util-visit'

/**
 * Search `tree` for a start and end comments matching `name` and change their
 * “section” with `handler`.
 *
 * @param {Nodes} node
 *   Tree to search.
 * @param {string} name
 *   Comment name to look for.
 * @param {Handler} handler
 *   Handle a section.
 * @returns {undefined}
 *   Nothing.
 */
export function zone(node, name, handler) {
  /** @type {number | undefined} */
  let level
  /** @type {Nodes | undefined} */
  let marker
  /** @type {Parents | undefined} */
  let scope

  visit(node, function (node, index, parent) {
    const info = commentMarker(node)
    const match =
      info && info.name === name
        ? info.attributes.match(/(start|end)\b/)
        : undefined
    const type = match ? match[0] : undefined

    if (parent && index !== undefined && type) {
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
          // @ts-expect-error: Assume `scope` is a valid parent of `node`.
          const start = scope.children.indexOf(marker)

          const nodes = handler(
            marker,
            scope.children.slice(start + 1, index),
            node,
            {start, end: index, parent: scope}
          )

          if (!nodes) {
            marker = undefined
            scope = undefined
            return
          }

          // Ensure no empty nodes are inserted.
          // This could be the case if `end` is in `nodes` but no `end` node exists.
          /** @type {Array<Nodes>} */
          const result = []
          let offset = -1

          while (++offset < nodes.length) {
            const node = nodes[offset]
            if (node) result.push(node)
          }

          const deleteCount = index - start + 1
          scope.children.splice(
            start,
            deleteCount,
            // @ts-expect-error: Assume the correct children are passed.
            ...result
          )

          marker = undefined
          scope = undefined

          return index - deleteCount + result.length
        }
      }
    }
  })
}
