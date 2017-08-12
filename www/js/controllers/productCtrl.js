angular.module('app')
    .controller('productCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, fireBaseData, $state,
        $ionicHistory, $firebaseArray, sharedCartService, sharedUtils, SessionService, $stateParams, $window, $ionicHistory,IonicPopupService) {
$scope.userData = SessionService.getUser();
        $rootScope.extras = true;

        $scope.addToCart=function(item){
  IonicPopupService.alert("Item added to cart");
          sharedCartService.add(item);
        };

        $scope.showProductInfo=function (id) {
              $state.go('details',{'category_id' : id });
        };

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            $scope.user_info=user; //Saves data to user_info
            // console.log("scope.user_info at home controller : " + angular.toJson($scope.user_info , ' '));
            $scope.get_total= function() {
              var total_qty=0;
              for (var i = 0; i < sharedCartService.cart_items.length; i++) {
                total_qty += sharedCartService.cart_items[i].item_qty;
              }
              return total_qty;
            };
          }else if ($scope.user.isGuest === 'true') {
            $scope.user_info = $scope.user;
            $scope.get_total= function() {
              var total_qty=0;
              for (var i = 0; i < sharedCartService.cart_items.length; i++) {
                total_qty += sharedCartService.cart_items[i].item_qty;
              }
              return total_qty;
            };
            // console.log("$scope.user_info for guest : " + angular.toJson($scope.user_info , ' '));
          }else if (!!$rootScope.userLog) {
            $scope.user = $rootScope.userLog;
            $scope.get_total= function() {
              var total_qty=0;
              for (var i = 0; i < sharedCartService.cart_items.length; i++) {
                total_qty += sharedCartService.cart_items[i].item_qty;
              }
              return total_qty;
            };

          }else {

            // $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
            // $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
            //
            // $ionicHistory.nextViewOptions({
            //   historyRoot: true
            // });
            //
            // $rootScope.extras = false;
            // sharedUtils.hideLoading();
            // $state.go('tabsController.login', {}, {location: "replace"});

          }
        });
        var allProducts = [];

        $scope.loadSubCategory = function(category_id) {
            $scope.sub_category = $firebaseArray(fireBaseData.refSubCategory().orderByChild('categoryid')
                .equalTo(category_id));
        };

        $scope.loadProductByCategory = function(category_id) {
            $scope.menu = $firebaseArray(fireBaseData.refProduct()
                .orderByChild('category')
                .equalTo(category_id));
            $scope.menu.$loaded().then(function (data) {
                allProducts = data;
            });
        };

        $scope.goAdminPage = function(id){
          $state.go('admin' , {'product_id' : id});
        };

        $scope.deleteproduct = function(productId) {
          console.log("productId : " + productId);
          IonicPopupService.confirm('Delete Product', 'Are you sure you want to delete this Product?').then(function(res) {
          if (res) {
            console.log("$scope.productId : " + productId);
            var deleteProductRef = firebase.database().ref('product/'  + productId );
            deleteProductRef.remove().then(function (response) {
              console.log('product removed successfully..');
            });
          }
        });
      };

        $scope.$on('$ionicView.enter', function(ev) {
            if (ev.targetScope !== $scope)
                return;
            // Your code which should only run once
            $scope.categoryId = $stateParams.category_id;
            console.log("$scope.categoryId : " + $scope.categoryId);
            $scope.loadProductByCategory($stateParams.category_id);
            $scope.loadSubCategory($stateParams.category_id);
        });

        $scope.filterProduct = function (sub_category_data) {
          if(sub_category_data === undefined || sub_category_data === null) {
            return;
          }

          if(sub_category_data.is_selected) {
              sub_category_data.is_selected = false;
          } else {
            sub_category_data.is_selected = true;
          }
          var tempArray = [];
          var doFilter = false;
          for(var j=0; j<$scope.sub_category.length; j++) {
              if(!!$scope.sub_category[j].is_selected && $scope.sub_category[j].is_selected === true) {
                doFilter = true;
                  for(var i=0; i< allProducts.length; i++) {
                      if(allProducts[i].subcategory === $scope.sub_category[j].$id) {
                        tempArray.push(allProducts[i]);
                      }
                  }
              }
          }
          if(doFilter === true) {
              $scope.menu = tempArray;
          } else {
            $scope.menu = allProducts;
          }
        }

    });
