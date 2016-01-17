'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onparse(result) {
        t.test('attributes-number', function (st) {
            st.equal(
                result.parameters.bar,
                Infinity,
                'should parse `"Infinity"` as `Infinity`'
            );

            st.equal(
                result.parameters.baz,
                1,
                'should parse `"1"` as `1`'
            );

            st.equal(
                result.parameters.qux,
                -1,
                'should parse `"-1"` as `-1`'
            );

            st.end();
        });
    }

    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onparse': onparse
        }));
    }

    return plugin;
}

module.exports = assertion;
