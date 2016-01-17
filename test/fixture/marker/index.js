'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onrun(result) {
        t.test('marker', function (st) {
            st.notEqual(
                result.type,
                'marker',
                'should not `onrun` with markers when transforming'
            );

            st.end();
        });
    }

    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onrun': onrun
        }));
    }

    return plugin;
}

module.exports = assertion;
