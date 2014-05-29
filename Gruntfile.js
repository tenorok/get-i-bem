module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var version = grunt.option('ver'),
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
            add: { command: 'git add -f ' + ibem + ' ' + ibemmin },
            commit: { command: 'git commit -m "' + releaseTag + '"' },
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

    grunt.registerTask('version', function() {
        var fs = require('fs');
        ['package.json', 'bower.json'].forEach(function(file) {
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
