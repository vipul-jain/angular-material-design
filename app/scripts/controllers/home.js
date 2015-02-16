'use strict';
app.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log, $rootScope, $cookies, $state) {
    var token = $cookies.cargly_rsmt_access_token;
    if (angular.isUndefined(token) || token === null ) {
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

    $scope.updateAccountForm = function(){
      if (CarglyPartner.accountInfo) {
        $scope.user = {
          businessName: CarglyPartner.accountInfo["businessName"],
          businessUrl: CarglyPartner.accountInfo["website"],
          address: CarglyPartner.accountInfo["address"],
          city: CarglyPartner.accountInfo["city"],
          state: CarglyPartner.accountInfo["state"],
          businessZip: CarglyPartner.accountInfo["zip"],
          businessTimezone: CarglyPartner.accountInfo["timezone"],
          contactName:CarglyPartner.accountInfo["contactName"],
          contactEmail:CarglyPartner.accountInfo["email"],
          cardType: CarglyPartner.accountInfo["cardType"],
          cardNumber: CarglyPartner.accountInfo["cardLast4"],
          secretKey: CarglyPartner.accountInfo["paymentProcessingSecretKey"],
          publicKey: CarglyPartner.accountInfo["paymentProcessingPublicKey"],
          paymentAccountId: CarglyPartner.accountInfo["paymentProcessingAccountId"]
        };
        $scope.$apply();
      }
    }

    $scope.fetchAccount = function(){
      CarglyPartner.ajax({
        url: '/partners/api/account/' + CarglyPartner.user.id,
        type: 'GET',
        success: function(data) {
          CarglyPartner.accountInfo = data;
          $scope.updateAccountForm();
        }
      });
      return false;
    }



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
});
