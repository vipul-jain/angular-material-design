'use strict';
app.controller('VerifyUserCtrl', function ($scope, $timeout, $mdSidenav, $log, $rootScope, $cookies, $state, $mdDialog) {
    var token = $cookies.cargly_rsmt_access_token;
    if (angular.isUndefined(token) || token === null) {

    } else {
        CarglyPartner._getUser(token, function (success) {
            $rootScope.headerText = "Signed in as " + CarglyPartner.user.name;
            $rootScope.isLoggedIn = true;
        }, function (error) {
            $state.go('/');
            $rootScope.headerText = "Already Registered?";
            $rootScope.isLoggedIn = false;
        });
    }

    $scope.resendConfimEmail = function () {
        CarglyPartner.reconfirmUser(function () {
        });
    }
});
