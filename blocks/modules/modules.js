(function(global) {

    global.modules = {

        define: function(name, depsOrBody, body) {
            if(body === undefined) {
                body = depsOrBody;
                depsOrBody = [];
            }

            this._definePool[name] = {
                deps: depsOrBody,
                body: body
            };
        },

        require: function(deps, body) {
            this._provideAllModules();

            var definePool = this._definePool,
                depsModule,
                args = [],
                i, len;

            for(i = 0, len = deps.length; i < len; i++) {
                depsModule = definePool[deps[i]];
                if(!depsModule.provide) {
                    this._provideModule(deps[i]);
                }
                args.push(depsModule.provide);
            }

            body.apply(global, args);
        },

        _definePool: {},

        _provideAllModules: function() {
            var definePool = this._definePool,
                name;

            for(name in definePool) if(definePool.hasOwnProperty(name)) {
                this._provideModule(name);
            }
        },

        _provideModule: function(name) {
            var definePool = this._definePool,
                module = definePool[name],
                moduleDeps = module.deps,
                depsModule,
                args = [],
                i, len;

            for(i = 0, len = moduleDeps.length; i < len; i++) {
                depsModule = definePool[moduleDeps[i]];
                if(!depsModule.provide) {
                    this._provideModule(moduleDeps[i]);
                }
                args.push(depsModule.provide);
            }

            module.body.apply({
                name: name,
                deps: moduleDeps,
                global: global
            }, [function(provide) {
                definePool[name].provide = provide;
            }].concat(args));
        }

    };

})(this);
