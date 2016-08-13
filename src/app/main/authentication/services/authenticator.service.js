(function() {
	'use strict';

	angular.module('app.authentication')
		   .factory('authenticator', authenticator);

	/** @ngInject */
    function authenticator($cookies, $location, $rootScope, $filter, Base64, $sanitize, API_URL, AUTH_EVENTS, DEBUG_INFO, authService, jwtHelper) {

        return {
            authenticate:       authenticate,
            deleteToken:        deleteToken,
            deleteUserSettings: deleteUserSettings,
            getDecodedToken:    getDecodedToken,
            getExpirationDate:  getExpirationDate,
            getToken:           getToken,
            getUser:            getUser,
            hasRole:            hasRole,
            isAuthenticated:    isAuthenticated,
            isAuthorized:       isAuthorized,
            logout:             logout,
            importBackendUrl:   importBackendUrl,
            setToken:           setToken
        };

        function authenticate (loginRequest, callback) {

            console.log('credentials, userName: ' + loginRequest.userName);
            var credentials = Base64.encode(loginRequest.userName + ':' + loginRequest.password);
            console.log('Base64 encrypted credentials: ' + credentials);

            if(isAuthenticated()) {
                console.log('User is already authenticated: ' + getUser().userName);
                $location.path('/home');
            } else {
                window.$.ajax({ /* Labo admins: superadminlabo	12345
                    Labo admins: admin	eDentOM61066
                    Agents: agent0	eDentOM79719
                    Agents: agent1	eDentOM54969
                    Agents: agent2	eDentOM91888
                    Agents: agent3	eDentOM67526
                    Agents: agent4	eDentOM43168
                    Agents: agent5	eDentOM93887
                    Agents: agent6	eDentOM8343
                    Practice admins: superadminpractice	12345
                    Practice admins: adminoffice	eDentOM7945
                    Doctors: doc0	eDentOM7080
                    Doctors: doc1	eDentOM72951*/
                    url: API_URL + 'authentification/login',
                    type: 'POST',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log('Data: ' + JSON.stringify(data));
                        setToken(JSON.parse(JSON.stringify(data)).token);
                        console.log('authenticator: login successful (current token: <' + JSON.stringify(getToken()) + '>)');

                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        authService.loginConfirmed();
                        callback(data, false);
                    },
                    error: function (data, status) {
                        deleteToken();
                        console.log('authenticator: login failed (data: ' + JSON.stringify(data) + ')');
                        $rootScope.$apply();
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed, status);
                        callback(data, true);
                    }
                });
            }
        }

        function deleteToken () {
			$cookies.remove('token');
        }

        function deleteUserSettings () {
			$cookies.remove('pisStatisticsParameters');
            $cookies.remove('scanAgentsParameters');
        }

        function getDecodedToken () {
        	var token = $cookies.getObject('token');
			if (token) {
                return jwtHelper.decodeToken(token);
            }
            return null;
        }

        function getExpirationDate () {
            var decodedToken = getDecodedToken();
            if(!decodedToken || (typeof decodedToken.EXP === 'undefined')) {
                return null;
            }
            var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
            d.setUTCSeconds(decodedToken.EXP);
            console.log('--ExpirationDate: ' + JSON.stringify(d));
            return d;
            /* var token = $cookies.getObject('token');
               if (token) {
                return jwtHelper.getTokenExpirationDate(token); // getTokenExpirationDate() needs token.exp and not token.EXP
                //var isExpired = jwtHelper.isTokenExpired(token);
            }
            return null;*/
        }

        function getToken () {
            return $cookies.getObject('token');
        }

        function getUser () {
            var token = getDecodedToken();
            if ((token !== null) && (token !== undefined)) {
                console.log('decoded token = ' + JSON.stringify(token));
                return JSON.parse(token.SUB);
            }
            return null;
        }

        function hasRole (role) {
            if (getUser()) {
                var filteredRoles = $filter('filter')(getUser().roles, function(entry) {
                    if(entry === role){
                        return true;
                    }
                });
                return (filteredRoles.length > 0);
            }
            return null;
        }

        function isAuthenticated() {
            var boolean = getUser() && !!getUser().userName;
            console.log('--isAuthenticated: ' + boolean);
            return boolean;
        }

        function isAuthorized (authorizedRoles) {
            console.log('isAuthorized for authorizedRoles = ' + JSON.stringify(authorizedRoles) + '?');

            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            if(authorizedRoles[0] === '*') {
                return true;
            }
            var boolean = isAuthenticated() && ($filter('filter')(getUser().roles, function(entry) {
                //console.log('This User has Role: ' + JSON.stringify(entry));
                if (authorizedRoles.indexOf(entry) !== -1){
                    return true;
                }
            }).length > 0);
            console.log('This User has Roles: ' + JSON.stringify(getUser().roles) + ' --> isAuthorized = ' + boolean + ' ---> for ' + JSON.stringify(authorizedRoles));
            return boolean;
        }

        function logout () {
            $rootScope.user = null;
            deleteToken();
            deleteUserSettings(); // in our case, Settings for 'Report Values'
            console.log('authenticator: logout successful (current token: <' + JSON.stringify(getToken()) + '>)');
            //--$location.path('/login');
            //$rootScope.$broadcast(AUTH_EVENTS.loginRequired);
            //--$window.location.reload();
        }

        function importBackendUrl() {
            var q = window.$.ajax({
                type:        'GET',
                url:         '/config.json',
                contentType: 'application/json',
                dataType:    'json',
                cache:       false,
                async:       false,
                success:     function (data) {
                    console.log('--Success read config.json: ' + JSON.stringify(data));
                    console.info('----API_URL before reading config.json: ' + JSON.stringify(data.API_URL));
                    console.info('----DEBUG_INFO before reading config.json: ' + JSON.stringify(data.DEBUG_INFO));
                    API_URL    = data.API_URL;
                    DEBUG_INFO = data.DEBUG_INFO;
                },
                error:       function (data, status) {
                    console.warn('--Error read config.json: ' + JSON.stringify(data));
                }
            });
            if (q.status === 200) {
                console.info('----API_URL from config.json: ' + JSON.stringify(API_URL));
                console.info('----DEBUG_INFO from config.json: ' + JSON.stringify(DEBUG_INFO));
            } else {
                console.info('----API_URL that will be used: ' + JSON.stringify(API_URL));
                console.info('----DEBUG_INFO that will be used: ' + JSON.stringify(DEBUG_INFO));
            }
        }
        function setToken (token) {
            $cookies.putObject('token', token); //<-- to have the possibility to do a logout when the user closed the tab/browser and than want to log in
            $rootScope.$broadcast(AUTH_EVENTS.tokenChanged, token);
        }
}

})();
