'use strict';

/* eslint-env node */

/**
 * Assertion.
 *
 * @param {Function} zone - Utility.
 * @param {Object} t - Test.
 * @return {Function} - Attacher.
 */
function assertion(zone, t) {
    /**
     * Run handler.
     *
     * @param {Node} start - First node.
     */
    function onrun(start) {
        t.test('marker', function (st) {
            st.notEqual(
                start.type,
                'marker',
                'should not `onrun` with markers when transforming'
            );

            st.end();
        });
    }

    /**
     * Plug-in.
     *
     * @param {Remark} remark - Processor.
     */
    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onrun': onrun
        }));
    }

    return plugin;
}

module.exports = assertion;
