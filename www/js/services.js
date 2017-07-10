// angular.module('app.services', [])


// .factory('fireBaseData', function($firebase) {
// 	var ref = new Firebase("https://shopping-42daf.firebaseio.com/"),
//     refCart = new Firebase("https://shopping-42daf.firebaseio.com/cart"),
//     refUser = new Firebase("https://shopping-42daf.firebaseio.com/users"),
//     refCategory = new Firebase("https://shopping-42daf.firebaseio.com/category"),
//     refOrder = new Firebase("https://shopping-42daf.firebaseio.com/orders"),
//     refFeatured = new Firebase("https://shopping-42daf.firebaseio.com/featured"),
//     refProduct = new Firebase("https://shopping-42daf.firebaseio.com/product");
//
//   return {
//     ref: function() {
//       return ref;
//     },
//     refCart: function() {
//       return refCart;
//     },
//     refUser: function() {
//       return refUser;
//     },
//     refCategory: function() {
//       return refCategory;
//     },
//     refOrder: function() {
//       return refOrder;
//     },
//     refFeatured: function() {
//       return refFeatured;
//     },
//     refProduct: function() {
//       return refProduct;
//     }
//
//   }
// })
//
//
// .factory('sharedUtils',['$ionicLoading','$ionicPopup', function($ionicLoading,$ionicPopup){
//
//
//     var functionObj={};
//
//     functionObj.showLoading=function(){
//       $ionicLoading.show({
//         content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
//         animation: 'fade-in', // The animation to use
//         showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
//         maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
//         showDelay: 0 // The delay in showing the indicator
//       });
//     };
//     functionObj.hideLoading=function(){
//       $ionicLoading.hide();
//     };
//
//
//     functionObj.showAlert = function(title,message) {
//       var alertPopup = $ionicPopup.alert({
//         title: title,
//         template: message
//       });
//     };
//
//     return functionObj;
//
// }])
//
//
//
//
//   .factory('sharedCartService', ['$ionicPopup','fireBaseData','$firebaseArray','SessionService',function($ionicPopup, fireBaseData, $firebaseArray,SessionService){
//
//     var uid ;// uid is temporary user_id
//
//     var cart={}; // the main Object
// 		var guestUser = SessionService.getUser();
//     //Check if user already logged in
//     firebase.auth().onAuthStateChanged(function(user) {
//       if (user) {
//         uid=user.uid;
//         cart.cart_items = $firebaseArray(fireBaseData.refCart().child(uid));
//       }else if (!!guestUser && guestUser.guestID) {
//       	////for guest user :
//       	uid = guestUser.guestID;
// 				console.log("uid at else part at service : " + uid);
// 				cart.cart_items = $firebaseArray(fireBaseData.refCart().child(uid));
//       }
//     });
//
//
//
//
//     //Add to Cart
//     cart.add = function(item) {
//       //check if item is already added or not
// 			var guestUser = SessionService.getUser();
// 			if (!!guestUser && guestUser.guestID) {
//       	////for guest user :
//       	uid = guestUser.guestID;
// 				console.log("uid at else part at service : " + uid);
// 				cart.cart_items = $firebaseArray(fireBaseData.refCart().child(uid));
//       }
//       fireBaseData.refCart().child(uid).once("value", function(snapshot) {
//
//         if( snapshot.hasChild(item.$id) == true ){
//
//           //if item is already in the cart
//           var currentQty = snapshot.child(item.$id).val().item_qty;
//
//           fireBaseData.refCart().child(uid).child(item.$id).update({   // update
//             item_qty : currentQty+1
//           });
//
//         }else{
//
//           //if item is new in the cart
//           fireBaseData.refCart().child(uid).child(item.$id).set({    // set
//             item_name: item.name,
//             item_image: item.image,
//             item_price: item.price,
//             item_qty: 1
//           });
//         }
//       });
//     };
//
//     cart.drop=function(item_id){
//       fireBaseData.refCart().child(uid).child(item_id).remove();
//     };
//
//     cart.increment=function(item_id){
//
//       //check if item is exist in the cart or not
//       fireBaseData.refCart().child(uid).once("value", function(snapshot) {
//         if( snapshot.hasChild(item_id) == true ){
//
//           var currentQty = snapshot.child(item_id).val().item_qty;
//           //check if currentQty+1 is less than available stock
//           fireBaseData.refCart().child(uid).child(item_id).update({
//             item_qty : currentQty+1
//           });
//
//         }else{
//           //pop error
//         }
//       });
//
//     };
//
//     cart.decrement=function(item_id){
//
//       //check if item is exist in the cart or not
//       fireBaseData.refCart().child(uid).once("value", function(snapshot) {
//         if( snapshot.hasChild(item_id) == true ){
//
//           var currentQty = snapshot.child(item_id).val().item_qty;
//
//           if( currentQty-1 <= 0){
//             cart.drop(item_id);
//           }else{
//             fireBaseData.refCart().child(uid).child(item_id).update({
//               item_qty : currentQty-1
//             });
//           }
//
//         }else{
//           //pop error
//         }
//       });
//
//     };
//
//     return cart;
//   }])



