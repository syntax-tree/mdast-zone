'use strict';

/* eslint-env node */

function assertion(zone) {
    function onparse() {
        throw new Error('This shouldn’t be invoked! (#1)');
    }

    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onparse': onparse
        }));
    }

    return plugin;
}

module.exports = assertion;
