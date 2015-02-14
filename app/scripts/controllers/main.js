'use strict';

/**
 * @ngdoc function
 * @name patnerPortalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the patnerPortalApp
 */
 app.controller('MainCtrl', function ($scope, $mdDialog, $state) {
    $scope.user = {
      businessName:"",
      businessZip:"",
      businessTimezone:"",
      businessUrl:"",
      contactName:"",
      contactEmail:"",
      password:""
    };

    $scope.userText = "Signed in as";

    $scope.isLoggedin = false;
    if($scope.isLoggedin)
      $scope.userText = "Signed in as";
    else
      $scope.userText = "Already Registered?";

    $scope.registerUser = function(){
//      CarglyPartner.createPartner($scope.user,
//        function(success) {
//          $scope.user = {
//            businessName:"",
//            businessZip:"",
//            businessTimezone:"",
//            businessUrl:"",
//            contactName:"",
//            contactEmail:"",
//            password:""
//          };
//          $scope.userText = "Signed in as " + CarglyPartner.user.name;
//        },
//        function(failure) {
//          if (failure["status"] == HTTP_CONFLICT) {
//            showError("The email address provided is already associated with another partner account.");
//          }
//          else {
//            showError("An unexpected error occurred on the server. Please reload the page and try again. If the problem continues, contact us at support@cargly.com.");
//          }
//        }
//      );
        $state.go("confirmEmail");
    }

    $scope.showSignIn = function(ev) {
        console.log("== work login ==");
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/signin.tmpl.html',
        targetEvent: ev
      })
        .then(function(answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.alert = 'You cancelled the dialog.';
        });
    };

    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }

     $scope.forgotPassword = function(ev) {
         $mdDialog.show({
             controller: DialogController,
             templateUrl: 'views/forgotpassword.tmpl.html',
             targetEvent: ev
         })
             .then(function(answer) {
                 $scope.alert = 'You said the information was "' + answer + '".';
             }, function() {
                 $scope.alert = 'You cancelled the dialog.';
             });
     };

  });
