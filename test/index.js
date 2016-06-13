/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:zone
 * @fileoverview Test suite for `mdast-zone`.
 */

'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var test = require('tape');
var remark = require('remark');
var zone = require('..');
var fixtures = require('./fixture');

/*
 * Tests.
 */

test('mdast-zone(options)', function (t) {
    t.throws(
        function () {
            zone();
        },
        /Missing `name` in `options`/,
        'should throw without `options`'
    );

    t.throws(
        function () {
            zone({});
        },
        /Missing `name` in `options`/,
        'should throw without `options.name`'
    );

    t.end();
});

test('Fixtures', function (t) {
    fixtures.forEach(function (fixture) {
        var processor = remark().use(fixture.test(zone, t));

        processor.process(fixture.input, function (err, file) {
            t.ifError(err, 'should not fail (' + fixture.name + ')');

            if (fixture.output) {
                t.equal(
                    String(file),
                    fixture.output,
                    'should stringify ' + fixture.name
                );
            }
        });
    });
});
