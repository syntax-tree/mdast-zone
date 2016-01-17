'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onparse(result) {
        t.test('onparse', function (st) {
            st.equal(result.type, 'marker');
            st.equal(result.node.type, 'html');
            st.equal(result.node.value, '<!--foo bar="baz"-->');
            st.equal(result.attributes, 'bar="baz"');
            st.equal(result.parameters.bar, 'baz');

            st.end();
        });
    }

    function plugin(mdast) {
        mdast.use(zone({
            'name': 'foo',
            'onparse': onparse
        }));
    }

    return plugin;
}

module.exports = assertion;
