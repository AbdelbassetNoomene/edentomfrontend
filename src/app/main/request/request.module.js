(function ()
{
    'use strict';

    angular
        .module('app.request', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.request', {
                url    : '/request',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/request/views/request.html',
                        controller : 'RequestController as vm'
                    }
                },
                requiresLogin:   false,
                authorizedRoles: [USER_ROLES.all]
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/request');

        msNavigationServiceProvider.saveItem('edentom.request', {
            title    : 'Anfragen',
            icon     : 'icon-view-list',
            state    : 'app.request',
            translate: 'REQUEST.REQUEST_NAV',
            weight   : 2
        });
    }
})();