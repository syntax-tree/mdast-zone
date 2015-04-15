(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mdastZone = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
 * @param {string} name
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
 * Visit.
 *
 * @param {Node} tree
 * @param {function(node, parent)} callback
 */
function visit(tree, callback) {
    /**
     * Visit one node.
     *
     * @param {Node} node
     * @param {number} index
     */
    function one(node, index) {
        var parent = this || null;

        callback(node, parent, index);

        if (node.children) {
            node.children.forEach(one, node);
        }
    }

    one(tree);
}

/**
 * Parse `value` into an object.
 *
 * @param {string} value
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
 * @param {Object} settings
 * @param {function(Object)} callback
 * @return {Function}
 */
function testFactory(settings, callback) {
    var name = settings.name;
    var expression = marker(name);

    /**
     * Test if `node` matches the bound settings.
     *
     * @param {Node} node
     * @return {Object?}
     */
    function test(node) {
        var value = node.value;
        var match;
        var result;

        if (node.type !== 'html') {
            return null;
        }

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
            callback(result);
        }

        return result;
    }

    return test;
}

/**
 * Parse factory.
 *
 * @param {Function} tokenize - Previous parser.
 * @param {Object} settings
 */
function parse(tokenize, settings) {
    var callback = settings.onparse;
    var test = testFactory(settings, function (result) {
        if (result.type === 'marker') {
            callback(result);
        }
    });

    /**
     * Parse HTML.
     *
     * @return {Node}
     */
    return function () {
        var node = tokenize.apply(this, arguments);

        test(node);

        return node;
    };
}

/**
 * Stringify factory.
 *
 * @param {Function} compile - Previous compiler.
 * @param {Object} settings
 */
function stringify(compile, settings) {
    var callback = settings.onstringify;
    var test = testFactory(settings, function (result) {
        if (result.type === 'marker') {
            callback(result);
        }
    });

    /**
     * Stringify HTML.
     *
     * @param {Object} node
     * @return {string}
     */
    return function (node) {
        test(node);

        return compile.apply(this, arguments);
    };
}

/**
 * Run factory.
 *
 * @param {Object} settings
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
     * @param {Node} node
     * @param {Node} parent
     * @param {number} index
     */
    function gather(node, parent, index) {
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
     * @param {Object} node
     */
    return function (node) {
        visit(node, gather);
    };
}

/**
 * Modify mdast to invoke callbacks when HTML commnts are
 * found.
 *
 * @param {MDAST} mdast
 * @param {Object?} options
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
 * @param {Object} options
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

},{}]},{},[1])(1)
});