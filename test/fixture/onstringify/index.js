'use strict';

/* eslint-env node, mocha */

var assert = require('assert');

function test(zone) {
    function onstringify(result) {
        it('should invoke `onstringify` when compiling', function () {
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
            'onstringify': onstringify
        }));
    }

    return plugin;
}

module.exports = test;
