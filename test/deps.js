describe('Проверка результатов сборки.', function() {

    it('Файл i-bem.deps.js должен сохранять строгий порядок', function() {
        assert.deepEqual(require('../i-bem/i-bem.deps.js'), {
            deps: [
                { block: 'jsdoc' },
                { block: 'modules' },
                { block: 'inherit' },
                { block: 'identify' },
                { block: 'next-tick' },
                { block: 'objects' },
                { block: 'functions' },
                { block: 'events' },
                { block: 'i-bem', elem: 'internal' },
                { block: 'i-bem' },
                { block: 'i-bem', mod: 'provide', val: 'global' },
                { block: 'i-jquery' },
                { block: 'dom' },
                { block: 'i-bem', elem: 'dom' },
                { block: 'i-bem', elem: 'dom', mod: 'provide', val: 'global' },
                { block: 'i-bem', elem: 'dom', mod: 'init' },
                { block: 'i-bem', elem: 'dom', mod: 'init', val: 'auto' },
                { block: 'modules', mod: 'delete' }
            ]
        });
    });

});
