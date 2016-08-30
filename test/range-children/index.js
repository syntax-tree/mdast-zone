'use strict';

module.exports = assertion;

function assertion(t, zone, tree) {
  var count = 0;

  zone(tree, 'foo', handle);

  function handle(start, nodes) {
    t.test('range-children', function (st) {
      st.equal(nodes.length, 1);
      st.equal(nodes[0].type, 'blockquote');

      count++;
      st.equal(count, 1);

      st.end();
    });
  }
}
