/**
 * @param {import('tape').Test} t
 * @param {import('../../../index.js').zone} zone
 * @param {import('mdast').Root} tree
 */
export default function assertion(t, zone, tree) {
  let count = 0

  t.test('range-children', (st) => {
    st.plan(3)

    zone(tree, 'foo', handle)

    /** @type {import('../../../index.js').Handler} */
    function handle(_, nodes) {
      st.equal(nodes.length, 1)
      st.equal(nodes[0].type, 'blockquote')
      st.equal(++count, 1)
    }
  })
}
