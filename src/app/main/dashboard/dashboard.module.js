(function ()
{
    'use strict';

    angular
        .module('app.dashboard', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.dashboard', {
                url    : '/dashboard',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/dashboard/dashboard.html',
                        controller : 'BourseController as vm'
                    }
                },
                requiresLogin:   false,
                authorizedRoles: [USER_ROLES.all]
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/dashboard');

        msNavigationServiceProvider.saveItem('edentom.dashboard', {
            title    : 'Dashboard',
            icon     : 'icon-view-list',
            state    : 'app.dashboard',
            translate: 'DASHBOARD.DASHBOARD_NAV',
            weight   : 7
        });
    }
})();