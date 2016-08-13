(function ()
{
    'use strict';

    angular.module('app.laboratory')
           .controller('AddLaboratoryController', AddLaboratoryController);

    /** @ngInject */
    function AddLaboratoryController($log, $scope, $mdDialog, $mdSidenav, msApi)
    {
        var vm             = this;
        // Data
        vm.availability    = [{
            'available': true,
            'icon':      'icon-checkbox-marked-circle',
            'color':     '#4CAF50'
            }, {
            'available': false,
            'icon' :     'icon-checkbox-blank-circle-outline',
            'color':     '#616161'
        }];
        vm.cities          = [];
        vm.countries       = [];
        vm.error           = '';
        //vm.uploadComplete(); //TODO
        vm.dropping        = false;
        vm.labors          = [];
        vm.website         = 'http://';
        vm.fileAdded       = fileAdded;
        vm.fileSuccess     = fileSuccess;
        vm.filteredEntries = [];
        vm.getCities       = getCities;
        vm.getCountries    = getCountries;
        vm.item            = {images: []}; //vm.laboratory      = {images: []};
        vm.message         = '';
        vm.ngFlowOptions   = {
                // You can configure the ngFlow from here
                /*target                   : 'api/media/image',
                 chunkSize                : 15 * 1024 * 1024,
                 maxChunkRetries          : 1,
                 simultaneousUploads      : 1,
                 testChunks               : false,
                 progressCallbacksInterval: 1000*/
        };
        vm.ngFlow          = {
            // ng-flow will be injected into here through its directive
            flow: {}
        };
        vm.upload          = upload;
        vm.selectedmarker  = {};
        vm.setAvailability = setAvailability;
        vm.showInfo        = showInfo;
        vm.search          = search;
        vm.sendForm        = sendForm;
        vm.toggleSidenav   = toggleSidenav;
        vm.itemsMap       = {
            //center: {latitude : -25.363882, longitude: 131.044922},
            zoom  : 12,
            options: {
                minZoom:     3,
                scrollwheel: false
            },
            markers: [],
            markersEvents: {
                click: function(marker, eventName, model) {
                    console.log('Marker was clicked:' + JSON.stringify(model));//+', '+mydump(model, 0)+', '+mydump(arguments)+')');
                    vm.selectedmarker = model;
                    vm.selectedmarker.show = true;
                    vm.showInfo(model.id);
                }
            }/*,
            window: {
                marker: {},
                show: false,
                closeClick: function() {
                    $log.debug('closeClick(): ' + JSON.stringify(response));
                    this.show = false;
                },
                options: {}, // define when map is ready
                title: ''
            }*/
        };


        //----------------Implementation details
        vm.search(); // initialize with getLaboratories
        vm.getCountries();

        function getCountries() {
            msApi.request('country@getCountries', function (response) {
                //$log.debug('--country@getCountries: ' + response.length + ' --> ' + JSON.stringify(response));
                vm.countries = response;
            }, errorCallback);
        }

        function getCities(countryId) {
            $log.debug('----getCities for countryId: ' + countryId);
            msApi.request('country@getCities', {id: countryId}, function (response) {
                vm.cities = response;
            }, errorCallback);
        }

        function errorCallback(response) {
            $log.debug('Server response: ' + JSON.stringify(response));
            vm.error = response.data.error + ': ' + response.data.message; //response.data.code + ': ' +
            vm.item.message = response.data.error + ': ' + response.data.message;
        }

        /**
         * File added callback
         * Triggers when files added to the uploader
         *
         * @param file
         */
        function fileAdded(file) {
            // Prepare the temp file data for media list
            var uploadingFile = {
                id  : file.uniqueIdentifier,
                file: file,
                type: 'uploading'
            };
            // Append it to the media list
            vm.item.images.unshift(uploadingFile);
            //$log.debug('fileAdded() - vm.laboratory.images[0].id: ' + JSON.stringify(vm.laboratory.images[0].id));
            //$log.debug('fileAdded() - vm.laboratory.images[0].file.url: ' + JSON.stringify(vm.laboratory.images[0].file.url));
            //$log.debug('fileAdded() - vm.laboratory.images[0].file.length: ' + JSON.stringify(vm.laboratory.images[0].file.length));
        }

        /**
         * Upload
         * Automatically triggers when files added to the uploader
         */
        function upload() {
            // Set headers
            vm.ngFlow.flow.opts.headers = {
                'X-Requested-With': 'XMLHttpRequest',
                //'X-XSRF-TOKEN'    : $cookies.get('XSRF-TOKEN')
            };
            vm.ngFlow.flow.upload();
        }

        /**
         * File upload success callback
         * Triggers when upload completed
         * @param file
         * @param message
         */
        function fileSuccess(file, message)
        {
            // find the image we are added as a temp and replace its data
            // Normally you would parse the message and extract the uploaded file data from it
            //$log.debug('----Nb item images: ' + vm.item.images.length);
            angular.forEach(vm.item.images, function (media, index) {

            //if (media.id === file.uniqueIdentifier)
            //{
                // Normally you would update the media item from database but we are cheating here!
                var fileReader    = new FileReader();
                fileReader.readAsDataURL(media.file.file);
                fileReader.onload = function (event)
                {
                    media.url = event.target.result;
                };
                // Update the image type so the overlay can go away
                media.type = 'image';

                /*// Figure out & upddate the size
                if ( file.file.size < 1024 ) {
                    vm.item.image.size = parseFloat(file.file.size).toFixed(2) + ' B';
                }
                else if ( file.file.size >= 1024 && file.file.size < 1048576 ) {
                    vm.item.image.size = parseFloat(file.file.size / 1024).toFixed(2) + ' Kb';
                }
                else if ( file.file.size >= 1048576 && file.file.size < 1073741824 ) {
                    vm.item.image.size = parseFloat(file.file.size / (1024 * 1024)).toFixed(2) + ' Mb';
                }
                else {
                    vm.item.image.size = parseFloat(file.file.size / (1024 * 1024 * 1024)).toFixed(2) + ' Gb';
                }*/
            //}
            });
        }

        /**
         * Send form
         */
        function sendForm(ev)
        {
            vm.item.message = '';
            // You can do an API call here to send the form to your server
            var superAdmin = {
                            idOrganization: vm.item.id,
                            username:       vm.item.userName,
                            password:       vm.item.password,
                            firstName:      vm.item.firstName,
                            lastName:       vm.item.surname,
                            mail:           vm.item.yourEmail,
                            mobile:         vm.item.mobile,
                            sex:            vm.item.genre
            };
            msApi.request('laboratory@add', superAdmin, function (response) {
                $log.debug('Add Laboratory response: ' + JSON.stringify(response));
                vm.item.message = response.message;
                
                // Show the success message to user.
                //$log.debug('Test vm.item: '+ JSON.stringify(vm.item));
                $mdDialog.show({
                    controller         : function ($scope, $mdDialog, itemData) {
                        $scope.itemData = itemData;
                        $scope.closeDialog = function ()
                        {
                            $mdDialog.hide();
                        };
                    },
                    /*template           : '<md-dialog>' +
                    '  <md-dialog-content><h1>You have sent the form with the following data</h1><div><pre>{{itemData | json}}</pre></div></md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Close' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',*/
                    template           : '<md-dialog>' +
                    '  <md-dialog-content><div translate="LABORATORY.MESSAGE"><pre>{{itemData.message | json}}</pre></div></md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Close' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                    parent             : angular.element('body'),
                    targetEvent        : ev,
                    locals             : {
                        // itemData: {id: vm.item.id, name: vm.item.name, nbImages: vm.item.images.length, message: vm.item.message}
                        itemData: {message: vm.item.message}
                    },
                    clickOutsideToClose: true
                });
                //return response;
            }, errorCallback);

            // Clear the form data
            vm.item = {};
            //$log.debug('Test vm.item: ' + JSON.stringify(vm.item));
        }

        /**
         * set map markers
         */
        function setMapMarkers(entries) {
            angular.forEach(entries, function(entry, key) {
                //$log.debug('entry = ' + JSON.stringify(entry) +'key = ' + key);
                var marker = {
                    id: entry.id,
                    coords: {latitude: entry.latitude, longitude: entry.longitude},
                    show: false,
                    name: entry.nameLabo
                };
                vm.itemsMap.markers.push(marker);
            });
            if(entries && entries.length) {
                vm.itemsMap.center = {latitude: entries[0].latitude, longitude: entries[0].longitude}; // vm.itemsMap.markers[0].coords
            }
        }

        /**
         * show informations of selected laboratory
         */
        function showInfo(id) {
            angular.forEach(vm.filteredEntries, function(entry, key){
                if(entry.id == id){
                    $log.debug('selected labo is = ' + JSON.stringify(entry));
                    vm.item = {
                        id:              entry.id,
                        name:            entry.nameLabo,
                        phoneNumber:     "" + 0 + entry.phoneLabo,
                        postalCode:      entry.postalCode,
                        city:            entry.city,
                        street:          entry.street,
                        houseNumber:     entry.streetNumber,
                        country:         entry.country,
                        email:           entry.mail,
                        website:         entry.website,
                        genre:           '',
                        role:            {
                            manager:     false,
                            systemAdmin: false
                        },
                        surname:         '',
                        firstName:       '',
                        mobile:          null,
                        userName:        '',
                        yourEmail:       '',
                        password:        '',
                        passwordConfirm: '',
                        data:            {
                            cb1: false,
                            cb2: false
                        },
                        images: [],
                        message:''
                    };
                    $log.debug('selecded Item is = ' + JSON.stringify(vm.item));
                }
            });
        }

        function setAvailability(entries) {
            angular.forEach(entries, function(entry, key) {
                entry.availabilityStatus = entry.available ? vm.availability[0] : vm.availability[1]; //TODO: work in progress
            });
        }

        function search() {
            vm.message = '';
            vm.error   = '';
            //$log.debug('SearchOptions: ' + JSON.stringify(vm.searchOptions));

            msApi.request('laboratory@getLaboratories', function (response) {
                $log.debug('Nb Laboratories = ' + response.length);
                vm.labors = response;

                vm.setAvailability(vm.labors);
                vm.filteredEntries = vm.labors;
                setMapMarkers(vm.filteredEntries);
            }, errorCallback);
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
