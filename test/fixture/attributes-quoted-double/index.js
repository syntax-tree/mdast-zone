'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onparse(result) {
        t.test('attributes-quoted-double', function (st) {
            st.equal(
                result.parameters.bar,
                'baz\\bar\\"baz',
                'should parse attributes with double quotes'
            );

            st.end();
        });
    }

    function plugin(mdast) {
        mdast.use(zone({
            'name': 'foo',
            'onparse': onparse
        }));
    }

    return plugin;
}

module.exports = assertion;
