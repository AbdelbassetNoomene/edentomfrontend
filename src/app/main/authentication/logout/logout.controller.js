(function ()
{
    'use strict';

    angular.module('app.authentication.logout')
           .controller('LogoutController', LogoutController);

    /** @ngInject */
    function LogoutController($log, $mdDialog, $rootScope, $state, msApi, authenticator, AUTH_EVENTS)
    {
        var vm              = this;
        vm.cancel           = cancel;
        vm.closeDialog      = closeDialog;
        vm.logout           = logout;
		vm.uiLogout         = uiLogout;

		//---------------------Implementation details
	    function cancel() {
		    $log.debug('Logout canceled');
	    }
	    
	    /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }

		/**
		 * send logout request the Server
		 */
	    function logout() {
            $log.debug('logout userName: ' + authenticator.getUser().userName);
	    	msApi.request('logout@logout', {userName: authenticator.getUser().userName}, function (response)
	        {
	    		$log.debug('Server success response for logout: ' + JSON.stringify(response));
		        uiLogout(true);
		        $mdDialog.cancel();
	    	},
	    	function (response)
	        {
	    		$log.debug('Server error response: ' + JSON.stringify(response));
	        });
	    }

	    /**
	     * Logout in the Frontend (client side)
	     */
	    function uiLogout(doRedirect) {
   		    $log.debug('Delete Tokens and Logout in the Frontend');
	    	authenticator.logout();
	    	/*if(doRedirect) {
	    		$rootScope.$broadcast(AUTH_EVENTS.loginRequired);
	    		//$state.go('app.login');
	    	}*/
	    }
    }
})();
