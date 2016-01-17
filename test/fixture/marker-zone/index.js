'use strict';

/* eslint-env node */

function assertion(zone) {
    function exception() {
        throw new Error('This shouldn’t be invoked! (#1)');
    }

    function plugin(mdast) {
        mdast.use(zone({
            'name': 'foo',
            'onparse': exception,
            'onstringify': exception
        }));
    }

    return plugin;
}

module.exports = assertion;
