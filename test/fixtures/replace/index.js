/**
 * @param {import('tape').Test} _
 * @param {import('../../../index.js').zone} zone
 * @param {import('mdast').Root} tree
 */
export default function assertion(_, zone, tree) {
  zone(tree, 'foo', () => [
    {
      type: 'heading',
      depth: 2,
      children: [{type: 'text', value: 'Bar'}]
    }
  ])
}
