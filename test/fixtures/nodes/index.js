import assert from 'node:assert'

/**
 * @param {import('tape').Test} t
 * @param {import('../../../index.js').zone} zone
 * @param {import('mdast').Root} tree
 */
export default function assertion(t, zone, tree) {
  let count = 0

  t.test('nodes', (st) => {
    st.plan(6)

    zone(tree, 'foo', handle)

    /** @type {import('../../../index.js').Handler} */
    function handle(_, nodes) {
      st.equal(nodes.length, 1)
      const head = nodes[0]
      st.equal(head.type, 'paragraph')
      assert(head.type === 'paragraph')
      st.equal(head.children.length, 1)
      const headHead = head.children[0]
      st.equal(headHead.type, 'text')
      assert(headHead.type === 'text')
      st.equal(headHead.value, 'Foo.')
      st.equal(++count, 1)
    }
  })
}
