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
        t.test('attributes-boolean-true', function (st) {
            st.equal(
                result.parameters.bar,
                true,
                'should parse `"true"` as `true`'
            );

            st.end();
        });
    }

    /**
     * Plug-in.
     *
     * @param {Unified} processor - Processor.
     */
    function plugin(processor) {
        processor.use(zone({
            'name': 'foo',
            'onparse': onparse
        }));
    }

    return plugin;
}

module.exports = assertion;
