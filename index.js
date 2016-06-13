/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module mdast:zone
 * @fileoverview HTML comments as ranges or markers in mdast.
 */

'use strict';

/* eslint-env commonjs */

/*
 * Dependencies.
 */

var trim = require('trim');
var commentMarker = require('mdast-comment-marker');
var visit = require('unist-util-visit');

/*
 * Methods.
 */

var splice = [].splice;

/**
 * Factory to test if `node` matches `settings`.
 *
 * @param {Object} settings - Configuration.
 * @param {Function} callback - Invoked iwht a matching
 *   HTML node.
 * @return {Function} - Test.
 */
function testFactory(settings, callback) {
    var name = settings.name;

    /**
     * Test if `node` matches the bound settings.
     *
     * @param {MDASTNode} node - Node to check.
     * @param {Parser|Compiler} [context] - Context class.
     * @return {Object?} - Whether `node` matches.
     */
    function test(node, context) {
        var marker = commentMarker(node);
        var attributes;
        var head;

        if (!marker || marker.name !== name) {
            return null;
        }

        attributes = marker.attributes;
        head = attributes.match(/(start|end)\b/);

        if (head) {
            head = head[0];
            marker.attributes = trim.left(attributes.slice(head.length));
            marker.parameters[head] = undefined;
        }

        marker.type = head || 'marker';

        if (callback) {
            callback(marker, context);
        }

        return marker;
    }

    return test;
}

/**
 * Parse factory.
 *
 * @param {Function} tokenize - Previous parser.
 * @param {Object} settings - Configuration.
 */
function parse(tokenize, settings) {
    var callback = settings.onparse;
    var test = testFactory(settings, function (result, context) {
        if (result.type === 'marker') {
            callback(result, context);
        }
    });

    /**
     * Parse HTML.
     *
     * @return {Node} - Result of overloaded function.
     */
    function replacement() {
        var node = tokenize.apply(this, arguments);

        test(node, this);

        return node;
    }

    replacement.locator = tokenize.locator;

    return replacement;
}

/**
 * Stringify factory.
 *
 * @param {Function} compile - Previous compiler.
 * @param {Object} settings - Configuration.
 */
function stringify(compile, settings) {
    var callback = settings.onstringify;
    var test = testFactory(settings, function (result, context) {
        if (result.type === 'marker') {
            callback(result, context);
        }
    });

    /**
     * Stringify HTML.
     *
     * @param {MDASTHTMLNode} node - HTML node.
     * @return {string} - Compiled document.
     */
    return function (node) {
        test(node, this);

        return compile.apply(this, arguments);
    };
}

/**
 * Run factory.
 *
 * @param {Object} settings - Configuration.
 */
function run(settings) {
    var callback = settings.onrun;
    var test = testFactory(settings);
    var nodes = [];
    var start = null;
    var scope = null;
    var level = 0;
    var position;

    /**
     * Gather one dimensional zones.
     *
     * Passed intto `visit`.
     *
     * @param {MDASTNode} node - node to check.
     * @param {number} index - Position of `node` in
     *   `parent`.
     * @param {MDASTNode} parent - Parent of `node`.
     */
    function gather(node, index, parent) {
        var result = test(node);
        var type = result && result.type;

        if (scope && parent === scope) {
            if (type === 'start') {
                level++;
            }

            if (type === 'end') {
                level--;
            }

            if (type === 'end' && level === 0) {
                nodes = callback(start, nodes, result, {
                    'start': index - nodes.length - 1,
                    'end': index,
                    'parent': scope
                });

                if (nodes) {
                    splice.apply(
                        scope.children, [position, index + 1].concat(nodes)
                    );
                }

                start = null;
                scope = null;
                position = null;
                nodes = [];
            } else {
                nodes.push(node);
            }
        }

        if (!scope && type === 'start') {
            level = 1;
            position = index;
            start = result;
            scope = parent;
        }
    }

    /**
     * Modify AST.
     *
     * @param {MDASTNode} node - Root node.
     */
    return function (node) {
        visit(node, gather);
    };
}

/**
 * Modify mdast to invoke callbacks when HTML commnts are
 * found.
 *
 * @param {MDAST} mdast - Instance.
 * @param {Object?} [options] - Configuration.
 * @return {Function?} - Transformer.
 */
function attacher(mdast, options) {
    var parser = mdast.Parser.prototype;
    var blockTokenizers = parser.blockTokenizers;
    var inlineTokenizers = parser.inlineTokenizers;
    var stringifiers = mdast.Compiler.prototype.visitors;

    if (options.onparse) {
        blockTokenizers.html = parse(blockTokenizers.html, options);
        inlineTokenizers.html = parse(inlineTokenizers.html, options);
    }

    if (options.onstringify) {
        stringifiers.html = stringify(stringifiers.html, options);
    }

    if (options.onrun) {
        return run(options);
    }

    return null;
}

/**
 * Wrap `zone` to be passed into `mdast.use()`.
 *
 * Reason for this is that **mdast** only allows a single
 * function to be `use`d once.
 *
 * @param {Object} options - Plugin configuration.
 * @return {Function} - Attacher.
 */
function wrapper(options) {
    if (!options || !options.name) {
        throw new Error('Missing `name` in `options`');
    }

    return function (mdast) {
        return attacher(mdast, options);
    };
}

/*
 * Expose.
 */

module.exports = wrapper;
