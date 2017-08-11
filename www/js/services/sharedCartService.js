angular.module('app')
.factory('sharedCartService', ['$ionicPopup','fireBaseData','$firebaseArray','SessionService',function($ionicPopup, fireBaseData, $firebaseArray,SessionService){

  var uid ;// uid is temporary user_id

  var cart={}; // the main Object
  var guestUser = SessionService.getUser();
  //Check if user already logged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid=user.uid;
      cart.cart_items = $firebaseArray(fireBaseData.refCart().child(uid));
    }else if (!!guestUser && guestUser.guestID) {
      ////for guest user :
      uid = guestUser.guestID;
      console.log("uid at else part at service : " + uid);
      cart.cart_items = $firebaseArray(fireBaseData.refCart().child(uid));
    }
  });




  //Add to Cart
  cart.add = function(item) {
      // console.log("item : " + angular.toJson(item , ' '));
    //check if item is already added or not
    var guestUser = SessionService.getUser();
      // console.log("guestUser at service : " + angular.toJson(guestUser , ' '));
    if (!!guestUser && guestUser.uid) {
      ////for guest user :
      uid = guestUser.uid;
      console.log("uid at else part at service : " + uid);
      cart.cart_items = $firebaseArray(fireBaseData.refCart().child(uid));
    }
    fireBaseData.refCart().child(uid).once("value", function(snapshot) {

      if( snapshot.hasChild(item.$id) == true ){

        //if item is already in the cart
        var currentQty = snapshot.child(item.$id).val().item_qty;

        fireBaseData.refCart().child(uid).child(item.$id).update({   // update
          item_qty : currentQty+1
        });

      }else{
        // console.log("item : " + angular.toJson(item , ' '));
        //if item is new in the cart
        fireBaseData.refCart().child(uid).child(item.$id).set({    // set
          item_name: item.name,
          item_image: item.image,
          item_price: item.price,
          item_qty: 1,
          item_weight: item.weight
        });
      }
    });
  };

  cart.drop=function(item_id){
    fireBaseData.refCart().child(uid).child(item_id).remove();
  };

  cart.increment=function(item_id){

    //check if item is exist in the cart or not
    fireBaseData.refCart().child(uid).once("value", function(snapshot) {
      if( snapshot.hasChild(item_id) == true ){

        var currentQty = snapshot.child(item_id).val().item_qty;
        //check if currentQty+1 is less than available stock
        fireBaseData.refCart().child(uid).child(item_id).update({
          item_qty : currentQty+1
        });

      }else{
        //pop error
      }
    });

  };

  cart.decrement=function(item_id){

    //check if item is exist in the cart or not
    fireBaseData.refCart().child(uid).once("value", function(snapshot) {
      if( snapshot.hasChild(item_id) == true ){

        var currentQty = snapshot.child(item_id).val().item_qty;

        if( currentQty-1 <= 0){
          cart.drop(item_id);
        }else{
          fireBaseData.refCart().child(uid).child(item_id).update({
            item_qty : currentQty-1
          });
        }

      }else{
        //pop error
      }
    });

  };

  return cart;
}]);
