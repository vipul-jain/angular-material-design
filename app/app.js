
/**
 * @ngdoc overview
 * @name patnerPortalApp
 * @description
 * # patnerPortalApp
 *
 * Main module of the application.
 */
var app = angular.module('patnerPortalApp', ['ui.router', 'ngMaterial', 'ngCookies', 'ngGrid']);

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
                'rightPanel': { templateUrl: 'views/authenticated/dashboard.tmpl.html'}
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

app.controller('patnerPortalCtrl', function ($scope, $rootScope, $state, $cookies, $q, $timeout, $mdDialog) {
    CarglyPartner.configure({
        //applicationId: "Ir85FTuOGRMujq9Xy88RrgmqnyoKm8HN", // test
        applicationId: "bTkSVhhdCDKmJU1KrE9nmwBllTl8iQ9r", // prod
        appLabel: "rsmt",
        onAuthChanged: function () {
            if (CarglyPartner.isResettingPassword()) {
              console.log("isResettingPassword " + CarglyPartner.isResettingPassword());
            }
            else if (CarglyPartner.isLoggedIn()) {
              console.log("isLoggedIn " + CarglyPartner.isLoggedIn());
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
              console.log("confirm " + CarglyPartner.isConfirmingAccount());
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
