(function ()
{
    'use strict';

    angular
        .module('app.resource', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.resource', {
                url    : '/resource',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/resource/resource.html',
                        controller : 'ResourceController as vm'
                    }
                },
                requiresLogin:   false,
                authorizedRoles: [USER_ROLES.all]
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/resource');

        msNavigationServiceProvider.saveItem('edentom.resource', {
            title    : 'Ressourcen',
            icon     : 'icon-view-list',
            state    : 'app.resource',
            translate: 'RESOURCE.RESOURCE_NAV',
            weight   : 8
        });
    }
})();