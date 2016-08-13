(function ()
{
    'use strict';

    angular
        .module('app.offer', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.offer', {
                url    : '/offer',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/offer/offer.html',
                        controller : 'OfferController as vm'
                    },
                    'tabContent@app.offer': {
                    templateUrl: 'app/main/offer/views/mobile-impression.html',
                },
                },
                requiresLogin:   false,
                authorizedRoles: [USER_ROLES.all]
            })
        .state('app.offer.digitizing', {
            url  : '/digitizing',
            views: {
                'tabContent': {
                    templateUrl: 'app/main/offer/views/digitizing.html',
                    controller : 'OfferController as vm'
                }
            },
            requiresLogin:   false,           //TODO
            authorizedRoles: [USER_ROLES.all] //TODO
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/offer');

        // Api
        msApiProvider.register('offer', [API_URL + 'offers/:urlSuffix1/:urlSuffix2', {urlSuffix1: '@urlSuffix1', urlSuffix2: '@urlSuffix2'}, {
            add:             {method:'POST', params: {urlSuffix1: '', urlSuffix2: ''}, isArray: false}
            //getOffers: {method:'GET',  params: {urlSuffix1: '', urlSuffix2: ''}, isArray: true},
        }]);

        // Navigation
        msNavigationServiceProvider.saveItem('edentom.offer', {
            title    : 'Angebote',
            icon     : 'icon-view-list',
            state    : 'app.offer',
            translate: 'OFFER.OFFER_NAV',
            weight   : 3
        });
    }
})();