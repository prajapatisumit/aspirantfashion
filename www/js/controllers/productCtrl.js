angular.module('app')
    .controller('productCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, fireBaseData, $state,
        $ionicHistory, $firebaseArray, sharedCartService, sharedUtils, SessionService, $stateParams, $window, $ionicHistory,IonicPopupService) {

        $rootScope.extras = true;
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
