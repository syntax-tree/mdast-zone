import assert from 'node:assert'

/**
 * @param {import('tape').Test} t
 * @param {import('../../../index.js').zone} zone
 * @param {import('mdast').Root} tree
 */
export default function assertion(t, zone, tree) {
  t.test('range', (st) => {
    st.plan(5)

    zone(tree, 'foo', handle)

    /** @type {import('../../../index.js').Handler} */
    function handle(start, nodes, end) {
      st.equal(start.type, 'html')
      assert(start.type === 'html')
      st.equal(start.value, '<!--foo start bar="baz"-->')
      st.deepEqual(nodes, [])
      st.equal(end.type, 'html')
      assert(end.type === 'html')
      st.equal(end.value, '<!--foo end qux="quux"-->')
    }
  })
}
