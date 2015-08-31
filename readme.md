# mdast-zone [![Build Status](https://img.shields.io/travis/wooorm/mdast-zone.svg)](https://travis-ci.org/wooorm/mdast-zone) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/mdast-zone.svg)](https://codecov.io/github/wooorm/mdast-zone)

HTML comments as ranges or markers in [**mdast**](https://github.com/wooorm/mdast).

## Installation

[npm](https://docs.npmjs.com/cli/install)

```bash
npm install mdast-zone
```

[Component.js](https://github.com/componentjs/component)

```bash
component install wooorm/mdast-zone
```

[Bower](http://bower.io/#install-packages)

```bash
bower install mdast-zone
```

[Duo](http://duojs.org/#getting-started)

```javascript
var zone = require('wooorm/mdast-zone');
```

UMD: globals, AMD, and CommonJS ([uncompressed](mdast-zone.js) and [compressed](mdast-zone.min.js)):

```html
<script src="path/to/mdast.js"></script>
<script src="path/to/mdast-zone.js"></script>
<script>
  mdast.use(mdastZone);
</script>
```

## Table of Contents

*   [Usage](#usage)

*   [API](#api)

    *   [zone(options)](#zoneoptions)

        *   [Marker](#marker)
        *   [function onparse(marker) and function onstringify(marker)](#function-onparsemarker-and-function-onstringifymarker)
        *   [function onrun(start, nodes, end, scope)](#function-onrunstart-nodes-end-scope)

*   [License](#license)

## Usage

```javascript
var zone = require('mdast-zone');
var mdast = require('mdast');
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
var doc = mdast().use(zone({
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

Note that **mdast-zone** is not a plugin by itself. It should be used by one.

### zone(options)

The goal of **zone** is two fold:

1.  Configuration during **mdast**s parse and/or stringification stage,
    using **markers**;

2.  Transforming parts of a document without affecting other parts, which
    is not visible when rendering to HTML, using **ranges** (a starting
    marker, followed by nodes, and an ending marker).

The first is exposed by this plugin in the form of an HTML comment which
sort-of looks like a self-closing, custom tag. The second by placing starting
and ending tags, as siblings, in a parent.

**Parameters**

*   `options` (`Object`):

    *   `name` (`string`) — Type to look for;

    *   [`onparse`](#function-onparsemarker-and-function-onstringifymarker)
        (`function (marker)`, optional)
        — Callback invoked when a marker is found during parsing;

    *   [`onstringify`](#function-onparsemarker-and-function-onstringifymarker)
        (`function (marker)`, optional)
        — Callback invoked when a marker is found during stringification;

    *   [`onrun`](#function-onrunstart-nodes-end-scope)
        (`Array.<Node>? = function (start, nodes, end)`, optional)
        — Callback invoked when a range is found during transformation.

**Returns**

`Function` — Should be passed to [`mdast.use()`](https://github.com/wooorm/mdast#mdastuseplugin-options).

#### Marker

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
*   `node` (`Node`) — Original HTML node.

#### `function onparse(marker)` and `function onstringify(marker)`

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

    *   `parent` (`Node`) — Parent of the range;
    *   `start` (`number`) — Index of `start` in `parent`;
    *   `end` (`number`) — Index of `end` in `parent`.

**Returns**

`Array.<Node>?` — Zero or more nodes to replace the range (including `start`
and `end`s HTML comments) with.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
