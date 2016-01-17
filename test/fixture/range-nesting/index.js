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
    var index = -1;

    /**
     * Run handler.
     *
     * @param {Node} start - Head node.
     * @param {Array.<Node>} nodes - Content.
     * @param {Node} end - Tail node.
     * @param {Object} scope - Information.
     */
    function onrun(start, nodes, end, scope) {
        t.test('range-nesting', function (st) {
            st.equal(nodes.length, 3);
            st.equal(nodes[0].type, 'html');
            st.equal(nodes[1].type, 'paragraph');
            st.equal(nodes[2].type, 'html');

            st.equal(scope.start, 1);
            st.equal(scope.end, 5);
            st.equal(scope.parent.type, 'root');

            index++;

            if (index !== 0) {
                throw new Error('Duplicate invocations!');
            }

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
