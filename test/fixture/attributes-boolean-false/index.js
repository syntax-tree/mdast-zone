'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onparse(result) {
        t.test('attributes-boolean-false', function (st) {
            st.equal(
                result.parameters.bar,
                false,
                'should parse `"false"` as `false`'
            );

            st.end();
        })
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
