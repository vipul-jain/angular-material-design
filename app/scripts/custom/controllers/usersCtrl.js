'use strict';
app.controller('usersCtrl',
    function ($scope, $http, $timeout, $mdSidenav, $log, $rootScope, $cookies, $state, $mdDialog) {

        $scope.newUser = function (ev) {
            $mdDialog.show({
                controller: 'usersDialogCtrl',
                templateUrl: 'views/authenticated/newuser.html',
                targetEvent: ev
            });
        };

        var userFilterOptions = {
            filterText: "",
            useExternalFilter: false
        };
        var userTotalServerItems = 0;
        var userPagingOptions = {
            pageSizes: [5, 10, 25, 50],
            pageSize: 5,
            currentPage: 1
        };
        $scope.setPagingData = function (data, page, pageSize) {
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.userTotalServerItems = data.length;
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
                        url: '/partners/api/users',
                        type: 'GET',
                        success: function (largeLoad) {

                            data = largeLoad.filter(function (item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            $scope.setPagingData(data, page, pageSize);
                        }});
                } else {
                    CarglyPartner.ajax({
                        url: '/partners/api/users',
                        type: 'GET',
                        success: function (data) {
                            CarglyPartner.users = data;
                            $scope.setPagingData(data, page, pageSize);
                        }
                    });
                }
            }, 100);
        };

        $scope.$on("refressUsers", function (event) {
            $scope.getPagedDataAsync(userPagingOptions.pageSize, userPagingOptions.currentPage);
        });

        $scope.getPagedDataAsync(userPagingOptions.pageSize, userPagingOptions.currentPage);

        $scope.$watch('userPagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                //was there a page change? if not make sure to reset the page to 1 because it must have been a size change
                if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
                    userPagingOptions.currentPage = 1; //  this will also trigger this same watch
                } else {
                    // update the grid with new data
                    $scope.getPagedDataAsync(userPagingOptions.pageSize, userPagingOptions.currentPage, userFilterOptions.filterText);
                }

            }
        }, true);

        $scope.$watch('userFilterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync(userPagingOptions.pageSize, userPagingOptions.currentPage, userFilterOptions.filterText);
            }
        }, true);

        $scope.userDelete = '<md-button class="md-raised btn btnRed" style="margin:8px 15px !important;" ng-click="fnUserDelete(row,$event)" >Remove</md-button> ';
        $scope.userEdit = '<md-button class="md-raised btn btnBlue" style="margin:8px 15px !important;" ng-click="fnUserEdit(row,$event)" >Edit</md-button> ';

        $scope.userGridOptions = {
            data: 'myData',
            rowHeight: 50,
            enablePaging: true,
            showFooter: true,
            totalServerItems: userTotalServerItems,
            pagingOptions: userPagingOptions,
            filterOptions: userFilterOptions,
            showFilter: true,
            columnDefs: [
                {field: 'name', displayName: 'Name'},
                {field: 'email', displayName: 'Email'},
                {field: 'role', displayName: 'Role'},
                {field: 'verified', displayName: 'Verified'},
                {displayName: 'Delete', cellTemplate: $scope.userDelete},
                {displayName: 'Edit', cellTemplate: $scope.userEdit}
            ]
        };

        $scope.fnUserDelete = function (row, event) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete user?')
                .content('User record delete')
                .ariaLabel('User')
                .ok('User')
                .cancel('Cancel')
                .targetEvent(event);
            $mdDialog.show(confirm).then(function () {
                CarglyPartner.ajax({
                    url: '/partners/api/users/' + row.entity.id,
                    type: 'DELETE',
                    data: null,
                    success: function (data) {
                        $scope.getPagedDataAsync(locationpagingOptions.pageSize, locationpagingOptions.currentPage, locationFilterOptions.filterText);
                    }
                })
            });
        };

        $scope.fnUserEdit = function (row, event) {
            console.log(row.entity);
            $rootScope.editUser = row.entity;
            $scope.newUser(event);
        };

    });