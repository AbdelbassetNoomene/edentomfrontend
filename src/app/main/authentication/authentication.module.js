(function ()
{
    'use strict';

    angular
        .module('app.authentication', [
            'app.authentication.login',
            'app.authentication.logout'
        ])
        .config(config);

    /** @ngInject */
    function config(msApiProvider, API_URL)
    {
        // Api
        msApiProvider.register('logout', [API_URL + 'authentification/logout/:userName', {userName:'@userName'}, {
            logout: { method:'POST', isArray: false }
        }]);
    } 
})();
