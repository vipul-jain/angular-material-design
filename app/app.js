
/**
 * @ngdoc overview
 * @name patnerPortalApp
 * @description
 * # patnerPortalApp
 *
 * Main module of the application.
 */
var app = angular.module('partnerPortalApp', ['ui.router', 'ngMaterial', 'ngCookies', 'ngGrid']);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {

    $mdThemingProvider.theme('default')
        .primaryPalette('grey');

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            views: {
                'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
                'container': { templateUrl: 'views/main.html', controller: 'MainCtrl'}
            },
            resolve: {
                IsLoggedIn: function (userFactory) {
                    return userFactory.alreadyLoggedIn();
                }
            }
        })
        .state('ConfimAccount', {
          url: '/confirm=:token',
          views: {
            'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
            'container': { templateUrl: 'views/confirmaccount.html', controller: 'confirmAccountCtrl'}
          }/*,
          resolve: {
            IsLoggedIn: function (userFactory) {
              return userFactory.alreadyLoggedIn();
            }
          }*/
        })

        //Authenticated views start
        .state('VerifyUser', {
            url: '/verifyUser',
            views: {
                'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
                'container': { templateUrl: 'views/authenticated/verifyUser.html', controller: 'VerifyUserCtrl'}
            },
            resolve: {
                IsLoggedIn: function (userFactory) {
                    return userFactory.isVerified();
                }
            }
        })
        .state('dashboard', {
            url: '/dashboard',
            views: {
                'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
                'leftNav': { templateUrl: 'views/authenticated/leftNav.html' , controller: 'leftNavCtrl'},
                'rightPanel': { templateUrl: 'views/authenticated/dashboard.tmpl.html', controller: 'dashboardCtrl'}
            },
            resolve: {
                IsLoggedIn: function (userFactory) {
                    return userFactory.isLoggedIn();
                }
            }
        })
        .state('accountsettings', {
            url: '/accountsettings',
            views: {
                'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
                'leftNav': { templateUrl: 'views/authenticated/leftNav.html', controller: 'leftNavCtrl'},
                'rightPanel': { templateUrl: 'views/authenticated/accountsettings.html', controller: 'accountSettingsCtrl'}
            },
            resolve: {
                IsLoggedIn: function (userFactory) {
                    return userFactory.isLoggedIn();
                }
            }
        })
        .state('locations', {
            url: '/locations',
            views: {
                'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
                'leftNav': { templateUrl: 'views/authenticated/leftNav.html', controller: 'leftNavCtrl'},
                'rightPanel': { templateUrl: 'views/authenticated/locations.html', controller: 'locationsCtrl'}
            },
            resolve: {
                IsLoggedIn: function (userFactory) {
                    return userFactory.isLoggedIn();
                }
            }
        })
        .state('users', {
            url: '/users',
            views: {
                'navigation': { templateUrl: 'views/header.html', controller: 'NavCtrl'},
                'leftNav': { templateUrl: 'views/authenticated/leftNav.html', controller: 'leftNavCtrl'},
                'rightPanel': { templateUrl: 'views/authenticated/users.html', controller: 'usersCtrl'}
            },
            resolve: {
                IsLoggedIn: function (userFactory) {
                    return userFactory.isLoggedIn();
                }
            }
        });

//        $locationProvider.html5Mode({
//            enabled: true,
//            requireBase: false
//        });
});

app.run( function($rootScope, $location, $state) {

    // register listener to watch route changes
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams){
          if(('/dashboard' == toState.url || '/users' == toState.url || '/locations' == toState.url || '/accountsettings' == toState.url || '/verifyUser' == toState.url) && '/' == fromState.url){
              if(!$rootScope.isLoggedIn) {
                  event.preventDefault(); //prevents from resolving requested url
                  $state.go('/'); //redirects to 'home.other' state url
              }
          }
      });
})

app.controller('partnerPortalCtrl', function ($scope, $rootScope, $state, $cookies, $q, $timeout, $mdDialog, $location) {
    CarglyPartner.configure({
        //applicationId: "Ir85FTuOGRMujq9Xy88RrgmqnyoKm8HN", // test
        applicationId: "bTkSVhhdCDKmJU1KrE9nmwBllTl8iQ9r", // prod
        appLabel: "rsmt",
        onAuthChanged: function () {
            if (CarglyPartner.isResettingPassword()) {
//              console.log("isResettingPassword " + CarglyPartner.isResettingPassword());
            }
            else if (CarglyPartner.isLoggedIn()) {
              //console.log("CarglyPartner.configure isLoggedIn " + CarglyPartner.isLoggedIn());
                $mdDialog.hide();

                if (CarglyPartner.user.verified == 'true') {
                    $rootScope.isVerified = true;
                    if($state.current.url == '/'){
                        $state.go("dashboard");
                    }
                } else {
                    $state.go("VerifyUser");
                    $rootScope.isVerified = false;
                }
                $rootScope.headerText = "Signed in as " + CarglyPartner.user.name;
                $rootScope.isLoggedIn = true;

            }
            else {
                $rootScope.headerText = "Already Registered?";
//              console.log("confirm " + CarglyPartner.isConfirmingAccount());
                if (CarglyPartner.isConfirmingAccount()) {
                    $state.go("/");
                }
                else {
                    $state.go('/');
                }
            }
        }
    });
});
