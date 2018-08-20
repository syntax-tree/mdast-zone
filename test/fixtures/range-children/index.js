'use strict'

module.exports = assertion

function assertion(t, zone, tree) {
  var count = 0

  t.test('range-children', function(st) {
    st.plan(3)

    zone(tree, 'foo', handle)

    function handle(start, nodes) {
      st.equal(nodes.length, 1)
      st.equal(nodes[0].type, 'blockquote')
      st.equal(++count, 1)
    }
  })
}
