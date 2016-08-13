(function ()
{
    'use strict';

    angular
        .module('app.bourse', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.bourse', {
                url    : '/bourse',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/bourse/bourse.html',
                        controller : 'BourseController as vm'
                    }
                },
                requiresLogin:   false,
                authorizedRoles: [USER_ROLES.all]
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/bourse');

        msNavigationServiceProvider.saveItem('edentom.bourse', {
            title    : 'Börse',
            icon     : 'icon-view-list',
            state    : 'app.bourse',
            translate: 'BOURSE.BOURSE_NAV',
            weight   : 4
        });
    }
})();