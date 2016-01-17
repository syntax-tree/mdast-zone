'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onrun(start, nodes, end, scope) {
        t.test('range', function (st) {
            st.equal(start.type, 'start');
            st.equal(start.node.type, 'html');
            st.equal(start.node.value, '<!--foo start bar="baz"-->');
            st.equal(start.attributes, 'bar="baz"');
            st.equal(start.parameters.bar, 'baz');
            st.equal(start.parameters.start, undefined);

            st.equal(end.type, 'end');
            st.equal(end.node.type, 'html');
            st.equal(end.node.value, '<!--foo end qux="quux"-->');
            st.equal(end.attributes, 'qux="quux"');
            st.equal(end.parameters.qux, 'quux');
            st.equal(end.parameters.end, undefined);

            st.equal(scope.start, 1);
            st.equal(scope.end, 2);
            st.equal(scope.parent.type, 'root');

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
