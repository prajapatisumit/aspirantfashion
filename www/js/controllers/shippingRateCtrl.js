angular.module('app')
.controller('shippingRateCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService) {

    $rootScope.extras=true;

    $scope.addshippingrate = function (shippingInguj,shippingOutguj) {
        var shippingObj = {
            guajrat : shippingInguj,
            outofguajrat : shippingOutguj
        }

      var ShippingRef = firebase.database().ref().child('shipping rate').push(shippingObj).key;
      console.log("shippingObj : " + angular.toJson(shippingObj , ' '));
      // $scope.globalproductID = BrandRef;
      // console.log("$scope.globalcategory "+ $scope.globalproductID);
      // if (!!$scope.globalproductID) {
      //   var imgObj = {
      //     image : $scope.downloadURL
      //   };
      //  firebase.database().ref().child('brand/' + $scope.globalproductID + '/images' ).set($scope.imgset3);
      // }
    };

})
