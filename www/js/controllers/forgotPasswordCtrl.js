angular.module('app')
.controller('forgotPasswordCtrl', function($scope,$rootScope) {
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope){
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }

  });
    $rootScope.extras=false;
  })
