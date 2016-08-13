(function ()
{
    'use strict';

    angular
        .module('app.scanagent', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.scanagent', {
                url    : '/scanagent',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/scanagent/views/scanagent-list/scanagent.html',
                        controller : 'ScanAgentController as vm'
                    }
                },
                requiresLogin:   false,
                authorizedRoles: [USER_ROLES.all]
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/scanagent');

        // Api
        msApiProvider.register('agent', [API_URL + 'laboratories/scan-agents', {}, {
            getAgents: {method:'GET', params: {}, isArray: false}
        }]);

        msApiProvider.register('country', [API_URL + 'countries/:id/:urlSuffix', {id: '@id', urlSuffix: '@urlSuffix'}, {
            getCountries: {method:'GET', params: {id: '', urlSuffix: ''      }, isArray: true },
            getCities:    {method:'GET', params: {id: '', urlSuffix: 'cities'}, isArray: true }
        }]);

        msNavigationServiceProvider.saveItem('edentom.scanagent', {
            title    : 'Scan-Agents',
            icon     : 'icon-view-list',
            state    : 'app.scanagent',
            translate: 'SCAN_AGENT.SCAN_AGENT_NAV',
            weight   : 10
        });
    }
})();