(function ()
{
    'use strict';

    angular
        .module('app.clearances', ['app.clearances.clearance'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        $stateProvider.state('app.clearances', {
            url    : '/clearances',
            views  : {
                'content@app': {
                    templateUrl: 'app/main/clearances/views/clearances.html',
                    controller : 'ClearancesController as vm'
                }
            },
            resolve: {
                ClearancesData: function ($stateParams, msApi)
                {
                    return msApi.resolve('clearances@getClearances');
                }
            },
            requiresLogin:   true,
            authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/clearances');

        //--Api
        msApiProvider.register('clearances', [API_URL + 'job/:urlSuffix/:jobInstanceId', {urlSuffix: '@urlSuffix', jobInstanceId: '@jobInstanceId'}, {
            getClearances: {method:'GET', params: {urlSuffix: 'clearances',   jobInstanceId: ''}, isArray: true },
            isCleared:     {method:'GET', params: {urlSuffix: 'cleared',      jobInstanceId: ''}, isArray: false},
            update:        {method:'GET', params: {urlSuffix: '',             jobInstanceId: ''}, isArray: false}// urlSuffix = approve|abandon
        }]);
        msApiProvider.register('statistics', [API_URL + 'statistics/:urlSuffix/:jobInstanceId', {urlSuffix: '@urlSuffix', jobInstanceId: '@jobInstanceId'}, {
            getStatistics: {method:'GET', params: {urlSuffix: '',             jobInstanceId: ''}, isArray: false}
        }]);
        msApiProvider.register('pi', [API_URL + 'pi/:urlSuffix/:performanceIndicatorId', {urlSuffix: '@urlSuffix', performanceIndicatorId: '@performanceIndicatorId'}, {
            get:           {method:'GET',  params: {urlSuffix: '',           performanceIndicatorId: ''}, isArray: true}, // urlSuffix = details
            getHistorical: {method:'POST', params: {urlSuffix: 'historical', performanceIndicatorId: ''}, isArray: true}
        }]);

        // Navigation
        msNavigationServiceProvider.saveItem('edentom.clearances', {
            title    : 'Clearance',
            icon     : 'icon-view-list',
            state    : 'app.clearances',
            badge : {
                content: 0,
                color  : '#F44336'
            },
            translate: 'CLEARANCES.CLEARANCES_NAV',
            weight   : 11
        });
    }
})();