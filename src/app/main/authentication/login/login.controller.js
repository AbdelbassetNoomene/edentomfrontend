(function ()
{
    'use strict';

    angular
        .module('app.authentication.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(AUTH_EVENTS, authenticator, $log, $rootScope, $scope, $state)
    {
        var vm          = this;
        vm.errorMessage = '';
        vm.error        = false;
        vm.form         = {};
        vm.login        = login; 

        if (authenticator.getUser()) {
            $log.debug('--User exists');
            $state.go('app.home');
        }

        // Methods
        function login() {
            //angular.element('#login').checkAndTriggerAutoFillEvent(); // Execute the check for all DOM elements in the given element

            $log.debug('loginRequest for userName: ' + vm.form.userName);
            if(vm.form.userName && vm.form.password) {

                $log.debug('userName and password are not empty');
                authenticator.authenticate(vm.form, function (response, isError) {
                    vm.error = isError;
                    if(isError) {
                        if(response.responseJSON) {
                            vm.errorMessage = response.responseJSON.message; //response.responseJSON.code + ': ' + response.responseJSON.error;
                        } else {
                            vm.errorMessage = response.statusText + ': der Server antwortet nicht!';
                        }
                        $log.debug(vm.errorMessage);
                        $scope.$apply();
                    } else {
                    	$rootScope.user = authenticator.getUser();
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        //$state.go('app.home');
                    }
                });
            }
        }
    }
})();