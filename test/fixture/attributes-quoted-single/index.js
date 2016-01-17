'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onparse(result) {
        t.test('attributes-single-double', function (st) {
            st.equal(
                result.parameters.bar,
                'baz\\bar\\\'baz',
                'should parse attributes with single quotes'
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
