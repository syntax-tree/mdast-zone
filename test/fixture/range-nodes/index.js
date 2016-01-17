'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onrun(start, nodes, end, scope) {
        t.test('range-nodes', function (st) {
            st.equal(nodes.length, 1);
            st.equal(nodes[0].type, 'paragraph');
            st.equal(nodes[0].children.length, 1);
            st.equal(nodes[0].children[0].type, 'text');
            st.equal(nodes[0].children[0].value, 'Foo.');

            st.equal(scope.start, 1);
            st.equal(scope.end, 3);
            st.equal(scope.parent.type, 'root');

            st.end();
        });
    }

    function plugin(remark) {
        remark.use(zone({
            'name': 'foo',
            'onrun': onrun
        }));
    }

    return plugin;
}

module.exports = assertion;
