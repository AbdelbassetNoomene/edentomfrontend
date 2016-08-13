(function ()
{
    'use strict';

    angular
        .module('app.reservation', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, API_URL, USER_ROLES)
    {
        // State
        $stateProvider.state('app.reservation', {
                url    : '/reservation',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/reservation/reservation.html',
                        controller : 'ReservationController as vm'
                    }
                },
                requiresLogin:   false,
                authorizedRoles: [USER_ROLES.all]
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/reservation');

        msNavigationServiceProvider.saveItem('edentom.reservation', {
            title    : 'Reservierung',
            icon     : 'icon-view-list',
            state    : 'app.reservation',
            translate: 'RESERVATION.RESERVATION_NAV',
            weight   : 5
        });
    }
})();