(function ()
{
    'use strict';

    angular.module('app.laboratory', ['app.authentication', 'flow'])
           .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.laboratory', {
            url  : '/laboratory',
            views: {
                'content@app': {
                    templateUrl: 'app/main/laboratory/views/laboratory.html',
                    controller : 'AddLaboratoryController as vm' //LaboratoryController
                }/*,
                'tabContent@app.laboratory': {
                    templateUrl: 'app/main/laboratory/views/add-laboratory.html'
                }/*,
                'sidenav@app.laboratory': {
                    templateUrl: 'app/main/scanagent/views/sidenav/sidenav.html',
                    controller : 'ScanAgentController as vm'
                }*/
            },
            requiresLogin:   false,
            authorizedRoles: [USER_ROLES.all]
        })
        .state('app.dental-practice', {
            url  : '/dental-practice',
            views: {
                'content@app': {
                    templateUrl: 'app/main/laboratory/views/laboratory.html'//,
                    //controller : 'AddDentalPriceController as vm'
                },
                'tabContent@dental-practice': {
                    templateUrl: 'app/main/laboratory/views/add-dental-price.html',
                    //controller : 'AddDentalPriceController as vm'
                }/*,
                'sidenav@app.laboratory': {
                    templateUrl: 'app/main/request/views/sidenav/sidenav.html',
                    controller : 'ScanAgentController as vm'
                }*/
            },
            requiresLogin:   false,           //TODO
            authorizedRoles: [USER_ROLES.all] //TODO
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/laboratory');

        // Api
        msApiProvider.register('laboratory', [API_URL + 'laboratories/:urlSuffix1/:urlSuffix2', {urlSuffix1: '@urlSuffix1', urlSuffix2: '@urlSuffix2'}, {
            getLaboratories: {method:'GET',  params: {urlSuffix1: '',      urlSuffix2: ''},      isArray: true },
            add:             {method:'POST', params: {urlSuffix1: 'super', urlSuffix2: 'admin'}, isArray: false}
        }]);

        // Navigation
        msNavigationServiceProvider.saveItem('edentom.laboratory', {
            title    : 'Laboratory',
            icon     : 'icon-view-list',
            state    : 'app.laboratory',
            translate: 'LABORATORY.LABORATORY_NAV',
            weight   : 9
        });
    }
})();