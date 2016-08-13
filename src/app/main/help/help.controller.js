(function ()
{
    'use strict';

    angular
        .module('app.help')
        .controller('HelpController', HelpController);

    /** @ngInject */
    function HelpController($mdDialog)
    {
    	var vm            = this;
        // Data
    	vm.guiDesignLink  = 'gui';
    	vm.specLink       = 'spec';
    	vm.userManualLink = 'manual';
    	vm.links          = [
	        vm.specLink,
	        vm.guiDesignLink,
	        vm.userManualLink
	    ];

        vm.stepper = {
            step1: {},
            step2: {},
            step3: {}
        };
        vm.submitStepper = submitStepper;

    	//---------------------Implementation details
        /**
         * Submit stepper form
         *
         * @param ev
         */
        function submitStepper(ev)
        {
            // You can do an API call here to send the form to your server

            // Show the sent data.. you can delete this safely.
            $mdDialog.show({
                controller         : function ($scope, $mdDialog, formWizardData)
                {
                    $scope.formWizardData = formWizardData;
                    $scope.closeDialog = function ()
                    {
                        $mdDialog.hide();
                    };
                },
                template           : '<md-dialog>' +
                '  <md-dialog-content><h1>You have sent the form with the following data</h1><div><pre>{{formWizardData | json}}</pre></div></md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-click="closeDialog()" class="md-primary">' +
                '      Close' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                parent             : angular.element('body'),
                targetEvent        : ev,
                locals             : {
                    formWizardData: vm.stepper
                },
                clickOutsideToClose: true
            });

            // Reset the form model
            vm.stepper = {
                step1: {},
                step2: {},
                step3: {}
            };
        }
    }
})();
