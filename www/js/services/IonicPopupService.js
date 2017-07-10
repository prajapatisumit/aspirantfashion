angular.module('app')
.service('IonicPopupService', ['$ionicPopup', function($ionicPopup) {

  this.alert = function(title, message) {
    return $ionicPopup.alert({
      title: title,
      template: message
    });
  };

  this.confirm = function(title, message) {
    return $ionicPopup.confirm({
      title: title,
      template: message
    });
  };

  this.showPopup = function() {

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.album">',
      title: 'Album Name',
      subTitle: 'Please enter name of new album and click on save',
      // scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          // if (!$scope.data.album) {
          //   //don't allow the user to close unless he enters wifi password
          //   e.preventDefault();
          // } else {
          return;
          // }
        }
      }, ]
    });

  };


}]);
