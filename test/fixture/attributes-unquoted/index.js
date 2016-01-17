'use strict';

/* eslint-env node */

function assertion(zone, t) {
    function onparse(result) {
        t.test('attributes-unquoted', function (st) {
            st.equal(
                result.parameters.bar,
                'baz\\bar\\ baz',
                'should parse attributes without quotes'
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
