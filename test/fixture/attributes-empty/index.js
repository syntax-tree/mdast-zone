'use strict';

/* eslint-env node, mocha */

var assert = require('assert');

function test(zone) {
    function onparse(result) {
        var parameters = result.parameters;

        it('should parse attributes without value', function () {
            assert(parameters.bar === true);
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
