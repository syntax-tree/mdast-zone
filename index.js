import {commentMarker} from 'mdast-comment-marker'
import {visit} from 'unist-util-visit'

export function zone(node, name, callback) {
  var level
  var marker
  var scope

  visit(node, gather)

  // Gather one dimensional zones.
  function gather(node, index, parent) {
    var info = commentMarker(node)
    var match =
      info && info.name === name && info.attributes.match(/(start|end)\b/)
    var type = match && match[0]
    var start
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
