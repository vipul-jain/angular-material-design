'use strict';
app.factory('userFactory', ['$http','$q', '$timeout','$cookies', '$location', '$rootScope', function($http, $q, $timeout, $cookies, $location, $rootScope) {
    $rootScope.isLoggedIn = true;
    var userFactory = {};
    userFactory.isLoggedIn = function () {
      //console.log('isLoggedIn');
      var token = $cookies.cargly_rsmt_access_token;
      //console.log('token ' + token);
      var promise = $q.defer();
      if (angular.isUndefined(token) || token === null ) {
        //console.log('undefined');
        promise.reject;
        $rootScope.headerText = 'Already Registered?';
        $rootScope.isLoggedIn = false;
        $location.url('/');
      } else {
        //console.log('call service');
        CarglyPartner._getUser(token, function () {
          //console.log('success');
          $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
          $rootScope.isLoggedIn = true;
          promise.resolve;
        }, function () {
          //console.log('failure');
          promise.reject;
          $rootScope.headerText = 'Already Registered?';
          $rootScope.isLoggedIn = false;
          $location.url('/');
        });
      }
      return promise;
    };
    return userFactory;
  }]);
