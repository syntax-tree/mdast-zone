'use strict';

module.exports = assertion;

function assertion(t, zone, tree) {
  zone(tree, 'foo', handle);

  function handle() {
    return [];
  }
}
