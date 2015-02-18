'use strict';
app.controller('confirmAccountCtrl',  function ($scope, $stateParams, $state, $rootScope) {
  console.log('token', $stateParams.token);
  $scope.signInUser = function () {
    CarglyPartner.login($scope.email, $scope.password, function () {
        console.log("CarglyPartner.user.verified " + CarglyPartner.user.verified);
        if (CarglyPartner.user.verified == 'true')
          $state.go('dashboard');
        else
          $state.go('VerifyUser');
        $rootScope.isLoggedIn = true;
        $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
        $scope.email = '';
        $scope.password = '';
      },
      function () {
        $rootScope.isLoggedIn = false;
        $scope.isError = true;
        $scope.$apply();
      }
    );
  };
});
