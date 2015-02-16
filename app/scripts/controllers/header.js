/**
 * Created by Jinna on 2/14/2015.
 */
'use strict';
app.controller('NavCtrl', function ($rootScope, $scope, $mdDialog, $mdSidenav, $state, $log, $cookies, $location){
  //$rootScope.headerText = "Already Registered?";
//  console.log('header ' + $rootScope.headerText );

  $scope.showSignIn = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/signin.tmpl.html',
      targetEvent: ev
    });
  };

  $scope.showMenu = function(){
    $mdSidenav('left').toggle()
      .then(function(){
        $log.debug('toggle left is done');
      });
  }

  $scope.logout = function(){
      delete $cookies['cargly_rsmt_access_token'];
    CarglyPartner.logout(function(success){
        $state.go('/');
        $rootScope.isLoggedIn = false;
        $rootScope.headerText = 'Already Registered?';
    },function(error){

    });

  };

  function DialogController($scope, $mdDialog) {
    $scope.isError1 = false;

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.forgotPassword = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'views/forgotpassword.tmpl.html',
        targetEvent: ev
      });
    };

    $scope.signInUser = function(){
//        console.log('signInUser ');
      CarglyPartner.login($scope.email, $scope.password, function() {
           $cookies['cargly_rsmt_access_token'] = CarglyPartner.accessToken;
          $mdDialog.hide();
//              console.log('signInUser ' + CarglyPartner.user.verified);
          if(CarglyPartner.user.verified == 'true')
              $state.go('Home');//$location.url('/home');
          else
              $state.go('VerifyUser'); //$location.url('/verifyUser');
          $rootScope.isLoggedIn = true;
          $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
          $scope.email = '';
          $scope.password = '';
        },
        function() {
            console.log($scope);
            $scope.email = '';
            $scope.password = '';
          $rootScope.isLoggedIn = false;
          $scope.isError = true;

        }
      );
    };

    $scope.resendMail = function(){
      CarglyPartner.requestPasswordReset($scope.resendEmail,
        function() {
          $scope.hide();
        },
        function() {
          $scope.hide();
        }
      );
    }
  };
});
