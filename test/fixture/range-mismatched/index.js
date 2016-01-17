'use strict';

/* eslint-env node */

function assertion(zone) {
    function onrun() {
        throw new Error('Duplicate invocations!');
    }

    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onrun': onrun
        }));
    }

    return plugin;
}

module.exports = assertion;
