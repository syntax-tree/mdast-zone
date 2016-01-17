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
     * Parse handler.
     *
     * @param {Object} result - Parse result.
     */
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

    /**
     * Plug-in.
     *
     * @param {Remark} remark - Processor.
     */
    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onparse': onparse
        }));
    }

    return plugin;
}

module.exports = assertion;
