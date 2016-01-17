'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onparse(result) {
        t.test('attributes-empty', function (st) {
            st.equal(
                result.parameters.bar,
                true,
                'should parse attributes without value'
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
