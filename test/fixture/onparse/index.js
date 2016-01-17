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
        t.test('onparse', function (st) {
            st.equal(result.type, 'marker');
            st.equal(result.node.type, 'html');
            st.equal(result.node.value, '<!--foo bar="baz"-->');
            st.equal(result.attributes, 'bar="baz"');
            st.equal(result.parameters.bar, 'baz');

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
