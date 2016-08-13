(function ()
{
    'use strict';

    angular.module('app.authentication').constant('AUTH_EVENTS', {
	  loginFailed:      'auth-login-failed',
	  loginRequired:    'auth-login-required',
	  loginSuccess:     'auth-login-success',
	  logoutSuccess:    'auth-logout-success',
	  logoutWanted:     'auth-logout-wanted',
	  notAuthenticated: 'auth-not-authenticated',
	  notAuthorized:    'auth-not-authorized',
	  sessionTimeout:   'auth-session-timeout',
	  tokenChanged:     'auth-token-changed',
	  noServerAnswer:   'no-server-answer'
    });

})();
