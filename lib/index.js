/**
 * @typedef {import('mdast').Parent} MdastParent
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').Root} Root
 */

/**
 * @typedef {Root | Content} Node
 * @typedef {Extract<Node, MdastParent>} Parent
 *
 * @typedef ZoneInfo
 *   Extra info.
 * @property {Parent} parent
 *   Parent of the section.
 * @property {number} start
 *   Index of `start` in `parent`.
 * @property {number} end
 *   Index of `end` in `parent`.
 *
 * @callback Handler
 *   Callback called when a section is found.
 * @param {Node} start
 *   Start of section.
 * @param {Array<Node>} between
 *   Nodes between `start` and `end`.
 * @param {Node} end
 *   End of section.
 * @param {ZoneInfo} info
 *   Extra info.
 * @returns {Array<Node | null | undefined> | null | undefined | void}
 *   Results.
 *
 *   If nothing is returned, nothing will be changed.
 *   If an array of nodes (can include `null` and `undefined`) is returned, the
 *   original section will be replaced by those nodes.
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
  /** @type {number | undefined} */
  let level
  /** @type {Node | undefined} */
  let marker
  /** @type {Parent | undefined} */
  let scope

  visit(node, (node, index, parent) => {
    const info = commentMarker(node)
    const match =
      info && info.name === name ? info.attributes.match(/(start|end)\b/) : null
    const type = match ? match[0] : undefined

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
          // @ts-expect-error: Assume `scope` is a valid parent of `node`.
          const start = scope.children.indexOf(marker)

          const nodes = callback(
            marker,
            scope.children.slice(start + 1, index),
            node,
            {start, end: index, parent: scope}
          )

          if (nodes) {
            // Ensure no empty nodes are inserted.
            // This could be the case if `end` is in `nodes` but no `end` node exists.
            /** @type {Array<Node>} */
            const result = []
            let offset = -1

            while (++offset < nodes.length) {
              const node = nodes[offset]
              if (node) result.push(node)
            }

            // @ts-expect-error: Assume the correct children are passed.
            scope.children.splice(start, index - start + 1, ...result)
          }

          marker = undefined
          scope = undefined
        }
      }
    }
  })
}
