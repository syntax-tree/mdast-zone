'use strict';

/* eslint-env mocha */

function test(zone) {
    function onrun() {
        it('should not invoke `onrun` with nested ranges', function () {
            throw new Error('Duplicate invocations!');
        });
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
