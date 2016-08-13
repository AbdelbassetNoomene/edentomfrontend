(function ()
{
    'use strict';

    angular
        .module('app.request')
        .controller('RequestController', RequestController);

    /** @ngInject */
    function RequestController($log)
    {
        var vm = this;
    }
})();
