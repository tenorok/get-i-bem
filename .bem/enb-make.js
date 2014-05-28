module.exports = function(config) {
    config.node('build/i-bem', function(nodeConfig) {

        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getLevels(config) } ],
            [ require('enb/techs/file-provider'), { target: '?.bemdecl.js' } ],
            require('enb/techs/deps-old'),
            require('enb/techs/files'),
            require('enb-diverse-js/techs/browser-js'),
            [require('enb-modules/techs/prepend-modules'), { source : '?.browser.js' }],
            [ require('enb-borschik/techs/borschik'), { sourceTarget: '?.js', destTarget: '?.min.js', minify: true } ]
        ]);

        nodeConfig.addTargets(['?.js', '?.min.js']);
    });
};

function getLevels(config) {
    return [
        {path: 'node_modules/bem-core/common.blocks', check: false},
        {path: 'node_modules/bem-core/desktop.blocks', check: false},
        {path: 'common.blocks', check: true}
    ].map(function(levelPath) { return config.resolvePath(levelPath); });
}
