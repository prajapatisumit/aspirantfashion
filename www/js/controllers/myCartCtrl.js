angular.module('app')
.controller('myCartCtrl', function($scope,$rootScope,$state,sharedCartService,SessionService,  $ionicHistory,$firebaseArray,$firebaseObject,$window) {

    $rootScope.extras=true;
    var guestUser = SessionService.getUser();
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user = user;
        // console.log("user : " + angular.toJson(user , ' '));

        $scope.cart=sharedCartService.cart_items;  // Loads users cart
        $scope.loadCart();
        $scope.loadShippingRate();
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

      }else if (!!guestUser) {
          $scope.cart=sharedCartService.cart_items;  // Loads users cart
          $scope.loadCart();
          $scope.loadShippingRate();

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
    $scope.loadCart = function () {
          $scope.get_weight = function() {
            $scope.total_qty=0;
            $scope.total_weight=0;
            sharedCartService.cart_items = sharedCartService.cart_items;
            if (!!sharedCartService.cart_items) {
              for (var i = 0; i < sharedCartService.cart_items.length; i++) {
                $scope.total_qty += sharedCartService.cart_items[i].item_qty;
                $scope.total_weight += (sharedCartService.cart_items[i].item_qty * (sharedCartService.cart_items[i].item_weight / 1000));
                // console.log("$scope.total_weight : " + $scope.total_weight);
                // console.log("$scope.total_qty : " + $scope.total_qty);
                $scope.totalWeightRoundFigure = $window.Math.round($scope.total_weight);
                // console.log("$scope.totalWeightRoundFigure : " + $scope.totalWeightRoundFigure);
              }
            }

            return $window.Math.round($scope.total_weight);
          };
        // console.log("$scope.get_weight : " + $scope.get_weight());
      };
      $scope.loadCart();

    $scope.userLocation = SessionService.getUserLocation();

    $scope.loadShippingRate  = function () {
        var shippingRef = firebase.database().ref('shippingRate/Gujarat');
            var shippingData = $firebaseObject(shippingRef);
            shippingData.$loaded().then(function(response) {
              $scope.shippingData = response;
              // console.log("$scope.shippingData : " + angular.toJson($scope.shippingData , ' '));
              if ($scope.shippingData.state === $scope.userLocation.state) {
                  $scope.shippingRate = $scope.shippingData.rate;
              }else {
                      $scope.shippingRate = '110';
                  }

            });
    };

    $scope.loadShippingRate();
    $scope.removeFromCart=function(c_id){
      sharedCartService.drop(c_id);
      $scope.loadCart();
    };

    $scope.inc=function(c_id){
      sharedCartService.increment(c_id);
      $scope.loadCart();
    };

    $scope.dec=function(c_id){
      sharedCartService.decrement(c_id);
      $scope.loadCart();
    };

    $scope.checkout=function(){
      $state.go('checkout', {}, {location: "replace"});
    };


})
