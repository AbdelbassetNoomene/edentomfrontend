(function ()
{
    'use strict';

    angular
        .module('app.resource')
        .controller('ResourceController', ResourceController);

    /** @ngInject */
    function ResourceController($log)
    {
        var vm = this;
    }
})();
