module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var fs = require('fs'),
        Release = require('./tasks/Release'),
        versionReal = grunt.option('ver'),
        versionPlus = versionReal.split('.').map(function(part, index) {
            return index === 0 ? Number(part) + 1 : part;
        }).join('.'),
        jsonFiles = ['package.json', 'bower.json'],
        ibem = 'i-bem.js',
        ibemmin = 'i-bem.min.js',
        releaseBranch = 'release-' + versionPlus,
        releaseTag = 'v' + versionPlus;

    grunt.initConfig({
        clean: {
            githooks: ['.git/hooks/*'],
            test: ['!test/tmp/.gitkeep', 'test/tmp/*'],
            jsdoc: ['jsdoc'],
            release: ['release']
        },
        shell: {
            install: { command: 'bower install git://github.com/bem/bem-core#' + versionReal },
            make: { command: 'npm run make' },

            addJSONFiles: { command: 'git add ' + jsonFiles.join(' ') },
            commitJSONFiles: { command: 'git commit -m "' + releaseTag + '"' },

            addReleaseBranch: { command: 'git checkout -b ' + releaseBranch },
            addBuildFiles: { command: 'git add -f ' + ibem + ' ' + ibemmin },
            commitBuildFiles: { command: 'git commit -m "' + releaseTag + '"' },
            tag: { command: 'git tag ' + releaseTag },
            removeReleaseBranch: { command: 'git checkout master && git branch -D ' + releaseBranch },
            mergeBemBlToMaster: { command: 'git merge --no-ff bem-core -m "' + releaseTag + '"' },
            push:  {
                command: function() {
                    return grunt.config('isReleaseOk')
                        ? 'git push origin master bem-core ' + releaseTag
                        : '';
                }
            }
        },
        prompt: {
            release: {
                options: {
                    questions: [
                        {
                            config: 'isReleaseOk',
                            type: 'confirm',
                            default: false,
                            message: 'Please check is everything alright'
                        }
                    ]
                }
            }
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
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: './test/helpers/chai-assert.js'
                },
                src: ['test/*.js']
            }
        }
    });

    grunt.registerTask('test', ['mochaTest:test']);

    grunt.registerTask('release', function() {
        if(!versionReal) throw new Error('Parameter --ver must be set!');

        new Release(versionReal, versionPlus).setJsDoc().updateJsonFiles(jsonFiles);

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
            'prompt:release',
            'shell:push'
        );
    });

};
