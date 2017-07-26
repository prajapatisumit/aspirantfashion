angular.module('app')
.controller('myCartCtrl', function($scope,$rootScope,$state,sharedCartService,SessionService,  $ionicHistory) {
    // $scope.goBack = function() {
    //   console.log("this is calling...");
    //   $ionicHistory.goBack();
    // };
    $rootScope.extras=true;
    var guestUser = SessionService.getUser();
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {


        $scope.cart=sharedCartService.cart_items;  // Loads users cart

        $scope.get_qty = function() {
          $scope.total_qty=0;
          $scope.total_amount=0;


          for (var i = 0; i < sharedCartService.cart_items.length; i++) {
            $scope.total_qty += sharedCartService.cart_items[i].item_qty;
            $scope.total_amount += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_price);  $scope.total_weight += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_weight);
          }
          return $scope.total_qty;
        };
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



})
