'use strict';

/* eslint-env node, mocha */

var assert = require('assert');

function test(zone) {
    function onrun(start, nodes, end, scope) {
        it('should `onrun` with ranges when transforming', function () {
            assert(nodes.length === 1);
            assert(nodes[0].type === 'paragraph');
            assert(nodes[0].children.length === 1);
            assert(nodes[0].children[0].type === 'text');
            assert(nodes[0].children[0].value === 'Foo.');

            assert(scope.start === 1);
            assert(scope.end === 3);
            assert(scope.parent.type === 'root');
        });
    }

    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onrun': onrun
        }));
    }

    return plugin;
}

module.exports = test;
