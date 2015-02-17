'use strict';
app.controller('AppCtrl', function ($scope, $http, $timeout, $mdSidenav, $log, $rootScope, $cookies, $state, $mdDialog) {
    var token = $cookies.cargly_rsmt_access_token;
    if (angular.isUndefined(token) || token === null) {
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

    $scope.view = 'dashboard';

    $scope.newUser = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/newuser.html',
            targetEvent: ev
        });
    }

    $scope.newLocation = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/newlocation.html',
            targetEvent: ev
        });
    }

    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        //$scope.forgotPassword = function(ev) {
        //  $mdDialog.show({
        //    controller: DialogController,
        //    templateUrl: 'views/forgotpassword.tmpl.html',
        //    targetEvent: ev
        //  });
        //};
        //
        //$scope.signInUser = function(){
        //  CarglyPartner.login($scope.email, $scope.password, function() {
        //      $cookies['cargly_rsmt_access_token'] = CarglyPartner.accessToken;
        //      $mdDialog.hide();
        //      if(CarglyPartner.user.verified == 'true')
        //        $state.go('Home');
        //      else
        //        $state.go('VerifyUser');
        //      $rootScope.isLoggedIn = true;
        //      $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
        //      $scope.email = '';
        //      $scope.password = '';
        //    },
        //    function() {
        //      $rootScope.isLoggedIn = false;
        //      $scope.isError = true;
        //      $scope.$apply();
        //    }
        //  );
        //};
        //
        //$scope.resendMail = function(){
        //  CarglyPartner.requestPasswordReset($scope.resendEmail,
        //    function() {
        //      $scope.hide();
        //    },
        //    function() {
        //      $scope.hide();
        //    }
        //  );
        //}

        $scope.newUser = {
            userId: '',
            name: '',
            email: '',
            role: 'User',
            defaultLocation: '',
            customerContact: ''
        };
        $scope.saveUser = function (newUser) {
            var id = null;
            CarglyPartner.ajax({
                url: '/partners/api/users' + (id ? "/" + id : "" ),
                type: 'POST',
                data: newUser,
                success: function (data) {

                }
            });
        };

        $scope.locations = '';
        // Users
        $scope.fetchLocations = function () {
            CarglyPartner.ajax({
                url: '/partners/api/locations',
                type: 'GET',
                success: function (data) {
                    $scope.locations = data;
                    $scope.$apply();
                }
            });
        };
        $scope.fetchLocations();


        $scope.newLocation = {
            locationId: '',
            name: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            timezone: '',
            zip: ''
        };

        $scope.saveLocation = function (newLocation) {
            var id = null;
            CarglyPartner.ajax({
                url: '/partners/api/locations' + (id ? "/" + id : "" ),
                type: 'POST',
                data: newLocation,
                success: function (data) {

                }
            });
        }
    };

    $scope.removeCCInfo = function () {
        CarglyPartner.ajax({
            url: '/partners/api/paymentInfo',
            type: 'DELETE',
            data: null,
            success: function (data) {
                fetchAccount();
            }
        });
    }

    $scope.updateUser = function () {
        var id = CarglyPartner.user.id;
        if (id.length == 0) id = null;
        CarglyPartner.ajax({
            url: '/partners/api/account' + (id ? "/" + id : "" ),
            type: 'POST',
            data: $scope.user,
            success: function (data) {
                //fetchUsers();
                //$('#usersModal').modal('hide');
            }
        });
    }

    $scope.updateAccountForm = function () {
        if (CarglyPartner.accountInfo) {
            $scope.user = {
                businessName: CarglyPartner.accountInfo["businessName"],
                website: CarglyPartner.accountInfo["website"],
                address: CarglyPartner.accountInfo["address"],
                city: CarglyPartner.accountInfo["city"],
                state: CarglyPartner.accountInfo["state"],
                zip: CarglyPartner.accountInfo["zip"],
                timezone: CarglyPartner.accountInfo["timezone"],
                contactName: CarglyPartner.accountInfo["contactName"],
                paymentProcessingSecretKey: CarglyPartner.accountInfo["paymentProcessingSecretKey"],
                paymentProcessingPublicKey: CarglyPartner.accountInfo["paymentProcessingPublicKey"],
                paymentProcessingAccountId: CarglyPartner.accountInfo["paymentProcessingAccountId"]
            };
            $scope.cardType = CarglyPartner.accountInfo["cardType"];
            $scope.cardLast4 = CarglyPartner.accountInfo["cardLast4"];
            $scope.email = CarglyPartner.accountInfo["email"],
                $scope.$apply();
        }
    }

    $scope.fetchAccount = function () {
        console.log(CarglyPartner.user);
        CarglyPartner.ajax({
            url: '/partners/api/account/' + CarglyPartner.user.id,
            type: 'GET',
            success: function (data) {
                CarglyPartner.accountInfo = data;
                $scope.updateAccountForm();
            }
        });
        return false;
    }

    $scope.closeLeftMenu = function () {
        $mdSidenav('left').close();
    };

    $scope.changeView = function (view) {
        if (view == 'dashboard') {
            $scope.rightPanel = "views/dashboard.tmpl.html";
            $scope.view = 'dashboard';
        } else if (view == 'locations') {
            $scope.rightPanel = "views/locations.html";
            $scope.view = 'locations';
        } else if (view == 'users') {
            $scope.rightPanel = "views/users.html";
            $scope.view = 'users';
        } else if (view == 'accountsettings') {
            $scope.rightPanel = "views/accountsettings.html";
            $scope.view = 'accountsettings';
            $scope.fetchAccount();
        }
    }

    $scope.changeView('dashboard');
});
