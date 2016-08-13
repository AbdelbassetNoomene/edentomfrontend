(function ()
{
    'use strict';

    angular.module('app.scanagent')
           .controller('PricesListScanAgentController', PricesListScanAgentController);

    /** @ngInject */
    function PricesListScanAgentController($document, $log, $mdDialog, $rootScope, $scope, $state, $window)
    {
          // Data
          var vm                      = this;
          var PRICES_LIST_SCANAGENT_STATE = 'app.home.prices-list-scanagent';
          //vm.checkLoginRequired       = checkLoginRequired;
          vm.distance                 = '';
          vm.down1 = '1-1DOWN';
          vm.down2 = '2-1DOWN';
          vm.down3 = '3-1DOWN';  
          vm.error                    = '';
          vm.message                  = '';
          vm.onStateUrl    = '../assets/images/teeth/selected/'; //folder contain list of teeth blue color
          vm.offStateUrl   = '../assets/images/teeth/unselected/'; //folder contain list of teeth white color
          vm.pricesList               = {
        		  tariffs: [{
        			      name:      'tariff-by-scan-operation',
	        			  title:     'Tariff by scan operation',
	        		      translate: 'PRICE_LIST.TARIFF_BY_SCAN_OPERATION',
	        		      template:  'tariff-by-operation.html',
	        		      expanded:  false,
	        		      selected:  false
	        		  }, {
	        			  name:      'tariff-by-quadrant',
	        		      title:     'Tariff by Quadrant',
	        		      translate: 'PRICE_LIST.TARIFF_BY_QUADRANT',
	        		      template:  'tariff-by-quadrant.html',
	        		      expanded:  false,
	        		      selected:  false
	        		  }, {
	        			  name:      'tariff-by-full-kiefer',
	        		      title:     'Tariff by Full Kiefer',
	          		      translate: 'PRICE_LIST.TARIFF_BY_ENTIRE_KIEFER',
	          		      template:  'tariff-by-entire-kiefer.html',
	        		      expanded:  false,
	        		      selected:  false
	        		  }
        		  ],
        		  selectedTariffs: []
          }; 
          vm.availability             = [
                           {
                             'available': true,
                             'icon' :     'icon-checkbox-marked-circle',
                             'color':     '#4CAF50'
                           },{
                             'available': false,
                             'icon' :     'icon-checkbox-blank-circle-outline',
                             'color':     '#616161'
                          }];
          vm.selectedScanagent        = JSON.parse($window.sessionStorage.getItem('selectedScanagent'));
          //$window.sessionStorage.removeItem('selectedScanagent');
          vm.scanAgents               = [];
          vm.scanAgentIds             = [];
          //vm.showAwardContract        = true;
          vm.stepper = {
              step1: {scanAgent: 'Steve', Adresse: 'testAdd'},
              step2: {test1: 'test1', test2: 'test2'},
              step3: {test3: 'test3', test4: 'test4'},
              step4: {test5: 'test5', test6: 'test6'}
          };
          vm.selected                 = [];
          vm.up1   = '1-1UP';
          vm.up2   = '2-1UP';
          vm.up3   = '3-1UP';

          $rootScope.teethOperation = {
                                        veneer : {
                                            typeOperation  : 'veneer',
                                            teethList      : [],
                                            antagonistList : [],
                                            price          : {
                                                abform     : 18,
                                                biregister : 4,
                                                archivage  : 0.50
                                            } 
                                        },
                                        krone : {
                                            typeOperation  : 'krone',
                                            teethList      : [],
                                            antagonistList : [],
                                            price          : {
                                                abform     : 20,
                                                biregister : 'inklusive',
                                                archivage  : 1
                                            } 
                                        },
                                        bridge : {
                                            typeOperation  : 'bridge',
                                            teethList      : [
                                                  {
                                                    toothNumber:'', coreList:[]
                                                  }
                                            ],
                                            antagonistList : [],
                                            price          : {
                                                abform     : 25,
                                                biregister : 4,
                                                archivage  : 0.50
                                            }, 
                                        },
                                        inOnlay : {
                                            typeOperation  : 'inOnlay',
                                            teethList      : [],
                                            antagonistList : [],
                                            price          : {
                                                abform     : 15,
                                                biregister : 'inklusive',
                                                archivage  : 1
                                            } 
                                        },
                                        implantat : {
                                            typeOperation  : 'implantat',
                                            teethList      : [],
                                            antagonistList : [],
                                            price          : {
                                                abform     : 30,
                                                biregister : 4,
                                                archivage  : 'inklusive'
                                            } 
                                        }
          }; 

          // Methods
          vm.exists                   = exists;
          vm.setAvailability          = setAvailability;
          vm.selectTooth              = selectTooth;
          vm.submitStepper            = submitStepper;
          vm.selectItem               = selectItem;
          vm.toggleItem               = toggleItem;

        //----------------Implementation details
        if(($state.current.name === PRICES_LIST_SCANAGENT_STATE)) { // we are on the 'prices-list-scanagent' view

            vm.selectedScanagent = JSON.parse($window.sessionStorage.getItem('selectedScanagent'));
            //$log.debug('--Scanagent in Prices list state: ' + JSON.stringify(vm.selectedScanagent));
        }

        /*function checkLoginRequired() {
        	if($rootScope.user && $rootScope.user.userName) {
        		vm.showAwardContract = true;
        	}
        }*/

        /**
         * Select tooth & Open chooser-operation dialog
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

                $mdDialog.show({
                    controller         : 'OperationDialogController',
                    controllerAs       : 'vm',
                    templateUrl        : 'app/main/scanagent/views/operation-dialog/operation-dialog.html',
                    parent             : angular.element($document.body),
                    targetEvent        : event,
                    clickOutsideToClose: true,
                    locals: { 
                        toothNumber: toothNumber 
                    } 
                });
            }
            else if (stateTooth === 'on') 
            {
                $(event.currentTarget).attr('status','off');
                $(event.currentTarget).attr('src',vm.offStateUrl +toothNumber +'.png' );
            } 

            $log.debug('event.currentTarget).attr(status): ' + JSON.stringify($(event.currentTarget).attr('status')));
        }

        function setAvailability(entries) {
            angular.forEach(entries, function(entry, key) {
                entry.availabilityStatus = entry.availability ? vm.availability[0] : vm.availability[1]; //TODO: work in progress
            });
        }



         function errorCallback(response) {
            $log.debug('Server response: ' + JSON.stringify(response));
            vm.error = response.data.code + ': ' + response.data.error;
        }

        /**
         * Submit stepper form
         *
         * @param ev
         */
        function submitStepper(ev)
        {
            //vm.showAwardContract = false;
            // You can do an API call here to send the form to your server

            // Show the sent data.. you can delete this safely.
            $mdDialog.show({
                controller: function ($scope, $mdDialog, formWizardData)
                {
                    $scope.formWizardData = formWizardData;
                    $scope.closeDialog = function ()
                    {
                        $mdDialog.hide();
                    };
                },
                template: '<md-dialog>' +
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
            })/*.then(function (result) {
			    $log.debug('Close dialog: Ok');
			    $mdDialog.hide();
    	    }, function () {
    		    $log.debug('Close dialog: Cancel');
    		    $mdDialog.cancel();
    		})*/;

            // Reset the form model
            vm.stepper = {
                step1: {},
                step2: {},
                step3: {}
            };
        }

        function exists(item, selectedList) {
            return selectedList.indexOf(item) > -1;
        }

        function selectItem(item, selectedList, maxSelect) {
        	//$log.debug('selectedList.indexOf(item): ' + selectedList.indexOf(item));
        	var index;
            // Only 1 select is allowed, if a second one is selected, the first one will be automatic deselected
        	if((Number(maxSelect) === 1) && (selectedList.length === Number(maxSelect)) && (selectedList.indexOf(item) < 0)) {
            	$log.debug('click on an item that is already selected --> deselect this item');
                index = selectedList.indexOf(selectedList[0]);
                selectedList.splice(index, 1);
            }
            if((selectedList.length < Number(maxSelect)) || (selectedList.indexOf(item) > -1)) { // select more than maxSelect items is not allowed

                index = selectedList.indexOf(item);
                if (index > -1) {
                	$log.debug('Deselect item: ' + item);
                    selectedList.splice(index, 1);
                } else {
                	$log.debug('Select item: ' + item);
                    selectedList.push(item);
                }
            }

			if((item.selected === true) || (item.selected === false)) { // if item.selected is already defined
				item.selected = !item.selected;
			}
			$log.debug('selectedList after selectItem(): ' + JSON.stringify(selectedList));
        }

        function toggleItem(item) {
			if((item.expanded === true) || (item.expanded === false)) { // if item.expanded is already defined
				item.expanded = !item.expanded;
			}
        }
    }
})();
