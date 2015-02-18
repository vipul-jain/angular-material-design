'use strict';
app.controller('locationsCtrl',
    function ($scope, $http, $timeout, $mdSidenav, $log, $rootScope, $cookies, $state, $mdDialog) {

        $scope.newLocation = function (ev) {
            $mdDialog.show({
                controller: 'locationsDialogCtrl',
                templateUrl: 'views/authenticated/newlocation.html',
                targetEvent: ev
            });
        }

        var locationFilterOptions = {
            filterText: "",
            useExternalFilter: false
        };

        var locationTotalServerItems = 0;
        var locationpagingOptions = {
            pageSizes: [5, 10, 25, 50],
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingDataLocation = function (data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.locationmyData = pagedData;
            locationTotalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();

            }
        };

        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            setTimeout(function () {
                var data;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    CarglyPartner.ajax({
                        url: '/partners/api/locations',
                        type: 'GET',
                        success: function (largeLoad) {

                            data = largeLoad.filter(function (item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            $scope.setPagingData(data, page, pageSize);
                        }});
                } else {
                    CarglyPartner.ajax({
                        url: '/partners/api/locations',
                        type: 'GET',
                        success: function (data) {
                            CarglyPartner.locations = data;
                            $scope.setPagingDataLocation(data, page, pageSize);
                        }
                    });
                }
            }, 100);
        };

        $scope.$on("refressLocations", function (event) {
            $scope.getPagedDataAsync(locationpagingOptions.pageSize, locationpagingOptions.currentPage);
        });

        $scope.getPagedDataAsync(locationpagingOptions.pageSize, locationpagingOptions.currentPage);

        $scope.$watch('locationpagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                //was there a page change? if not make sure to reset the page to 1 because it must have been a size change
                if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
                    locationpagingOptions.currentPage = 1; //  this will also trigger this same watch
                } else {
                    // update the grid with new data
                    $scope.getPagedDataAsync(locationpagingOptions.pageSize, locationpagingOptions.currentPage, locationFilterOptions.filterText);
                }

            }
        }, true);

        $scope.$watch('locationFilterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync(locationpagingOptions.pageSize, locationpagingOptions.currentPage, locationFilterOptions.filterText);
            }
        }, true);

        $scope.selectedLocation = [];

        $scope.locationDelete = '<md-button class="md-raised btn btnRed" style="margin:8px 15px !important;" ng-click="fnLocationDelete(row,$event)" >Remove</md-button> ';
        $scope.locationEdit = '<md-button class="md-raised btn btnBlue" style="margin:8px 15px !important;" ng-click="fnLocationEdit(row,$event)">Edit</md-button>';
        $scope.locationGridOptions = {
            data: 'locationmyData',
            rowHeight: 50,
            selectedItems: $scope.selectedLocation,
            multiSelect: false,
            afterSelectionChange: function (row, $event) {
                $scope.selectedIDs = [];
                angular.forEach($scope.selectedLocation, function (item) {
                    $scope.selectedIDs.push(item.id)
                });
            },
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'locationTotalServerItems',
            pagingOptions: locationpagingOptions,
            filterOptions: locationFilterOptions,
            showFilter: true,
            columnDefs: [
                {field: 'name', displayName: 'Name'},
                {field: 'address', displayName: 'Address'},
                {field: 'city', displayName: 'City'},
                {field: 'state', displayName: 'State'},
                {field: 'zip', displayName: 'Zip'},
                { displayName: 'Delete', cellTemplate: $scope.locationDelete},
                { displayName: 'Edit', cellTemplate: $scope.locationEdit}
            ]
        };

        $scope.fnLocationDelete = function (row, event) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete location?')
                .content('Location record delete')
                .ariaLabel('Delete')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event);
            $mdDialog.show(confirm).then(function () {
                CarglyPartner.ajax({
                    url: '/partners/api/locations/' + row.entity.id,
                    type: 'DELETE',
                    data: null,
                    success: function (data) {
                        $scope.getPagedDataAsync(locationpagingOptions.pageSize, locationpagingOptions.currentPage, locationFilterOptions.filterText);
                    }
                })
            }, function () {

            });

        };

        $scope.fnLocationEdit = function (row, event) {
            console.log(row.entity);
            $rootScope.editLocation = row.entity;
            $scope.newLocation(event);
        };

    });