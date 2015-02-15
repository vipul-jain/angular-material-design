'use strict';

/**
 * @ngdoc function
 * @name patnerPortalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the patnerPortalApp
 */
 app.controller('MainCtrl', function ($scope, $rootScope, $mdDialog, $state, $timeout, $mdSidenav, $log){
    $scope.user = {
      businessName:"",
      businessZip:"",
      businessTimezone:"",
      businessUrl:"",
      contactName:"",
      contactEmail:"",
      password:""
    };

   $rootScope.headerText = "Already Registered?";
   $rootScope.isLoggedIn = false;

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
          $state.go("confirmEmail");
        },
        function(failure) {
          if (failure["status"] == HTTP_CONFLICT) {
            showError("The email address provided is already associated with another partner account.");
          }
          else {
            showError("An unexpected error occurred on the server. Please reload the page and try again. If the problem continues, contact us at support@cargly.com.");
          }
        }
      );
    }


  });
