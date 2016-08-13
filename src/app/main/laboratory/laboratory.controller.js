(function ()
{
    'use strict';

    angular.module('app.laboratory')
           .controller('LaboratoryController', LaboratoryController);

    /** @ngInject */
    function LaboratoryController()
    {
        var vm                    = this;
        // Data
        /*var currentState   = $state.current.name;
 
        //----Implementation details
        /*switch(currentState) {
            case 'app.laboratory':
                vm.selectedIndex = 0;
                break;
            case 'app.dental-practice':
                vm.selectedIndex = 1;
                break;
            default:
                vm.selectedIndex = 0;
        }*/
    }
})();
