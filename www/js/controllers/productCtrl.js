angular.module('app')
.controller('productCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
                                  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils,SessionService,$stateParams,$window,$ionicHistory) {

  $rootScope.extras=true;

  $scope.categoryId = $stateParams.category_id;
  console.log("$scope.categoryId : " + $scope.categoryId);

  $scope.loadCategory = function() {
    $scope.category=$firebaseArray(fireBaseData.refCategory());
  };

  $scope.loadProduct = function () {
    $scope.menu=$firebaseArray(fireBaseData.refProduct());
  };
})
