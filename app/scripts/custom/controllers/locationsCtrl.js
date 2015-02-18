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

        $scope.locationFilterOptions = {
            filterText: "",
            useExternalFilter: false
        };

        $scope.locationTotalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [5, 10, 25, 50],
            pageSize: 10,
            currentPage: 1
        };

        $scope.setPagingData = function (data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.locationmyData = pagedData;
            $scope.locationTotalServerItems = data.length;
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
                            $scope.setPagingData(data, page, pageSize);
                        }
                    });
                }
                $('.gridStyle').trigger('resize');
            }, 100);
        };

        $scope.$on("refressLocations", function (event) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        });

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
                    $scope.pagingOptions.currentPage = 1;
                } else {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.locationFilterOptions.filterText);
                }

            }
        }, true);

        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.locationFilterOptions.filterText);
            }
        }, true);

        $scope.selectedLocation = [];

        $scope.locationDelete = '<md-button class="md-warn md-raised md-hue-2" style="margin:8px 15px !important;" ng-click="fnLocationDelete(row,$event)" >Remove</md-button> ';
        $scope.locationEdit = '<md-button class="md-raised btn btnBlue" style="margin:8px 15px !important;" ng-click="fnLocationEdit(row,$event)">Edit</md-button>';
        $scope.locationGridOptions = {
            data: 'locationmyData',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'locationTotalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.locationFilterOptions,
            showFilter : true,
            rowHeight: 50,
            multiSelect:false,
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
                        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.locationFilterOptions.filterText);
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
