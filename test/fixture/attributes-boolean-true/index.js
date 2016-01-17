'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onparse(result) {
        t.test('attributes-boolean-true', function (st) {
            st.equal(
                result.parameters.bar,
                true,
                'should parse `"true"` as `true`'
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
