'use strict';

/* eslint-env node, mocha */

function test(zone) {
    function onparse() {
        it('should invoke `onparse` when tokenizing', function () {
            throw new Error('This shouldn’t be invoked!');
        });
    }

    function plugin(mdast) {
        mdast.use(zone({
            'name': 'foo',
            'onparse': onparse
        }));
    }

    return plugin;
}

module.exports = test;
