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
     * @return {Array.<Node>} - Replacement.
     */
    function onrun() {
        return [];
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
