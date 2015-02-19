app.controller('leftNavCtrl', function($scope, $location,$mdSidenav,$log) {

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.close = function() {
        $mdSidenav('left').close()
            .then(function(){
                //$log.debug('toggle left is close');
            });
    };
});