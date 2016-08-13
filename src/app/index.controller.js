(function ()
{
    'use strict';

    angular.module('edentom')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $document, $filter, $log, $location, $mdDialog, $mdSidenav, $rootScope, $scope, authenticator, AUTH_EVENTS, APP_VERSION)
    {
    	// Data
        var vm                    = this;
        vm.themes                 = fuseTheming.themes;
        $rootScope.EC_FE_008      = 'EC_FE_008: kein valider Wert, das erwartete Format ist mm.yyyy';
        $rootScope.appVersion     = APP_VERSION;
        $log.debug('--APP_VERSION: ' + $rootScope.appVersion);
        $rootScope.user           = authenticator.getUser();
        $rootScope.expirationDate = $filter('date')(authenticator.getExpirationDate(), 'dd.MM.yyyy HH:mm:ss');
 	    $rootScope.hasRole        = hasRole;

        /*$scope.$on(AUTH_EVENTS.clearancesReceived, function (event) {
            //$log.debug(AUTH_EVENTS.clearancesReceived + ' event received');
            msNavigationService.saveItem('edentom.clearances', {
                title    : 'Clearance',
                icon     : 'icon-checkbox-marked',
                state    : 'app.clearances',
                badge    : {
                    content: Number($window.sessionStorage.getItem('nbClearances')),
                    color  : RED_COLOR
                },
                translate: 'CLEARANCES.CLEARANCES_NAV',
                hidden   : function () {
                    return (authenticator.hasRole(USER_ROLES.hof) || authenticator.hasRole(USER_ROLES.config));
                },
                weight   : 1
            });
            msNavigationService.sort();
        });

        if($window.sessionStorage.getItem('nbClearances')) {
            msNavigationService.saveItem('edentom.clearances', {
                title    : 'Clearance',
                icon     : 'icon-checkbox-marked',
                state    : 'app.clearances',
                badge    : {
                    content: Number($window.sessionStorage.getItem('nbClearances')),
                    color  : RED_COLOR
                },
                translate: 'CLEARANCES.CLEARANCES_NAV',
                hidden   : function () {
                    return (authenticator.hasRole(USER_ROLES.hof) || authenticator.hasRole(USER_ROLES.config));
                },
             weight      : 1
            });
            msNavigationService.sort();
        }*/

        //----------------Implementation details
	    function hasRole(role) {
		    return authenticator.hasRole(role);
	    }

	    /**
	     * Logout in the Frontend (client side)
	     */
	    function uiLogout(doRedirect) {
            $log.debug('Delete Tokens and Logout in the Frontend');
	    	authenticator.logout();
	    	if(doRedirect) {
	    		//$location.path('/login');
	    		$rootScope.$broadcast(AUTH_EVENTS.loginRequired);
	    	}
	    }

	    /**
	     * show the received accessError or authError from the Server to the user
	     */
	    function showErrorDialog(message, isAuthError) {

	    	$rootScope.$broadcast('msSplashScreen::remove'); //remove the splashScreen because it hides the dialog

			// Appending dialog to document.body
		    var confirm = $mdDialog.alert()
                                   .title('Achtung')
                                   .textContent(message)
                                   .ariaLabel('Achtung')
                                   .clickOutsideToClose(false)
                                   .parent(angular.element(document.body))
                                   .ok('Ok');

		    $mdDialog.show(confirm).then(function() {
		    	if(isAuthError) {
		    		$log.debug('Sie wollen sich einloggen');
			    	uiLogout(true);
		    	}
		    }, function() {
		    	if(isAuthError) {
		    		uiLogout(false);
		    	}
		    });
		}

	    /**
	     * check authError
	     */
		$scope.$watch('authError', function(newValue, oldValue) {
            if(newValue && (newValue !== '')) {
                $log.debug('authError changed: ' + oldValue + ' --> ' + newValue);
                showErrorDialog($rootScope.authError, true);
            }
        });
		/**
		 * check accessError
		 */
		$scope.$watch('accessError', function(newValue, oldValue) {
            if(newValue && (newValue !== '')) {
                $log.debug('accessError changed: ' + oldValue + ' --> ' + newValue);
                showErrorDialog($rootScope.accessError, false);
            }
        });
		//<div class="alert alert-danger" ng-show="accessError" ng-bind="accessError"></div>

		/**
         * Show logout dialog
         * @param event
         */
		function showLogoutDialog(event) {
		$mdDialog.show({
	            controller         : 'LogoutController',
	            controllerAs       : 'vm',
	            templateUrl        : 'app/main/authentication/logout/logout.dialog.html',
	            parent             : angular.element($document.body),
	            targetEvent        : event,
	            clickOutsideToClose: true
	        }).then(function (response) {
	        	$mdDialog.cancel();
	        });
		}

		$scope.$on(AUTH_EVENTS.logoutWanted, function (event) {

			$log.debug(AUTH_EVENTS.logoutWanted + ' event received');
			showLogoutDialog(event);
		});

		$rootScope.$on(AUTH_EVENTS.loginRequired, function (event) {

			$log.debug(AUTH_EVENTS.loginRequired + ' event received - IndexController');
			$mdSidenav('login').open(); //.isLockedOpen()
		});

		$rootScope.$on(AUTH_EVENTS.loginSuccess, function (event) {

			$log.debug(AUTH_EVENTS.loginSuccess + ' event received - IndexController');
			$mdSidenav('login').close();
		});

		$scope.$on(AUTH_EVENTS.tokenChanged, function (event) {

			$log.debug(AUTH_EVENTS.tokenChanged + ' event received');
			$rootScope.expirationDate = $filter('date')(authenticator.getExpirationDate(), 'dd.MM.yyyy HH:mm:ss');
		});
    }
})();
