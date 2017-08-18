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

        if ($scope.validate(addressObj) === false) {
              return;
            }
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
    ////for validate form :
    $scope.validate = function(addressObj) {
            // console.log("addressObj : " + angular.toJson(addressObj , ' '));
          if (!addressObj) {
            IonicPopupService.alert("Oops!" , "Please enter data.");
          }else if (CommonService.validateEmpty(addressObj.city, 'Oops!', 'Please enter city') === false) {
            return false;
          }else if (CommonService.validateEmpty(addressObj.area, 'Oops!', 'Please enter area') === false) {
            return false;
          } else if (CommonService.validateEmpty(addressObj.building, 'Oops!', 'Please enter building or society name') === false) {
            return false;
          }else if (CommonService.validateEmpty(addressObj.pincode, 'Oops!', 'Please enter pincode') === false) {
            return false;
          } else if (CommonService.validateEmpty(addressObj.state, 'Oops!', 'Please enter state') === false) {
            return false;
          }else if (CommonService.validateEmpty(addressObj.name, 'Oops!', 'Please enter name') === false) {
            return false;
          } else if (CommonService.validateEmpty(addressObj.number, 'Oops!', 'Please enter phone number') === false) {
            return false;
          } else if (CommonService.validateEmpty(addressObj.deliveryPlace, 'Oops!', 'Please enter deliveryPlace') === false) {
            return false;
          }
        };

    $scope.goEditAddress = function (selectedAddress) {
        $state.go('editAddress' , {'addressId' : selectedAddress})
    };
});
