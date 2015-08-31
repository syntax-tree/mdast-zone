'use strict';

/* eslint-env node, mocha */

var assert = require('assert');

function test(zone) {
    function onparse(result) {
        it('should invoke `onparse` when tokenizing', function () {
            assert(result.type === 'marker');
            assert(result.node.type === 'html');
            assert(result.node.value === '<!--foo bar="baz"-->');
            assert(result.attributes === 'bar="baz"');
            assert(result.parameters.bar === 'baz');
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
