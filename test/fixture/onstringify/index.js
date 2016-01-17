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
     * Compilation handler.
     *
     * @param {Object} result - Marker.
     */
    function onstringify(result) {
        t.test('onstringify', function (st) {
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
            'onstringify': onstringify
        }));
    }

    return plugin;
}

module.exports = assertion;
