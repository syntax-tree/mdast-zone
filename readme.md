# mdast-zone [![Build Status][travis-badge]][travis] [![Coverage Status][coverage-badge]][coverage]

[**mdast**][mdast] utility to treat HTML comments as ranges or markers.
Useful as a base for remark plugins.

## Installation

[npm][npm-install]:

```bash
npm install mdast-zone
```

**mdast-zone** is also available for [duo][], and as an AMD, CommonJS,
and globals module, [uncompressed and compressed][releases].

## Table of Contents

*   [Usage](#usage)

*   [API](#api)

    *   [zone(options)](#zoneoptions)

        *   [Marker](#marker)
        *   [function onparse(marker)](#function-onparsemarker)
        *   [function onstringify(marker)](#function-onstringifymarker)
        *   [function onrun(start, nodes, end, scope)](#function-onrunstart-nodes-end-scope)

*   [License](#license)

## Usage

```javascript
var zone = require('mdast-zone');
var remark = require('remark');
```

Callback invoked when a `range` is found.

```javascript
function onrun(start, nodes, end) {
    return [
        start.node,
        {
            'type': 'paragraph',
            'children': [
                {
                    'type': 'text',
                    'value': 'Bar'
                }
            ]
        },
        end.node
    ];
}
```

Process a document.

```javascript
var doc = remark().use(zone({
    'name': 'foo',
    'onrun': onrun
})).process(
    '<!--foo start-->\n' +
    '\n' +
    'Foo\n' +
    '\n' +
    '<!--foo end-->\n'
);
```

Yields:

```markdown
<!--foo start-->

Bar

<!--foo end-->
```

## API

Note that **mdast-zone** is not a plugin by itself. It should be used by a
remark plugin.

### `zone(options)`

The goal of **zone** is two fold:

1.  Configuration during **remark**s parse and/or stringification stage,
    using **markers**;

2.  Transforming parts of a document without affecting other parts, which
    is not visible when rendering to HTML, using **ranges** (a starting
    marker, followed by nodes, and an ending marker).

The first is exposed by this plugin in the form of an HTML comment which
sort-of looks like a self-closing, custom tag. The second by placing starting
and ending tags, as siblings, in a parent.

**Parameters**:

*   `options` (`Object`):

    *   `name` (`string`) — Type to look for;

    *   `onparse` ([`Function`](#function-onparsemarker), optional)
        — Callback invoked when a marker is found during parsing;

    *   `onstringify` ([`Function`](#function-onstringifymarker), optional)
        — Callback invoked when a marker is found during stringification;

    *   `onrun` ([Function](#function-onrunstart-nodes-end-scope), optional)
        — Callback invoked when a range is found during transformation.

**Returns**: `Function` — Should be passed to [`remark.use()`](https://github.com/wooorm/remark#remarkuseplugin-options).

#### `Marker`

**Example**

```markdown
<!--foo bar="baz" qux-->
```

Yields:

```json
{
  "type": "marker",
  "attributes": "bar=\"baz\" qux",
  "parameters": {
    "bar": "baz",
    "qux": true
  },
  "node": {
    "type": "html",
    "value": "<!--foo bar=\"baz\" qux-->"
  }
}
```

**Fields**

*   `type` (`string`) — Either `"marker"`, `"start"`, or `"end"`;
*   `attributes` (`string`) — Raw, unparsed value;
*   `parameters` (`Object.<string, *>`) — Parsed attributes;
*   `node` ([`Node`][mdast-node]) — Original HTML node.

#### `function onparse(marker)`

#### `function onstringify(marker)`

**Parameters**

*   `marker` ([`Marker`](#marker)) — Marker.

When passing `name: "foo"` and `onparse: console.log.bind(console)` to
`zone()`, comments in the form of `<!--foo bar="baz" qux-->` are detected and
`onparse` is invoked:

An `onstringify` method could (instead, or both) be passed to `zone()`,
which would be invoked with the same `marker` but during the stringification
phase.

#### function onrun(start, nodes, end, scope)

**Parameters**

*   `start` ([`Marker`](#marker)) — Start of range;

*   `nodes` (`Array.<Node>`) — Nodes between `start` and `end`;

*   `end` ([`Marker`](#marker)) — End of range.

*   `scope` (`Object`):

    *   `parent` ([`Node`][mdast-node]) — Parent of the range;
    *   `start` (`number`) — Index of `start` in `parent`;
    *   `end` (`number`) — Index of `end` in `parent`.

**Returns**: `Array.<Node>?` — Zero or more nodes to replace the range
(including `start` and `end`s HTML comments) with.

## License

[MIT][license] © [Titus Wormer][home]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/mdast-zone.svg

[travis]: https://travis-ci.org/wooorm/mdast-zone

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/mdast-zone.svg

[coverage]: https://codecov.io/github/wooorm/mdast-zone

[mdast]: https://github.com/wooorm/mdast

[mdast-node]: https://github.com/wooorm/mdast#node

[npm-install]: https://docs.npmjs.com/cli/install

[duo]: http://duojs.org/#getting-started

[releases]: https://github.com/wooorm/mdast-zone/releases

[license]: LICENSE

[home]: http://wooorm.com
