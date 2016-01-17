'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onstringify(result) {
        t.test('onstringify', function (st) {
            st.equal(result.type, 'marker');
            st.equal(result.node.type, 'html');
            st.equal(result.node.value, '<!--foo bar="baz"-->');
            st.equal(result.attributes, 'bar="baz"');
            st.equal(result.parameters.bar, 'baz');

            st.end();
        });
    }

    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onstringify': onstringify
        }));
    }

    return plugin;
}

module.exports = assertion;
