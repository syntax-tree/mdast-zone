var zone = require('./index.js');
var mdast = require('mdast');

// Callback invoked when a `range` is found.
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

// Process a document.
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

// Yields:
console.log('markdown', doc);
