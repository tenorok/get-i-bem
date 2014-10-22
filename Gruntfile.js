module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var fs = require('fs'),
        Release = require('./tasks/Release'),
        version = grunt.option('ver'),
        jsonFiles = ['package.json', 'bower.json'],
        ibem = 'i-bem.js',
        ibemmin = 'i-bem.min.js',
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
            install: { command: 'bower install git://github.com/bem/bem-bl#' + version },
            make: { command: 'npm run make' },

            addJSONFiles: { command: 'git add ' + jsonFiles.join(' ') },
            commitJSONFiles: { command: 'git commit -m "' + releaseTag + '"' },

            addReleaseBranch: { command: 'git checkout -b ' + releaseBranch },
            addBuildFiles: { command: 'git add -f ' + ibem + ' ' + ibemmin },
            commitBuildFiles: { command: 'git commit -m "' + releaseTag + '"' },
            tag: { command: 'git tag ' + releaseTag },
            removeReleaseBranch: { command: 'git checkout master && git branch -D ' + releaseBranch },
            mergeBemBlToMaster: { command: 'git merge --no-ff bem-bl -m "' + releaseTag + '"' },
            push: { command: 'git push origin master bem-bl ' + releaseTag }
        },
        uglify: {
            release: {
                options: {
                    preserveComments: 'some'
                },
                files: { 'i-bem/i-bem.min.js': 'i-bem/i-bem.js' }
            }
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

    grunt.registerTask('release', function() {
        if(!version) throw new Error('Parameter --ver must be set!');

        new Release(version).setJsDoc().updateJsonFiles(jsonFiles);

        grunt.task.run('shell:install', 'shell:make');
        grunt.task.run('uglify:release', 'copy');

        grunt.task.run('shell:addJSONFiles', 'shell:commitJSONFiles');

        grunt.task.run(
            'shell:addReleaseBranch',
            'shell:addBuildFiles',
            'shell:commitBuildFiles',
            'shell:tag',
            'shell:removeReleaseBranch',
            'shell:mergeBemBlToMaster',
            'shell:push'
        );
    });

};
