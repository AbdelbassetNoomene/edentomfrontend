(function ()
{
    'use strict';

    angular.module('app.scanagent')
        .controller('OperationDialogController', OperationDialogController);

    /** @ngInject */
    function OperationDialogController($document, $log, $mdDialog, $rootScope, toothNumber)
    {
        var vm = this;

        // Data
        vm.selectedOperation = '';
        vm.toothNumber = toothNumber;
        $log.debug('toothNumber: ' + toothNumber);

        // Methods
        vm.closeDialog     = closeDialog;
        vm.selectOperation = selectOperation;

        //----------------Implementation details
        function closeDialog()
        {
            $mdDialog.cancel();
        }

        function selectOperation(event)
        { 
            $log.debug('vm.selectedOperation: ' + vm.selectedOperation);

            switch (vm.selectedOperation) {
                case 'Veneer':
                    $rootScope.teethOperation.veneer.teethList.push( toothNumber );
                    break; 
                case 'Krone':
                    $rootScope.teethOperation.krone.teethList.push( toothNumber );
                    break; 
                case 'Brucke':
                    $rootScope.teethOperation.bridge.teethList.push( toothNumber );
                    $mdDialog.show({
                        controller         : 'CoreDialogController',
                        controllerAs       : 'vm',
                        templateUrl        : 'app/main/scanagent/views/core-dialog/core-dialog.html',
                        parent             : angular.element($document.body),
                        targetEvent        : event,
                        clickOutsideToClose: true,
                        locals: { 
                            toothNumber: toothNumber 
                        } 
                    }).then(function (result) {
        			    $log.debug('Close dialog: Ok');
        			    $mdDialog.hide();
            	    }, function () {
            		    $log.debug('Close dialog: Cancel');
            		    $mdDialog.cancel();
            		});
                    break; 
                case 'In-Onlay':
                    $rootScope.teethOperation.inOnlay.teethList.push( toothNumber );
                    break; 
                case 'Implantat':
                    $rootScope.teethOperation.implantat.teethList.push( toothNumber );
                    break; 
            }

            $log.debug('veneer.teethList: ' + $rootScope.teethOperation.veneer.teethList);
            $log.debug('krone.teethList: ' + $rootScope.teethOperation.krone.teethList);
            $log.debug('bridge.teethList: ' + $rootScope.teethOperation.bridge.teethList);
            $log.debug('inOnlay.teethList: ' + $rootScope.teethOperation.inOnlay.teethList);
            $log.debug('implantat.teethList: ' + $rootScope.teethOperation.implantat.teethList);
        } 
    }
})();
