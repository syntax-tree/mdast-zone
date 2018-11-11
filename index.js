'use strict'

var commentMarker = require('mdast-comment-marker')
var visit = require('unist-util-visit')

module.exports = zone

var splice = [].splice

function zone(node, name, callback) {
  var nodes = []
  var start = null
  var scope = null
  var level = 0
  var position

  visit(node, gather)

  // Gather one dimensional zones.
  function gather(node, index, parent) {
    var type = test(node)

    if (scope && parent === scope) {
      if (type === 'start') {
        level++
      }

      if (type === 'end') {
        level--
      }

      if (type === 'end' && level === 0) {
        nodes = callback(start, nodes, node, {
          start: index - nodes.length - 1,
          end: index,
          parent: scope
        })

        if (nodes) {
          splice.apply(
            scope.children,
            [position, index - position + 1].concat(nodes)
          )
        }

        start = null
        scope = null
        position = null
        nodes = []
      } else {
        nodes.push(node)
      }
    }

    if (!scope && type === 'start') {
      level = 1
      position = index
      start = node
      scope = parent
    }
  }

  // Test if `node` matches the bound settings.
  function test(node) {
    var marker = commentMarker(node)
    var attributes
    var head

    if (!marker || marker.name !== name) {
      return null
    }

    attributes = marker.attributes
    head = attributes.match(/(start|end)\b/)

    return head ? head[0] : null
  }
}
