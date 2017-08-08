angular.module('app')
.controller('shippingRateCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService) {



    $rootScope.extras=true;
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
      return;
      }
        $scope.shippingObj = {};
    });

    $scope.addshippingrate = function () {
        // var shippingObj = {
        //     guajrat : shippingInguj,
        //     outofguajrat : shippingOutguj
        // }
        // $scope.globalproductID = ShippingRef;
        // console.log("$scope.globalproductID : " + $scope.globalproductID);
      var ShippingRef = firebase.database().ref().child('shipping rate').push($scope.shippingObj).then(function (data) {
        $scope.globalproductshippingID = ShippingRef;
             $scope.shippingObj = {};

             // $window.location.reload(true)
      }).catch(function (error) {
       //  debugger
        console.log('Error : ' + error);
      });
      console.log("shippingObj : " + angular.toJson($scope.shippingObj , ' '));
    };

})
