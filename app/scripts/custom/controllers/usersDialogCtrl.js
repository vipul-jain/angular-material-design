'use strict';
app.controller('usersDialogCtrl',
    function ($scope, $rootScope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        if ($rootScope.editUser) {
            $scope.newUser = $rootScope.editUser;
            $rootScope.editUser = null;
        } else {
            $scope.newUser = {
                userId: '',
                name: '',
                email: '',
                role: 'User',
                defaultLocation: '',
                customerContact: '',
                verified: 'false'
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
                    $scope.$apply();
                }
            });
        };
        $scope.fetchLocations();
    });