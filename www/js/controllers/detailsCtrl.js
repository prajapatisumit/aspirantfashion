angular.module('app')
.controller('detailsCtrl', function($scope,$state,$rootScope,$stateParams, $firebaseObject, $firebaseArray,SessionService,sharedCartService) {

    // $rootScope.extras=true;
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }

    });
    $scope.user = SessionService.getUser();
      console.log("  $scope.user" + angular.toJson(  $scope.user ,' '));
    $scope.selectedId = $stateParams.category_id;
    var field_id = $stateParams.category_id;
      console.log("$scope.selectedId : " + $scope.selectedId );

      var fb = firebase.database().ref('menu/' + field_id);
      // new Firebase("https://shopping-42daf.firebaseio.com/menu/" + field_id);
      $scope.details = $firebaseObject(fb);
        console.log("$scope.details : " + angular.toJson($scope.details , ' '));


        // $scope.addToCart=function(item){
        //   sharedCartService.add(item);
        // };

        $scope.buyNow = function () {
          $state.go('checkout');
        };

    var refProduct = firebase.database().ref('product/' + $scope.selectedId);
        // new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.selectedId);
        var userData = $firebaseObject(refProduct);
        userData.$loaded().then(function(response) {
          $scope.showproductdetails = response;
        });


		var userdata = [];
		var refProduct = firebase.database().ref('product/' + $scope.selectedId +'/product_specification');
        // new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.selectedId +"/product_specification");
        var userData = $firebaseArray(refProduct);
        userData.$loaded().then(function(response) {
          $scope.productSpdetails = response;
          console.log("Response data for fetch data from response........... ",angular.toJson($scope.productSpdetails,' '));
        });
        
        var refProduct = firebase.database().ref('product/' + $scope.selectedId +'/images');
            // new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.selectedId +"/product_specification");
            var userData = $firebaseArray(refProduct);
            userData.$loaded().then(function(response) {
              $scope.productimages = response;
              console.log("Response data for fetch data from image........... ",angular.toJson($scope.productimages,' '));
            });


})
