angular.module('app')
.controller('shippingRateCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService) {



    $rootScope.extras=true;
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
      return;
      }
        // $scope.shippingObj = {};
      $scope.addshippingrate = function (shippingObj) {
          $scope.shippingObj = shippingObj;
          var shippingObj = {
              city : shippingObj.city,
              rate : shippingObj.rate
          }
        if (!!shippingObj.city) {
          var ShippingRef = firebase.database().ref().child('shippingRate/' + shippingObj.city).set(shippingObj).then(function (data) {
            $scope.globalproductshippingID = ShippingRef;
                console.log("yes comes here...");
                 $scope.shippingObj.city = '';
                 $scope.shippingObj.rate = '' ;


          }).catch(function (error) {
            console.log('Error : ' + error);
          });
        }


      };
    });


})
