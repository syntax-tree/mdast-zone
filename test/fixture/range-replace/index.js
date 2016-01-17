'use strict';

/* eslint-env node */

/**
 * Assertion.
 *
 * @param {Function} zone - Utility.
 * @return {Function} - Attacher.
 */
function assertion(zone) {
    /**
     * Run handler.
     *
     * @param {Node} start - Head node.
     * @param {Array.<Node>} nodes - Content.
     * @param {Node} end - Tail node.
     * @return {Array.<Node>} - Replacement.
     */
    function onrun(start, nodes, end) {
        return [start.node, end.node];
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
