'use strict';
app.factory('userFactory', ['$http', '$q', '$timeout', '$cookies', '$rootScope', '$state', '$location', function ($http, $q, $timeout, $cookies, $rootScope, $state, $location) {
    //$rootScope.isLoggedIn = true;
    var userFactory = {};
    userFactory.isLoggedIn = function () {
        //console.log("userFactory.isLoggedIn ");
        var token = $cookies['cargly_rsmt_access_token'];
        var promise = $q.defer();
        if (angular.isUndefined(token) || token === null) {
            promise.reject;
            $rootScope.headerText = 'Already Registered?';
            $rootScope.isLoggedIn = false;
            $state.go('/');
        } else {
            CarglyPartner._getUser(token, function () {
                //console.log("_getUser " + CarglyPartner.user.name);
                $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
                $rootScope.isLoggedIn = true;
                promise.resolve;
            }, function () {
                promise.reject;
                $rootScope.headerText = 'Already Registered?';
                $rootScope.isLoggedIn = false;
                $state.go('/');
            });
        }
        return promise;
    };

    userFactory.isVerified = function () {
        var token = $cookies['cargly_rsmt_access_token'];
        var promise = $q.defer();
        if (angular.isUndefined(token) || token === null) {
            promise.reject;
            $rootScope.headerText = 'Already Registered?';
            $rootScope.isLoggedIn = false;
            $location.url("/");
        } else {
            CarglyPartner._getUser(token, function () {
                $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
                $rootScope.isLoggedIn = true;
                console.log('CarglyPartner.user.verified' + CarglyPartner.user.verified);
                if (CarglyPartner.user.verified == 'true') {
                    promise.reject;
                    $state.go('dashboard');
                    $rootScope.isVerified = true;
                } else {
                    promise.reject;
                    $state.go('VerifyUser');
                    $rootScope.isVerified = false;
                }
            }, function () {
                promise.reject;
                $rootScope.headerText = 'Already Registered?';
                $rootScope.isLoggedIn = false;
                $location.url("/");
            });
        }
        return promise;
    };

    userFactory.alreadyLoggedIn = function () {
        var token = $cookies['cargly_rsmt_access_token'];
        if (token)
            console.log('token ' + token);
        else
            token = null;
        var promise = $q.defer();
        if (angular.isUndefined(token) || token === null) {
            promise.resolve;
            $location.url("/");
            $rootScope.headerText = 'Already Registered?';
        } else {
            CarglyPartner._getUser(token, function () {
                $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
                $rootScope.isLoggedIn = true;
                if (CarglyPartner.user.verified == 'true') {
                    $rootScope.isVerified = true;
                } else {
                    $rootScope.isVerified = false;
                }
                promise.reject;
            }, function () {
                promise.resolve;
                $location.url("/");
                $rootScope.headerText = 'Already Registered?';
                $rootScope.isLoggedIn = false;
            });
        }
        return promise;
    }
    return userFactory;
}]);
