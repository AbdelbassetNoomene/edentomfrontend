(function() {
	'use strict';

	angular.module('app.authentication')
		   .factory('authenticationInterceptor', authenticationInterceptor);

	/** @ngInject */
    function authenticationInterceptor($rootScope, $log, $q, AUTH_EVENTS, authenticator) {

    return {
        // set the X-Auth-Token on each AJAX request
        request: function (config) {
            //$log.debug('authenticationInterceptor, current token: ' + JSON.stringify(authenticator.getToken()));
            config.headers = config.headers || {};
            if (authenticator.getToken() !== null) {
                config.headers['X-Auth-Token'] = authenticator.getToken();
            }
            //console.log('----Interceptor, request(config): ' + JSON.stringify(config));
            return config;
        },

        requestError: function(rejection) {
            $log.debug('----Interceptor requestError: ' + JSON.stringify(rejection));
            return $q.reject(rejection);
        },

        // each AJAX request returns a new token which we need to remember for the next request
        response: function (response) {
            var xAuthToken = response.headers('X-Auth-Token');
            if (xAuthToken !== null) {
                authenticator.setToken(xAuthToken);
            }
            //console.log('Interceptor: response (status: <' + response.status + ' ' + response.statusText + '>, method: <' + response.config.method + '>, URL: <' + response.config.url + '>, current token: <' + JSON.stringify(authenticator.getToken()) + '>)');
            return response;
        },

        responseError: function(response) {

            $log.debug('----Interceptor responseError status: ' + response.status);
            $log.debug('----Interceptor responseError:' + JSON.stringify(response));
            /*$rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);*/

            // status:406 --> Not Acceptable: EC_FE_002 Der Benutzer ist bereits eingeloggt
            // status:-1 Internal Server Error --> Authorisierung abgelaufen

            if (response.status === -1 || response.status === 401 || response.status === 419 || response.status === 440) {
                if(response.data && response.data.code && response.data.error) {
                    $rootScope.authError = response.data.code + ': ' + response.data.error;
                } else {
                    $rootScope.accessError = 'Der Server antwortet nicht.';
                    $rootScope.$broadcast(AUTH_EVENTS.noServerAnswer);
                }
                return response;
            } else {
            	if(response.data && response.data.code) {
            		$log.debug('----Interceptor responseError: ' + response.data.code + ': ' + response.data.error);
                    // EC_FE_005 --> 406    'Der Lauf ist bereits freigegeben/verworfen worden und steht nicht mehr als offene Freigabe zur Verfügung'
                    // FC_RE_001 --> 403    'Zugriff verweigert'
                    if (response.data.code === 'FC_RE_001') {
                        $rootScope.accessError = response.data.code + ': ' + response.data.error;
                    }
                    if ((response.data.code === 'FC_RE_001') || (response.data.code === 'FC_FE_005')) {
                        return response; // accept the server response to avoid a re-send (2 sends successively) of the same request to the server
                    }	
            	}
            }
            return $q.reject(response);
        }
    };
}

})();