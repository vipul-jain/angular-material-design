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
  });
