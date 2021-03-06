'use strict';
app.controller('NavCtrl', function ($rootScope, $scope, $mdDialog, $mdSidenav, $state) {
    $rootScope.leftBarLoaded = true;
    $scope.showSignIn = function (ev) {
        $mdDialog.show({
            controller: 'signinDialogCtrl',
            templateUrl: 'views/signin.tmpl.html',
            targetEvent: ev
        });
    };

    $scope.showMenu = function () {
        $mdSidenav('left').toggle()
            .then(function () {
                //$log.debug('toggle left is done');
            });
    }

    $scope.logout = function () {
//      delete $cookies['cargly_rsmt_access_token'];
        CarglyPartner.logout(function (success) {
            $state.go('/');
            $rootScope.isLoggedIn = false;
            $rootScope.isVerified = false;
            $rootScope.headerText = 'Already Registered?';
        }, function (error) {

        });

    };
});
