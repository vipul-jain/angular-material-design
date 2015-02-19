'use strict';
app.controller('usersDialogCtrl',
    function ($scope, $rootScope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        /*$scope.newUser.verified = 'false';*/
        if ($rootScope.editUser) {

            $scope.newUser = angular.copy($rootScope.editUser);
            if($rootScope.editUser.verified == 'true')
            {
                console.log('true');
                $scope.newUser.verified = true;
            }
            else{
                $scope.newUser.verified = false;
            }

            $rootScope.editUser = null;

        } else {
            $scope.newUser = {
                userId: '',
                name: '',
                email: '',
                role: 'User',
                defaultLocation: '',
                customerContact: 'false',
                verified: ''
            };
        }

        $scope.saveUser = function (newUser) {
            var id = null;
            if (newUser.id)
                var id = newUser.id;
            CarglyPartner.ajax({
                url: '/partners/api/users' + (id ? "/" + id : "" ),
                type: 'POST',
                data: newUser,
                success: function (data) {
                    console.log('data=',data);
                    $rootScope.$broadcast("refressUsers");
                    $scope.hide();
                }
            });
        };

        $scope.locations = '';
        // Locations
        $scope.fetchLocations = function () {
            CarglyPartner.ajax({
                url: '/partners/api/locations',
                type: 'GET',
                success: function (data) {
                    $scope.locations = data;
                    $scope.newUser.defaultLocation = data[0].id;
                    $scope.$apply();
                }
            });
        };
        $scope.fetchLocations();
    });