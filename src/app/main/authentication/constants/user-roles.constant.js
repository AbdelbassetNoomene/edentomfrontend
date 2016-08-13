(function ()
{
    'use strict';

    angular.module('app.authentication').constant('USER_ROLES', {
            admin:            'ROLE_ADMIN',
            superAdminLabo:   'ROLE_SUPER_ADMIN_LABO',
            superAdminOffice: 'ROLE_SUPER_ADMIN_OFFICE',
            doc:              'ROLE_DOC',
            agent:            'ROLE_AGENT',
            labo:             'ROLE_LABO',
            all:              '*'
    });

})();
