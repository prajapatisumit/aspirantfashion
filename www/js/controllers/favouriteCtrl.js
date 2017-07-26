angular.module('app')
.controller('favouriteCtrl', function($scope,$rootScope) {
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope){
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }

  });
    $rootScope.extras=true;
})
