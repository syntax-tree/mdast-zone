# mdast-zone

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**mdast**][mdast] utility to treat HTML comments as ranges.

Useful in [**remark**][remark] plugins.

## Install

[npm][]:

```sh
npm install mdast-zone
```

## Use

Say we have the following file, `example.md`:

```markdown
<!--foo start-->

Foo

<!--foo end-->
```

And our script, `example.js`, looks as follows:

```js
var vfile = require('to-vfile')
var remark = require('remark')
var zone = require('mdast-zone')

remark()
  .use(plugin)
  .process(vfile.readSync('example.md'), function(err, file) {
    if (err) throw err
    console.log(String(file))
  })

function plugin() {
  return transform

  function transform(tree) {
    zone(tree, 'foo', mutate)
  }

  function mutate(start, nodes, end) {
    return [
      start,
      {type: 'paragraph', children: [{type: 'text', value: 'Bar'}]},
      end
    ]
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

*   `tree` ([`Node`][node]) — [Tree][] to search for ranges
*   `name` (`string`) — Name of ranges to search for
*   `handler` ([`Function`][handler]) — Function invoked for each found range

#### `function handler(start, nodes, end)`

Invoked with the two markers that determine a range: the first `start`
and the last `end`, and the content inside.

###### Parameters

*   `start` ([`Node`][node]) — Start of range (an [HTML][] comment node)
*   `nodes` ([`Array.<Node>`][node]) — Nodes between `start` and `end`
*   `end` ([`Node`][node]) — End of range (an [HTML][] comment node)

###### Returns

[`Array.<Node>?`][node] — List of nodes to replace `start`, `nodes`, and `end`
with, optional.

## Security

Improper use of `handler` can open you up to a [cross-site scripting (XSS)][xss]
attack as the value it returns is injected into the syntax tree.
This can become a problem if the tree is later transformed to [**hast**][hast].
The following example shows how a script is injected that could run when loaded
in a browser.

```js
function handler(start, nodes, end) {
  return [start, {type: 'html', value: 'alert(1)'}, end]
}
```

Yields:

```markdown
<!--foo start-->

<script>alert(1)</script>

<!--foo end-->
```

Either do not use user input or use [`hast-util-santize`][sanitize].

## Related

*   [`mdast-util-heading-range`](https://github.com/syntax-tree/mdast-util-heading-range)
    — use headings as ranges instead of comments

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/mdast-zone.svg

[build]: https://travis-ci.org/syntax-tree/mdast-zone

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-zone.svg

[coverage]: https://codecov.io/github/syntax-tree/mdast-zone

[downloads-badge]: https://img.shields.io/npm/dm/mdast-zone.svg

[downloads]: https://www.npmjs.com/package/mdast-zone

[size-badge]: https://img.shields.io/bundlephobia/minzip/mdast-zone.svg

[size]: https://bundlephobia.com/result?p=mdast-zone

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[mdast]: https://github.com/syntax-tree/mdast

[remark]: https://github.com/remarkjs/remark

[handler]: #function-handlerstart-nodes-end

[node]: https://github.com/syntax-tree/mdast#nodes

[tree]: https://github.com/syntax-tree/unist#tree

[html]: https://github.com/syntax-tree/mdast#html

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[hast]: https://github.com/syntax-tree/hast

[sanitize]: https://github.com/syntax-tree/hast-util-sanitize
