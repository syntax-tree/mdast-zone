# mdast-zone [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status] [![Chat][chat-badge]][chat]

<!--lint disable list-item-spacing heading-increment no-duplicate-headings-->

[**MDAST**][mdast] utility to treat HTML comments as ranges or markers.
Useful as a base for remark plugins.

## Installation

[npm][]:

```bash
npm install mdast-zone
```

**mdast-zone** is also available as an AMD, CommonJS, and
globals module, [uncompressed and compressed][releases].

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

###### `options`

*   `name` (`string`) — Type to look for;
*   `onparse` ([`Function`][onparse], optional)
    — Callback invoked when a marker is found during parsing;
*   `onstringify` ([`Function`][onstringify], optional)
    — Callback invoked when a marker is found during stringification;
*   `onrun` ([Function][onrun], optional)
    — Callback invoked when a range is found during transformation.

###### Returns

`Function`, which should be passed to [`remark.use()`][use].

#### `function onparse(marker)`

#### `function onstringify(marker)`

When passing `name: "foo"` and `onparse: console.log.bind(console)` to
`zone()`, comments in the form of `<!--foo bar="baz" qux-->` are detected
and `onparse` is invoked during the parsing phase.

An `onstringify` method could (instead, or both) be passed to `zone()`,
which would be invoked with the same `marker` but during the
stringification phase.

###### Parameters

*   `marker` ([`Marker`][marker]).

#### `function onrun(start, nodes, end, scope)`

Invoked during the transformation phase with markers which determine
a range: two markers, the first `start` and the last `end`, and the
content inside.

###### Parameters

*   `start` ([`Marker`][marker]) — Start of range;
*   `nodes` (`Array.<Node>`) — Nodes between `start` and `end`;
*   `end` ([`Marker`][marker]) — End of range.
*   `scope` (`Object`):

    *   `parent` ([`Node`][node]) — Parent of the range;
    *   `start` (`number`) — Index of `start` in `parent`;
    *   `end` (`number`) — Index of `end` in `parent`.

###### Returns

`Array.<Node>?` — Zero or more nodes to replace the range (including
`start` and `end`s markers) with.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/mdast-zone.svg

[build-status]: https://travis-ci.org/wooorm/mdast-zone

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/mdast-zone.svg

[coverage-status]: https://codecov.io/github/wooorm/mdast-zone

[chat-badge]: https://img.shields.io/gitter/room/wooorm/remark.svg

[chat]: https://gitter.im/wooorm/remark

[releases]: https://github.com/wooorm/mdast-zone/releases

[license]: LICENSE

[author]: http://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[mdast]: https://github.com/wooorm/mdast

[node]: https://github.com/wooorm/mdast#node

[onparse]: #function-onparsemarker

[onstringify]: #function-onstringifymarker

[onrun]: #function-onrunstart-nodes-end-scope

[use]: https://github.com/wooorm/unified#processoruseplugin-options

[marker]: https://github.com/wooorm/mdast-comment-marker#marker
