'use strict';

/* eslint-env node, mocha */

var assert = require('assert');

function test(zone) {
    function onparse(result) {
        var parameters = result.parameters;

        it('should parse `"false"` as `false`', function () {
            assert(parameters.bar === false);
        });
    }

    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onparse': onparse
        }));
    }

    return plugin;
}

module.exports = test;
