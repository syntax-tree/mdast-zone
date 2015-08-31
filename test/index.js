/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:zone
 * @fileoverview Test suite for `mdast-zone`.
 */

'use strict';

/* eslint-env node, mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var mdast = require('mdast');
var zone = require('..');
var fixtures = require('./fixture');

/*
 * Methods.
 */

var equal = assert.strictEqual;
var throws = assert.throws;

/*
 * Tests.
 */

describe('mdast-zone(options)', function () {
    it('should throw without `options`', function () {
        throws(function () {
            zone();
        }, /Missing `name` in `options`/);
    });

    it('should throw without `options.name`', function () {
        throws(function () {
            zone({});
        }, /Missing `name` in `options`/);
    });
});

/**
 * Describe a single fixture.
 *
 * @param {Object} fixture - Test context.
 */
function describeFixture(fixture) {
    var processor = mdast().use(fixture.test(zone));

    describe(fixture.name, function () {
        processor.process(fixture.input, function (err, file, doc) {
            if (fixture.output) {
                it('should stringify ' + fixture.name, function (done) {
                    equal(doc, fixture.output);

                    done(err);
                });
            }
        });
    });
}

describe('Fixtures', function () {
    fixtures.forEach(describeFixture);
});
