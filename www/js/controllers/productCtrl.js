angular.module('app')
.controller('productCtrl', function($scope,$rootScope,fireBaseData,$firebaseArray,$stateParams) {

  $rootScope.extras=true;
  $scope.categoryId = $stateParams.category_id;
  console.log("$scope.categoryId : " + $scope.categoryId);

  $scope.loadProduct = function () {
    
  };
})
