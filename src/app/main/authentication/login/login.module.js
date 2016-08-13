(function ()
{
    'use strict';

    angular
        .module('app.authentication.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.login', {
                url    : '/login',
                views  : {
                    'content@app': { //app.login
                        templateUrl: 'app/main/authentication/login/login.html',
                        controller : 'LoginController as vm'
                    }
                },
                bodyClass: 'login'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/authentication/login');
    }
})();