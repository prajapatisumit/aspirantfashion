angular.module('app')
.controller('addAdressCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService,$window) {



    $rootScope.extras=true;
    $scope.isDivShow = false;
    $scope.showDiv = function () {
      if ($scope.isDivShow === false) {
        $scope.isDivShow = true;
      }else if ($scope.isDivShow === true) {
        $scope.isDivShow = false;
      }

    };
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.addresses= $firebaseArray( fireBaseData.refUser().child(user.uid).child("address") );
        $scope.user_info=user;
        // console.log("$scope.user_info : " + angular.toJson($scope.user_info , ' '));
      }else if (!!sessionUser.uid) {
        $scope.addresses= $firebaseArray( fireBaseData.refUser().child(sessionUser.uid).child("address") );
        $scope.user_info=sessionUser;
      }
    });
    $scope.selectAddress = function (selectedAddress) {
        // console.log("selectedAddress : " + angular.toJson(selectedAddress , ' '));
        $state.go('checkout', {'addressId' : selectedAddress})

    };
    $scope.saveAddress = function (addressObj) {
        var obj = {
              name : addressObj.name,
              city : addressObj.city,
              area : addressObj.area,
              building : addressObj.building,
              postalCode : addressObj.pincode,
              state : addressObj.state,
              phoneNumber : addressObj.number,
              alternateNumber : addressObj.alternateNumber,
              deliveryPlace : addressObj.deliveryPlace,
          };
        fireBaseData.refUser().child($scope.user_info.uid).child("address").push(obj);
        $scope.isDivShow = false;
    };

});
