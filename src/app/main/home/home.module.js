(function ()
{
    'use strict';

    angular.module('app.home', ['app.authentication'])
           .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.home', {
            url  : '/home',
            views: {
                'content@app': {
                    templateUrl: 'app/main/home/views/home.html',
                    controller : 'HomeController as vm'
                },
                'tabContent@app.home': {
                    templateUrl: 'app/main/scanagent/views/search-scanagent.html',
                    controller : 'ScanAgentController as vm'
                },
                'sidenav@app.home': {
                    templateUrl: 'app/main/scanagent/views/sidenav/sidenav.html',
                    controller : 'ScanAgentController as vm'
                }
            },
            requiresLogin:   false,
            authorizedRoles: [USER_ROLES.all]
        })
        .state('app.home.prices-list-scanagent', {
            url  : '/prices-list-scanagent/:scanagentId',
            views: {
                'tabContent': {
                    templateUrl: 'app/main/scanagent/views/prices-list-scanagent/prices-list-scanagent.html',
                    controller : 'PricesListScanAgentController as vm'
                },
                'step1@app.home.prices-list-scanagent': {
                    templateUrl: 'app/main/scanagent/views/stepper-steps/step-1.html'//,
                    //controller : 'PricesListScanAgentController as vm'
                },
                'step2@app.home.prices-list-scanagent': {
                    templateUrl: 'app/main/scanagent/views/stepper-steps/step-2.html'//,
                    //controller : 'PricesListScanAgentController as vm'
                },
                'step3@app.home.prices-list-scanagent': {
                    templateUrl: 'app/main/scanagent/views/stepper-steps/step-3.html'//,
                    //controller : 'PricesListScanAgentController as vm'
                },
                'login@app.home.prices-list-scanagent': {
                    templateUrl: 'app/main/authentication/login/login.html',
                    controller : 'LoginController as vm'
                }
            },
            requiresLogin:   false,           //TODO: verify
            authorizedRoles: [USER_ROLES.all] //TODO: verify
        })
        .state('app.home.digitalimprint', {
            url  : '/digitalimprint',
            views: {
                'tabContent': {
                    templateUrl: 'app/main/request/views/request.html',
                    controller : 'RequestController as vm'
                },
                'sidenav@app.home': {
                    templateUrl: 'app/main/request/views/sidenav/sidenav.html'//,
                    //controller : 'RequestController as vm'
                }
            },
            requiresLogin:   false,           //TODO
            authorizedRoles: [USER_ROLES.all] //TODO
        })
        .state('app.home.3dscann', {
            url  : '/3dscann',
            views: {
                'tabContent': {
                    templateUrl: 'app/main/reservation/reservation.html',
                    controller : 'ReservationController as vm'
                },
                'sidenav@app.home': {
                    templateUrl: 'app/main/request/views/sidenav/sidenav.html'//,
                    //controller : 'ReservationController as vm'
                }
            },
            requiresLogin:   false,			  //TODO
            authorizedRoles: [USER_ROLES.all] //TODO
        })
        .state('app.home.3ddesign', {
            url  : '/3ddesign',
            views: {
                'tabContent': {
                    templateUrl: 'app/main/realisation/realisation.html',
                    controller : 'RealisationController as vm'
                },
                'sidenav@app.home': {
                    templateUrl: 'app/main/request/views/sidenav/sidenav.html'//,
                    //controller : 'RealisationController as vm'
                }
            },
            requiresLogin:   false,			  //TODO
            authorizedRoles: [USER_ROLES.all] //TODO
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/home');
        $translatePartialLoaderProvider.addPart('app/main/scanagent');

        // Navigation
        msNavigationServiceProvider.saveItem('edentom', {
            title : '', //no title to make the group name invisible
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('edentom.home', {
            title    : 'Home',
            icon     : 'icon-view-list',
            state    : 'app.home',
            translate: 'HOME.HOME_NAV',
            weight   : 1
        });
    }
})();