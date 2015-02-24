var fs = require('fs'),
    path = require('path');
/**
 * Класс для выпуска релиза.
 *
 * @param {string} version Версия в формате semver
 */
function Release(version) {
    this.version = version;
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
            ' * @version ' + this.version + '\n' +
            ' * @tutorial https://ru.bem.info/libs/bem-core/v' + this.version + '/desktop/i-bem/\n' +
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
            json.version = this.version;
            fs.writeFileSync(file, JSON.stringify(json, undefined, '    ') + '\n');
        }, this);
        return this;
    }

};

module.exports = Release;
