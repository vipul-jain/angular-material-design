'use strict';
app.controller('VerifyUserCtrl', function($scope, $timeout, $mdSidenav, $log, $rootScope, $cookies, $state, $mdDialog) {
    var token = $cookies.cargly_rsmt_access_token;
    if (angular.isUndefined(token) || token === null ) {
        //$state.go('/');
        //$rootScope.headerText = "Already Registered?";
        //$rootScope.isLoggedIn = false;
    } else {
        CarglyPartner._getUser(token, function (success) {
            //console.log('success');
            $rootScope.headerText = "Signed in as " + CarglyPartner.user.name;
            //console.log('home header ' + $rootScope.headerText );
            $rootScope.isLoggedIn = true;
        }, function (error) {
            $state.go('/');
            $rootScope.headerText = "Already Registered?";
            $rootScope.isLoggedIn = false;
            //console.log('error');

        });
    }

    $scope.resendConfimEmail = function(){
        CarglyPartner.reconfirmUser(function() {
        });
    }
});