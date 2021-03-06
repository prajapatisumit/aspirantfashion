angular.module('app')
.controller('checkoutCtrl', function($scope,$rootScope,sharedUtils,$state,$firebaseArray,
                                     $ionicHistory,fireBaseData, $ionicPopup,sharedCartService,SessionService,$stateParams,$firebaseObject) {
                                       $scope.$on('$ionicView.enter', function(ev) {
                                         if(ev.targetScope !== $scope){
                                           $ionicHistory.clearHistory();
                                           $ionicHistory.clearCache();
                                         }

                                       });
    $rootScope.extras=true;
    ///For get address from selected address id :
    $scope.addressId = $stateParams.addressId;
    // console.log("$scope.addressId : " + angular.toJson($scope.addressId , ' '));
    if (!!$scope.addressId && !!$scope.user_info) {
          var addressRef = firebase.database().ref('users/' + $scope.user_info.uid + '/address/' + $scope.addressId);
              var addressData = $firebaseObject(addressRef);
              addressData.$loaded().then(function(response) {
                $scope.address = response;
                // console.log("$scope.address : " + angular.toJson($scope.address , ' '));

    });
  }
    $scope.userAddress = SessionService.getUserLocation();
    // console.log("$scope.userAddress : " + angular.toJson($scope.userAddress , ' '));
    var sessionUser = SessionService.getUser();
    //Check if user already logged in
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
    ////for payment :
    $scope.saveCardDetail = function (cardDetails) {
      console.log("cardDetails : " + angular.toJson(cardDetails , ' '));

    };
    $scope.payments = [
      {id: 'CREDIT', name: 'Credit / Debit / Atm Card'},
      {id: 'NETBANK', name: 'Net Banking'},
      {id: 'COD', name: 'COD'}
    ];
  ///for show item and price detail :
      $scope.price = SessionService.getTotalPrice();
      $scope.item = SessionService.getTotalItem();
      $scope.weight = SessionService.getTotalWeight();
///for goes enter card detail page :
  $scope.cardDetailPage = function (payChoice) {
      console.log("payChoice : " + payChoice);
      if (payChoice === 'CREDIT') {
          $state.go('creditCardDetail');
      }
    
  };
    $scope.pay=function(address,payment){
      console.log("address : " +angular.toJson(address , ' '));
      console.log("payment : " + angular.toJson(payment , ' '));
      if (!!address.$id) {
        var abressObj = {
            alternateNumber: address.alternateNumber,
            area: address.area,
            building: address.building,
            city: address.city,
            deliveryPlace: address.deliveryPlace,
            name: address.name,
            phoneNumber: address.phoneNumber,
            postalCode: address.postalCode,
            state: address.state
        }
      }

      if(address==null || payment==null){
        //Check if the checkboxes are selected ?
        sharedUtils.showAlert("Error","Please choose from the Address and Payment Modes.")
      }
      else {
        // Loop throw all the cart item
        for (var i = 0; i < sharedCartService.cart_items.length; i++) {
          //Add cart item to order table
          fireBaseData.refOrder().push({

            //Product data is hardcoded for simplicity
            product_name: sharedCartService.cart_items[i].item_name,
            product_price: sharedCartService.cart_items[i].item_price,
            product_image: sharedCartService.cart_items[i].item_image,
            product_id: sharedCartService.cart_items[i].$id,

            //item data
            item_qty: sharedCartService.cart_items[i].item_qty,

            //Order data
            user_id: $scope.user_info.uid,
            user_name:$scope.user_info.displayName,
            address_id: abressObj || address,
            payment_id: payment,
            status: "Queued"
          });

        }

        //Remove users cart
        fireBaseData.refCart().child($scope.user_info.uid).remove();

        sharedUtils.showAlert("Info", "Order Successfull");

        // Go to past order page
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('lastOrders', {}, {location: "replace", reload: true});
      }
    }



    // $scope.addManipulation = function(edit_val) {  // Takes care of address add and edit ie Address Manipulator
    //
    //
    //   if(edit_val!=null) {
    //     $scope.data = edit_val; // For editing address
    //     var title="Edit Address";
    //     var sub_title="Edit your address";
    //   }
    //   else {
    //     $scope.data = {};    // For adding new address
    //     var title="Add Address";
    //     var sub_title="Add your new address";
    //   }
    //   // An elaborate, custom popup
    //   var addressPopup = $ionicPopup.show({
    //     template: '<input type="text"   placeholder="Nick Name"  ng-model="data.nickname"> <br/> ' +
    //     '<input type="text"   placeholder="Address" ng-model="data.address"> <br/> ' +
    //     '<input type="number" placeholder="Pincode" ng-model="data.pin"> <br/> ' +
    //     '<input type="number" placeholder="Phone" ng-model="data.phone">',
    //     title: title,
    //     subTitle: sub_title,
    //     scope: $scope,
    //     buttons: [
    //       { text: 'Close' },
    //       {
    //         text: '<b>Save</b>',
    //         type: 'button-positive',
    //         onTap: function(e) {
    //           if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone ) {
    //             e.preventDefault(); //don't allow the user to close unless he enters full details
    //           } else {
    //             return $scope.data;
    //           }
    //         }
    //       }
    //     ]
    //   });
    //
    //   addressPopup.then(function(res) {
    //
    //     if(edit_val!=null) {
    //       //Update  address
    //       fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({    // set
    //         nickname: res.nickname,
    //         address: res.address,
    //         pin: res.pin,
    //         phone: res.phone
    //       });
    //     }else{
    //       //Add new address
    //       fireBaseData.refUser().child($scope.user_info.uid).child("address").push({    // set
    //         nickname: res.nickname,
    //         address: res.address,
    //         pin: res.pin,
    //         phone: res.phone
    //       });
    //     }
    //
    //   });
    //
    // };

    ///for go address page :
    $scope.goAddressPage = function () {
        // console.log("this is calling...");
        $state.go('addAddress');

    };


  })
