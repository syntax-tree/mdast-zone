'use strict'

module.exports = assertion

function assertion(t, zone, tree) {
  zone(tree, 'foo', handle)

  function handle(start, nodes, end) {
    return [
      start,
      {
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Bar'}]
      },
      end
    ]
  }
}
