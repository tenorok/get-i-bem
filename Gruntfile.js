module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var fs = require('fs'),
        version = grunt.option('ver'),
        jsonFiles = ['package.json', 'bower.json'],
        ibem = 'i-bem-' + version + '.js',
        ibemmin = 'i-bem-' + version + '.min.js',
        releaseBranch = 'release-' + version,
        releaseTag = 'v' + version;

    grunt.initConfig({
        clean: {
            githooks: ['.git/hooks/*'],
            test: ['!test/tmp/.gitkeep', 'test/tmp/*'],
            jsdoc: ['jsdoc'],
            release: ['release']
        },
        shell: {
            make: { command: 'npm run make' },
            addReleaseBranch: { command: 'git checkout -b ' + releaseBranch },
            add: { command: 'git add -f ' + ibem + ' ' + ibemmin + ' ' + jsonFiles.join(' ') },
            commit: { command: 'git commit -m "' + releaseTag + '" -m "' + getBemBlVersion() + '"' },
            tag: { command: 'git tag ' + releaseTag },
            removeReleaseBranch: { command: 'git checkout master && git branch -D ' + releaseBranch },
            push: { command: 'git push origin ' + releaseTag }
        },
        copy: {
            ibem: {
                src: 'i-bem/i-bem.js',
                dest: ibem
            },
            ibemmin: {
                src: 'i-bem/i-bem.min.js',
                dest: ibemmin
            }
        }
    });

    function getBemBlVersion() {
        return JSON.parse(fs.readFileSync('node_modules/bem-bl/package.json', { encoding: 'utf8' }))._resolved;
    }

    grunt.registerTask('version', function() {
        jsonFiles.forEach(function(file) {
            var json = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
            json.version = version;
            fs.writeFileSync(file, JSON.stringify(json, undefined, '    ') + '\n');
        });
    });

    grunt.registerTask('publish', [
        'shell:make',
        'copy',
        'version',

        'shell:addReleaseBranch',
        'shell:add',
        'shell:commit',
        'shell:tag',
        'shell:removeReleaseBranch',
        'shell:push'
    ]);

};
