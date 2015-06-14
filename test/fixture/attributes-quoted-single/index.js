'use strict';

/* eslint-env mocha */

var assert = require('assert');

function test(zone) {
    function onparse(result) {
        var parameters = result.parameters;

        it('should parse attributes with single quotes', function () {
            assert(parameters.bar === 'baz\\bar\\\'baz');
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
