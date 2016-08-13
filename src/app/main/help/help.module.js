(function ()
{
    'use strict';

    angular
        .module('app.help', ['app.authentication'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider, USER_ROLES)
    {
        // State
        $stateProvider.state('app.help', {
                url    : '/help',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/help/help.html',
                        controller : 'HelpController as vm'
                    }
                },
                requiresLogin:   false,
                authorizedRoles: [USER_ROLES.all]
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/help');

        // Navigation
        msNavigationServiceProvider.saveItem('edentom.help', {
            title    : 'Hilfe',
            icon     : 'icon-help',
            state    : 'app.help',
            translate: 'HELP.HELP_NAV',
            weight   : 9
        });
    }
})();