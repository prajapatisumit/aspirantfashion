angular.module('app')
.controller('homeCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,$cordovaDevice,$firebaseObject,
                                  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils,SessionService,$stateParams,$window,$ionicHistory) {
                                    // debugger
    if (!!$rootScope.userLog) {

      $scope.user = $rootScope.userLog;
      // console.log("$scope.user at rootscope " + angular.toJson($scope.user ,' '));
    }else {
      $rootScope.user = SessionService.getUser();
      // console.log("$scope.user at at session: " + angular.toJson($scope.user , ' '));
    }

  $scope.goBack = function () {
    $ionicHistory.goBack();
  }

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

  // On Loggin in to menu page, the sideMenu drag state is set to true
  $ionicSideMenuDelegate.canDragContent(true);
  $rootScope.extras=true;

  // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope){
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }

  });

  $scope.filterProduct = function (category_id) {
    console.log("category_id : " + category_id );
    $scope.menu = $firebaseArray(fireBaseData.refProduct()
      .orderByChild('category')
      .equalTo(category_id));

  };
  $scope.loadMenu = function() {
    // debugger
    sharedUtils.showLoading();
    $scope.menu=$firebaseArray(fireBaseData.refCategory());
    sharedUtils.hideLoading();
  };

  $scope.loadCategory = function() {
    // debugger
    // sharedUtils.showLoading();
    $scope.category=$firebaseArray(fireBaseData.refCategory());
    // sharedUtils.hideLoading();
  };

  $scope.showProductInfo=function (id) {
        $state.go('details',{'category_id' : id });
  };

  $scope.addToCart=function(item){

    sharedCartService.add(item);
  };

  $scope.goAdminPage = function(id){
    $state.go('admin' , {'product_id' : id});
  };
  $scope.goproductPage = function (categoryId) {
    console.log("categoryId : " + categoryId);
    $state.go('product', { 'category_id': categoryId });
  }
////for logout :
  $scope.logout=function(){

    sharedUtils.showLoading();

    // Main Firebase logout
    firebase.auth().signOut().then(function() {


      $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
      $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
      SessionService.setUser(null);
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });


      $rootScope.extras = false;
      sharedUtils.hideLoading();
      $state.go('tabsController.login', {}, {location: "replace"});

    }, function(error) {
       sharedUtils.showAlert("Error","Logout Failed")
    });

  }
  // var refProduct = firebase.database().ref('product/' + $scope.selectedId +'/images');
  //     // new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.selectedId +"/product_specification");
  //     var userData = $firebaseArray(refProduct);
  //     userData.$loaded().then(function(response) {
  //       $scope.productimages = response;
  //       console.log("Response data for fetch data from image........... ",angular.toJson($scope.productimages,' '));
  //     });
});
