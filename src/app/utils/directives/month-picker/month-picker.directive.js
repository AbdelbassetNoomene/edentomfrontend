
(function(){
	'use strict';

	var DATE_FORMAT = 'yyyy-MM-ddT13:mm:ss.sssZ'; //'yyyy-MM-ddTHH:mm:ss.sssZ'   var TIMEZONE = 'UTC';

	angular.module('edentom').directive('monthPicker', MonthPickerDirective);

	/*************************************************************************************************************************
	* The monthPicker directive is to be used like this:
	*     if 'day' is not given, the first day of the month will be selected
	*
	*     <month-picker bind="monthYear" ng-model="monthYearShortcut" id="monthYearName" inputname="monthYearName" ng-pattern="/^(0[1-9]|1[0-2])\.[1-9][0-9]{3}$/">
	*     	<div ng-message="pattern">{{EC_FE_008}}</div>
	*     </month-picker>
    *     OR
	*     <month-picker bind="monthYear" ng-model="monthYearShortcut" id="monthYearName" inputname="monthYearName" disable="true">
	*     </month-picker>
	*
	**************************************************************************************************************************/
	angular.module('edentom').directive('mdYear', mdYearSelector);
	
	/** @ngInject */
	function MonthPickerDirective () {

		/** @ngInject */
		function MonthPickerCtrl($filter, $log, $scope) {

			this.ngModelCtrl = null;
			var self         = this;
			this.model       = null;
			this.configureNgModel   = function(ngModelCtrl) {

                this.$error = ngModelCtrl.$error;
                this.ngModelCtrl = ngModelCtrl;
                var self = this;
                ngModelCtrl.$render = function() { // $render(): Called when the view needs to be updated. It is expected that the user of the ng-model directive will implement it
                    self.model = ngModelCtrl.$viewValue;
                };
                $scope.$watch('ctrl.model', function(newValue, oldValue) {
                    //$log.debug('ctrl.model changed: ' + oldValue + ' --> ' + newValue);

                    if(newValue && (newValue !== oldValue) && ((newValue.length !== 7) || (newValue.slice(2,3) !== '.'))) {
						$log.debug('--the given monthYear is invalid');
						$scope.month      = undefined;
						$scope.resultDate = null;
					}

                    if(!isNaN(oldValue) && (isNaN(newValue) || !newValue)) { // the user is deleting ctrl.model manually
					    // $log.debug('--the user is deleting ctrl.model manually or he is giving an invalid monthYear');
					    $scope.month      = undefined;
						$scope.resultDate = null;
					} else {
						// !isNaN($scope.resultDate.valueOf()) to detect 'Invalid Date' instance
						//$scope.disable && (
						if($scope.resultDate && angular.isDate($scope.resultDate) && !isNaN($scope.resultDate.valueOf())) { // to show an initialized month-picker

							// $log.debug('--$scope.disable: ' + $scope.disable);
							// $log.debug('--$scope.resultDate isDate: ' + $scope.resultDate);
							$scope.year    = $scope.resultDate.getFullYear();
							$scope.setMonth($scope.resultDate.getMonth());
						} else {
							$log.debug('--the user is giving monthYear manually');
							// newValue is a String
							if(newValue && (newValue !== oldValue) && (newValue.length === 7) && (newValue.slice(2,3) === '.')) {

								var m = Number(newValue.slice(0,2)) - 1,
									y = Number(newValue.slice(3,7));
								if((m > -1) && (m < 12)) {  // a valid month
									$scope.year = y;
									//$log.debug('--getMonth(), getFullYear(): ' + m + ', ' + $scope.year);
									$scope.setMonth(m);
								} /*else {
									$log.debug('--the given month is invalid');
									//$scope.month      = undefined;
									//$scope.resultDate = null;
								}*/
							} /*else if(newValue && (newValue !== oldValue) && ((newValue.length !== 7) || (newValue.slice(2,3) !== '.'))) {
								$log.debug('--the given monthYear is invalid');
								//$scope.month      = undefined;
								//$scope.resultDate = null;
							}*/
						}
				    }
	                ngModelCtrl.$setViewValue(newValue);
	                //$log.debug('--self.$error: ' + JSON.stringify(self.$error));
	            });
	        };

		    $scope.year = (new Date()).getFullYear(); // initialize the current year
			$scope.months = [{id:0, name:'Jan'}, {id:1,  name:'Feb'}, {id:2,  name:'Mrz'},
							 {id:3, name:'Apr'}, {id:4,  name:'Mai'}, {id:5,  name:'Jun'},
							 {id:6, name:'Jul'}, {id:7,  name:'Aug'}, {id:8,  name:'Sep'},
							 {id:9, name:'Okt'}, {id:10, name:'Nov'}, {id:11, name:'Dez'}];

			$scope.setMonth = function(monthId){
				if(angular.isNumber(monthId)) {
					$scope.month     = {id: monthId};
					self.model = new Date($scope.year, monthId, 1);
					if($scope.day === 'last') {
						self.model = new Date($scope.year, (monthId+1), 0); // to get a date with the last day of monthId
					}
					//--> when TIMEZONE is used, the the returned date 'resultDate' will be decrement by 1 day
					$scope.resultDate = new Date($filter('date') (self.model, DATE_FORMAT));//, TIMEZONE
					$log.debug('--resultDate: ' + $scope.resultDate);

					self.model = $filter('date') (self.model, 'MM.yyyy');
					$log.debug('--self.model: ' + self.model);
				}
			};
			this.setYear = function(nestedDirective) {
				//$log.debug('--year changed: ' + $scope.year + ' --> ' + nestedDirective.year + ', month= ' + JSON.stringify($scope.month));

				if(!($scope.resultDate && angular.isDate($scope.resultDate) && !isNaN($scope.resultDate.valueOf())) ||
				    (($scope.year !== nestedDirective.year)) && !nestedDirective.initialized) { // 'resultDate was not initialized' or 'just the year is changed'

					//$log.debug('--$scope.resultDate is not initialized || just the year is changed --> initialized=' + nestedDirective.initialized);
					$scope.year = nestedDirective.year;
				    if($scope.month && angular.isNumber($scope.month.id)) {
				        $scope.setMonth($scope.month.id);
				    }
				}
			};
    }

	return {
		restrict: 'E',
		scope: {
			day:        '@',
			disable:    '=',
			id:         '@',
			inputname:  '@',
			year:       '@',
			resultDate: '=bind'
		},
		controllerAs:     'ctrl',
		controller:       MonthPickerCtrl,
		require:          ['ngModel', 'monthPicker'],
        transclude:       true, // 'transclude' makes the contents of a directive with this option have access to the scope outside of the directive rather than inside
        link:             function(scope, element, attrs, controllers) {
            var ngModelCtrl       = controllers[0];
            var monthPicker       = controllers[1];
            monthPicker.configureNgModel(ngModelCtrl);
        },
		template: '<div layout="row" ng-disabled="disable" flex>' +
					'<div layout-align="center center"><md-menu-bar ng-disabled="disable"><md-menu>' +
						'<button class="md-icon-button" ng-disabled="disable" ng-click="$mdOpenMenu()">' +
							'<md-icon md-font-icon="icon-calendar" class="icon s20"></md-icon>' +
						'</button>' +
						'<md-menu-content>' +
							'<md-menu-item>' +
								'<md-year layout="row" layout-align="center center" year="year"></md-year>' +
							'</md-menu-item>' +
							'<md-menu-divider></md-menu-divider>' +
							'<div layout="row">' +
								'<md-menu-item class="md-indent" ng-repeat="mon in months.slice(0,3)">' +
									'<md-button ng-click="setMonth(mon.id)">{{mon.name}}</md-button>' +
								'</md-menu-item>' +
							'</div>' +
							'<div layout="row">' +
								'<md-menu-item class="md-indent" ng-repeat="mon in months.slice(3,6)">' +
									'<md-button ng-click="setMonth(mon.id)">{{mon.name}}</md-button>' +
								'</md-menu-item>' +
							'</div>' +
							'<div layout="row">' +
								'<md-menu-item class="md-indent" ng-repeat="mon in months.slice(6,9)">' +
									'<md-button ng-click="setMonth(mon.id)">{{mon.name}}</md-button>' +
								'</md-menu-item>' +
							'</div>' +
							'<div layout="row">' +
								'<md-menu-item class="md-indent" ng-repeat="mon in months.slice(9,12)">' +
									'<md-button ng-click="setMonth(mon.id)">{{mon.name}}</md-button>' +
								'</md-menu-item>' +
							'</div>' +
						'</md-menu-content>' +
					'</md-menu></md-menu-bar></div>' +
					'<div>' +
					     '<md-input-container class="md-block">' +
						    '<input type="text" ng-model="ctrl.model" id="{{id}}" name="{{inputname}}" placeholder="mm.yyyy" ng-disabled="disable" />' +
						    '<div ng-messages="ctrl.$error" md-auto-hide="false" role="alert" ng-transclude>' +
			                    // element content, the messages will be transcluded here
			                '</div>' +
						    // aria-haspopup="true" class="md-datepicker-input" size="1"
						 '</md-input-container>' +
				   '</div>' +
				'</div>'
	};
}

/** @ngInject */
function mdYearSelector() {

	/** @ngInject */
	function Controller($attrs, $scope) {

		$scope.limit = (new Date()).getFullYear(); // current year is the last year to show
		//$scope.year = (new Date()).getFullYear();

		$scope.hasNext = function () {
			return $scope.year < $scope.limit;
		};

		$scope.hasPrevious = function () {
			return $scope.year > 1900; // 1900 is the first year to show
		};

		$scope.next = function () {
			++$scope.year;
		};

		$scope.previous = function () {
			--$scope.year;
		};

		$scope.setYear = function(y){
			$scope.year = y;
		};
	}

	return {
		controller: Controller,
		restrict:   'E',
		scope:      {year: '='},
		require:    '^monthPicker',// The ^^ prefix means that this directive searches for the controller on its parents.
		                           // (A ^ prefix would make the directive look for the controller on its own element or its parents; without any prefix, the directive would look on its own element only.)
		link:       function(scope, element, attrs, monthPickerCtrl) {

						scope.$watch('year', function (newValue, oldValue) {
							if((oldValue !== newValue) && angular.isNumber(newValue)) {
								scope.initialized = false;
							    monthPickerCtrl.setYear(scope);
							}
							else if(angular.isNumber(newValue)){
								scope.initialized = true;
							    monthPickerCtrl.setYear(scope);
							} /*else {
								//$log.debug('--invalid year: ' + newValue);
							}*/
						});
					},
		template:   '<md-button class="md-icon-button" type="button" md-prevent-menu-close="true" ng-click="previous()" aria-label="Previous">' +//ng-disabled="!hasPrevious()"
						'<md-icon md-font-icon="icon-chevron-left" class="icon s24"></md-icon>' +
					'</md-button>' +
					'<md-button ng-click="setYear(year)">{{year}}</md-button>' +
					'<md-button class="md-icon-button" type="button" md-prevent-menu-close="true" ng-click="next()" aria-label="Next">' +//ng-disabled="!hasNext()"
						'<md-icon md-font-icon="icon-chevron-right" class="icon s24"></md-icon>' +
					'</md-button>'
	};
}
})();