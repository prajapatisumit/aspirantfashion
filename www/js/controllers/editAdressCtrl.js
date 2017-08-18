angular.module('app')
.controller('editAdressCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService,$window) {



    $rootScope.extras=true;
    $scope.selectedAddressId = $stateParams.addressId;
    console.log("$scope.selectedAddressId : " + angular.toJson($scope.selectedAddressId , ' '));
    // $scope.loadAddress = function () {
    //    $scope.addressObj= $firebaseObject( fireBaseData.refUser().child(user.uid).child("address").child($scope.selectedAddressId) );
    // };
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         $scope.addressObj= $firebaseObject( fireBaseData.refUser().child(user.uid).child("address").child($scope.selectedAddressId) );
        // console.log("$scope.addressObj : " + angular.toJson($scope.addressObj , ' '));
        $scope.user_info=user;
        // console.log("$scope.user_info : " + angular.toJson($scope.user_info , ' '));
      }else if (!!sessionUser.uid) {
         $scope.addressObj= $firebaseObject( fireBaseData.refUser().child(user.uid).child("address").child($scope.selectedAddressId) );
        $scope.user_info=sessionUser;
      }
    });

    $scope.editAddress = function (addressObj) {
        var obj = {
              name : addressObj.name,
              city : addressObj.city,
              area : addressObj.area,
              building : addressObj.building,
              postalCode : addressObj.postalCode,
              state : addressObj.state,
              phoneNumber : addressObj.phoneNumber,
              alternateNumber : addressObj.alternateNumber,
              deliveryPlace : addressObj.deliveryPlace,
          };
        var addressRef = firebase.database().ref().child('users/'+$scope.user_info.uid + '/address/' + $scope.selectedAddressId).update(obj);
        IonicPopupService.alert("Success" , "Address Edited Successfully.");

    };

});
