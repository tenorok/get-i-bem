module.exports = function(config) {
    config.node('i-bem', function(nodeConfig) {

        nodeConfig.addTechs([
            [ require('enb/techs/levels'), { levels: getLevels(config) } ],
            [ require('enb/techs/file-provider'), { target: '?.bemdecl.js' } ],
            require('enb/techs/deps-old'),
            require('enb/techs/files'),
            [ require('../techs/js'), {
                sourceSuffixes : ['vanilla.js', 'js', 'browser.js']
            } ]
        ]);

        nodeConfig.addTargets(['?.js']);
    });
};

function getLevels(config) {
    return [
        'bower_components/bem-core/common.blocks',
        'blocks'
    ].map(function(levelPath) { return config.resolvePath(levelPath); });
}
