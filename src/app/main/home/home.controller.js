(function ()
{
    'use strict';

    angular.module('app.home')
           .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($log, $state, $mdSidenav)
    {
        var vm     = this;
        var currentState = $state.current.name;

        //----Implementation details
        switch(currentState) {
            case 'app.home':
                vm.selectedIndex = 0;
                break;
            case 'app.home.digitalimprint':
                vm.selectedIndex = 1;
                break;
            case 'app.home.3dscann':
                vm.selectedIndex = 2;
                break;
            case 'app.home.3ddesign':
                vm.selectedIndex = 3;
                break;
            default:
                vm.selectedIndex = 0;
        }
        
        /**
         * Toggle sidenav
         * @param sidenavId
         */
        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }
    }
})();
