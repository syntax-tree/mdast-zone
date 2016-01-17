'use strict';

/* eslint-env node */

function assertion(zone) {
    function onrun() {
        return [];
    }

    function plugin(mdast) {
        mdast.use(zone({
            'name': 'foo',
            'onrun': onrun
        }));
    }

    return plugin;
}

module.exports = assertion;
