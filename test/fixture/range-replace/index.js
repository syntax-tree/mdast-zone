'use strict';

/* eslint-env mocha */

function test(zone) {
    function onrun(start, nodes, end) {
        return [start.node, end.node];
    }

    function plugin(mdast) {
        mdast.use(zone({
            'name': 'foo',
            'onrun': onrun
        }));
    }

    return plugin;
}

module.exports = test;
