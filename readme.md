# mdast-zone [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov] [![Chat][chat-badge]][chat]

[**MDAST**][mdast] utility to treat HTML comments as ranges.
Useful in [**remark**][remark] plugins.

## Installation

[npm][]:

```bash
npm install mdast-zone
```

## Usage

Say we have the following file, `example.md`:

```markdown
<!--foo start-->

Foo

<!--foo end-->
```

And our script, `example.js`, looks as follows:

```javascript
var vfile = require('to-vfile');
var remark = require('remark');
var zone = require('mdast-zone');

remark()
  .use(plugin)
  .process(vfile.readSync('example.md'), function (err, file) {
    if (err) throw err;
    console.log(String(file));
  });

function plugin() {
  return transformer;
  function transformer(tree) {
    zone(tree, 'foo', mutate);
  }
  function mutate(start, nodes, end) {
    return [
      start,
      {type: 'paragraph', children: [{type: 'text', value: 'Bar'}]},
      end
    ];
  }
}
```

Now, running `node example` yields:

```markdown
<!--foo start-->

Bar

<!--foo end-->
```

## API

### `zone(tree, name, handler)`

Search `tree` for comment ranges (“zones”).

###### Parameters

*   `tree` ([`Node`][mdast]) — Node to search for ranges
*   `name` (`string`) — Name of ranges to search for
*   `handler` ([`Function`][handler]) — Function invoked for each found range

#### `function handler(start, nodes, end)`

Invoked with the two markers that determine a range: the first `start`
and the last `end`, and the content inside.

###### Parameters

*   `start` ([`Node`][mdast]) — Start of range (an HTML comment node)
*   `nodes` (`Array.<Node>`) — Nodes between `start` and `end`
*   `end` ([`Node`][mdast]) — End of range (an HTML comment node)

###### Returns

`Array.<Node>?` — List of nodes to replace `start`, `nodes`, and `end`
with, optional.

## Contribute

See [`contributing.md` in `syntax-tree/mdast`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/mdast-zone.svg

[travis]: https://travis-ci.org/syntax-tree/mdast-zone

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-zone.svg

[chat-badge]: https://img.shields.io/gitter/room/wooorm/remark.svg

[codecov]: https://codecov.io/github/syntax-tree/mdast-zone

[chat]: https://gitter.im/wooorm/remark

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[mdast]: https://github.com/syntax-tree/mdast

[remark]: https://github.com/wooorm/remark

[handler]: #function-handlerstart-nodes-end

[contributing]: https://github.com/syntax-tree/mdast/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/mdast/blob/master/code-of-conduct.md
