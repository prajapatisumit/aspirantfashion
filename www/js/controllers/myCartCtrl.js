angular.module('app')
.controller('myCartCtrl', function($scope,$rootScope,$state,sharedCartService,SessionService,  $ionicHistory,$firebaseArray,$firebaseObject) {

    $rootScope.extras=true;
    var guestUser = SessionService.getUser();
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user = user;
        // console.log("user : " + angular.toJson(user , ' '));

        $scope.cart=sharedCartService.cart_items;  // Loads users cart

        // console.log("$scope.cart : " + angular.toJson($scope.cart , ' '));
        $scope.get_qty = function() {
          $scope.total_qty=0;
          $scope.total_amount=0;


          for (var i = 0; i < sharedCartService.cart_items.length; i++) {
            $scope.total_qty += sharedCartService.cart_items[i].item_qty;
            $scope.total_amount += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_price);
            $scope.total_weight += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_weight);

          }
          return $scope.total_qty;
        };
        $scope.loadShippingRate();
      }else if (!!guestUser) {
          $scope.cart=sharedCartService.cart_items;  // Loads users cart

          $scope.get_qty = function() {
            $scope.total_qty=0;
            $scope.total_amount=0;

            for (var i = 0; i < sharedCartService.cart_items.length; i++) {
              $scope.total_qty += sharedCartService.cart_items[i].item_qty;
              $scope.total_amount += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_price);

            }
            return $scope.total_qty;
          };
      }
      //We dont need the else part because indexCtrl takes care of it
    });
    $scope.userLocation = SessionService.getUserLocation();
    // console.log("$scope.userLocation : " + angular.toJson($scope.userLocation , ' '));
    $scope.loadShippingRate  = function () {
        var shippingRef = firebase.database().ref('shippingRate/Gujarat');
            var shippingData = $firebaseObject(shippingRef);
            shippingData.$loaded().then(function(response) {
              $scope.shippingData = response;
              if ($scope.shippingData.city === $scope.userLocation.state) {

              }
              // console.log("$scope.shippingData : " + angular.toJson($scope.shippingData , ' '));


            });
    };
    $scope.removeFromCart=function(c_id){
      sharedCartService.drop(c_id);
    };

    $scope.inc=function(c_id){
      sharedCartService.increment(c_id);
    };

    $scope.dec=function(c_id){
      sharedCartService.decrement(c_id);
    };

    $scope.checkout=function(){
      $state.go('checkout', {}, {location: "replace"});
    };
  // $scope.loadShippingRate  = function () {
  //     var shippingRef = firebase.database().ref('shippingRate');
  //         var shippingData = $firebaseArray(shippingRef);
  //         shippingData.$loaded().then(function(response) {
  //           $scope.allShippingData = response;
  //           console.log("$scope.allShippingData : " + angular.toJson($scope.allShippingData , ' '));
  //           for (var i = 0; i < $scope.allShippingData.length; i++) {
  //             if ($scope.allShippingData[i].city === $scope.userLocation.state) {
  //                 if ($scope.allShippingData[i].city === 'Gujarat') {
  //                     $scope.shippingRate = $scope.allShippingData[i].rate;
  //                 }
  //                 console.log("$scope.allShippingData[i].city : " + $scope.allShippingData[i].city);
  //                 console.log("$scope.allShippingData[i].rate : " + $scope.allShippingData[i].rate);
  //             }
  //           }
  //
  //         });
  // };


})
