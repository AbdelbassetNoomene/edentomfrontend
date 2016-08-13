(function ()
{
    'use strict';

    angular.module('edentom').factory('AlertService', AlertService);

    /** @ngInject */
    function AlertService($mdToast)
    {
    	var service = {
    		showAlert: showAlert
        };

		/**
         * @param type: success or error
         * @param msg
         */
        function showAlert(type, msg) {
        	$mdToast.show(
        	    $mdToast.simple()
        		        .textContent(msg)
        	            .theme(type + '-toast') //--> Warning: attempted to use unregistered theme 'success-toast'/'error-toast'
        		        .position('top right')
        		        //.parent(angular.element(document.querySelector('#content'))) //angular.element($document.body)
        		        .hideDelay(6000)
            );
        }
        return service;
	}
})();
