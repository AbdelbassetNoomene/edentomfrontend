(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(msApi)
    {
        var vm = this;

        // Data
        vm.date = new Date();
        vm.settings = {
            notify: true,
            cloud : false,
            retro : true
        };

        msApi.request('quickPanel.activities@get', {},
            // Success
            function (response)
            {
                vm.activities = response.data;
            }
        );

        msApi.request('quickPanel.events@get', {},
            // Success
            function (response)
            {
                vm.events = response.data;
                 var stompClient = null;
	            var socket = new SockJS('http://localhost:8080/chat');
	            stompClient = Stomp.over(socket);  
	            
	            stompClient.connect({}, function(frame) {
	                
	            	//setConnected(true);
	                console.log('Connected: ' + frame);
	                stompClient.subscribe('http://localhost:8080/topic/messages', function(messageOutput) {
                        vm.messages=messageOutput;
                        var messageOutput=JSON.parse(messageOutput.body);
                         var response = document.getElementById('response');
                            var p = document.createElement('p');
                            p.style.wordWrap = 'break-word';
                            p.appendChild(document.createTextNode(messageOutput.from + ": " + messageOutput.text + " (" + messageOutput.time + ")"));
                            response.appendChild(p);
	                	
	                });

	            });
                var from = "sdfsdfsd";
	            var text = "sdfqsdfqsdffdfsdfdfsd";
	            stompClient.send("http://localhost:8080/app/chat", {}, JSON.stringify({'from':from, 'text':text}));
	        }
            
        );

        msApi.request('quickPanel.notes@get', {},
            // Success
            function (response)
            {
                vm.notes = response.data;
            }
        );

        // Methods

        //////////
    }

})();