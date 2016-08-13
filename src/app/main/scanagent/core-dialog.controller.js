(function ()
{
    'use strict';

    angular.module('app.scanagent')
        .controller('CoreDialogController', CoreDialogController);

    /** @ngInject */
    function CoreDialogController($mdDialog, $rootScope, $log ,toothNumber)
    {
        var vm = this;

        // Data
        vm.down1 = '1-1DOWN';
        vm.down2 = '2-1DOWN';
        vm.down3 = '3-1DOWN';
        vm.toothNumber = toothNumber;
        vm.listCoreNumber = [];
        vm.onStateUrl    = '../assets/images/teeth/selected/'; //folder contain list of teeth blue color
        vm.offStateUrl   = '../assets/images/teeth/unselected/'; //folder contain list of teeth white color
        vm.up1   = '1-1UP';
        vm.up2   = '2-1UP';
        vm.up3   = '3-1UP';
        $log.debug('toothNumber: ' + toothNumber);

        // Methods
        vm.closeDialog     = closeDialog;
        vm.selectCore      = selectCore;
        vm.selectTooth     = selectTooth;


        //----------------Implementation details
        function closeDialog()
        {
            $mdDialog.cancel(); // click on cancel button
        }
        /**
         * Select tooth & Open chooser-operation dialog
         *
         * @param ev 
         */
        function selectTooth(event)
        {
            var toothNumber = $(event.currentTarget).attr('id').split('-')[1];
            var stateTooth = $(event.currentTarget).attr('status');

            if (stateTooth === 'off') 
            {
                $(event.currentTarget).attr('status','on');
                $(event.currentTarget).attr('src',vm.onStateUrl +toothNumber +'.png' );

               /* $mdDialog.show({
                    controller         : 'OperationDialogController',
                    controllerAs       : 'vm',
                    templateUrl        : 'app/main/scanagent/views/operation-dialog/operation-dialog.html',
                    parent             : angular.element('body'),
                    targetEvent        : event,
                    clickOutsideToClose: true,
                    locals: { 
                        toothNumber: toothNumber 
                    } 
                });*/
            }
            else if (stateTooth === 'on') 
            {
                $(event.currentTarget).attr('status','off');
                $(event.currentTarget).attr('src',vm.offStateUrl +toothNumber +'.png' );
            } 

            $log.debug('event.currentTarget).attr(status): ' + JSON.stringify($(event.currentTarget).attr('status')));
        }
        /**
         * Select core
         *
         * @param ev 
         */
        function selectCore()
        {
            //vm.listCoreNumber.push( CoreNumber );
            //$rootScope.teethOperation.bridge.teethList.push( {toothNumber,[]} );

            $mdDialog.hide();  // click on OK button
        }

    }
})();
