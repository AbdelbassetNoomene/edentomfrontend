(function ()
{
    'use strict';

    angular
        .module('app.realisation', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.realisation', {
                url    : '/realisation',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/realisation/realisation.html',
                        controller : 'RealisationController as vm'
                    }
                },
                requiresLogin:   false,
                authorizedRoles: [USER_ROLES.all]
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/realisation');

        msNavigationServiceProvider.saveItem('edentom.realisation', {
            title    : 'Durschführungen',
            icon     : 'icon-view-list',
            state    : 'app.realisation',
            translate: 'REALISATION.REALISATION_NAV',
            weight   : 6
        });
    }
})();