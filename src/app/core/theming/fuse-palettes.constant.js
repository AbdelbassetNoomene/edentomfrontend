(function () {
    'use strict';

    var fusePalettes = [
        {
            name: 'fuse-blue',
            options: {
                '50': '#ebf1fa',
                '100': '#c2d4ef',
                '200': '#9ab8e5',
                '300': '#78a0dc',
                '400': '#5688d3',
                '500': '#3470ca',
                '600': '#2e62b1',
                '700': '#275498',
                '800': '#21467e',
                '900': '#1a3865',
                'A100': '#c2d4ef',
                'A200': '#9ab8e5',
                'A400': '#5688d3',
                'A700': '#275498',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        },
        {
            name: 'fuse-pale-blue',
            options: {
                '50': '#ececee',
                '100': '#c5c6cb',
                '200': '#9ea1a9',
                '300': '#7d818c',
                '400': '#5c616f',
                '500': '#3c4252',
                '600': '#353a48',
                '700': '#2d323e',
                '800': '#262933',
                '900': '#1e2129',
                'A100': '#c5c6cb',
                'A200': '#9ea1a9',
                'A400': '#5c616f',
                'A700': '#2d323e',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        },
        {
            name: 'app-palette',
            options: {
                '50': '#00bdcb',             // ~cyan-500/blue: used as color identifying the app
                '100': '#e29db4',            // pink (rose)
                '200': '#ededed',            // light gray
                '300': '#818181',            // gray
                '400': 'rgba(0, 0, 0, 0.7)', // black: used as color for the navigation-menu (the main left sidenav)
                '500': '#44e4ef',            // light cyan-500 --> can be used as 'hue'
                '600': '#40ced8',            // ~cyan-500 --> can be used as 'hue'
                '700': '#333333',            // dark gray
                '800': '#1a1a1a',            // dark gray
                '900': '#ffffff',            // white
                'A100': '#1fb9f2',           // light cyan-500 --> can be used as 'hue'
                'A200': '#d43824',           // red
                'A400': '#0f3f87',           // dark material blue
                'A700': '#22549e',           // material blue
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        },
        {
            name: 'app-palette2',
            options: {
                '50': '#00bdcb',  //#84bc34  // ~cyan-500/blue: used as color identifying the app
                '100': '#e29db4',            // pink (rose)
                '200': '#ededed',            // light gray
                '300': '#818181',            // gray
                '400': 'rgba(0, 0, 0, 0.7)', // black: used as color for the navigation-menu (the main left sidenav)
                '500': '#44e4ef',            // light cyan-500 --> can be used as 'hue'
                '600': '#40ced8',            // ~cyan-500 --> can be used as 'hue'
                '700': '#333333',            // dark gray
                '800': '#1a1a1a',            // dark gray
                '900': '#ffffff',            // white
                'A100': '#1fb9f2',           // light cyan-500 --> can be used as 'hue'
                'A200': '#d43824',           // red
                'A400': '#0f3f87',           // dark material blue
                'A700': '#22549e',           // material blue
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        }
    ];

    angular
        .module('app.core')
        .constant('fusePalettes', fusePalettes);
})();