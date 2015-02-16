'use strict';

/**
 * @ngdoc function
 * @name patnerPortalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the patnerPortalApp
 */
 app.controller('MainCtrl', function ($scope, $rootScope, $mdDialog, $state, $timeout, $mdSidenav, $log, $q){
    $scope.user = {
      businessName:"",
      businessZip:"",
      businessTimezone:"",
      businessUrl:"",
      contactName:"",
      contactEmail:"",
      password:""
    };

    $scope.error = '';
    $rootScope.headerText = "Already Registered?";
    $rootScope.isLoggedIn = false;

    var HTTP_CONFLICT = 409;

    $scope.registerUser = function(){
      CarglyPartner.createPartner($scope.user,
        function(success) {
          $scope.user = {
            businessName:"",
            businessZip:"",
            businessTimezone:"",
            businessUrl:"",
            contactName:"",
            contactEmail:"",
            password:""
          };
          $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
          $rootScope.isLoggedIn = true;
          $state.go('VerifyUser');
        },
        function(failure) {
          if (failure["status"] == HTTP_CONFLICT) {
              $scope.error ='The email address provided is already associated with another partner account.';
          }
          else {
              $scope.error='An unexpected error occurred on the server. Please reload the page and try again. If the problem continues, contact us at support@cargly.com.';
          }
          $scope.$apply();
        }
      );
    }

     $scope.resendConfimEmail = function(){
         CarglyPartner.reconfirmUser(function() {

         });
     }

     var self = this;
     // list of `state` value/display objects
     self.states        = loadAll();
     self.selectedItem  = null;
     self.searchText    = null;
     self.querySearch   = querySearch;
     // ******************************
     // Internal methods
     // ******************************
     /**
      * Search for states... use $timeout to simulate
      * remote dataservice call.
      */
     function querySearch (query) {
         var results = query ? self.states.filter( createFilterFor(query) ) : [],
             deferred;
         return results;
     }
     /**
      * Build `states` list of key/value pairs
      */
     function loadAll() {
         var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
         return allStates.split(/, +/g).map( function (state) {
             return {
                 value: state.toLowerCase(),
                 display: state
             };
         });
     }
     /**
      * Create filter function for a query string
      */
     function createFilterFor(query) {
         var lowercaseQuery = angular.lowercase(query);
         return function filterFn(state) {
             return (state.value.indexOf(lowercaseQuery) === 0);
         };
     }
  });
