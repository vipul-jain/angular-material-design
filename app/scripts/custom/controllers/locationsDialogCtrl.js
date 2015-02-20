'use strict';

app.controller('locationsDialogCtrl',
    function ($scope, $rootScope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.newLocation = {};

        if ($rootScope.editLocation) {
            $scope.newLocation = angular.copy($rootScope.editLocation);
            $rootScope.editLocation = null;
        } else {
            $scope.newLocation = {
                locationId: '',
                name: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                timezone: 'US/Central',
                zip: ''
            };
        };

        $scope.saveLocation = function (newLocation) {
            var id = null;
            if (newLocation.id)id = newLocation.id;
            CarglyPartner.ajax({
                url: '/partners/api/locations' + (id ? "/" + id : "" ),
                type: 'POST',
                data: newLocation,
                success: function (data) {
                    $rootScope.$broadcast("refreshLocations");
                    $scope.hide();
                },error: function (request, status, error) {
                    console.log('Not Saved');
                }
            });
        };
    });