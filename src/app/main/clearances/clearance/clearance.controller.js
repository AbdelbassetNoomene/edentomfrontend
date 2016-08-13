(function ()
{
    'use strict';

    angular.module('app.clearances.clearance')
           .controller('ClearanceController', ClearanceController);

    /** @ngInject */
    function ClearanceController($cookies, $rootScope, $log, $stateParams, $timeout, $filter, $sce, $mdDialog, msApi, ClearanceData, AlertService)
    {
    	// Data
        var vm                                = this;
        var DEFAULT_PIS_STATISTICS_PARAMETERS = [2, 6, 12];
        var REPORT_VALUES_PI_STATISTICS_ERROR = 'WC_FE_002: in „Einstellungen->Report Werte->Kennzahlen Statistiken“ wurde keine Auswahl getroffen.';
        var errorCallback           = errorCallback;
        var getPercent              = getPercent;
        var getPiHistory            = getPiHistory;
        var openConfirmDialog       = openConfirmDialog;
        var prepareTabData          = prepareTabData;
        var safePush                = safePush;
        var setSelectedTabIndex     = setSelectedTabIndex;
        vm.abandon                  = abandon;
        vm.approve                  = approve;
        vm.cleared                  = false;
        vm.clearance                = ClearanceData[0];
        vm.error                    = '';
        vm.errorCallback            = errorCallback;
        vm.examineProtocol          = examineProtocol;
        vm.deselect                 = deselect;
        vm.getContent               = getContent;
        vm.getDuration              = getDuration;
    	vm.getNextPI                = getNextPI;
    	vm.getPercentPotfolio       = getPercentPotfolio;
    	vm.getPreviousPI            = getPreviousPI;
    	vm.getSum                   = getSum;
        vm.getTabContent            = getTabContent;
        vm.isUnitOrFormattedValue   = isUnitOrFormattedValue;
        vm.isValue                  = isValue;
        vm.message                  = '';
        vm.loadStuff                = loadStuff;
        vm.log                      = log;
        vm.onPaginate               = onPaginate;
        vm.onReorder                = onReorder;
        vm.pisStatisticsParameters  = $cookies.getObject('pisStatisticsParameters');
        vm.protocolFileContent      = null;
    	vm.protocolFileError        = '';
    	vm.protocolFileURL          = '';
        vm.query                    = {order: 'companyName', filter: '', limit: 10, page: 1};
        vm.selected                 = [];
        vm.setSelectedItem          = setSelectedItem;
        vm.setSelectedPortfolio     = setSelectedPortfolio;
        vm.statistics               = {
                'selectedTabIndex': $stateParams.tabIndex,
                'inputData'    : {index: 0, urlSuffix: 'input',      data: {}, selectedPortfolio: {}},
                'pisOverview'  : {index: 1, urlSuffix: 'overview',   data: {}, selectedPortfolio: {}},
                'pisStatistics': {index: 2, urlSuffix: 'pistats',    data: {}, selectedPortfolio: {}, selectedPI: {}, selectedVS: null, pisStatisticsError: ''},
                'billenginePis': {index: 3, urlSuffix: 'billengine', data: {}, selectedPortfolio: {}, selectedCorrectionFunction: {}},
                'pisDetails'   : {index: 4, urlSuffix: 'pidetails',  data: {}, selectedPortfolio: {}, selectedPI: {}}
        };
        vm.tabs = [
                             {
                                 name: 'inputData',
                                 title: 'Eingangsdaten Analyse',
                                 src: 'app/main/clearances/clearance/views/details/input-data.html',
                                 isActive: true
                             }, {
                                 name: 'pisOverview',
                                 title: 'Kennzahlen Übersicht',
                                 src: 'app/main/clearances/clearance/views/details/pis-overview.html',
                                 isActive: true
                             }, {
                                 name: 'pisStatistics',
                                 title: 'Kennzahlen Statistik',
                                 src: 'app/main/clearances/clearance/views/details/pis-statistics.html',
                                 isActive: true
                             }, {
                                 name: 'billenginePis',
                                 title: 'BillEngine Kennzahlen',
                                 src: 'app/main/clearances/clearance/views/details/billengine-pis.html',
                                 isActive: true
                             }, {
                                 name: 'pisDetails',
                                 title: 'Kennzahlen Details',
                                 src: 'app/main/clearances/clearance/views/details/pis-details.html',
                                 isActive: true
                             }
        ];
        //--Header for PIs Details Table
        vm.statistics.pisDetails.allColumns = {
            monetaryValue:                      'MONETARY_VALUE',
            monetaryUnitType:                   'MONETARY_Einheit',
            monetaryValueFormatted:             'MONETARY_VALUE',
            itemCountValue:                     'ITEM_COUNT_VALUE',
            itemCountUnitType:                  'ITEM_COUNT_Einheit',
            itemCountValueFormatted:            'ITEM_COUNT_VALUE',
            contractCountValue:                 'CONTRACT_COUNT_VALUE',
            contractCountUnitType:              'CONTRACT_COUNT_Einheit',
            contractCountValueFormatted:        'CONTRACT_COUNT_VALUE',
            percentOfTotalAmountValue:          'PERCENT_OF_TOTAL_AMOUNT_VALUE',
            percentOfTotalAmountUnitType:       'PERCENT_OF_TOTAL_AMOUNT_Einheit',
            percentOfTotalAmountValueFormatted: 'PERCENT_OF_TOTAL_AMOUNT_VALUE',
            percentOfTotalCountValue:           'PERCENT_OF_TOTAL_COUNT_VALUE',
            percentOfTotalCountUnitType:        'PERCENT_OF_TOTAL_COUNT_Einheit',
            percentOfTotalCountValueFormatted:  'PERCENT_OF_TOTAL_COUNT_VALUE',
            baseQuantityValue:                  'BASE_QUANTITY_VALUE',
            baseQuantityUnitType:               'BASE_QUANTITY_Einheit',
            baseQuantityValueFormatted:         'BASE_QUANTITY_VALUE',
            baseQuantityMonValue:               'BASE_QUANTITY_MON_VALUE',
            baseQuantityMonUnitType:            'BASE_QUANTITY_MON_Einheit',
            baseQuantityMonValueFormatted:      'BASE_QUANTITY_MON_VALUE',
            averageMonValue:                    'AVERAGE_MON_VALUE',
            averageMonUnitType:                 'AVERAGE_MON_Einheit',
            averageMonValueFormatted:           'AVERAGE_MON_VALUE',
            businessInteraction:                'BUSINESS_INTERACTION',
            networkOperator:                    'NETWORK_OPERATOR',
            contractRenewalInAdvance:           'CONTRACT_RENEWAL_IN_ADVANCE',
            minimumContractTerm:                'MINIMUM_CONTRACT_TERM',
            salesChannel:                       'SALES_CHANNEL',
            salesChannelType:                   'SALES_CHANNEL_TYPE',
            minimumProductTerm:                 'MINIMUM_PRODUCT_TERM',
            hardwareInstalment:                 'HARDWARE_INSTALMENT',
            hardwareIncluded:                   'HARDWARE_INCLUDED',
            primaryBusinessInteractionDate:     'PRIMARY_BUSINESS_INTERACTION_DATE',
            principal:                          'PRINCIPAL',
            financialChargeCategory:            'FINANCIAL_CHARGE_CATEGORY',
            materialNumber:                     'MATERIAL_NUMBER',
            productEffectivity:                 'PRODUCT_EFFECTIVITY',
            referenceMonth:                     'REFERENCE_MONTH',
            actionDate:                         'ACTION_DATE',
            hardwareDistribution:               'HARDWARE_DISTRIBUTION'
        };
        var messages = {
    	    	'approve': {
    				title:         'Lauf freigeben',
    				message:       'Wollen Sie den Lauf wirklich freigeben? Eine Freigabe ist unwiderruflich.',
    				confirmButton: 'Freigeben'
    			},
    	    	'abandon': {
    				title:         'Lauf verwerfen',
    				message:       'Wollen Sie den Lauf wirklich verwerfen? Einen Lauf zu verwerfen ist unwiderruflich - einer erneuter Start für die Buchungsperiode dann erforderlich!',
    				confirmButton: 'Verwerfen'
    		}
        };
        var localeDE = d3.locale({
            decimal:     ',',
            thousands:   '.',
            grouping:    [3],
            currency:    ['', '\xa0€'],
    		dateTime:    '%A, der %e. %B %Y, %X',
            date:        '%d.%m.%Y',
            time:        '%H:%M:%S',
            periods:     ['AM', 'PM'], //unused
            days:        ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            shortDays:   ['Son',     'Mon',    'Die',      'Mit',      'Don',        'Fre',     'Sam'],
            months:      ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            shortMonths: ['Jan',    'Feb',     'Mrz',  'Apr',   'Mai', 'Jun',  'Jul',  'Aug',    'Sep',       'Okt',     'Nov',      'Dez']
        });
        var chartOptions = {
        		chart: {
        			type: 'discreteBarChart',
        			height: 450,
        			margin: {
        				top: 20,
        				right: 0,
        				bottom: 100,
        				left: 110
        			},
        			x:           function(d) { return d.label; },
        			y:           function(d) { return d.value; },
        			showValues:  false,
        			showXAxis:   true,
        			showYAxis:   true,
        			duration: 500,
        			rotateLabels: 60,
        			staggerLabels: true,
        			xAxis: {
        				axisLabelDistance: 10
        			},
        			yAxis: {
        				axisLabel: '',
        				axisLabelDistance: -10,
        				tickFormat: function(d) {
        					return localeDE.numberFormat(',.2f')(d);
        				}
        			},
        			useInteractiveGuideline: false,
        			tooltip: {
        				contentGenerator: function (e) {
        				    var series = e.series[0];
                            if (series.value === null) { return; }
                            var header = '<thead>' + 
                                            '<tr>' +
                                                '<td class="legend-color-guide"><div style="background-color: ' + series.color + ';"></div></td>' +
                                                '<td class="key">' + e.data.name + '</td>' +
                                            '</tr>' + 
                                        '</thead>';
        				    var rows =  '<tr>' +
                                            '<td class="key">' + 'Wert: ' + '</td>' +
                                            '<td class="x-value"><strong>' + localeDE.numberFormat(',.4f')(series.value) + '</strong></td>' + 
                                        '</tr>';
                            return  '<table>' +
                                        header +
                                        '<tbody>' + 
                                            rows + 
                                        '</tbody>' +
                                    '</table>';
                        }
        			}
        		},
        		title: {
        			enable: true,
        		    text: '',
        			className: 'h5',
        			css: {
        				width: '90px',
        				textAlign: 'right'
        			}
        		}
        };


        //-----------------------------Init the first tab
        if($stateParams.tabIndex || (Number($stateParams.tabIndex) === 0)) {
    		$log.debug('$stateParams.tabIndex = ' + $stateParams.tabIndex);

    		//----Ask if the Job is cleared or not to determine if the pisDetails tab should be displayed or not
    		msApi.request('clearances@isCleared', {urlSuffix: 'cleared', jobInstanceId: $stateParams.clearanceId}, function(response) {

    			$log.debug('Job cleared = ' + JSON.stringify(response));
    			vm.cleared = response.cleared;
    			// Don't show the content of the tabIndex=4 (pisDetails) id the job is cleared
    			if((Number($stateParams.tabIndex) > 4 ) || ((Number($stateParams.tabIndex) === 4) && vm.cleared)) {
    				$stateParams.tabIndex = 0;
    			}
    			setSelectedTabIndex($stateParams.tabIndex);
    		}, errorCallback);
    	} else {
    		$log.debug('--$stateParams.tabIndex undefined');
    		getContent('inputData');
    	}

    	//---------------------Methods Implementation details
        function errorCallback(response) {
            $log.debug('Server response: ' + JSON.stringify(response));
            vm.error = response.data.code + ': ' + response.data.error;
            AlertService.showAlert('error', vm.error);
        }

        //-------getDuration()
        function getDuration(startDate, endDate) {
            try {
                var start    = moment(startDate, moment.ISO_8601),
                    end      = moment(endDate,   moment.ISO_8601);
                //$log.debug('endDate - startDate: ' + end + ' - ' + start + ' --> ' + (end - start));

                var duration = moment.duration(end - start);
                var mm = (duration.months() > 0) ? duration.months() + 'Monat(e) ' : '',
                    dd = (duration.days() > 0)   ? duration.days()   + 'Tag(e) ' : '';

                return mm + dd + duration.hours() + ':' + duration.minutes() + ':' + duration.seconds();
            } catch (e) {
                return 'Die Dauer kann nicht berechnet.';
            }
        }

      //----Open confirm approve/abandon modal
      function openConfirmDialog(action, clearanceId) {
            vm.message = '';
            vm.error = '';
            // Appending dialog to document.body
		    var confirm = $mdDialog.confirm()
		          .title(messages[action].title)
		          .textContent(messages[action].message)
		          .ariaLabel(messages[action].title)
		          //.targetEvent(ev)
		          .clickOutsideToClose(true)
		          .parent(angular.element(document.body))
		          .ok(messages[action].confirmButton)
		          .cancel('Abbrechen');

		    $mdDialog.show(confirm).then(function() {
		    	$log.debug('Sie wollen den ' + messages[action].title);
		    	//...
		    	msApi.request('clearances@update', {urlSuffix: action, jobInstanceId: clearanceId}, function(response) {
					$log.debug('Server response: ' + JSON.stringify(response));
					vm.message = response.message;
					AlertService.showAlert('success', vm.message);
					$mdDialog.hide({message: vm.message, error: vm.error});
				},
				function(response) {
					$log.debug('Server response: ' + JSON.stringify(response));
					vm.error = response.data.code + ': ' + response.data.error;
					AlertService.showAlert('error', vm.error);
				});

		    	vm.statistics.inputData.data.cleared = true;
				vm.cleared = true;
		    }, function() {
		    	$log.debug('Sie wollen abbrechen');
		    });
        }

        //-------approve()
        function approve() {
            $log.debug('approve() ' + $stateParams.clearanceId);
    		openConfirmDialog('approve', $stateParams.clearanceId);
    	}
        //-------abandon()
    	function abandon() {
            $log.debug('abandon() ' + $stateParams.clearanceId);
    		openConfirmDialog('abandon', $stateParams.clearanceId);
    	}

        //-------examineProtocol()
        function examineProtocol() {
            $log.debug('examineProtocol() Job ID: ' + $stateParams.clearanceId);
            msApi.request('jobs@getProtocolFile', {urlSuffix: 'protocolfile', jobInstanceId: $stateParams.clearanceId}, function(data) {

    		    vm.protocolFileError   = '';
    			vm.protocolFileURL     = URL.createObjectURL(data.response);
                vm.protocolFileContent = $sce.trustAsResourceUrl(vm.protocolFileURL);
    			$log.debug('ProtocolFile URL: ' + vm.protocolFileURL);

            }, function(data) {
                $log.debug('Server response: ' + JSON.stringify(data));
    			if(data.status === 404) { // NetworkError: 404 Not Found
    				vm.protocolFileError = 'EC_FE_004: Auf das Protokoll-File kann nicht zugegriffen werden';
    			}
    			//vm.protocolFileError = data.data.code + ': ' + data.data.error;
            });
        }

    	//-------getContent()
        function getContent(tabName) {
            $log.debug('getContent() for tabName: ' + tabName);

    		if((tabName === 'pisStatistics') && (vm.pisStatisticsParameters && (vm.pisStatisticsParameters.length === 0))) {
    			vm.statistics.pisStatistics.pisStatisticsError = REPORT_VALUES_PI_STATISTICS_ERROR;
    		}
    		if(!$stateParams.tabIndex) {
    			$log.debug('$stateParams.tabIndex is unknown: ' + $stateParams.tabIndex);

    			//----Ask if the Job is cleared or not to determine if the pisDetails tab should be displayed or not
    			msApi.request('clearances@isCleared', {urlSuffix: 'cleared', jobInstanceId: $stateParams.clearanceId}, function(response) {
    				$log.debug('Job cleared = ' + JSON.stringify(response));
    				vm.cleared = response.cleared;

    				if((tabName !== 'pisDetails') || (tabName === 'pisDetails') && !vm.cleared) {
    					$log.debug('(tabName !== "pisDetails") || (tabName === "pisDetails") && !vm.cleared');
    					getTabContent(tabName);
    				}
    			}, errorCallback);
    		} else {
    			getTabContent(tabName);
    		}
        }

        //-------getNextPI()
        function getNextPI() {
            var index = 0;//vm.statistics.pisStatistics.selectedPortfolio.performanceIndicators.length - 1; // to get the last element in the array
            if(vm.statistics.pisStatistics.selectedPiIndex &&
                    (vm.statistics.pisStatistics.selectedPiIndex > -1) &&
                    (vm.statistics.pisStatistics.selectedPiIndex < vm.statistics.pisStatistics.selectedPortfolio.performanceIndicators.length)) {
                index = ++vm.statistics.pisStatistics.selectedPiIndex;
            }
    		if(index === vm.statistics.pisStatistics.selectedPortfolio.performanceIndicators.length) {
    			--vm.statistics.pisStatistics.selectedPiIndex;
    			 //index = 0;
    		}
            else if((index > -1) && (index < vm.statistics.pisStatistics.selectedPortfolio.performanceIndicators.length)) {
    			$log.debug('NextPI index: '+ index);
    			vm.statistics.pisStatistics.selectedPiIndex = index;
                vm.setSelectedItem(index, 'pi', 'pisStatistics');
            }
        }

        //-------getPreviousPI()
        function getPreviousPI() {
            var index = 0; // to get the first element in the array
            if(vm.statistics.pisStatistics.selectedPiIndex &&
                    (vm.statistics.pisStatistics.selectedPiIndex > -1) &&
                    (vm.statistics.pisStatistics.selectedPiIndex < vm.statistics.pisStatistics.selectedPortfolio.performanceIndicators.length)) {
                index = --vm.statistics.pisStatistics.selectedPiIndex;
            }
   		 if(index === -1) {
   			 ++vm.statistics.pisStatistics.selectedPiIndex;
   			 //index = vm.statistics.pisStatistics.selectedPortfolio.performanceIndicators.length - 1;
   		 }
   		 else if((index > -1) && (index < vm.statistics.pisStatistics.selectedPortfolio.performanceIndicators.length)) {
   			 $log.debug('PreviousPI index: '+ index);
   			 vm.statistics.pisStatistics.selectedPiIndex = index;
                vm.setSelectedItem(index, 'pi', 'pisStatistics');
            }
        }

        //-------getPiHistory()
        function getPiHistory(index, tabName) {

            vm.statistics[tabName].selectedPI.history = [];
    		vm.statistics[tabName].selectedPI.history.message = '';
            var data = {performanceIndicatorId: vm.statistics[tabName].selectedPI.id, valueSpecShortcut: vm.statistics[tabName].selectedVS.shortcut};

            msApi.request('pi@getHistorical', data, function(response) { //{urlSuffix: 'historical'}
     
                $log.debug('PI ' + index + ' has ' + response.length + ' history');
                vm.statistics[tabName].selectedPI.history = response;
                $log.debug('Selected PI with history: ' + JSON.stringify(vm.statistics[tabName].selectedPI));

    			if(response && (response.length > 0)) {
    				// Data for Charts
    				if(!vm.pisStatisticsParameters) {
    					$log.debug('----> pisStatisticsParameters: ' + JSON.stringify(vm.pisStatisticsParameters));
    					vm.pisStatisticsParameters = DEFAULT_PIS_STATISTICS_PARAMETERS;
    				}

    				vm.statistics[tabName].selectedPI.history.options = chartOptions;
    				var unitType = '';
    			    angular.forEach(vm.statistics[tabName].selectedPI.history, function(hist) {
    				    unitType = hist.unitType;
    			    });
    				vm.statistics[tabName].selectedPI.history.options.title.text = unitType;
    				vm.statistics[tabName].selectedPI.history.data               = {};

    				angular.forEach(vm.pisStatisticsParameters, function(pisStatisticsParameter) {
    					vm.statistics[tabName].selectedPI.history.data[pisStatisticsParameter] = [{key:'Statistik ' + pisStatisticsParameter, values:[]}]; // values: {2:[], 6:[], 12:[]};
    				});

    				angular.forEach(vm.statistics[tabName].selectedPI.history, function(history) {
    					$log.debug('history for ' + history.balancingMonth + '/' + history.balancingYear);

    					angular.forEach(vm.pisStatisticsParameters, function(pisStatisticsParameter) {
    						$log.debug('pisStatisticsParameter: ' + pisStatisticsParameter);
    						if(vm.statistics[tabName].selectedPI.history.data[pisStatisticsParameter][0].values.length < pisStatisticsParameter) {

    							vm.statistics[tabName].selectedPI.history.data[pisStatisticsParameter][0].values.push({
    								label: history.balancingMonth + '/' + history.balancingYear,
    								value: history.value,
    								name:  history.balancingMonth + '/' + history.balancingYear
    							});
    						}
    					});
    				});
    				angular.forEach(vm.pisStatisticsParameters, function(pisStatisticsParameter) {
    					$log.debug('history.data.' + pisStatisticsParameter + ': ' + JSON.stringify(vm.statistics[tabName].selectedPI.history.data[pisStatisticsParameter][0].values));
    					vm.statistics[tabName].selectedPI.history.data[pisStatisticsParameter][0].values.reverse();
    				});
    			} else {
    				var pi = vm.statistics[tabName].selectedPI;
    				vm.statistics[tabName].selectedPI.history.message = 'Kennzahl ' + pi.name + ' hat keine Statistiken für Ergebniswert ' + pi.valueSpecs[0].name +'.';
    			}
            }, errorCallback);
        }

        //--calculate percent
    	function getPercent(number, total) {
            var per = number * 100 / total;
            return $filter('number')(per, 2);
        }

        //--calculate percent for Portfolios
    	function getPercentPotfolio(number) {
            var total = vm.statistics.pisOverview.data.countPortfolioWithoutSubsidizedHardware +
                        vm.statistics.pisOverview.data.countPortfolioWithSubsidizedHardware +
                        vm.statistics.pisOverview.data.countErrors;
            return getPercent(number, total);
        }

        function getSum(array, column) {
            var sum = 0;
            angular.forEach(array, function(entry) {
                sum += entry[column];
            });
            return sum;
        }

        //-------getTabContent()
        function getTabContent(tabName) {
    		//----Get the statistics for the appropriate job-details tab
            msApi.request('statistics@getStatistics', {urlSuffix: vm.statistics[tabName].urlSuffix, jobInstanceId: $stateParams.clearanceId}, function(response) {

                //$log.debug(tabName + ' Statistics: ' + JSON.stringify(response));
                vm.statistics[tabName].data = response;

    			if(tabName === 'inputData') { // format the values
    				vm.statistics[tabName].data.countTotal             = localeDE.numberFormat(',.0f')(vm.statistics[tabName].data.countTotal);
    				vm.statistics[tabName].data.countPortfolioWithSubsidizedHardware    = localeDE.numberFormat(',.0f')(vm.statistics[tabName].data.countPortfolioWithSubsidizedHardware);
    				vm.statistics[tabName].data.countPortfolioWithoutSubsidizedHardware = localeDE.numberFormat(',.0f')(vm.statistics[tabName].data.countPortfolioWithoutSubsidizedHardware);
    				vm.statistics[tabName].data.countPortfolioPostpaid = localeDE.numberFormat(',.0f')(vm.statistics[tabName].data.countPortfolioPostpaid);
    				vm.statistics[tabName].data.countNonMea            = localeDE.numberFormat(',.0f')(vm.statistics[tabName].data.countNonMea);
    			}
    			if(tabName === 'pisOverview') { // format the values
    				vm.statistics[tabName].data.countPortfolioWithoutSubsidizedHardware = localeDE.numberFormat(',.0f')(vm.statistics[tabName].data.countPortfolioWithoutSubsidizedHardware);
    				vm.statistics[tabName].data.countPortfolioWithSubsidizedHardware    = localeDE.numberFormat(',.0f')(vm.statistics[tabName].data.countPortfolioWithSubsidizedHardware);
    				vm.statistics[tabName].data.countErrors                             = localeDE.numberFormat(',.0f')(vm.statistics[tabName].data.countErrors);
    			}
                prepareTabData(tabName);
            },
            function(response) {
                $log.debug('Server response: ' + JSON.stringify(response));
                if((tabName === 'pisStatistics') && (response.data.code === 'WC_FE_001')) { // Simulationslauf hat keine Statistiken
                    vm.statistics.pisStatistics.pisStatisticsError = response.data.code + ': ' + response.data.error;
                } else {
                    vm.error = response.data.code + ': ' + response.data.error;
                    AlertService.showAlert('error', vm.error);
                }
            });
    	}

        //-------isUnitOrFormattedValue()
        function isUnitOrFormattedValue(columnName) {
            var bool = (columnName === 'monetaryUnitType')             || (columnName === 'monetaryValueFormatted') ||
                       (columnName === 'itemCountUnitType')            || (columnName === 'itemCountValueFormatted') ||
                       (columnName === 'contractCountUnitType')        || (columnName === 'contractCountValueFormatted') ||
                       (columnName === 'percentOfTotalAmountUnitType') || (columnName === 'percentOfTotalAmountValueFormatted') ||
                       (columnName === 'percentOfTotalCountUnitType')  || (columnName === 'percentOfTotalCountValueFormatted') ||
                       (columnName === 'baseQuantityUnitType')         || (columnName === 'baseQuantityValueFormatted') ||
                       (columnName === 'baseQuantityMonUnitType')      || (columnName === 'baseQuantityMonValueFormatted') ||
                       (columnName === 'averageMonUnitType')           || (columnName === 'averageMonValueFormatted');
            //$log.debug(columnName + ' isUnitOrFormattedValue: ' + bool);
            return bool;
        }

        //-------isValue()
    	function isValue(columnName) {
            var bool = (columnName === 'monetaryValue')            || (columnName === 'itemCountValue') ||
                       (columnName === 'contractCountValue')       || (columnName === 'percentOfTotalAmountValue') ||
                       (columnName === 'percentOfTotalCountValue') || (columnName === 'baseQuantityValue') ||
                       (columnName === 'baseQuantityMonValue')     || (columnName === 'averageMonValue');
            //$log.debug(columnName + ' isValue: ' + bool);
            return bool;
        }

        //-------prepareTabData
        function prepareTabData(tabName) {
            if(tabName === 'inputData') {
                // Ausgeschlossene Verträge wegen Fehlende MEA--Relevanz
    			vm.statistics.inputData.bookingRelevancesOptions = {
    				chart: {
    					type: 'pieChart',
    					height: 500,
    					x: function(d){return d.key;},
    					y: function(d){
    						var percent = d.y * 100/d.total;
    						return ((percent < 0.5) ? (d.total * 0.005) : d.y); //--> return 0.5% of the circle if d.y represents < 0.5% of it
    					},
    					showLabels: false,
    					duration: 500,
    					labelThreshold: 0.00001,
    					labelSunbeamLayout: true,
    					legend: { maxKeyLength: 100 },
    					tooltip: {
    						contentGenerator: function (e) {
    							//$log.debug('tooltip for: ' + JSON.stringify(e));
    							var series = e.series[0];
    							if (series.value === null) { return; }
    								return  '<table>' +
    											'<tbody>' + 
    												'<tr>' +
    													'<td class="legend-color-guide"><div style="background-color: ' + series.color + ';"></div></td>' +
    													'<td class="key">' + e.data.key + '</td>' +
    													'<td class="x-value"><strong>' + localeDE.numberFormat(',.0f')(e.data.y) + '</strong></td>' + 
    													'<td class="x-value"><strong>' + localeDE.numberFormat('.2f')(e.data.y * 100/e.data.total) + '%</strong></td>' +
    												'</tr>' +
    											'</tbody>' +
    										'</table>';
    						}
    					}
    				}
    			};
    			vm.totalBookingRelevances = vm.getSum(vm.statistics.inputData.data.irrelevantReasons, 'counter');
    			vm.statistics.inputData.bookingRelevancesData = [];

                angular.forEach(vm.statistics.inputData.data.irrelevantReasons, function(irrelevantReason) {
    				vm.statistics.inputData.bookingRelevancesData.push({key: irrelevantReason.name, y: irrelevantReason.counter, total: vm.totalBookingRelevances});
    				irrelevantReason.counter = localeDE.numberFormat(',.0f')(irrelevantReason.counter);
                });
    			vm.totalBookingRelevances = localeDE.numberFormat(',.0f')(vm.totalBookingRelevances);

                // Buchungsrelevante Verträge, gruppiert nach Portfoliozuordnungs-Grund
    			vm.totalPortfolioRelevances = vm.getSum(vm.statistics.inputData.data.relevantReasons, 'counter');
    			vm.statistics.inputData.portfolioRelevancesOptions = vm.statistics.inputData.bookingRelevancesOptions;
    			vm.statistics.inputData.portfolioRelevancesData = [];

                angular.forEach(vm.statistics.inputData.data.relevantReasons, function(relevantReason) {
    				vm.statistics.inputData.portfolioRelevancesData.push({key: relevantReason.name, y: relevantReason.counter, total: vm.totalPortfolioRelevances});
    				relevantReason.counter = localeDE.numberFormat(',.0f')(relevantReason.counter);
                });
    			vm.totalPortfolioRelevances = localeDE.numberFormat(',.0f')(vm.totalPortfolioRelevances);
            }
        }

        //-------safePush()
        function safePush(array, item) {
            if (item && (array.indexOf(item) === -1)) { // if item is not empty and array does not contain item
                array.push(item);
            }
        }

        //-------setSelectedItem()
    	function setSelectedItem(index, type, tabName) { // type = 'cf'|'pi'		//save the selected item

            $log.debug('Selected Item index: '+ index);
            if(type === 'vs') { // vs = valueSpecifications is selected in the 'pisStatistics' tab

                vm.statistics[tabName].selectedVS = vm.statistics[tabName].selectedPI.valueSpecs[index];
                $log.debug('Selected VS: '+ JSON.stringify(vm.statistics[tabName].selectedVS));

                if(tabName === 'pisStatistics') {
                    getPiHistory(index, tabName);
                }
            } else
            if(type === 'pi') { // pi = a Performance Indicator is selected
                vm.statistics[tabName].selectedPI = vm.statistics[tabName].selectedPortfolio.performanceIndicators[index];
                $log.debug('Selected PI: '+ JSON.stringify(vm.statistics[tabName].selectedPI));

                if(tabName === 'pisStatistics') {
    			    vm.statistics[tabName].selectedVsIndex = 0; // Initialize the selected valueSpecification with the first one
    				vm.setSelectedItem(0, 'vs', 'pisStatistics');

                } else if(tabName === 'pisDetails') {
                    // Data for Filter Form
                    vm.searchQuery = {};
                    vm.statistics[tabName].selectedPI.businessInteractions = [];
                    vm.statistics[tabName].selectedPI.salesChannels        = [];
                    vm.statistics[tabName].selectedPI.networks             = [];
                    vm.statistics[tabName].selectedPI.formattedValues      = [];

                    msApi.request('pi@get', {urlSuffix: 'details', performanceIndicatorId: vm.statistics[tabName].selectedPI.id}, function(response) {

                        vm.statistics[tabName].selectedPI.details = response;
                        vm.statistics.pisDetails.columns = [];
                        angular.forEach(vm.statistics[tabName].selectedPI.details[0], function(value, key) {
                            $log.debug('key: ' + JSON.stringify(key));
                            $log.debug('value: ' + JSON.stringify(value));
                            vm.statistics.pisDetails.columns.push(key);
                        });
                        $log.debug('pisDetails.header: ' + JSON.stringify(vm.statistics.pisDetails.columns));
                        $log.debug('Selected PI with details: ' + JSON.stringify(vm.statistics[tabName].selectedPI.details));

                        // Data for Filter Form
                        angular.forEach(vm.statistics[tabName].selectedPI.details, function(detail) {
                            safePush(vm.statistics[tabName].selectedPI.businessInteractions, detail.businessInteraction);
                            safePush(vm.statistics[tabName].selectedPI.salesChannels, detail.salesChannel);
                            safePush(vm.statistics[tabName].selectedPI.networks, detail.networkOperator);
                            safePush(vm.statistics[tabName].selectedPI.formattedValues, detail.formattedValue);
                        });
                    }, errorCallback);
                }
            } else
                if(type === 'cf') { // cf = a Correction Function is selected

    				vm.statistics.pisDetails.selectedPI.details = [];
                    vm.query = {order: 'businessInteraction', limit: 10, page: 1};

    				// Remove all performanceIndicators & quotes from selectedPortfolio
    				vm.statistics.billenginePis.selectedPortfolio.pisOptions = chartOptions;

    				vm.statistics.billenginePis.selectedPortfolio.pisData    = [{key:'Pro Portfolio', values:[]}];
    			    vm.statistics.billenginePis.selectedPortfolio.pisFormattedValues = [];
    			    vm.statistics.billenginePis.selectedPortfolio.quotes             = [];

    				// CorrectionFunction: shortcut, name, performanceIndicators, quotes
                    vm.statistics.billenginePis.selectedCorrectionFunction = {};
                    vm.statistics.billenginePis.selectedCorrectionFunction = vm.statistics.billenginePis.selectedPortfolio.correctionFunctions[index];

    				var unitType = '';
    			    angular.forEach(vm.statistics.billenginePis.selectedCorrectionFunction.performanceIndicators, function(pi) {
    				    unitType = pi.unitType;
    			    });
    				vm.statistics.billenginePis.selectedCorrectionFunction.pisOptions = chartOptions;
    				vm.statistics.billenginePis.selectedCorrectionFunction.pisOptions.title.text = unitType;

    				vm.statistics.billenginePis.selectedCorrectionFunction.pisData = [{key:'Pro Korrektur Funktion', values:[]}];
    				vm.statistics.billenginePis.selectedCorrectionFunction.pisFormattedValues = [];

                    // Data for Chart
                    angular.forEach(vm.statistics.billenginePis.selectedCorrectionFunction.performanceIndicators, function(pi) {

    					vm.statistics.billenginePis.selectedCorrectionFunction.pisData[0].values.push({label: pi.shortcut, value: pi.value, name: pi.name});
    					vm.statistics.billenginePis.selectedCorrectionFunction.pisFormattedValues.push(pi.formattedValue);
                    });
    				delete vm.statistics.billenginePis.selectedCorrectionFunction.performanceIndicators;
                    $log.debug('Selected CorrectionFunction: '+ JSON.stringify(vm.statistics.billenginePis.selectedCorrectionFunction));
                }
        }

        //-------setSelectedPortfolio()
        function setSelectedPortfolio(portfolio, tabName) { //save the selected portfolio

    	    // set the selected Portfolio
            vm.statistics[tabName].selectedPortfolio = portfolio;
            $log.debug('Selected Portfolio in ' + tabName + ': ' + portfolio.name);

            if(tabName === 'billenginePis') {
    			//vm.statistics[tabName].selectedPortfolio = {name: portfolio.name, shortcut: portfolio.shortcut};--> in this case the KorrekturFunktion selectBox will be empty!!!
                vm.statistics[tabName].selectedCorrectionFunction = {};

                //--vm.statistics.pisDetails.selectedPI.details = [];
                //--vm.query = {order: 'businessInteraction', limit: 10, page: 1};

                // Set Performance Indicators & Quotes
    			vm.statistics.billenginePis.selectedPortfolio.pisOptions = chartOptions;
    			var unitType = '';
    			angular.forEach(portfolio.correctionFunctions, function(correctionFunction) {
    				angular.forEach(correctionFunction.performanceIndicators, function(pi) {
    					unitType = pi.unitType;
    				});
    			});
    			vm.statistics.billenginePis.selectedPortfolio.pisOptions.title.text = unitType;
    			vm.statistics.billenginePis.selectedPortfolio.pisData    = [{key:'Pro Portfolio', values:[]}];

                vm.statistics.billenginePis.selectedPortfolio.pisFormattedValues = [];
    			vm.statistics.billenginePis.selectedPortfolio.quotes             = [];

                // Data for Chart
                angular.forEach(portfolio.correctionFunctions, function(cf) {

    				angular.forEach(cf.performanceIndicators, function(pi) {
    					var filteredEntries = [];
    					filteredEntries = $filter('filter')(vm.statistics.billenginePis.selectedPortfolio.pisData[0].values, function(entry) {
    						return (entry.name === pi.name);
    					});
    					if (filteredEntries.length === 0) { // pi.name does not exist in vm.statistics.billenginePis.selectedPortfolio.pisData
    						vm.statistics.billenginePis.selectedPortfolio.pisData[0].values.push({label: pi.shortcut, value: pi.value, name: pi.name});
                            vm.statistics.billenginePis.selectedPortfolio.pisFormattedValues.push(pi.formattedValue);
    					} else {
    						$log.debug('--Item exists in pisData[]: ' + pi.name);
    					}
    				});
    				angular.forEach(cf.quotes, function(quote) {
    					vm.statistics.billenginePis.selectedPortfolio.quotes = $filter('filter')(vm.statistics.billenginePis.selectedPortfolio.quotes, function(entry) {
    						if(entry.shortcut === quote.shortcut) {
    							$log.debug('--Item exists in quotes[]: ' + JSON.stringify(quote));
    							return false;
    						} else {
    							return true;
    						}
    					});
    					vm.statistics.billenginePis.selectedPortfolio.quotes.push(quote);
    				});
                });
    			//$log.debug('statistics.billenginePis.selectedPortfolio.pisData: ' + JSON.stringify(vm.statistics.billenginePis.selectedPortfolio.pisData[0].values));
    			//$log.debug('statistics.billenginePis.selectedPortfolio.quotes: ' + JSON.stringify(vm.statistics.billenginePis.selectedPortfolio.quotes));
            }

            if(tabName === 'pisStatistics') {
                vm.statistics[tabName].selectedPI.history = [];
    			vm.statistics[tabName].selectedPI.history.message = '';
            }
            if(tabName === 'pisDetails') {
                vm.statistics[tabName].selectedPI.details = [];
            }
            if(tabName === 'pisOverview') {
    			vm.statistics[tabName].primaryPisOptions = chartOptions;
    			var unitType = '';
    			angular.forEach(portfolio.primaryPis, function(primaryPi) {
    				unitType = primaryPi.unitType;
    			});
    			vm.statistics[tabName].primaryPisOptions.title.text = unitType;

    			vm.statistics[tabName].primaryPisData      = [{key:'Primären Kennzahlen', values:[]}];
                vm.statistics[tabName].secondaryPisData    = [{key:'Sekundären Kennzahlen', values:[]}];
    			vm.statistics[tabName].secondaryPisOptions = vm.statistics[tabName].primaryPisOptions;
    			var unitType2 = '';
    			angular.forEach(portfolio.secondaryPis, function(secondaryPi) {
    				unitType2 = secondaryPi.unitType;
    			});
    			vm.statistics[tabName].secondaryPisOptions.title.text = unitType2;

                angular.forEach(portfolio.primaryPis, function(primaryPi) {
    				vm.statistics[tabName].primaryPisData[0].values.push({label: primaryPi.shortcut, value: primaryPi.value, name: primaryPi.name});
                });
                angular.forEach(portfolio.secondaryPis, function(secondaryPi) {
    				vm.statistics[tabName].secondaryPisData[0].values.push({label: secondaryPi.shortcut, value: secondaryPi.value, name: secondaryPi.name});
                });
                $log.debug('vm.statistics.pisOverview.primaryPisData: ' + JSON.stringify(vm.statistics[tabName].primaryPisData[0].values));
                $log.debug('vm.statistics.pisOverview.secondaryPisData: ' + JSON.stringify(vm.statistics[tabName].secondaryPisData[0].values));
            }
        }

        //-------setSelectedTabIndex()
        function setSelectedTabIndex(tabIndex) {
            vm.statistics.selectedTabIndex = (tabIndex && (tabIndex >= 0 && tabIndex <= 4)) ? tabIndex : 0;
            vm.statistics.selectedTabIndex = tabIndex;
            $log.debug('Tabs selectedIndex: ' + vm.statistics.selectedTabIndex);

            // determine the name of the Tab with the index 'tabIndex'
            angular.forEach(vm.statistics, function(value, key) { // key is the tabName
                //$log.debug('key: ' + key + ' - value: ' + JSON.stringify(value));
                if((tabIndex - value.index) === 0) {
                    getContent(key);
                }
            });
        }

       	//--------------------------------Pagination for the pis-details tab
    	function onPaginate(page, limit) {
    		$log.debug('Scope Page: ' + vm.query.page + ' Scope Limit: ' + vm.query.limit);
    		$log.debug('Page: ' + page + ' Limit: ' + limit);
    	    vm.promise = $timeout(function () {}, 2000);
    	}

    	function deselect(item) {
    		$log.debug(item.jobInstanceId, 'was deselected');
    	}

    	function log(item) {
    		$log.debug(item.jobInstanceId, 'was selected');
    	}

    	function loadStuff() {
    	    vm.promise = $timeout(function () {}, 2000);
        }

        function onReorder(order) {
        	$log.debug('Scope Order: ' + vm.query.order);
        	$log.debug('Order: ' + order);
    	    vm.promise = $timeout(function () {}, 2000);
    	}
    }
})();
