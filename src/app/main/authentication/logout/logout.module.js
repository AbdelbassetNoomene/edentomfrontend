(function ()
{
    'use strict';

    angular.module('app.authentication.logout', [])
           .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider)
    {
        // Translation
        $translatePartialLoaderProvider.addPart('app/main/authentication/logout');
    }
})();