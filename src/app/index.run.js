(function ()
{
    'use strict';

    angular.module('edentom')
           .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $cookies, $location, AUTH_EVENTS, authenticator)
    {
        authenticator.importBackendUrl();

        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState)
        {
             $rootScope.loadingProgress = true;
             $rootScope.accessError     = '';
             $rootScope.authError       = '';
             if(fromState.url !== '^') {
                 $rootScope.referer = fromState.name; // save referer in the rootScope
             }

             //AuthenticationRequired if the target stateUrl is not '/login' && the target state 'requiresLogin=true' && the user is not authenticated
             var isAuthenticationRequired = (toState.url === '/login') ? false : (toState && toState.requiresLogin && !authenticator.getUser());

             console.log('--isAuthenticationRequired: ' + isAuthenticationRequired);
             console.log('--$stateChangeStart, fromState: ' + JSON.stringify(fromState));
             console.log('--$stateChangeStart, toState: ' + JSON.stringify(toState));

             var accessMsg = '';
             if(isAuthenticationRequired) {
                 console.log('----AuthenticationRequired');
                 //$location.path('/login');
                 $rootScope.$broadcast(AUTH_EVENTS.loginRequired);

             } else if(toState.url !== '/login') {

            	 //$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                 if (!('authorizedRoles' in toState)) {	// check the authorization
                     console.log('---->No authorizedRoles in toState');

                     $rootScope.accessError = 'authorizedRoles undefined for this state';
                     //event.preventDefault();//--
                     //$location.path('/');
                 } else if (!authenticator.isAuthorized(toState.authorizedRoles)) {

                     accessMsg = 'Benutzer mit Rollen ' + JSON.stringify(authenticator.getUser().roles) +
                                                  ' ist nicht autorisiert für URL "' + toState.url + '"';// + '" for ' + JSON.stringify(toState.authorizedRoles);
                     console.log(accessMsg);
                     console.log('--toState.authorizedRoles: ' + JSON.stringify(toState.authorizedRoles));
                     $rootScope.accessError = 'Ihnen fehlen die Rechte um auf diesem Link/View/Komponent zuzugreifen: ' + accessMsg; //'Seems like you tried accessing a route you do not have access to: '
                     event.preventDefault();

                     if(fromState.url === '^') {
                         if(authenticator.isAuthenticated()) {
                             console.log('---->User is authenticated');
                         } else {
                             console.log('---->User is not authenticated');
                             $rootScope.authError = 'User not authenticated';
                         }
                     }
                 }
             }
             console.log('--$rootScope.authError: ' + $rootScope.authError);
             console.log('--$rootScope.accessError: ' + $rootScope.accessError);
        });

    	// De-activate loading indicator
    	var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
    	{
    	     $timeout(function ()
    	     {
    	         $rootScope.loadingProgress = false;
    	     });
    	});

    	// Store state in the root scope for easy access
    	$rootScope.state = $state;

    	// Cleanup
    	$rootScope.$on('$destroy', function ()
    	{
    	     stateChangeStartEvent();
    	     stateChangeSuccessEvent();
    	});
    }
})();