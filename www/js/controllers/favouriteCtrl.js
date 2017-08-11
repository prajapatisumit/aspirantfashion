angular.module('app')
.controller('favouriteCtrl', function($scope,$state,$rootScope,$stateParams,IonicPopupService, $firebaseObject, $firebaseArray,SessionService,sharedCartService,$ionicModal,$http) {
  $rootScope.extras=true;
  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope){
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user=user; //Saves data to user_info
        $scope.loadFavourite();
      }
    });
    $scope.favouriteDataArray = [];
    $scope.loadFavourite = function () {
      var refFavoriteData = firebase.database().ref('favourits/' + $scope.user.uid);
          var favouriteData = $firebaseArray(refFavoriteData);
          favouriteData.$loaded().then(function(response) {
            $scope.favouritsData = response;
          });
    };

    $scope.deletefevorite = function(productId) {
      IonicPopupService.confirm('Delete favorite', 'Are you sure you want to delete your favorite Product?').then(function(res) {
      if (res) {
        var deleteFevoriteRef = firebase.database().ref('favourits/' + $scope.user.uid + '/' + productId);
        var deleteFevoriteProductRef = firebase.database().ref('product/' + productId + '/favouriteBy/' + $scope.user.uid);
        deleteFevoriteRef.remove().then(function (response) {
          deleteFevoriteProductRef.remove().then(function (response) {
          });
        });
      }
    });
  };

  });


})
