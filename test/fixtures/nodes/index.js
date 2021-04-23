/**
 * @param {import('tape').Test} t
 * @param {import('../../../index.js').zone} zone
 * @param {import('unist').Node} tree
 */
export default function assertion(t, zone, tree) {
  var count = 0

  t.test('nodes', function (st) {
    st.plan(6)

    zone(tree, 'foo', handle)

    /** @type {import('../../../index.js').Handler} */
    function handle(_, nodes) {
      st.equal(nodes.length, 1)
      st.equal(nodes[0].type, 'paragraph')
      // @ts-ignore hush
      st.equal(nodes[0].children.length, 1)
      st.equal(nodes[0].children[0].type, 'text')
      st.equal(nodes[0].children[0].value, 'Foo.')
      st.equal(++count, 1)
    }
  })
}
