var fs = require('fs'),
    path = require('path');
/**
 * Класс для выпуска релиза.
 *
 * @param {string} versionReal Версия bem-core в формате semver
 * @param {string} versionPlus Инкрементированная версия в формате semver
 */
function Release(versionReal, versionPlus) {
    this.versionReal = versionReal;
    this.versionPlus = versionPlus;
}

Release.prototype = {

    /**
     * Сохранить JSDoc, предваряющий собранные файлы.
     *
     * @returns {Release}
     */
    setJsDoc: function() {
        fs.writeFileSync(path.join(__dirname, '../blocks/jsdoc/jsdoc.js'), '/*!\n' +
            ' * @file i-bem — library to write client side with BEM methodology\n' +
            ' * @version ' + this.versionPlus + '\n' +
            ' * @tutorial https://ru.bem.info/libs/bem-core/v' + this.versionReal + '/desktop/i-bem/\n' +
            ' * @link https://github.com/bem-node/i-bem-doc\n' +
            ' */\n');
        return this;
    },

    /**
     * Обновить версию в JSON-файлах.
     *
     * @param {string[]} files JSON-файлы для обновления версии, например: `['package.json', 'bower.json']`
     * @returns {Release}
     */
    updateJsonFiles: function(files) {
        files.forEach(function(file) {
            var json = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
            json.version = this.versionPlus;
            fs.writeFileSync(file, JSON.stringify(json, undefined, '    ') + '\n');
        }, this);
        return this;
    }

};

module.exports = Release;
