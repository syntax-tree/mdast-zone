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
     * @param {Node} start - Head node.
     * @param {Array.<Node>} nodes - Content.
     * @param {Node} end - Tail node.
     * @param {Object} scope - Information.
     */
    function onrun(start, nodes, end, scope) {
        t.test('range', function (st) {
            st.equal(start.type, 'start');
            st.equal(start.node.type, 'html');
            st.equal(start.node.value, '<!--foo start bar="baz"-->');
            st.equal(start.attributes, 'bar="baz"');
            st.equal(start.parameters.bar, 'baz');
            st.equal(start.parameters.start, undefined);

            st.equal(end.type, 'end');
            st.equal(end.node.type, 'html');
            st.equal(end.node.value, '<!--foo end qux="quux"-->');
            st.equal(end.attributes, 'qux="quux"');
            st.equal(end.parameters.qux, 'quux');
            st.equal(end.parameters.end, undefined);

            st.equal(scope.start, 1);
            st.equal(scope.end, 2);
            st.equal(scope.parent.type, 'root');

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
