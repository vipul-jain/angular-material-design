'use strict';

app.controller('signinDialogCtrl',
    function ($scope, $state, $rootScope, $mdDialog) {
        $scope.isError1 = false;

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.forgotPassword = function (ev) {
            $mdDialog.show({
                controller: 'signinDialogCtrl',
                templateUrl: 'views/forgotpassword.tmpl.html',
                targetEvent: ev
            });
        };

        $scope.signInUser = function () {
            CarglyPartner.login($scope.email, $scope.password, function () {
                    $mdDialog.hide();
                    if (CarglyPartner.user.verified == 'true')
                        $state.go('dashboard');
                    else
                        $state.go('VerifyUser');
                    $rootScope.isLoggedIn = true;
                    $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
                    $scope.email = '';
                    $scope.password = '';
                    setTimeout(function(){
                        $('#leftNav').css('box-shadow','0 8px 17px rgba(0, 0, 0, 0.2)');
                    },10);
                },
                function () {
                    $rootScope.isLoggedIn = false;
                    $scope.isError = true;
                    $scope.$apply();
                }
            );
        };

        $scope.resendMail = function () {
            CarglyPartner.requestPasswordReset($scope.resendEmail,
                function () {
                    $scope.hide();
                },
                function () {
                    $scope.hide();
                }
            );
        }

    });