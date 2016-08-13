(function ()
{
    'use strict';

    /**
     * Main module of edentom
     */
    angular
        .module('edentom', [

            'app.version',
             // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick panel
            'app.quick-panel',

            'app.authentication',
            'app.bourse',
            'app.clearances',
            'app.dashboard',
            'app.help',
            'app.home',
            'app.laboratory',
            'app.offer',
            'app.realisation',
            'app.request',
            'app.reservation',
            'app.resource',
            'app.scanagent',

            'angular-jwt',
            'http-auth-interceptor',
            'md.data.table',
            'ngCookies',
            'ngCsv',
            'ngMessages',
            'ngSanitize',
            'nvd3',
            'ui.router',
            'uiGmapgoogle-maps'
        ]);
})();