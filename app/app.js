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
var app = angular.module('patnerPortalApp', ['ui.router','ngMaterial','ngCookies']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider){

    $mdThemingProvider.theme('default')
        .primaryPalette('grey');

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            views: {
                'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
                'container' : { templateUrl: 'views/main.html', controller: 'MainCtrl'}
            },
            resolve: {
                IsLoggedIn: function(userFactory){
                    return userFactory.alreadyLoggedIn();
                }
            }
        })
        .state('VerfiyUser', {
            url: '/verifyUser',
            views: {
                 'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
                'container': { templateUrl: 'views/verifyUser.html', controller: 'MainCtrl'}
            },
            resolve: {
              IsLoggedIn: function(userFactory){
                return userFactory.isLoggedIn();
              }
            }
        })
        .state('Home', {
            url: '/home',
            views: {
                'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
                'container': { templateUrl: 'views/home.html', controller: 'AppCtrl'}
            },
            resolve: {
              IsLoggedIn: function(userFactory){
                return userFactory.isLoggedIn();
              }
            }
        });
});

app.controller('patnerPortalCtrl', function ($scope, $rootScope, $state, $cookies, $q, $timeout) {
  CarglyPartner.configure({
      //applicationId: "Ir85FTuOGRMujq9Xy88RrgmqnyoKm8HN", // test
      applicationId: "bTkSVhhdCDKmJU1KrE9nmwBllTl8iQ9r", // prod
      appLabel: "rsmt",
      onAuthChanged: function() {
//          console.log('app.js config');
      if (CarglyPartner.isResettingPassword()) {
//        console.log("reset");
      }
      else if (CarglyPartner.isLoggedIn()) {
//        console.log("isLoggedIn");
        $rootScope.headerText = "Signed in as " + CarglyPartner.user.name;
        if (CarglyPartner.user.verified == 'true') {
          $state.go("Home");
        }
        else {
          $state.go("VerfiyUser");
        }
      }
      else {
        $rootScope.headerText = "Already Registered?";
//        console.log("Registered");
        //$('#sign_in_buttons').show();
        //$('#sign_out_buttons').hide();
        //$('#onboarding_page').show();
        //$('#console_page').hide();
        //$('#signup_result_panel').hide();
        if (CarglyPartner.isConfirmingAccount()) {
          //$('#sign_in_buttons').hide();
          //$('#sign_out_buttons').hide();
          //$('#sign_in_panel').show();
          //$('#signup_form_container').hide();
          $state.go("/");
        }
        else {
          //$('#sign_in_panel').hide();
          //$('#signup_form_container').show();
          $state.go("/");
        }
      }
      }
    });
  //
  //$scope.IsLoggedIn = function(){
  //  var token = $cookies.cargly_rsmt_access_token;
  //  console.log(token);
  //  var promise = $q.defer();
  //  CarglyPartner._getUser(token,function(success) {
  //    $timeout(promise.resolve());
  //  }, function(error){
  //    $timeout(promise.reject());
  //  });
  //  return promise;
  //}
});
