'use strict';

/* eslint-env node */

function assertion(zone, t) {
    var index = -1;

    function onrun(start, nodes, end, scope) {
        t.test('range-children', function (st) {
            st.equal(nodes.length, 1);
            st.equal(nodes[0].type, 'blockquote');

            st.equal(scope.start, 1);
            st.equal(scope.end, 3);
            st.equal(scope.parent.type, 'root');

            index++;

            if (index !== 0) {
                throw new Error('Duplicate invocations!');
            }

            st.end();
        });
    }

    function plugin(mdast) {
        mdast.use(zone({
            'name': 'foo',
            'onrun': onrun
        }));
    }

    return plugin;
}

module.exports = assertion;
