'use strict';

/* eslint-env node, mocha */

var assert = require('assert');

function test(zone) {
    function onparse(result) {
        var parameters = result.parameters;

        it('should parse `"Infinity"` as `Infinity`', function () {
            assert(parameters.bar === Infinity);
        });

        it('should parse `"1"` as `1`', function () {
            assert(parameters.baz === 1);
        });

        it('should parse `"-1"` as `-1`', function () {
            assert(parameters.qux === -1);
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
