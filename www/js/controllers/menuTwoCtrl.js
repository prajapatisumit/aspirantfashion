angular.module('app')
.controller('menuTwoCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
                                  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils,SessionService,$stateParams,$window) {
                                    $scope.$on('$ionicView.enter', function(ev) {
                                      if(ev.targetScope !== $scope){
                                        $ionicHistory.clearHistory();
                                        $ionicHistory.clearCache();
                                      }

                                    });
  $scope.user = $rootScope.userLog;
    console.log("$scope.user " + angular.toJson($scope.user ,' '));
  //Check if user already logged in
    // $scope.user = SessionService.getUser();
    // console.log("$scope.user at menu 2 page: " + angular.toJson($scope.user , ' '));

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.user_info=user; //Saves data to user_info

    }else if ($scope.user.isGuest === 'true') {
      $scope.user_info=$scope.user;
      $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
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
    $scope.menu=$firebaseArray(fireBaseData.refProduct());
    sharedUtils.hideLoading();
  };

  $scope.loadCategory = function() {
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

});
