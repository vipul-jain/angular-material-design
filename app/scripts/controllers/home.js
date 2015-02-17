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
        $scope.newLocation = {};
        if($rootScope.editUser){
//            angular.forEach($rootScope.editUser,function(key,val){
                $scope.newLocation =  $rootScope.editUser;
//            });
        }else {
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
        }

        $scope.saveLocation = function (newLocation) {
            if(newLocation.id){
                var id = newLocation.id;
                if (id.length == 0) id = null;
                CarglyPartner.ajax({
                    url: '/partners/api/locations' + (id ? "/" + id : "" ),
                    type: 'POST',
                    data: newLocation,
                    success: function(data) {
                    }
                });

            }else{
                var id = null;
                CarglyPartner.ajax({
                    url: '/partners/api/locations' + (id ? "/" + id : "" ),
                    type: 'POST',
                    data: newLocation,
                    success: function (data) {

                    }
                });
            }
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

    /*********************** User Tab *************************/
    var userFilterOptions = {
        filterText: "",
        useExternalFilter: false
    };
    var userTotalServerItems = 0;
    var userPagingOptions = {
        pageSizes: [5,10, 25, 50],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize){
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
                    success: function(largeLoad) {

                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    }});

            } else {
                /*$http.get('json/data.json').success(function (largeLoad) {*/
                CarglyPartner.ajax({
                    url: '/partners/api/users',
                    type: 'GET',
                    success: function(data) {
                        CarglyPartner.users = data;
                        $scope.setPagingData(data,page,pageSize);
                    }
                });
                /* });*/
            }
        }, 100);
    };

    $scope.getPagedDataAsync(userPagingOptions.pageSize, userPagingOptions.currentPage);

    $scope.$watch('userPagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            //was there a page change? if not make sure to reset the page to 1 because it must have been a size change
            if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
                userPagingOptions.currentPage = 1; //  this will also trigger this same watch
            } else {
                // update the grid with new data
                $scope.getPagedDataAsync(userPagingOptions.pageSize,userPagingOptions.currentPage, userFilterOptions.filterText);
            }

        }
    }, true);

    $scope.$watch('userFilterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync(userPagingOptions.pageSize, userPagingOptions.currentPage, userFilterOptions.filterText);
        }
    }, true);

    $scope.userEditableInPopup = '<button id="editBtn" type="button" class="btn btnRed" ng-click="userDeleteThisRow(row)" >Remove</button> ';

    $scope.userGridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        totalServerItems: userTotalServerItems,
        pagingOptions: userPagingOptions,
        filterOptions: userFilterOptions,
        showFilter : true,
        columnDefs: [
            {field: 'name', displayName: 'Name'},
            {field: 'email', displayName: 'Email'},
            {field: 'role', displayName: 'Role'},
            {field: 'verified', displayName: 'Verified'},
            {displayName: 'Action', cellTemplate:$scope.userEditableInPopup}
        ]
    };

    $scope.userDeleteThisRow = function(row) {
        CarglyPartner.ajax({
            url: '/partners/api/users/' + row.entity.id,
            type: 'DELETE',
            data: null,
            success: function (data) {
                $scope.getPagedDataAsync(locationpagingOptions.pageSize, locationpagingOptions.currentPage, locationFilterOptions.filterText);
            }
        })
    }

    /*********************** Location Tab *************************/

    var locationFilterOptions = {
        filterText: "",
        useExternalFilter: false
    };
    var locationTotalServerItems = 0;
    var locationpagingOptions = {
        pageSizes: [5,10, 25, 50],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingDataLocation = function(data, page, pageSize){
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.locationmyData = pagedData;
        locationTotalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();

        }
    };
    $scope.getPagedDataAsync1 = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                CarglyPartner.ajax({
                    url: '/partners/api/locations',
                    type: 'GET',
                    success: function(largeLoad) {

                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    }});
            } else {
                /*$http.get('json/data.json').success(function (largeLoad) {*/
                CarglyPartner.ajax({
                    url: '/partners/api/locations',
                    type: 'GET',
                    success: function(data) {
                        CarglyPartner.locations = data;
                        $scope.setPagingDataLocation(data,page,pageSize);
                    }
                });
                /*});*/
            }
        }, 100);
    };

    $scope.getPagedDataAsync1(locationpagingOptions.pageSize, locationpagingOptions.currentPage);

    $scope.$watch('locationpagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            //was there a page change? if not make sure to reset the page to 1 because it must have been a size change
            if (newVal.currentPage === oldVal.currentPage && oldVal.currentPage !== 1) {
                locationpagingOptions.currentPage = 1; //  this will also trigger this same watch
            } else {
                // update the grid with new data
                $scope.getPagedDataAsync1(locationpagingOptions.pageSize,locationpagingOptions.currentPage, locationFilterOptions.filterText);
            }

        }
    }, true);

    $scope.$watch('locationFilterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync1(locationpagingOptions.pageSize, locationpagingOptions.currentPage, locationFilterOptions.filterText);
        }
    }, true);

    $scope.selectedLocation = [];

    $scope.locationDelete = '<md-button type="button" class="md-raised btn btnRed" ng-click="fnLocationDelete(row)" >Remove</md-button> ';
    $scope.locationEdit = '<md-button class="md-raised btn btnEdit" ng-click="fnLocationEdit(row,$event)">Edit</md-button>';
    $scope.locationGridOptions = {
        data: 'locationmyData',
        selectedItems: $scope.selectedLocation,
        multiSelect:false,
        afterSelectionChange: function (row, $event) {
            $scope.selectedIDs = [];
            angular.forEach($scope.selectedLocation, function ( item ) {
                $scope.selectedIDs.push( item.id )
            });
//            $rootScope.editUser = $scope.selectedLocation;
//            $scope.newLocation($event);
        },
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'locationTotalServerItems',
        pagingOptions: locationpagingOptions,
        filterOptions: locationFilterOptions,
        showFilter : true,
        columnDefs:[
            {field: 'name', displayName: 'Name'},
            {field: 'address', displayName: 'Address'},
            {field: 'city', displayName: 'City'},
            {field: 'state', displayName: 'State'},
            {field: 'zip', displayName: 'Zip'},
            { displayName: '', cellTemplate:$scope.locationDelete},
            { displayName: '', cellTemplate:$scope.locationEdit}
        ]
        /*columnDefs: [
            {field: 'name', displayName: 'Name',cellTemplate: '<div  ng-click="$event.stopPropagation();       getLocationData(row)"       ng-bind="row.getProperty(col.field)"></div>'},
            {field: 'address', displayName: 'Address',cellTemplate: '<div  ng-click="$event.stopPropagation(); getLocationData(row)" ng-bind="row.getProperty(col.field)"></div>'},
            {field: 'city', displayName: 'City',cellTemplate: '<div  ng-click="$event.stopPropagation();   getLocationData(row)"   ng-bind="row.getProperty(col.field)"></div>'},
            {field: 'state', displayName: 'State',cellTemplate: '<div  ng-click="$event.stopPropagation(); getLocationData(row)" ng-bind="row.getProperty(col.field)"></div>'},
            {field: 'zip', displayName: 'Zip',cellTemplate: '<div  ng-click="$event.stopPropagation();     getLocationData(row)"     ng-bind="row.getProperty(col.field)"></div>'}
        ]*/
    };
    $scope.fnLocationDelete = function(row) {
        CarglyPartner.ajax({
            url: '/partners/api/locations/' + row.entity.id,
            type: 'DELETE',
            data: null,
            success: function (data) {
                $scope.getPagedDataAsync1(locationpagingOptions.pageSize, locationpagingOptions.currentPage, locationFilterOptions.filterText);
            }
        })
    }
    $scope.fnLocationEdit = function(row,event) {
        console.log(row.entity);
        $rootScope.editUser = row.entity;
        $scope.newLocation(event);
    }
    /*$scope.$on('ngGridEventData', function(){
        $scope.locationGridOptions.selectRow(0, true);
    });
    $scope.getLocationData = function(row) {
        *//*alert('hi '+row.entity);*//*
        *//*console.log(row.entity);*//*
        console.log(row);
        $rootScope.editUser = $scope.selectedLocation;
        $scope.newLocation(row);
    };*/

});
