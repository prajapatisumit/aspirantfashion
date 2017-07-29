angular.module('app')
    .controller('productCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, fireBaseData, $state,
        $ionicHistory, $firebaseArray, sharedCartService, sharedUtils, SessionService, $stateParams, $window, $ionicHistory) {

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
              debugger
                allProducts = data;
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
          if(sub_category_data.is_selected) {
              sub_category_data.is_selected = false;
          } else {
            sub_category_data.is_selected = true;
          }
          var tempArray = [];
          var doFilter = false;
          for(var j=0; j<$scope.sub_category.length; j++) {
              console.log('$scope.sub_category : ' + angular.toJson($scope.sub_category[j], ' '));
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
