angular.module('app')
.controller('supportCtrl', function($scope,$rootScope) {

    $rootScope.extras=true;
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }

    });

})
