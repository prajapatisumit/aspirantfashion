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
              state : shippingObj.state,
              rate : shippingObj.rate
          }
        if (!!shippingObj.state) {
          var ShippingRef = firebase.database().ref().child('shippingRate/' + shippingObj.state).set(shippingObj).then(function (data) {
            $scope.globalproductshippingID = ShippingRef;
                console.log("yes comes here...");
                 $scope.shippingObj.state = '';
                 $scope.shippingObj.rate = '' ;


          }).catch(function (error) {
            console.log('Error : ' + error);
          });
        }


      };
    });


})