// .factory('BlankFactory', [function(){
//
// }])

// .service('SessionService', [function SessionFunction($rootScope, $ionicHistory) {
//
//   var Session = {
//     user: null,
//
//     getUser: function() {
//       Session.user = localStorage.getItem("user");
//       return JSON.parse(Session.user);
//     },
//     setUser: function(data) {
//       Session.user = JSON.stringify(data);
//       localStorage.setItem("user", Session.user);
//     },
//
//     isLoggedIn: function() {
//       if (!!Session.getUser()) {
//         return true;
//       } else {
//         return false;
//       }
//     },
//     cache: {},
//
//   };
//   return Session;
// }])

// .service('IonicPopupService', ['$ionicPopup', function($ionicPopup) {
//
//   this.alert = function(title, message) {
//     return $ionicPopup.alert({
//       title: title,
//       template: message
//     });
//   };
//
//   this.confirm = function(title, message) {
//     return $ionicPopup.confirm({
//       title: title,
//       template: message
//     });
//   };
//
//   this.showPopup = function() {
//
//     // An elaborate, custom popup
//     var myPopup = $ionicPopup.show({
//       template: '<input type="text" ng-model="data.album">',
//       title: 'Album Name',
//       subTitle: 'Please enter name of new album and click on save',
//       // scope: $scope,
//       buttons: [{
//         text: 'Cancel'
//       }, {
//         text: '<b>Save</b>',
//         type: 'button-positive',
//         onTap: function(e) {
//           // if (!$scope.data.album) {
//           //   //don't allow the user to close unless he enters wifi password
//           //   e.preventDefault();
//           // } else {
//           return;
//           // }
//         }
//       }, ]
//     });
//     // myPopup.then(function(res) {
//     //   $scope.createAlbum();
//     //   console.log('called....', res);
//     // });
//     // $timeout(function() {
//     //   myPopup.close(); //close the popup after 3 seconds for some reason
//     // }, 3000);
//   };
//
//   // this.showAlert = function(title, message) {
//   //   return $ionicPopup.confirm({
//   //     title: title,
//   //     template: message
//   //   });
//   // };
//
//   // $scope.showAlert = function(title, message) {
//   //   // var alertPopup =
//   //   .then(function(res) {
//   //     console.log('Thank you for not eating my delicious ice cream cone');
//   //   });
//   //
//   // };
//
//   //
//
// }])

// .service('CommonService', ['$http', 'IonicPopupService', function( $http, IonicPopupService) {
//
//
//
//
//   this.validateEmpty = function(value, failTitle, failMessage) {
//     if (!!value && value !== '') {
//       return true;
//     } else {
//       IonicPopupService.alert(failTitle, failMessage);
//       return false;
//     }
//   };
//
//   this.validateEmail = function(email, failTitle, failMessage) {
//     console.log('email: ' + email);
//     var re = new RegExp(
//       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
//     if (re.test(email) !== true) {
//       console.log('its false');
//       IonicPopupService.alert(failTitle, failMessage);
//       return false;
//     } else {
//       console.log('its true');
//       return true;
//     }
//
//   };







  // //for select category
  //
  // this.selectSubCategoy = function(jsonData) {
  //   var uristr = encodeURI(
  //     '{"id":"' + Session.getUser().userName + '","access_ticket":"' + Session.getUser().DESCRIPTION + '"}&commID=' + Session.getSelectedCommunity().ID +
  //     '&parCatID=' + jsonData + ''
  //   );
  //   return $http({
  //     url: AppSettings.classifiedUrl + 'getSubCategories.php?CurrentLogin=' + uristr,
  //     method: 'GET'
  //   });
  // };



  // if (($location.path() == "/app/welcome_page") || ($location.path() == "/app/login")) {
  //   $(".btnHide").css("display", "none");
  // }



  // Example Call from wennect
  // http://wennect.effisoc.com/getStateOptionsByCountryID.php?CurrentLogin={"id":"kjt","access_ticket":"1365211107.144696950912"}&countryid=219

// }]);
