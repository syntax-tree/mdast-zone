'use strict';

function test(zone) {
    function exception() {
        it('should not invoke `onparse`, `onstringify` with zones',
            function () {
                throw new Error('This shouldn’t be invoked!');
            }
        );
    }

    function plugin(mdast) {
        mdast.use(zone({
            'name': 'foo',
            'onparse': exception,
            'onstringify': exception
        }));
    }

    return plugin;
}

module.exports = test;
