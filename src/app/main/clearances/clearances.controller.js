(function ()
{
    'use strict';

    angular.module('app.clearances')
           .controller('ClearancesController', ClearancesController);

    /** @ngInject */
    function ClearancesController($cookies, $rootScope, $log, $stateParams, $timeout, $filter, $mdDialog, msApi, ClearancesData)
    {
    	// Data
        var vm                      = this;
        var errorCallback           = errorCallback;
        vm.loadStuff                = loadStuff;
        vm.log                      = log;
        vm.onPaginate               = onPaginate;
        vm.onReorder                = onReorder;
        vm.query                    = {order: 'companyName', filter: '', limit: 10, page: 1};
        vm.selected                 = [];

        $log.debug('----ClearancesController');

        //---------------------Methods Implementation details
        function errorCallback(response) {
            $log.debug('Server response: ' + JSON.stringify(response));
            vm.error = response.data.code + ': ' + response.data.error;
        }

        //--------------------------------Pagination
    	function onPaginate(page, limit) {
    		$log.debug('Scope Page: ' + vm.query.page + ' Scope Limit: ' + vm.query.limit);
    		$log.debug('Page: ' + page + ' Limit: ' + limit);
    	    vm.promise = $timeout(function () {}, 2000);
    	}

    	function deselect(item) {
    		$log.debug(item.jobInstanceId, 'was deselected');
    	}

    	function log(item) {
    		$log.debug(item.jobInstanceId, 'was selected');
    	}

    	function loadStuff() {
    	    vm.promise = $timeout(function () {}, 2000);
        }

        function onReorder(order) {
        	$log.debug('Scope Order: ' + vm.query.order);
        	$log.debug('Order: ' + order);
    	    vm.promise = $timeout(function () {}, 2000);
    	}
    }
})();
