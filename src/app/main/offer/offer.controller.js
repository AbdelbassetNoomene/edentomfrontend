(function ()
{
    'use strict';

    angular
        .module('app.offer')
        .controller('OfferController', OfferController);

    /** @ngInject */
    function OfferController($mdDialog, $log, $timeout, $rootScope, msApi)
      {
          var vm                   = this;

          // Data
          vm.archiving  = {
                    prices: [{
                            name:      'archiving-tooth',
                            title:     'Price by Tooth',
                            translate: 'OFFER.PRICE_BY_TOOTH',
                            template:  'archiving-tooth.html',
                            expanded:  false,
                            selected:  false
                        }, {
                            name:      'archiving-quadrant',
                            title:     'Price by Quadrant',
                            translate: 'OFFER.PRICE_BY_QUADRANT',
                            template:  'archiving-quadrant.html',
                            expanded:  false,
                            selected:  false
                        }
                    ],
                    selectedTariffs: []
          };
          vm.electronicImpression  = {
                    tariffs: [{
                            name:      'impression',
                            title:     'Impression',
                            translate: 'OFFER.IMPRESSION',
                            template:  'impression.html',
                            expanded:  false,
                            selected:  false
                        }, {
                            name:      'archiving',
                            title:     'Archiving',
                            translate: 'OFFER.ARCHIVING',
                            template:  'archiving.html',
                            expanded:  false,
                            selected:  false
                        }
                    ],
                    selectedTariffs: []
          };
          vm.error                 = '';
          vm.impression  = {
                    tariffs: [{
                            name:      'scan-operation',
                            title:     'Impression by Scanning Operation',
                            translate: 'OFFER.IMPRESSION_SCAN_OPERATION',
                            template:  'operation.html',
                            expanded:  false,
                            selected:  false
                        }, {
                            name:      'quadrant',
                            title:     'Impression by Quadrant/AnteriorRegion',
                            translate: 'OFFER.IMPRESSION_QUADRANT_ANT',
                            template:  'quadrant.html',
                            expanded:  false,
                            selected:  false
                        }
                    ],
                    selectedTariffs: []
          };
          vm.message               = '';
          vm.offer = {
                            idLaboratory: 2,
                            startDate: '',
                            endDate: '',
                            active: false,
                            dentArchivingPrice: 0,
                            dentAntArchivingPrice: 0,
                            quadArchivingPrice: 0,
                            quadAntArchivingPrice: 0,
                            designArchivingPrice: 0,
                            scanning: {
                              kroneScanPrice: 0,
                              veneerScanPrice: 80,
                              implantatScanPrice: 0,
                              inOnlayScanPrice: 0,
                              bridgeCoreScanPrice: 0,
                              bridgeAnchorScanPrice: 0,
                              kroneAntScanPrice: 0,
                              veneerAntScanPrice: 80,
                              implantatAntScanPrice: 0,
                              inOnlayAntScanPrice: 0,
                              bridgeAntScanPrice: 0,
                              kronePerReducAntScanPrice: 0,
                              veneerPerReducAntScanPrice: 0,
                              implantatPerReducAntScanPrice: 0,
                              inOnlayPerReducAntScanPrice: 0,
                              bridgePerReducAntScanPrice: 0,
                              kroneAntIncluded: false,
                              veneerAntIncluded: false,
                              implantatAntIncluded: false,
                              inOnlayAntIncluded: false,
                              bridgeAntIncluded: false,
                              kroneScanDuration: 0,
                              veneerScanDuration: 0,
                              implantatScanDuration: 0,
                              inOnlayScanDuration: 0,
                              bridgeScanDuration: 0,
                              quadScanPrice: 0,
                              quadAntScanPrice: 0,
                              quadScanDuration: 0,
                              frontScanPrice: 0,
                              frontAntScanPrice: 0,
                              frontScanDuration: 0,
                              reductions: []
                            },
                            design: {
                              kroneDesignPrice: 0,
                              veneerDesignPrice: 0,
                              implantatDesignPrice: 0,
                              inOnlayDesignPrice: 0,
                              bridgeCoreDesignPrice: 0,
                              bridgeAnchorDesignPrice: 0,
                              kroneDesignDuration: 0,
                              veneerDesignDuration: 0,
                              implantatDesignDuration: 0,
                              inOnlayDesignDuration: 0,
                              bridgeDesignDuration: 0,
                              simulationPrice: 0,
                              simulationDuration: 0,
                              reductions: []
                            },
                            production: {
                              coloringDentPrice: 0,
                              sinteringDentPrice: 0,
                              coloringDentDuration: 0,
                              sinteringDentDuration: 0,
                              materials: [
                                {
                                  type: '',
                                  kroneProdPrice: 0,
                                  veneerProdPrice: 0,
                                  implantatProdPrice: 0,
                                  inOnlayProdPrice: 0,
                                  bridgeCoreProdPrice: 0,
                                  bridgeAnchorProdPrice: 0,
                                  kroneProdDuration: 0,
                                  veneerProdDuration: 0,
                                  implantatProdDuration: 0,
                                  inOnlayProdDuration: 0,
                                  bridgeCoreProdDuration: 0,
                                  bridgeAnchorProdDuration: 0
                                },
                                {
                                  type: '',
                                  kroneProdPrice: 0,
                                  veneerProdPrice: 0,
                                  implantatProdPrice: 0,
                                  inOnlayProdPrice: 0,
                                  bridgeCoreProdPrice: 0,
                                  bridgeAnchorProdPrice: 0,
                                  kroneProdDuration: 0,
                                  veneerProdDuration: 0,
                                  implantatProdDuration: 0,
                                  inOnlayProdDuration: 0,
                                  bridgeCoreProdDuration: 0,
                                  bridgeAnchorProdDuration: 0
                                }
                              ],
                              reductions: []
                            },
                            transport: {
                              basePrice: 0,
                              pricePerKm: 0
                            }
                          }; 
          vm.operation             = {
                    types: [{
                            name:      'veneer',
                            title:     'Veneer',
                            translate: 'OFFER.VENEER',
                            template:  'veneer.html',
                            expanded:  false,
                            selected:  false
                        }, {
                            name:      'krone',
                            title:     'Krone',
                            translate: 'OFFER.KRONE',
                            template:  'krone.html',
                            expanded:  false,
                            selected:  false
                        },
                        {
                            name:      'bridge',
                            title:     'Bridge',
                            translate: 'OFFER.BRIDGE',
                            template:  'bridge.html',
                            expanded:  false,
                            selected:  false
                        }, {
                            name:      'in-onlay',
                            title:     'In/Onlay',
                            translate: 'OFFER.IN_ONLAY',
                            template:  'in-onlay.html',
                            expanded:  false,
                            selected:  false
                        },{
                            name:      'implantat',
                            title:     'Implantat',
                            translate: 'OFFER.IMPLANTAT',
                            template:  'implantat.html',
                            expanded:  false,
                            selected:  false
                        }
                    ],
                    selectedTypes: []
          }; 
          vm.query                 = {order: 'id', limit: 10, page: 1};
          vm.searchQuery           = {};
          vm.searchOptions         = {};
          vm.selected              = [];

          // Methods
          vm.applyBridgeDiscount   = applyBridgeDiscount;
          vm.applyImplantatDiscount= applyImplantatDiscount;
          vm.applyInOnlayDiscount  = applyInOnlayDiscount;
          vm.applyKroneDiscount    = applyKroneDiscount;
          vm.applyVennerDiscount   = applyVennerDiscount;
          vm.deselect              = deselect;
          vm.exists                = exists;
          vm.onPaginate            = onPaginate;
          vm.onReorder             = onReorder;
          vm.openReductionDialog   = openReductionDialog;
          vm.loadStuff             = loadStuff;
          vm.log                   = log;
          vm.search                = search;
          vm.sendForm              = sendForm;
          vm.selectItem            = selectItem;
          vm.toggleItem            = toggleItem;
          vm.updateBridgeAntagonist= updateBridgeAntagonist;
          vm.updateImplantatAntagonist= updateImplantatAntagonist;
          vm.updateInOnlayAntagonist= updateInOnlayAntagonist;
          vm.updateKroneAntagonist = updateKroneAntagonist;
          vm.updateVennerAntagonist= updateVennerAntagonist;

          //----------------Implementation details
          function errorCallback(response) {
              $log.debug('Server response: ' + JSON.stringify(response));
              vm.error = response.data.code + ': ' + response.data.error;

              // Show the error message to user.
              $mdDialog.show({
                      controller         : function ($scope, $mdDialog, itemData) {
                          $scope.itemData = itemData;
                          $scope.closeDialog = function ()
                          {
                              $mdDialog.hide();
                          };
                      },
                      template           : '<md-dialog>' +
                      '  <md-dialog-content><div translate="OFFER.ADD_MSG_ERROR"><pre>{{itemData.message | json}}</pre></div></md-dialog-content>' +
                      '  <md-dialog-actions>' +
                      '    <md-button ng-click="closeDialog()" class="md-primary">' +
                      '      Close' +
                      '    </md-button>' +
                      '  </md-dialog-actions>' +
                      '</md-dialog>',
                      parent             : angular.element('body'),
                      //targetEvent        : ev,
                      locals             : {
                          itemData: {message: "Server is not available. Please try again later!"}
                          // itemData: {message: vm.item.message}
                      },
                      clickOutsideToClose: true
                  });
          }

          function search() {
              vm.message = '';
              vm.error = '';
              $log.debug('SearchOptions: ' + JSON.stringify(vm.searchOptions));
          }

          vm.search(); // initialize with search

          function applyBridgeDiscount() {
              vm.offer.scanning.bridgeAntScanPrice = vm.offer.scanning.bridgeScanPrice*(1-vm.offer.scanning.bridgePerReducAntScanPrice/100);
          }

          function applyImplantatDiscount() {
              vm.offer.scanning.implantatAntScanPrice = vm.offer.scanning.implantatScanPrice*(1-vm.offer.scanning.implantatPerReducAntScanPrice/100);
          }

          function applyInOnlayDiscount() {
              vm.offer.scanning.inOnlayAntScanPrice = vm.offer.scanning.inOnlayScanPrice*(1-vm.offer.scanning.inOnlayPerReducAntScanPrice/100);
          }

          function applyKroneDiscount() {
              vm.offer.scanning.kroneAntScanPrice = vm.offer.scanning.kroneScanPrice*(1-vm.offer.scanning.kronePerReducAntScanPrice/100);
          }

          function applyVennerDiscount() {
              vm.offer.scanning.veneerAntScanPrice = vm.offer.scanning.veneerScanPrice*(1-vm.offer.scanning.veneerPerReducAntScanPrice/100);
          }

          function updateBridgeAntagonist(){
              vm.offer.scanning.bridgeAntScanPrice = vm.offer.scanning.bridgeScanPrice;
              // vm.veneerAntScanPrice = angular.copy(vm.veneerScanPrice);

              /*var num = parseFloat(vm.veneerScanPrice);
              vm.veneerScanPrice = num.toFixed(2);*/
          }
          function updateImplantatAntagonist(){
              vm.offer.scanning.implantatAntScanPrice = vm.offer.scanning.implantatScanPrice;
          }

          function updateInOnlayAntagonist(){
              vm.offer.scanning.inOnlayAntScanPrice = vm.offer.scanning.inOnlayScanPrice;
          }

          function updateKroneAntagonist(){
              vm.offer.scanning.kroneAntScanPrice = vm.offer.scanning.kroneScanPrice;
          }

          function updateVennerAntagonist(){
              vm.offer.scanning.veneerAntScanPrice = vm.offer.scanning.veneerScanPrice;
          }

          $rootScope.$on('sendReductions', function (event, args) {
              vm.offer.scanning.reductions = args;
              $log.debug('Reductions received from $emit: ' + JSON.stringify(vm.offer.scanning.reductions));
              $log.debug('Reductions received from $emit: ' + angular.toJson(vm.offer.scanning.reductions));
          });

          /**
           * Send form
           */
          function sendForm(ev)
          {
              // You can do an API call here to send the form to your server
              $log.debug('Offer details: ' + JSON.stringify(vm.offer));
              
              msApi.request('offer@add', vm.offer, function (response) {
                  $log.debug('Add Offer response: ' + JSON.stringify(response));

                  // Show the success message to user.
                  $mdDialog.show({
                      controller         : function ($scope, $mdDialog, itemData) {
                          $scope.itemData = itemData;
                          $scope.closeDialog = function ()
                          {
                              $mdDialog.hide();
                          };
                      },
                      template           : '<md-dialog>' +
                      '  <md-dialog-content><div translate="OFFER.ADD_MSG_SUSSESS"><pre>{{itemData.message | json}}</pre></div></md-dialog-content>' +
                      '  <md-dialog-actions>' +
                      '    <md-button ng-click="closeDialog()" class="md-primary">' +
                      '      Close' +
                      '    </md-button>' +
                      '  </md-dialog-actions>' +
                      '</md-dialog>',
                      parent             : angular.element('body'),
                      targetEvent        : ev,
                      locals             : {
                          itemData: {message: "Your offer details have been submitted successfully!"}
                          // itemData: {message: vm.item.message}
                      },
                      clickOutsideToClose: true
                  });

                  return response;
              }, errorCallback);

              // Clear the form data
              vm.offer = {
                            idLaboratory: 2,
                            startDate: '',
                            endDate: '',
                            active: false,
                            dentArchivingPrice: 0,
                            dentAntArchivingPrice: 0,
                            quadArchivingPrice: 0,
                            quadAntArchivingPrice: 0,
                            designArchivingPrice: 0,
                            scanning: {
                              kroneScanPrice: 0,
                              veneerScanPrice: 80,
                              implantatScanPrice: 0,
                              inOnlayScanPrice: 0,
                              bridgeCoreScanPrice: 0,
                              bridgeAnchorScanPrice: 0,
                              kroneAntScanPrice: 0,
                              veneerAntScanPrice: 80,
                              implantatAntScanPrice: 0,
                              inOnlayAntScanPrice: 0,
                              bridgeAntScanPrice: 0,
                              kronePerReducAntScanPrice: 0,
                              veneerPerReducAntScanPrice: 0,
                              implantatPerReducAntScanPrice: 0,
                              inOnlayPerReducAntScanPrice: 0,
                              bridgePerReducAntScanPrice: 0,
                              kroneAntIncluded: false,
                              veneerAntIncluded: false,
                              implantatAntIncluded: false,
                              inOnlayAntIncluded: false,
                              bridgeAntIncluded: false,
                              kroneScanDuration: 0,
                              veneerScanDuration: 0,
                              implantatScanDuration: 0,
                              inOnlayScanDuration: 0,
                              bridgeScanDuration: 0,
                              quadScanPrice: 0,
                              quadAntScanPrice: 0,
                              quadScanDuration: 0,
                              frontScanPrice: 0,
                              frontAntScanPrice: 0,
                              frontScanDuration: 0,
                              reductions: []
                            },
                            design: {
                              kroneDesignPrice: 0,
                              veneerDesignPrice: 0,
                              implantatDesignPrice: 0,
                              inOnlayDesignPrice: 0,
                              bridgeCoreDesignPrice: 0,
                              bridgeAnchorDesignPrice: 0,
                              kroneDesignDuration: 0,
                              veneerDesignDuration: 0,
                              implantatDesignDuration: 0,
                              inOnlayDesignDuration: 0,
                              bridgeDesignDuration: 0,
                              simulationPrice: 0,
                              simulationDuration: 0,
                              reductions: []
                            },
                            production: {
                              coloringDentPrice: 0,
                              sinteringDentPrice: 0,
                              coloringDentDuration: 0,
                              sinteringDentDuration: 0,
                              materials: [
                                {
                                  type: '',
                                  kroneProdPrice: 0,
                                  veneerProdPrice: 0,
                                  implantatProdPrice: 0,
                                  inOnlayProdPrice: 0,
                                  bridgeCoreProdPrice: 0,
                                  bridgeAnchorProdPrice: 0,
                                  kroneProdDuration: 0,
                                  veneerProdDuration: 0,
                                  implantatProdDuration: 0,
                                  inOnlayProdDuration: 0,
                                  bridgeCoreProdDuration: 0,
                                  bridgeAnchorProdDuration: 0
                                },
                                {
                                  type: '',
                                  kroneProdPrice: 0,
                                  veneerProdPrice: 0,
                                  implantatProdPrice: 0,
                                  inOnlayProdPrice: 0,
                                  bridgeCoreProdPrice: 0,
                                  bridgeAnchorProdPrice: 0,
                                  kroneProdDuration: 0,
                                  veneerProdDuration: 0,
                                  implantatProdDuration: 0,
                                  inOnlayProdDuration: 0,
                                  bridgeCoreProdDuration: 0,
                                  bridgeAnchorProdDuration: 0
                                }
                              ],
                              reductions: []
                            },
                            transport: {
                              basePrice: 0,
                              pricePerKm: 0
                            }
                          };
              $log.debug('Offer details empty: ' + JSON.stringify(vm.offer));
          }

          //-----------------Configuration for md-data-table
        	function onPaginate(page, limit) {
        		$log.debug('Query.page: ' + vm.query.page + ' Query.limit: ' + vm.query.limit);
        		$log.debug('Page: ' + page + ' Limit: ' + limit);
        	    vm.promise = $timeout(function () {}, 2000);
        	}

          /**
             * Open new contact dialog
             *
             * @param ev
             * @param contact
             */
          function openReductionDialog(ev, reduction)
          {
                $mdDialog.show({
                    controller         : 'ReductionDialogController',
                    controllerAs       : 'vm',
                    templateUrl        : 'app/main/offer/views/dialogs/reduction-dialog.html',
                    //parent             : angular.element($document.find('#content-container')),
                    targetEvent        : ev,
                    clickOutsideToClose: true,
                    locals             : {
                        Reduction : reduction,
                        Reductions: vm.offer.scanning.reductions
                    }
                });
            }

        	function log(item) {
        		$log.debug(item.id, 'was selected');
        	    vm.selected = [item];
        	    vm.protocolFileError = '';
        	}

        	function deselect(item) {
        		$log.debug(item.id, 'was deselected');
        	    vm.selected = [];
        	}

        	function loadStuff() {
        		vm.promise = $timeout(function () {}, 2000);
            }

        	function onReorder(order) {
        		$log.debug('Query.order: ' + vm.query.order);
        		$log.debug('Order: ' + order);
        	    vm.promise = $timeout(function () {}, 2000);
        	}

          function toggleItem(item) {
              if((item.expanded === true) || (item.expanded === false)) { // if item.expanded is already defined
                  item.expanded = !item.expanded;
              }
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
    }
})();
