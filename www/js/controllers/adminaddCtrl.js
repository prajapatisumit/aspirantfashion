angular.module('app')
.controller('adminaddCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService) {

    $rootScope.extras=true;
    $scope.goaddcategorypage = function () {
      // console.log("categoryId : " + categoryId);
      $state.go('addcategory');
    };
    $scope.gosubcategorypage = function () {
      // console.log("categoryId : " + categoryId);
      $state.go('addsubcategory');
    };
    $scope.goaddbrandpage = function () {
      // console.log("categoryId : " + categoryId);
      $state.go('addbrand');
    };
    $scope.goaddproductpage = function () {
      // console.log("categoryId : " + categoryId);
      $state.go('addproduct');
    };
    $scope.goshippingratepage = function () {
      // console.log("categoryId : " + categoryId);
      $state.go('shippingrate');
    };

})
