(function(){
    'use strict';

    angular.module('edentom').directive('pwCheck', PwCheckDirective);

    /** @ngInject */
    function PwCheckDirective() {

        function link(scope, elem, attrs, ctrl) {

            scope.$watch(attrs.pwCheck, function (newValue) {

                console.log('pwCheck: ' + newValue);
                elem[0].setCustomValidity(newValue);
                ctrl.$setValidity('pwCheck', newValue);
            });
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    }
})();