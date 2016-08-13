(function ()
{
    'use strict';

    angular.module('app.scanagent')
           .controller('ScanAgentController', ScanAgentController);

    /** @ngInject */
    function ScanAgentController($interval, $log, $scope, $state, $timeout, $window, msApi, authenticator, uiGmapGoogleMapApi)
      {
          // Data
          var vm                          = this;
          var GERMAN_ID                   = 80;
          var HOME_STATE                  = 'app.home';
          var PRICES_LIST_SCANAGENT_STATE = 'app.home.prices-list-scanagent';
          vm.TIME_FORMAT                  = 'dd.MM.yyyy HH:mm:ss';
          vm.cities                   = [];
          vm.columns                  = [{ name:    'ID',
                                           orderBy: 'id',
                                           numeric: true
                                        }, {
                                            name:    'username',
                                            orderBy: 'username'
                                        }, {
                                            name:    'firstName',
                                            orderBy: 'firstName'
                                        }, {
                                            name:    'mail',
                                            orderBy: 'mail'
                                        }, {
                                            name:    'mobile',
                                            orderBy: 'mobile'
                                        }, {
                                            name:    'readiness',
                                            orderBy: 'readiness'
                                        }
                                      ];
          vm.currenTime               = '';
          vm.distance                 = '';
          vm.dateMeeting              = '';
          vm.error                    = '';
          vm.filteredEntries          = [];
          vm.goToPricesListScanagent  = goToPricesListScanagent;
          vm.instruments              = ['Ins 1', 'Ins 2', 'Ins 3'];       //TODO: get those date from REST-Service
          vm.message                  = '';
          vm.models                   = ['Model 1', 'model 2', 'Model 3']; //TODO: get those date from REST-Service
          vm.nowWidget                = { now: {
                                              second: '',
                                              minute: '',
                                              hour  : '',
                                              day   : '',
                                              month : '',
                                              year  : ''
                                          },
                                          ticker: function () {
                                              var now = moment();
                                              vm.nowWidget.now = {
                                                  second : now.format('ss'),
                                                  minute : now.format('mm'),
                                                  hour   : now.format('HH'),
                                                  day    : now.format('D'),
                                                  weekDay: now.format('dddd'),
                                                  month  : now.format('MMMM'),
                                                  year   : now.format('YYYY')
                                              };
                                          }
                                        };
          vm.otherScanAgents          = [];
          vm.partnerScanAgents        = [];
          vm.producers                = ['Prod 1', 'Prod 2', 'Prod 3'];    //TODO: get those date from REST-Service
          vm.protocolFileContent      = null;
          vm.protocolFileError        = '';
          vm.protocolFileURL          = '';
          vm.query                    = {order: 'id', limit: 10, page: 1};
          vm.availability             = [{
                             'available': true,
                             'icon':      'icon-checkbox-marked-circle',
                             'color':     '#4CAF50'
                           },{
                             'available': false,
                             'icon' :     'icon-checkbox-blank-circle-outline',
                             'color':     '#616161'
                          }];
          vm.roles                    = ['Zahnarzt', 'Dental Labor','Agent']; // TODO: cette liste doit être la même dans le backend, il vaut mieux l'initialiser à partir de ce que le backend retourne
          vm.selectedRole             = vm.roles[0]; // initialize with Zahnarzt
          vm.selectedInstrument       = '';
          vm.selectedModel            = '';
          vm.searchQuery              = {};
          vm.searchOptions            = {};
          vm.scanAgents               = [];
          vm.scanAgentIds             = [];
          vm.scanagentsMap            = {
        		                            //center: {latitude : -25.363882, longitude: 131.044922},
                                            zoom  : 12,
                                            options: {
                                                minZoom:     3,
                                                scrollwheel: false
                                            },
                                            markers: []
                                        };
          vm.selected                 = [];
          vm.timeMeeting              = '';

          // Methods
          vm.deselect                 = deselect;
          vm.examine                  = examine;
          vm.goToPricesListScanagent  = goToPricesListScanagent;
          vm.loadStuff                = loadStuff;
          vm.log                      = log;
          vm.onPaginate               = onPaginate;
          vm.onReorder                = onReorder;
          vm.setAvailability          = setAvailability;
          vm.search                   = search;

        //----------------Implementation details
        if(($state.current.name === HOME_STATE)) { // we are on the '/home' view

            msApi.request('country@getCities', {id: GERMAN_ID}, function (response) {
                vm.cities = response;
            }, errorCallback);

            vm.search(); // initialize with search
        }

        function goToPricesListScanagent(scanagent) {

            if(scanagent.instruments && scanagent.instruments.length) {
                $log.debug('scanagent.instruments 1: ' + JSON.stringify(scanagent.instruments[0].availabilityStatus));
                vm.setAvailability(scanagent.instruments);
                $log.debug('scanagent.instruments 2: ' + JSON.stringify(scanagent.instruments[0].availabilityStatus));
            }

            $window.sessionStorage.setItem('selectedScanagent', JSON.stringify(scanagent));
            $state.go(PRICES_LIST_SCANAGENT_STATE, {scanagentId: scanagent.id});
        }

        uiGmapGoogleMapApi.then(function (maps) {
            //vm.scanagentsMap = {...};
        });

        /**
         * set map markers
         */
        function setMapMarkers(entries) {
            angular.forEach(entries, function(entry, key) {
                
                var marker = {
                    id: key,
                    coords: {latitude: entry.address.currentLatitude, longitude: entry.address.currentLongitude},
                    show: false,
                    name: entry.firstName + ' ' + entry.lastName
                };
                vm.scanagentsMap.markers.push(marker);
            });
            if(entries && entries.length) {
                vm.scanagentsMap.center = {latitude: entries[0].address.currentLatitude, longitude: entries[0].address.currentLongitude}; // vm.scanagentsMap.markers[0].coords
            }
        }

        function setAvailability(entries) {
            angular.forEach(entries, function(entry, key) {
                entry.availabilityStatus = entry.available ? vm.availability[0] : vm.availability[1]; //TODO: work in progress
            });
        }

        // Now widget ticker
        vm.nowWidget.ticker();

        var nowWidgetTicker = $interval(vm.nowWidget.ticker, 1000);

        $scope.$on('$destroy', function (){
            $interval.cancel(nowWidgetTicker);
        });
        
        vm.currenTime  = vm.nowWidget.now.year +'-'+ vm.nowWidget.now.month +'-' +vm.nowWidget.now.day +' '+ vm.nowWidget.now.hour +':'+ vm.nowWidget.now.minute;
        vm.timeMeeting = new Date(vm.currenTime);
        
        //Add 15min to the currunt time
        vm.timeMeeting.setMinutes(vm.timeMeeting.getMinutes() + 15);

        $log.debug('Afficher vm.timeMeeting: ' + vm.timeMeeting);

        function errorCallback(response) {
            $log.debug('Server response: ' + JSON.stringify(response));
            vm.error = response.data.code + ': ' + response.data.error;
        }

        function search() {
              vm.message = '';
              vm.error   = '';
              $log.debug('SearchOptions: ' + JSON.stringify(vm.searchOptions));

              msApi.request('agent@getAgents', function (response) {
                  //$log.debug('Nb ScanAgents = ' + response.length);
                  //$log.debug('ScanAgents = ' + JSON.stringify(response));

                  if(authenticator.isAuthenticated()) {
                      //if(authenticated user belongs to cabinet staff) {
                          vm.scanAgents = response.otherScanAgents;
                      //} else { // authenticated user belongs to cabinet staff
                          //vm.scanAgents.partnerScanAgents = response.Partner_Laboratory_Scan_Agents;
                          vm.scanAgents.otherScanAgents   = response.otherScanAgents;
                      //}
                  } else { // anonyme user
                      vm.scanAgents = response.otherScanAgents;
                  }
                  /*vm.partnerScanAgents = response.Partner_Laboratory_Scan_Agents;
                  vm.otherScanAgents = response.Other_Scan_Agents;
                  if(vm.partnerScanAgents){
                    vm.filteredEntries = vm.partnerScanAgents.concat(vm.otherScanAgents);
                  }else{
                    vm.filteredEntries = vm.otherScanAgents;
                  }*/
                  vm.setAvailability(vm.scanAgents);
                  vm.filteredEntries = vm.scanAgents;
                  setMapMarkers(vm.filteredEntries);
              }, errorCallback);
        }

          //-----------------------------------------------------------------------------------------------
          //----to get a PDF file from REST-Server
          function examine(id) {
              $log.debug('examine() scanAgent ID: ' + id);
              /*msApi.request('jobs@getProtocolFile',{urlSuffix: 'protocolfile', id: id}, function (data) {
              //JobService.getProtocolFile({urlSuffix: 'protocolfile', id: id}, function(data) {

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
                });*/
          }

        //-----------------Configuration for md-data-table
      	function onPaginate(page, limit) {
      		$log.debug('Query.page: ' + vm.query.page + ' Query.limit: ' + vm.query.limit);
      		$log.debug('Page: ' + page + ' Limit: ' + limit);
      	    vm.promise = $timeout(function () {}, 2000);
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
    }
})();
