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

var visit = require('unist-util-visit');

/*
 * Methods.
 */

var splice = [].splice;

/*
 * Expression for parsing parameters.
 */

var PARAMETERS = new RegExp(
    '\\s*' +
    '(' +
        '[-a-z09_]+' +
    ')' +
    '(?:' +
        '=' +
        '(?:' +
            '"' +
            '(' +
                '(?:' +
                    '\\\\[\\s\\S]' +
                    '|' +
                    '[^"]' +
                ')+' +
            ')' +
            '"' +
            '|' +
            '\'' +
            '(' +
                '(?:' +
                    '\\\\[\\s\\S]' +
                    '|' +
                    '[^\']' +
                ')+' +
            ')' +
            '\'' +
            '|' +
            '(' +
                '(?:' +
                    '\\\\[\\s\\S]' +
                    '|' +
                    '[^"\'\\s]' +
                ')+' +
            ')' +
        ')' +
    ')?' +
    '\\s*',
    'gi'
);

/**
 * Create an expression which matches a marker.
 *
 * @param {string} name - Plug-in name.
 * @return {RegExp}
 */
function marker(name) {
    return new RegExp(
        '(' +
            '\\s*' +
            '<!--' +
            '\\s*' +
            '(' +
                name +
            ')' +
            '\\s*' +
            '(' +
                'start' +
                '|' +
                'end' +
            ')?' +
            '\\s*' +
            '(' +
                '[\\s\\S]*?' +
            ')' +
            '\\s*' +
            '-->' +
            '\\s*' +
        ')'
    );
}

/**
 * Parse `value` into an object.
 *
 * @param {string} value - HTML comment.
 * @return {Object}
 */
function parameters(value) {
    var attributes = {};

    value.replace(PARAMETERS, function ($0, $1, $2, $3, $4) {
        var result = $2 || $3 || $4 || '';

        if (result === 'true' || result === '') {
            result = true;
        } else if (result === 'false') {
            result = false;
        } else if (!isNaN(result)) {
            result = Number(result);
        }

        attributes[$1] = result;

        return '';
    });

    return attributes;
}

/**
 * Factory to test if `node` matches `settings`.
 *
 * @param {Object} settings - Configuration.
 * @param {Function} callback - Invoked iwht a matching
 *   HTML node.
 * @return {Function}
 */
function testFactory(settings, callback) {
    var name = settings.name;
    var expression = marker(name);

    /**
     * Test if `node` matches the bound settings.
     *
     * @param {MDASTNode} node - Node to check.
     * @param {Parser|Compiler} [context] - Context class.
     * @return {Object?}
     */
    function test(node, context) {
        var value;
        var match;
        var result;

        if (!node || node.type !== 'html') {
            return null;
        }

        value = node.value;
        match = value.match(expression);

        if (
            !match ||
            match[1].length !== value.length ||
            match[2] !== settings.name
        ) {
            return null;
        }

        result = {
            'type': match[3] || 'marker',
            'attributes': match[4] || '',
            'parameters': parameters(match[4] || ''),
            'node': node
        };

        if (callback) {
            callback(result, context);
        }

        return result;
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
     * @return {Node}
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
     * @return {string}
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
 * @return {Function?}
 */
function attacher(mdast, options) {
    var blockTokenizers = mdast.Parser.prototype.blockTokenizers;
    var inlineTokenizers = mdast.Parser.prototype.inlineTokenizers;
    var stringifiers = mdast.Compiler.prototype;

    if (options.onparse) {
        blockTokenizers.html = parse(blockTokenizers.html, options);
        inlineTokenizers.tag = parse(inlineTokenizers.tag, options);
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
 * @return {Function}
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
