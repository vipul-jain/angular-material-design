//'use strict';

/**
 * @ngdoc overview
 * @name patnerPortalApp
 * @description
 * # patnerPortalApp
 *
 * Main module of the application.
 */
//angular
//  .module('patnerPortalApp', []);
var app = angular.module('patnerPortalApp', ['ui.router','ngMaterial']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider){

    $mdThemingProvider.theme('default')
        .primaryPalette('grey');

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            views: {
                '':{ templateUrls: 'index.html'},
                'navigation' : { templateUrl: 'views/navbar.html', controller: 'MainCtrl'},
                'container' : { templateUrl: 'views/main.html', controller: 'MainCtrl'}
            }
        })
        .state('confirmEmail', {
            url: '/confirmEmail',
            views: {
                '': { templateUrls: 'index.html'},
                'navigation': { templateUrl: 'views/navbar.html', controller: 'MainCtrl'},
                'container': { templateUrl: 'views/confirmEmail.html', controller: 'MainCtrl'}
            }
        })
        .state('sidebar', {
            url: '/sidebar',
            views: {
                '': { templateUrls: 'index.html'},
                'navigation': { templateUrl: 'views/navbar.html', controller: 'MainCtrl'},
                'container': { templateUrl: 'views/sidebar.html', controller: 'AppCtrl'}
            }
        });


    //to remove hashtag
//    $locationProvider.html5Mode({
//        enabled: true,
//        requireBase: false
//    });

});
