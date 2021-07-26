/**
 * @param {import('tape').Test} _
 * @param {import('../../../index.js').zone} zone
 * @param {import('mdast').Root} tree
 */
export default function assertion(_, zone, tree) {
  zone(tree, 'foo', handle)

  /** @type {import('../../../index.js').Handler} */
  function handle(start, _, end) {
    return [
      start,
      /** @type {import('mdast').Heading} */ ({
        type: 'heading',
        depth: 2,
        children: [{type: 'text', value: 'Bar'}]
      }),
      end
    ]
  }
}
