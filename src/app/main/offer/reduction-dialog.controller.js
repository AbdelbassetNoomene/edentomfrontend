(function ()
{
    'use strict';

    angular
        .module('app.offer')
        .controller('ReductionDialogController', ReductionDialogController);

    /** @ngInject */
    function ReductionDialogController($mdDialog, $rootScope, $log, Reduction, Reductions, msUtils)
    {
        var vm = this;

        // Data
        //vm.title = 'Edit Reduction';
        vm.title = 'Bearbeiten Reduktion';
        vm.reduction = angular.copy(Reduction);
        vm.reductions = Reductions;
        vm.newReduction = false;
        vm.allFields = false;

        if ( !vm.reduction )
        {
            vm.reduction = {
                "quantity": null,
                "reductionPercentage": null
                };

            // vm.title = 'New Reduction';
            vm.title = 'Neu Reduktion';
            vm.newReduction = true;
            vm.reduction.tags = [];
        }

        // Methods
        vm.addNewReduction = addNewReduction;
        vm.saveReduction = saveReduction;
        vm.deleteReductionConfirm = deleteReductionConfirm;
        vm.closeDialog = closeDialog;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        //////////

        /**
         * Add new reduction
         */
        function addNewReduction()
        {
            $log.debug('vm.reductions befor unshift: ' + JSON.stringify(vm.reductions));
            vm.reductions.unshift(vm.reduction);
            $log.debug('vm.reductions after unshift: ' + JSON.stringify(vm.reductions));

            $rootScope.$emit('sendReductions', vm.reductions);

            closeDialog();
        }

        /**
         * Save reduction
         */
        function saveReduction()
        {
            // Dummy save action
            for ( var i = 0; i < vm.reductions.length; i++ )
            {
                if ( vm.reductions[i].id === vm.reduction.id )
                {
                    vm.reductions[i] = angular.copy(vm.reduction);
                    break;
                }
            }

            closeDialog();
        }

        /**
         * Delete reduction Confirm Dialog
         */
        function deleteReductionConfirm(ev)
        {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete the reduction?')
                .htmlContent('<b> Reduction with ID: ' + vm.reduction.id + '</b>' + ' will be deleted.')
                .ariaLabel('delete reduction')
                .targetEvent(ev)
                .ok('OK')
                .cancel('CANCEL');

            $mdDialog.show(confirm).then(function ()
            {

                vm.reductions.splice(vm.reductions.indexOf(Reduction), 1);

            });
        }

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }

    }
})();