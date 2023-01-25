# mdast-zone

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[mdast][] utility to find two comments and replace the content in them.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`zone(tree, name, handler)`](#zonetree-name-handler)
    *   [`Handler`](#handler)
    *   [`Info`](#info)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a utility that lets you find certain comments, then takes the
content between them, and calls a given handler with the result, so that you can
change or replace things.

## When should I use this?

This utility is typically useful when you have certain sections that can be
generated.
Comments are a hidden part of markdown, so they can be used as processing
instructions.
You can use those comments to define what content to change or replace.

A similar package, [`mdast-util-heading-range`][mdast-util-heading-range], does
the same but uses a heading to mark the start and end of sections.

## Install

This package is [ESM only][esm].
In Node.js (version 14.14+ and 16.0+), install with [npm][]:

```sh
npm install mdast-zone
```

In Deno with [`esm.sh`][esmsh]:

```js
import {zone} from 'https://esm.sh/mdast-zone@5'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {zone} from 'https://esm.sh/mdast-zone@5?bundle'
</script>
```

## Use

Say we have the following file, `example.md`:

```markdown
<!--foo start-->

Foo

<!--foo end-->
```

…and a module `example.js`:

```js
import {read} from 'to-vfile'
import {remark} from 'remark'
import {zone} from 'mdast-zone'

const file = await remark()
  .use(myPluginThatReplacesFoo)
  .process(await read('example.md'))

console.log(String(file))

/** @type {import('unified').Plugin<[], import('mdast').Root>} */
function myPluginThatReplacesFoo() {
  return (tree) => {
    zone(tree, 'foo', (start, nodes, end) => [
      start,
      {type: 'paragraph', children: [{type: 'text', value: 'Bar.'}]},
      end
    ])
  }
}
```

…now running `node example.js` yields:

```markdown
<!--foo start-->

Bar.

<!--foo end-->
```

## API

This package exports the identifier [`zone`][api-zone].
There is no default export.

### `zone(tree, name, handler)`

Search `tree` for a start and end comments matching `name` and change their
“section” with `handler`.

###### Parameters

*   `tree` ([`Node`][node])
    — tree to change
*   `name` (`string`)
    — comment name to look for
*   `handler` ([`Handler`][api-handler])
    — handle a section

###### Returns

Nothing (`void`).

### `Handler`

Callback called when a section is found (TypeScript type).

###### Parameters

*   `start` ([`Node`][node])
    — start of section
*   `nodes` ([`Array<Node>`][node])
    — nodes between `start` and `end`
*   `end` ([`Node`][node])
    — end of section
*   `info` ([`Info`][api-info])
    — extra info

###### Returns

Results (`Array<Node | null | undefined>`, optional).

If nothing is returned, nothing will be changed.
If an array of nodes (can include `null` and `undefined`) is returned, the
original section will be replaced by those nodes.

### `Info`

Extra info (TypeScript type).

###### Fields

*   `parent` ([`Node`][node])
    — parent of the section
*   `start` (`number`)
    — index of `start` in `parent`
*   `end` (`number` or `null`)
    — index of `end` in `parent`

## Types

This package is fully typed with [TypeScript][].
It exports the additional types [`Handler`][api-handler] and
[`Info`][api-info].

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

Improper use of `handler` can open you up to a [cross-site scripting (XSS)][xss]
attack as the value it returns is injected into the syntax tree.
This can become a problem if the tree is later transformed to **[hast][]**.
The following example shows how a script is injected that could run when loaded
in a browser.

```js
function handler(start, nodes, end) {
  return [start, {type: 'html', value: '<script>alert(1)</script>'}, end]
}
```

Yields:

```markdown
<!--foo start-->

<script>alert(1)</script>

<!--foo end-->
```

Either do not use user input or use [`hast-util-santize`][hast-util-sanitize].

## Related

*   [`mdast-util-heading-range`](https://github.com/syntax-tree/mdast-util-heading-range)
    — similar but uses headings to mark sections

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/mdast-zone/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/mdast-zone/actions

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

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://wooorm.com

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[mdast]: https://github.com/syntax-tree/mdast

[node]: https://github.com/syntax-tree/mdast#nodes

[mdast-util-heading-range]: https://github.com/syntax-tree/mdast-util-heading-range

[hast]: https://github.com/syntax-tree/hast

[hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize

[api-zone]: #zonetree-name-handler

[api-handler]: #handler

[api-info]: #info
