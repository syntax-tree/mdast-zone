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
     * Thrower.
     */
    function exception() {
        throw new Error('This shouldn’t be invoked! (#1)');
    }

    /**
     * Plug-in.
     *
     * @param {Remark} remark - Processor.
     */
    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onparse': exception,
            'onstringify': exception
        }));
    }

    return plugin;
}

module.exports = assertion;
