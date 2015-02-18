'use strict';
app.factory('userFactory', ['$http','$q', '$timeout','$cookies', '$rootScope', '$state', function($http, $q, $timeout, $cookies, $rootScope, $state) {
    $rootScope.isLoggedIn = true;
    var userFactory = {};
    userFactory.isLoggedIn = function () {
//      console.log('userFactory isLoggedIn');
      var token = $cookies['cargly_rsmt_access_token'];
//      console.log('token ' + token);
      var promise = $q.defer();
      if (angular.isUndefined(token) || token === null) {
//        console.log('userFactory undefined');
        promise.reject;
        $rootScope.headerText = 'Already Registered?';
        $rootScope.isLoggedIn = false;
          $state.go('/');
      } else {
//        console.log('call service' + CarglyPartner + " token " + token);
        CarglyPartner._getUser(token, function () {
//          console.log('userFactory isLoggedIn success');
          $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
          $rootScope.isLoggedIn = true;
//            console.log('CarglyPartner.user.verified' + CarglyPartner.user.verified);
//            if(CarglyPartner.user.verified == 'true') {
//                promise.reject;
//                $state.go('dashboard');
//                $rootScope.isVerified = true;
//            }else{
////                console.log('CarglyPartner.user.verified' + CarglyPartner.user.verified);
//                promise.reject;
//                $state.go('VerifyUser');
//                $rootScope.isVerified = false;
//            }
        }, function () {
          //console.log('failure');
          promise.reject;
          $rootScope.headerText = 'Already Registered?';
          $rootScope.isLoggedIn = false;
            $state.go('/');
        });
      }
      return promise;
    };

    userFactory.alreadyLoggedIn = function(){
        //console.log('isLoggedIn');
        var token =  $cookies['cargly_rsmt_access_token'];
        //console.log('token ' + token);
        var promise = $q.defer();
        if (angular.isUndefined(token) || token === null) {
            //console.log('undefined');
            promise.resolve;
            $rootScope.headerText = 'Already Registered?';
        } else {
            //console.log('call service');
            CarglyPartner._getUser(token, function () {
//                console.log('alreadyLoggedIn success');
                $rootScope.headerText = 'Signed in as ' + CarglyPartner.user.name;
                $rootScope.isLoggedIn = true;
                if(CarglyPartner.user.verified == 'true') {
                    $state.go('dashboard');
                    $rootScope.isVerified = true;
                } else {
                    $state.go('VerifyUser');
                    $rootScope.isVerified = false;
                }
                promise.reject;
            }, function () {
                console.log('failure');
                promise.resolve;
                $rootScope.headerText = 'Already Registered?';
                $rootScope.isLoggedIn = false;
            });
        }
        return promise;
    }
    return userFactory;
  }]);
