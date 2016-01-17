'use strict';

/* eslint-env node */

function assertion(zone) {
    function onrun(start, nodes, end) {
        return [start.node, end.node];
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
