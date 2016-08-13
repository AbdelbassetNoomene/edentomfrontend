
(function(){
	'use strict';

	angular.module('edentom').directive('myCurrentTime', MyCurrentTimeDirective);

	/** @ngInject */
	function MyCurrentTimeDirective($interval, dateFilter) {

        function link(scope, element, attrs) {
		    var format, timeoutId;

		    function updateTime() {
		        element.text(dateFilter(new Date(), format));
		    }

		    scope.$watch(attrs.myCurrentTime, function(value) {
		        format = value;
		        updateTime();
		    });

		    element.on('$destroy', function() {
		        $interval.cancel(timeoutId);
		    });

		    // start the UI update process; save the timeoutId for canceling
		    timeoutId = $interval(function() {
		        updateTime(); // update DOM
		    }, 1000);
	    }
		//MyCurrentTimeDirective.$inject = ['$interval', 'dateFilter'];
	
		return {
		    link: link
		};
}
})();