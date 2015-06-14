'use strict';

/* eslint-env mocha */

var assert = require('assert');

function test(zone) {
    function onrun(start, nodes, end, scope) {
        it('should `onrun` with ranges when transforming', function () {
            assert(start.type === 'start');
            assert(start.node.type === 'html');
            assert(start.node.value === '<!--foo start bar="baz"-->');
            assert(start.attributes === 'bar="baz"');
            assert(start.parameters.bar === 'baz');
            assert(!start.parameters.start);

            assert(end.type === 'end');
            assert(end.node.type === 'html');
            assert(end.node.value === '<!--foo end qux="quux"-->');
            assert(end.attributes === 'qux="quux"');
            assert(end.parameters.qux === 'quux');
            assert(!end.parameters.end);

            assert(scope.start === 1);
            assert(scope.end === 2);
            assert(scope.parent.type === 'root');
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
