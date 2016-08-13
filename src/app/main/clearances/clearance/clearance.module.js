(function ()
{
    'use strict';

    angular
        .module('app.clearances.clearance', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
    	$stateProvider.state('app.clearance', {
                url    : '/clearance/:clearanceId/:tabIndex',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/clearances/clearance/views/clearance.html',
                        controller : 'ClearanceController as vm'
                    },
                    'clearanceToolbar@app.clearance': {
                        templateUrl: 'app/main/clearances/clearance/views/clearance.header.html'
                    },
                    'clearanceContent@app.clearance': {
                        templateUrl: 'app/main/clearances/clearance/views/clearance.content.html'
                    }
                },
                resolve: {
                    ClearanceData: function ($stateParams, msApi)
                    {
                        return msApi.resolve('jobs@search', {jobInstanceId: $stateParams.clearanceId});
                    }
                },
                requiresLogin:   true,
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/clearances/clearance');        
    }
})();