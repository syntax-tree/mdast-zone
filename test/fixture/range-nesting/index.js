'use strict';

/* eslint-env mocha */

var assert = require('assert');

function test(zone) {
    var index = -1;

    function onrun(start, nodes, end, scope) {
        it('should not invoke `onrun` with nested ranges', function () {
            assert(nodes.length === 3);
            assert(nodes[0].type === 'html');
            assert(nodes[1].type === 'paragraph');
            assert(nodes[2].type === 'html');

            assert(scope.start === 1);
            assert(scope.end === 5);
            assert(scope.parent.type === 'root');

            index++;

            if (index !== 0) {
                throw new Error('Duplicate invocations!');
            }
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
