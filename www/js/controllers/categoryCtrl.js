angular.module('app')
.controller('categoryCtrl', function($scope,$rootScope,fireBaseData,$firebaseArray,$state) {

    $rootScope.extras=true;

    $scope.loadCategory = function() {
      $scope.category = $firebaseArray(fireBaseData.refCategory());
    };
    $scope.loadCategory();

    $scope.goproductPage = function (categoryId) {
      console.log("categoryId : " + categoryId);
      $state.go('product', { 'category_id': categoryId });
    }
})
