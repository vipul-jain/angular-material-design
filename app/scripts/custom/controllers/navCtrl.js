'use strict';
app.controller('NavCtrl', function ($rootScope, $scope, $mdDialog, $mdSidenav, $state, $cookies,$log) {

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
                $('#leftNav').css('margin-top','50px');
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

    if($cookies['cargly_rsmt_access_token'])
    {
        setTimeout(function(){
            $('#leftNav').css('box-shadow','0 8px 17px rgba(0, 0, 0, 0.2)');
        },10);

    }
});
