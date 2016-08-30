'use strict';

module.exports = assertion;

function assertion(t, zone, tree) {
  zone(tree, 'foo', handle);

  function handle(start, nodes, end) {
    t.test('range', function (st) {
      st.equal(start.type, 'html');
      st.equal(start.value, '<!--foo start bar="baz"-->');

      st.deepEqual(nodes, []);

      st.equal(end.type, 'html');
      st.equal(end.value, '<!--foo end qux="quux"-->');

      st.end();
    });
  }
}
