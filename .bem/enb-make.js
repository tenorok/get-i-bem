module.exports = function(config) {
    config.node('i-bem', function(nodeConfig) {

        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getLevels(config) } ],
            [ require('enb/techs/file-provider'), { target: '?.bemdecl.js' } ],
            require('enb/techs/deps-old'),
            require('enb/techs/files'),
            require('../techs/js')
        ]);

        nodeConfig.addTargets(['?.js', '?.min.js']);
    });
};

function getLevels(config) {
    return [
        'node_modules/bem-bl/blocks-common',
        'node_modules/bem-bl/blocks-desktop',
        'blocks'
    ].map(function(levelPath) { return config.resolvePath(levelPath); });
}
