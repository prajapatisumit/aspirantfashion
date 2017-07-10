angular.module('app')
.controller('detailsCtrl', function($scope,$rootScope,$stateParams, $firebaseObject, $firebaseArray) {

    // $rootScope.extras=true;
    $scope.selectedId = $stateParams.category_id;
    var field_id = $stateParams.category_id;
      console.log("$scope.selectedId : " + $scope.selectedId );

      var fb = new Firebase("https://shopping-42daf.firebaseio.com/menu/" + field_id);
      $scope.details = $firebaseObject(fb);
        console.log("$scope.details : " + angular.toJson($scope.details , ' '));

        $scope.addToCart=function(item){
          sharedCartService.add(item);
        };

        $scope.buyNow = function () {
          $state.go('checkout');
        };

    var refProduct = new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.selectedId);
        var userData = $firebaseObject(refProduct);
        userData.$loaded().then(function(response) {
          $scope.showproductdetails = response;
        });


		var userdata = [];
		var refProduct = new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.selectedId +"/product_specification");
        var userData = $firebaseArray(refProduct);
        userData.$loaded().then(function(response) {
          $scope.productSpdetails = response;
          console.log("Response data for fetch data from response........... ",angular.toJson($scope.productSpdetails,' '));
        });


})
