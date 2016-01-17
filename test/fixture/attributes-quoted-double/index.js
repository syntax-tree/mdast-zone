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
        t.test('attributes-quoted-double', function (st) {
            st.equal(
                result.parameters.bar,
                'baz\\bar\\"baz',
                'should parse attributes with double quotes'
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
