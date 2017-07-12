 angular.module('app')
.controller('indexCtrl', function($scope,$rootScope,sharedUtils,$ionicHistory,$state,$ionicSideMenuDelegate,sharedCartService,SessionService,SessionService) {
      // if (!!$rootScope.userLog) {
      //   $scope.myUSer = $rootScope.userLog;
      //   console.log("$scope.user at rootscope " + angular.toJson($scope.myUser ,' '));
      // }else {
      //   $scope.myUSer = SessionService.getUser();
      //   console.log("$scope.user at at session: " + angular.toJson($scope.myUSer , ' '));
      // }
    $scope.myUSer = $rootScope.user;
    console.log("$scope.user at rootScope : " + angular.toJson($scope.myUSer  ,' '));

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user_info=user; //Saves data to user_info
        console.log("$scope.user_info : " + angular.toJson($scope.user_info , ' '));
        //Only when the user is logged in, the cart qty is shown
        //Else it will show unwanted console error till we get the user object
        $scope.get_total= function() {
          var total_qty=0;
          for (var i = 0; i < sharedCartService.cart_items.length; i++) {
            total_qty += sharedCartService.cart_items[i].item_qty;
          }
          return total_qty;
        };

      }else {

        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar

        $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {location: "replace"});

      }
    });

    $scope.logout=function(){

      sharedUtils.showLoading();

      // Main Firebase logout
      firebase.auth().signOut().then(function() {


        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
        SessionService.setUser(null);
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });


        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {location: "replace"});

      }, function(error) {
         sharedUtils.showAlert("Error","Logout Failed")
      });

    }

  })
// .controller('loginCtrl', function($scope,$rootScope,$ionicHistory,sharedUtils,$state,$ionicSideMenuDelegate,SessionService,$firebaseObject,$firebaseArray,$window,$cordovaDevice) {
//     $rootScope.extras = false;  // For hiding the side bar and nav icon
//
//     // When the user logs out and reaches login page,
//     // we clear all the history and cache to prevent back link
//     $scope.$on('$ionicView.enter', function(ev) {
//       if(ev.targetScope !== $scope){
//         $ionicHistory.clearHistory();
//         $ionicHistory.clearCache();
//       }
//     });
//     ////for get device tocken :
//       var init = function () {
//         console.log("initializing device");
//         try {
//
//           $scope.deviceId = $cordovaDevice.getUUID();
//           SessionService.setUser($scope.uuid);
//           $scope.sessionUser = SessionService.getUser();
//           console.log("$scope.sessionUser for get id: " + angular.toJson($scope.sessionUser , ' '));
//           console.log("$scope.uuid : " + $scope.uuid);
//
//         }
//         catch (err) {
//           console.log("Error " + err);
//           // alert("error " + err);
//         }
//
//       };
//
//       ionic.Platform.ready(function(){
//         init();
//       });
//     //Check if user already logged in
//     firebase.auth().onAuthStateChanged(function(user) {
//       if (user) {
//
//         $ionicHistory.nextViewOptions({
//           historyRoot: true
//         });
//         $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
//         $rootScope.extras = true;
//         sharedUtils.hideLoading();
//         $state.go('home', {}, {location: "replace"},{reload: true});
//
//       }
//     });
//
//
//     $scope.loginEmail = function(formName,cred) {
//       if(formName.$valid) {  // Check if the form data is valid or not
//           sharedUtils.showLoading();
//           //Email
//           firebase.auth().signInWithEmailAndPassword(cred.email,cred.password).then(function(result) {
//
//                 // You dont need to save the users session as firebase handles it
//                 // You only need to :
//                 // 1. clear the login page history from the history stack so that you cant come back
//                 // 2. Set rootScope.extra;
//                 // 3. Turn off the loading
//                 // 4. Got to menu page
//               // console.log("result of login : " + result);
//               firebase.auth().onAuthStateChanged(function(user) {
//               if (user) {
//                 var userObj = {
//                     displayName: user.displayName,
//                     email: user.email,
//                     uid:  user.uid,
//                     photoURL: user.photoURL,
//                     emailVerified: user.emailVerified,
//                     providerData: user.providerData
//                 };
//             $scope.user = userObj;
//                 SessionService.setUser($scope.user);
//                 $scope.sessionUser = SessionService.getUser();
//                 // console.log("$scope.sessionUser : " + angular.toJson($scope.sessionUser , ' '));
//                 $ionicHistory.nextViewOptions({
//                   historyRoot: true
//                 });
//                 $rootScope.extras = true;
//                 sharedUtils.hideLoading();
//                 $state.go('home', {}, {location: "replace"});
//               }
//             });
//
//             },
//             function(error) {
//               sharedUtils.hideLoading();
//               sharedUtils.showAlert("Please note","Authentication Error");
//             }
//         );
//
//       }else{
//         sharedUtils.showAlert("Please note","Entered data is not valid");
//       }
//
//
//
//
//     };
//     $scope.gotomenupage = function () {
//       $state.go('home');
//     };
//
//
//     ////for facebook login:
//   var facebookProvider = new firebase.auth.FacebookAuthProvider();
//   $scope.loginWithFacebook = function () {
//               // $scope.userData = [];
//               firebase.auth().signInWithPopup(facebookProvider).then(function(result) {
//               var token = result.credential.accessToken;
//               // The signed-in user info.
//               var user = result.user;
//               console.log("user.uid " + user.uid);
//                 var usersRef = new Firebase("https://shopping-42daf.firebaseio.com/users/" + user.uid);
//                 // console.log("usersRef: " + usersRef);
//                 var userData = $firebaseArray(usersRef);
//                 userData.$loaded().then(function(response) {
//                   $scope.data = response;
//                   // console.log("$scope.data : " + angular.toJson($scope.data , ' '));
//                 if ($scope.data.length > 0) {
//                           var userDataById = $firebaseObject(usersRef);
//                           userDataById.$loaded().then(function(resp) {
//                             $scope.userObj = resp;
//                             var obj = {
//                                 uid : $scope.userObj.uid,
//                                 displayName : $scope.userObj.displayName,
//                                 email : $scope.userObj.email,
//                                 photoURL : $scope.userObj.photoURL,
//                                 isAdmin : $scope.userObj.isAdmin
//
//                             }
//                             console.log("$scope.userObj: " + angular.toJson($scope.userObj, ' '));
//                             SessionService.setUser(obj);
//                             $scope.sessionUser = SessionService.getUser();
//                             // console.log("$scope.sessionUser when already user signup : " + angular.toJson($scope.sessionUser , ' '));
//
//                           });
//
//                   console.log("user already saved..");
//                 }else {
//                   var userObj = {
//                       uid : user.uid,
//                       displayName : user.displayName,
//                       email : user.email,
//                       photoURL : user.photoURL,
//                       isAdmin : true
//
//                   }
//                 var ref = firebase.database().ref('users/' + user.uid);
//                 ref.set(userObj).then(function(snapshot) {
//                   console.log('user set successfully...');
//                 });
//                 // var menuRef = firebase.database().ref().child('users').push(userObj).key;
//                   SessionService.setUser(userObj);
//                   $scope.sessionUser = SessionService.getUser();
//                   // console.log("$scope.sessionUser : " + angular.toJson($scope.sessionUser , ' '));
//                 }
//
//                 })
//                 .catch(function(error) {
//                   console.log("Error at get Ora-In-Tv Data:", error);
//                 });
//
//
//               // ...
//             }).catch(function(error) {
//               // Handle Errors here.
//               var errorCode = error.code;
//               var errorMessage = error.message;
//               // The email of the user's account used.
//               var email = error.email;
//               // The firebase.auth.AuthCredential type that was used.
//               var credential = error.credential;
//               // ...
//             });
//
//
//   };
//   ///for custom user :
//   $scope.guestUser = function () {
//     ///for check condition :
//       var ref = new Firebase("https://shopping-42daf.firebaseio.com/users/5afaa714fd8d2997");
//       // var ref = firebase.database().ref('users/5afaa714fd8d2997');
//       console.log("ref : " + ref);
//       var userData = $firebaseArray(ref);
//       userData.$loaded().then(function(resp) {
//         $scope.data = resp;
//         console.log("  $scope.data : " + angular.toJson(  $scope.data , ' '));
//       if ($scope.data.length > 0) {
//         console.log("user saved already...");
//         $state.go('home');
//       } else  {
//             var guestObj = {
//                 isAdmin : false,
//                 isGuest: true,
//                 uid: $scope.deviceId
//               }
//
//             console.log("ref : "  + ref);
//             ref.set(guestObj).then(function(response) {
//               console.log('guest user set successfully...' + angular.toJson(response , ' '));
//             });
//
//             SessionService.setUser(guestObj);
//             $scope.sessionUser = SessionService.getUser();
//             console.log("$scope.sessionUser for guest user"  + angular.toJson($scope.sessionUser , ' '));
//
//         $state.go('home');
//         }
//       });
//
//
//     // $window.location.reload(true);
//   };
//
//
//
// })
// .controller('SareesCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
//                                   $ionicHistory,$firebaseArray,sharedCartService,sharedUtils) {
//   //Check if user already logged in
//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       $scope.user_info=user; //Saves data to user_info
//     }else {
//
//       $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
//       $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
//
//       $ionicHistory.nextViewOptions({
//         historyRoot: true
//       });
//       $rootScope.extras = false;
//       sharedUtils.hideLoading();
//       $state.go('tabsController.login', {}, {location: "replace"});
//
//     }
//     $scope.sareesPage = function(){
//       $state.go('sarees');
//     };
//     $scope.kurtisPage = function(){
//       $state.go('krutis');
//     };
//     $scope.salwarPage = function(){
//       $state.go('salwar');
//     };
//     $scope.lehengaPage = function(){
//       $state.go('lehenga');
//     };
//   });
//
//   // On Loggin in to menu page, the sideMenu drag state is set to true
//   $ionicSideMenuDelegate.canDragContent(true);
//   $rootScope.extras=true;
//
//   // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
//   $scope.$on('$ionicView.enter', function(ev) {
//     if(ev.targetScope !== $scope){
//       $ionicHistory.clearHistory();
//       $ionicHistory.clearCache();
//     }
//   });
//
//
//
//   $scope.loadsaree = function() {
//     // debugger
//     sharedUtils.showLoading();
//     $scope.saree=$firebaseArray(fireBaseData.refSaree());
//     sharedUtils.hideLoading();
//   }
//
//   $scope.showProductInfo=function (id) {
//
//   };
//   $scope.addToCart=function(item){
//     sharedCartService.add(item);
//   };
//
// })
//
// .controller('KurtisCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
//                                   $ionicHistory,$firebaseArray,sharedCartService,sharedUtils) {
//   //Check if user already logged in
//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       $scope.user_info=user; //Saves data to user_info
//     }else {
//
//       $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
//       $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
//
//       $ionicHistory.nextViewOptions({
//         historyRoot: true
//       });
//       $rootScope.extras = false;
//       sharedUtils.hideLoading();
//       $state.go('tabsController.login', {}, {location: "replace"});
//
//     }
//     $scope.sareesPage = function(){
//       $state.go('sarees');
//     };
//     $scope.kurtisPage = function(){
//       $state.go('krutis');
//     };
//     $scope.salwarPage = function(){
//       $state.go('salwar');
//     };
//     $scope.lehengaPage = function(){
//       $state.go('lehenga');
//     };
//   });
//
//   // On Loggin in to menu page, the sideMenu drag state is set to true
//   $ionicSideMenuDelegate.canDragContent(true);
//   $rootScope.extras=true;
//
//   // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
//   $scope.$on('$ionicView.enter', function(ev) {
//     if(ev.targetScope !== $scope){
//       $ionicHistory.clearHistory();
//       $ionicHistory.clearCache();
//     }
//   });
//
//
//
//   $scope.loadKurtis = function() {
//     // debugger
//     sharedUtils.showLoading();
//     $scope.kurtis=$firebaseArray(fireBaseData.refKurties());
//     sharedUtils.hideLoading();
//   }
//
//   $scope.showProductInfo=function (id) {
//
//   };
//   $scope.addToCart=function(item){
//     sharedCartService.add(item);
//   };
//
// })
//
// .controller('SalwarCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
//                                   $ionicHistory,$firebaseArray,sharedCartService,sharedUtils) {
//   //Check if user already logged in
//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       $scope.user_info=user; //Saves data to user_info
//     }else {
//
//       $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
//       $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
//
//       $ionicHistory.nextViewOptions({
//         historyRoot: true
//       });
//       $rootScope.extras = false;
//       sharedUtils.hideLoading();
//       $state.go('tabsController.login', {}, {location: "replace"});
//
//     }
//     $scope.sareesPage = function(){
//       $state.go('sarees');
//     };
//     $scope.kurtisPage = function(){
//       $state.go('krutis');
//     };
//     $scope.salwarPage = function(){
//       $state.go('salwar');
//     };
//     $scope.lehengaPage = function(){
//       $state.go('lehenga');
//     };
//   });
//
//   // On Loggin in to menu page, the sideMenu drag state is set to true
//   $ionicSideMenuDelegate.canDragContent(true);
//   $rootScope.extras=true;
//
//   // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
//   $scope.$on('$ionicView.enter', function(ev) {
//     if(ev.targetScope !== $scope){
//       $ionicHistory.clearHistory();
//       $ionicHistory.clearCache();
//     }
//   });
//
//
//
//   $scope.loadsalwar = function() {
//     // debugger
//     sharedUtils.showLoading();
//     $scope.salwar=$firebaseArray(fireBaseData.refSalwar());
//     sharedUtils.hideLoading();
//   }
//
//   $scope.showProductInfo=function (id) {
//
//   };
//   $scope.addToCart=function(item){
//     sharedCartService.add(item);
//   };
//
// })
//
// .controller('LehengaCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
//                                   $ionicHistory,$firebaseArray,sharedCartService,sharedUtils) {
//   //Check if user already logged in
//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       $scope.user_info=user; //Saves data to user_info
//     }else {
//
//       $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
//       $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
//
//       $ionicHistory.nextViewOptions({
//         historyRoot: true
//       });
//       $rootScope.extras = false;
//       sharedUtils.hideLoading();
//       $state.go('tabsController.login', {}, {location: "replace"});
//
//     }
//     $scope.sareesPage = function(){
//       $state.go('sarees');
//     };
//     $scope.kurtisPage = function(){
//       $state.go('krutis');
//     };
//     $scope.salwarPage = function(){
//       $state.go('salwar');
//     };
//     $scope.lehengaPage = function(){
//       $state.go('lehenga');
//     };
//   });
//
//   // On Loggin in to menu page, the sideMenu drag state is set to true
//   $ionicSideMenuDelegate.canDragContent(true);
//   $rootScope.extras=true;
//
//   // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
//   $scope.$on('$ionicView.enter', function(ev) {
//     if(ev.targetScope !== $scope){
//       $ionicHistory.clearHistory();
//       $ionicHistory.clearCache();
//     }
//   });
//
//
//
//   $scope.loadlehenga = function() {
//     // debugger
//     sharedUtils.showLoading();
//     $scope.lehenga=$firebaseArray(fireBaseData.refLehenga());
//     sharedUtils.hideLoading();
//   }
//
//   $scope.showProductInfo=function (id) {
//
//   };
//   $scope.addToCart=function(item){
//     sharedCartService.add(item);
//   };
//
// })
//
//
//
// // .controller('KurtisCtrl', function($scope) {
// //   //Check if user already logged in
// // })
//
// // .controller('SalwarCtrl', function($scope) {
// //   //Check if user already logged in
// // })
//
// // .controller('LehengaCtrl', function($scope) {
// //   //Check if user already logged in
// // })
//
// .controller('signupCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,
//                                    $state,fireBaseData,$ionicHistory) {
//     $rootScope.extras = false; // For hiding the side bar and nav icon
//
//     $scope.signupEmail = function (formName, cred) {
//
//       if (formName.$valid) {  // Check if the form data is valid or not
//
//         sharedUtils.showLoading();
//
//         //Main Firebase Authentication part
//         firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function (result) {
//
//             //Add name and default dp to the Autherisation table
//             result.updateProfile({
//               displayName: cred.name,
//               photoURL: "default_dp"
//             }).then(function() {}, function(error) {});
//
//             //Add phone number to the user table
//             fireBaseData.refUser().child(result.uid).set({
//               telephone: cred.phone
//             });
//
//             //Registered OK
//             $ionicHistory.nextViewOptions({
//               historyRoot: true
//             });
//             $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
//             $rootScope.extras = true;
//             sharedUtils.hideLoading();
//             $state.go('home', {}, {location: "replace"});
//
//         }, function (error) {
//             sharedUtils.hideLoading();
//             sharedUtils.showAlert("Please note","Sign up Error");
//         });
//
//       }else{
//         sharedUtils.showAlert("Please note","Entered data is not valid");
//       }
//
//     }
//
//   })
//
//   ///for Admin  :
//     .controller('AdminCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,
//                                          $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService ) {
//
//                 $ionicModal.fromTemplateUrl('templates/admin.html', {
//                     scope: $scope
//                     }).then(function(modal) {
//                           $scope.modal = modal;
//                       });
//
// 					  $ionicModal.fromTemplateUrl('templates/admin.html', {
//                     scope: $scope
//                     }).then(function(updateModal) {
//                           $scope.updateModal = updateModal;
//                       });
//
// 					$ionicModal.fromTemplateUrl('templates/admin2.html', {
// 					scope: $scope,
// 					animation: 'slide-in-up'
// 				  }).then(function(modal) {
// 					console.log('before assign');
// 					$scope.modal1 = modal;
// 				  });
// 				  $scope.openModal1 = function() {
// 					$scope.modal1.show();
// 				  };
// 				  $scope.closeModal1 = function() {
// 					$scope.modal1.hide();
// 				  };
// 				  // Cleanup the modal when we're done with it!
// 				  $scope.$on('$destroy', function() {
// 					$scope.modal1.remove();
// 				  });
//
//       ///for show and hide div :
//         $scope.showsCategory = false;
//         $scope.showMenu = true;
//         $scope.showProductDescription = false;
//
//       $scope.showCategoryDiv = function() {
//           $scope.showsCategory = true;
//           $scope.showMenu = false;
//           $scope.showProductDescription = false;
//       };
//       $scope.showMenuDiv = function() {
//           $scope.showMenu = true;
//           $scope.showsCategory = false;
//           $scope.showProductDescription = false;
//       };
//       ///for category show:
//       $scope.loadCategory = function() {
//
//         $scope.category = $firebaseArray(fireBaseData.refCategory());
//         console.log("$scope.category : " + angular.toJson($scope.category , ' '));
//       };
//       // $scope.showProdDescDiv = function() {
//       //     $scope.showMenu = false;
//       //     $scope.showsCategory = false;
//       //       $scope.showProductDescription = true;
//       // };
//
//
//         $scope.userData = SessionService.getUser();
//         // console.log("$scope.userData at admin page  : " + angular.toJson($scope.userData , ' '));
//
//
// $scope.validate = function(item,downloadURL) {
//         console.log("item : " + angular.toJson(item , ' '));
//       if (CommonService.validateEmpty(item, 'Oops!', 'Please enter value') === false) {
//         return false;
//       }else if (CommonService.validateEmpty($scope.downloadURL, 'Oops!', 'Please Upload product Image') === false) {
//         return false;
//       }else if (CommonService.validateEmpty(item.name, 'Oops!', 'Please enter product name') === false) {
//         return false;
//       } else if (CommonService.validateEmpty(item.category, 'Oops!', 'Please enter product category') === false) {
//         return false;
//       } else if (CommonService.validateEmpty(item.available, 'Oops!', 'Please describe your product is available?(yes or no)') === false) {
//         return false;
//       } else if (CommonService.validateEmpty(item.description, 'Oops!', 'Please enter product description') === false) {
//         return false;
//       } else if (CommonService.validateEmpty(item.price, 'Oops!', 'Please enter product price') === false) {
//         return false;
//       } else if (CommonService.validateEmpty(item.stock, 'Oops!', 'Please enter product stocks') === false) {
//         return false;
//       }
//     };
//
//       //this is for add category :
//         $scope.addCategory = function (categoryName) {
//             var catObj = {
//                 name : categoryName
//             }
//           var categoryRef = firebase.database().ref().child('category').push(catObj).key;
//           console.log("catObj : " + angular.toJson(catObj , ' '));
//         };
//         ///for upload image :
//         $scope.uploadFile = function(event) {
//           var files = event.target.files;
//           var storage = firebase.storage();
//           var storageRef = storage.ref();
//           $scope.determinateValue = $scope.determinateValue + 5;
//           var uploadTask = storageRef.child('profileimages/' + 'photo_' + firebase.auth().currentUser.uid + '_' + new Date().getTime()).put(files[0], { contentType: 'image/jpeg' });
//
//           // Listen for state changes, errors, and completion of the upload.
//           uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
//             function(snapshot) {
//               // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//               $scope.determinateValue = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100) - 5;
//               $scope.$apply();
//               // console.log('Upload is ' + progress + '% done');
//               switch (snapshot.state) {
//                 case firebase.storage.TaskState.PAUSED: // or 'paused'
//                   console.log('Upload is paused');
//                   break;
//                 case firebase.storage.TaskState.RUNNING: // or 'running'
//                   console.log('Upload is running');
//                   break;
//               }
//
//             },
//             function(error) {
//               console.log('At error : ' + angular.toJson(error));
//             },
//             function() {
//               // Upload completed successfully, now we can get the download URL
//               $scope.downloadURL = uploadTask.snapshot.downloadURL;
//               $scope.updateproductdetails.image = $scope.downloadURL;
//               console.log("downloadURL : " + $scope.downloadURL);
//               // $scope.currentUser.photo = downloadURL;
//               var inProgressData = {};
//
//               $scope.determinateValue = 0;
//             });
//         };
//
//
//                 $scope.productId = $stateParams.product_id;
//     console.log("$scope.productId for admin  : " + $scope.productId );
//
//         $scope.addItem = function (item) {
//
//         if ($scope.validate(item) === false) {
//               return;
//             }
//           //console.log("item .category : " + item.category);
//           $scope.globalcategory = item.category;
//           //console.log("$scope.globalcategory "+ $scope.globalcategory);
//             var menuObj = {
//                 name : item.name,
//                 available : item.available,
//                 category : item.category,
//                 description : item.description,
//                 image : $scope.downloadURL,
//                 price : item.price,
//                 stock : item.stock
//             }
//           //console.log("menuObj : " + angular.toJson(menuObj , ' '));
//           var menuRef = firebase.database().ref().child('product').push(menuObj).key;
//           $scope.globalproductID = menuRef;
//           console.log("$scope.globalcategory "+ $scope.globalproductID);
//         };
//
//
//         //add html dynamically to add more button clicks
//         $scope.inputs = [];
//         $scope.inputs.push({'attribute': '', 'value' : ''});
//         $scope.addfield = function(){
//           $scope.inputs.push({})
//         };
// 		$scope.updatefield = function(){
//           $scope.inputs.push({})
//         };
//
//         $scope.addspcification = function(){
// 			console.log("$stateParams.product_id ----" + $stateParams.product_id);
// 			console.log(" $scope.globalproductID   ----" +  $scope.globalproductID );
//           $scope.data = [];
//           for (var i = 0; i < $scope.inputs.length; i++) {
//               $scope.name = $scope.inputs[i].attribute;
//               $scope.atribute = $scope.inputs[i].value;
//               var obj = {
//                 name : $scope.name,
//                 value: $scope.atribute
//
//               };
//           console.log(" $obj.obj "+ angular.toJson(obj,' '));
//
// 		  if(!!$stateParams.product_id){
// 			var refProduct = firebase.database().ref().child('product/' + $stateParams.product_id + '/product_specification' ).push(obj).key;
// 		  }
//
// 		  if(!!$scope.globalproductID){
//             var refProduct = firebase.database().ref().child('product/' + $scope.globalproductID + '/product_specification' ).push(obj).key;
// 		  }
//             console.log("refProduct : " + refProduct);
//                 // var refProduct = firebase.database().ref().push(obj).key;
//             //$scope.datas = $scope.inputs[i];
//             // var Obj = $scope.data.push($scope.inputs[i])
//           }
//           console.log(" $scope.datas "+ angular.toJson($scope.data,' '));
//           //console.log(" $scope.datas "+ angular.toJson($scope.lol,' '));
//           // var refProduct = firebase.database().ref().child('product/ID/Product Specification').push(Obj).key;
//         }
//
//         // Fetch Product from Firebase
//         console.log("userid for database  : " + $scope.productId );
//         $scope.updateproductdetails = '' ;
//
//         var refProduct = new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.productId);
//         var userData = $firebaseObject(refProduct);
//         userData.$loaded().then(function(response) {
//           $scope.updateproductdetails = response;
//           console.log("Response data for fetch data from response ",angular.toJson($scope.updateproductdetails,' '));
//         });
//
//
// 		$scope.updateItem = function(updateproductdetails){
// 			$scope.data = updateproductdetails;
// 			console.log("menuObj test: first " + angular.toJson(updateproductdetails.image, ' '));
// 		/*	if(updateproductdetails.image === null){
// 				console.log("menuObj test: 11 " + angular.toJson(updateproductdetails.image, ' '));
// 				updateproductdetails.image = updateproductdetails.image;
// 			}
// 			else
// 			{
// 				updateproductdetails.image = $scope.downloadURL;
// 				console.log("menuObj test:  22" + angular.toJson(updateproductdetails.image, ' '));
// 			}
// 			*/
// 			console.log("menuObj test breofre : " + angular.toJson(updateproductdetails.image , ' '));
//             var menuObj = {
//                 name : updateproductdetails.name,
//                 available : updateproductdetails.available,
//                 category : updateproductdetails.category,
//                 description : updateproductdetails.description,
//                 image : updateproductdetails.image,
//                 price : updateproductdetails.price,
// 				stock : updateproductdetails.stock
//             }
//           //console.log("menuObj test: " + angular.toJson(menuObj , ' '));
//           //console.log("product ID " + angular.toJson($scope.productId , ' '));
//
//           var menuRef = firebase.database().ref().child('product/'+$scope.productId).update(menuObj);
// 			//console.log("response test: " + angular.toJson(menuRef , ' '));
// 		}
//
// 		// Update Product Specification on model
//
// 		var userdata = [];
// 		var refProduct = new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.productId +"/product_specification");
//         var userData = $firebaseArray(refProduct);
//         userData.$loaded().then(function(response) {
//           $scope.productSpdetails = response;
//           console.log("admin pro se d ",angular.toJson($scope.productSpdetails,' '));
//         });
//
// 		$scope.updatespcification = function(productSpdetails){
// 			console.log("update fun ",angular.toJson($scope.productSpdetails,' '));
//
//
//      $scope.data = [];
//           for (var i = 0; i < $scope.productSpdetails.length; i++) {
//               $scope.name = $scope.productSpdetails[i].name;
//               $scope.atribute = $scope.productSpdetails[i].value;
// 			  $scope.id = $scope.productSpdetails[i].$id;
//               var obj = {
//                 name : $scope.name,
//                 value: $scope.atribute,
// 				id: $scope.id
//               };
// 			  var refProduct = firebase.database().ref().child('product/' + $stateParams.product_id + '/product_specification/' + $scope.id ).update(obj);
// 			  };
//           console.log("update Angular "+ angular.toJson(obj,' '));
//
// 		 //var refProduct = firebase.database().ref().child('product/' + $scope.globalproductID + '/product_specification/' + $scope.id ).update(obj);
//
// 		}
//
//         })
//   //////complete admin controller
//
//
// .controller('homeCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
//                                   $ionicHistory,$firebaseArray,sharedCartService,sharedUtils,SessionService,$stateParams,$window) {
//
//
//
//   //Check if user already logged in
//     // $scope.user = SessionService.getUser();
//     // console.log("$scope.user at menu 2 page: " + angular.toJson($scope.user , ' '));
//
//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       $scope.user_info=user; //Saves data to user_info
//       $scope.user = SessionService.getUser();
//       console.log("$scope.user at menu 2 page: " + angular.toJson($scope.user , ' '));
//       // $window.location.reload(true);
//       // $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
//     }else if ($scope.user.isGuest === 'true') {
//       $scope.user_info=$scope.user;
//       $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
//     }else {
//
//       // $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
//       // $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
//       //
//       // $ionicHistory.nextViewOptions({
//       //   historyRoot: true
//       // });
//       //
//       // $rootScope.extras = false;
//       // sharedUtils.hideLoading();
//       // $state.go('tabsController.login', {}, {location: "replace"});
//
//     }
//   });
//
//   // On Loggin in to menu page, the sideMenu drag state is set to true
//   $ionicSideMenuDelegate.canDragContent(true);
//   $rootScope.extras=true;
//
//   // When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
//   $scope.$on('$ionicView.enter', function(ev) {
//     if(ev.targetScope !== $scope){
//       $ionicHistory.clearHistory();
//       $ionicHistory.clearCache();
//     }
//
//   });
//
// $scope.filterProduct = function (category_id) {
//   // debugger
//   console.log("category_id : " + category_id );
//   $scope.menu = $firebaseArray(fireBaseData.refProduct()
//     .orderByChild('category')
//     .equalTo(category_id));
//
// };
//
//
//   $scope.loadMenu = function() {
//     // debugger
//     sharedUtils.showLoading();
//     $scope.menu=$firebaseArray(fireBaseData.refProduct());
//     sharedUtils.hideLoading();
//   };
//
//   $scope.loadCategory = function() {
//     // sharedUtils.showLoading();
//     $scope.category=$firebaseArray(fireBaseData.refCategory());
//     // sharedUtils.hideLoading();
//   };
//
//   $scope.showProductInfo=function (id) {
//         $state.go('details',{'category_id' : id });
//   };
//   $scope.addToCart=function(item){
//
//     sharedCartService.add(item);
//   };
//
//
//   // $scope.userData = SessionService.getUser();
//   // console.log("$scope.userData : " + angular.toJson($scope.userData , ' '));
//
//   $scope.goAdminPage = function(id){
//     $state.go('admin' , {'product_id' : id});
//   };
//
// })
//
// .controller('offersCtrl', function($scope,$rootScope) {
//
//     //We initialise it on all the Main Controllers because, $rootScope.extra has default value false
//     // So if you happen to refresh the Offer page, you will get $rootScope.extra = false
//     //We need $ionicSideMenuDelegate.canDragContent(true) only on the menu, ie after login page
//     $rootScope.extras=true;
// })
//

//
// .controller('myCartCtrl', function($scope,$rootScope,$state,sharedCartService,SessionService) {
//
//     $rootScope.extras=true;
//     var guestUser = SessionService.getUser();
//     //Check if user already logged in
//     firebase.auth().onAuthStateChanged(function(user) {
//       if (user) {
//
//         $scope.cart=sharedCartService.cart_items;  // Loads users cart
//
//         $scope.get_qty = function() {
//           $scope.total_qty=0;
//           $scope.total_amount=0;
//
//           for (var i = 0; i < sharedCartService.cart_items.length; i++) {
//             $scope.total_qty += sharedCartService.cart_items[i].item_qty;
//             $scope.total_amount += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_price);
//           }
//           return $scope.total_qty;
//         };
//       }else if (!!guestUser) {
//           $scope.cart=sharedCartService.cart_items;  // Loads users cart
//
//           $scope.get_qty = function() {
//             $scope.total_qty=0;
//             $scope.total_amount=0;
//
//             for (var i = 0; i < sharedCartService.cart_items.length; i++) {
//               $scope.total_qty += sharedCartService.cart_items[i].item_qty;
//               $scope.total_amount += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_price);
//             }
//             return $scope.total_qty;
//           };
//       }
//       //We dont need the else part because indexCtrl takes care of it
//     });
//
//     $scope.removeFromCart=function(c_id){
//       sharedCartService.drop(c_id);
//     };
//
//     $scope.inc=function(c_id){
//       sharedCartService.increment(c_id);
//     };
//
//     $scope.dec=function(c_id){
//       sharedCartService.decrement(c_id);
//     };
//
//     $scope.checkout=function(){
//       $state.go('checkout', {}, {location: "replace"});
//     };
//
//
//
// })
//
// .controller('lastOrdersCtrl', function($scope,$rootScope,fireBaseData,sharedUtils) {
//
//     $rootScope.extras = true;
//     sharedUtils.showLoading();
//
//     //Check if user already logged in
//     firebase.auth().onAuthStateChanged(function (user) {
//       if (user) {
//         $scope.user_info = user;
//
//         fireBaseData.refOrder()
//           .orderByChild('user_id')
//           .startAt($scope.user_info.uid).endAt($scope.user_info.uid)
//           .once('value', function (snapshot) {
//             $scope.orders = snapshot.val();
//             $scope.$apply();
//           });
//           sharedUtils.hideLoading();
//       }
//     });
//
//
//
//
//
// })
//
// .controller('favouriteCtrl', function($scope,$rootScope) {
//
//     $rootScope.extras=true;
// })
//
// .controller('detailsCtrl', function($scope,$rootScope,$stateParams, $firebaseObject, $firebaseArray) {
//
//     // $rootScope.extras=true;
//     $scope.selectedId = $stateParams.category_id;
//     var field_id = $stateParams.category_id;
//       console.log("$scope.selectedId : " + $scope.selectedId );
//
//       var fb = new Firebase("https://shopping-42daf.firebaseio.com/menu/" + field_id);
//       $scope.details = $firebaseObject(fb);
//         console.log("$scope.details : " + angular.toJson($scope.details , ' '));
//
//         $scope.addToCart=function(item){
//           sharedCartService.add(item);
//         };
//
//         $scope.buyNow = function () {
//           $state.go('checkout');
//         };
//
//     var refProduct = new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.selectedId);
//         var userData = $firebaseObject(refProduct);
//         userData.$loaded().then(function(response) {
//           $scope.showproductdetails = response;
//         });
//
//
// 		var userdata = [];
// 		var refProduct = new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.selectedId +"/product_specification");
//         var userData = $firebaseArray(refProduct);
//         userData.$loaded().then(function(response) {
//           $scope.productSpdetails = response;
//           console.log("Response data for fetch data from response........... ",angular.toJson($scope.productSpdetails,' '));
//         });
//
//
// })
//
//
// .controller('settingsCtrl', function($scope,$rootScope,fireBaseData,$firebaseObject,
//                                      $ionicPopup,$state,$window,$firebaseArray,
//                                      sharedUtils) {
//     //Bugs are most prevailing here
//     $rootScope.extras=true;
//
//     //Shows loading bar
//     sharedUtils.showLoading();
//
//     //Check if user already logged in
//     firebase.auth().onAuthStateChanged(function(user) {
//       if (user) {
//
//         //Accessing an array of objects using firebaseObject, does not give you the $id , so use firebase array to get $id
//         $scope.addresses= $firebaseArray(fireBaseData.refUser().child(user.uid).child("address"));
//
//         // firebaseObject is good for accessing single objects for eg:- telephone. Don't use it for array of objects
//         $scope.user_extras= $firebaseObject(fireBaseData.refUser().child(user.uid));
//
//         $scope.user_info=user; //Saves data to user_info
//         //NOTE: $scope.user_info is not writable ie you can't use it inside ng-model of <input>
//
//         //You have to create a local variable for storing emails
//         $scope.data_editable={};
//         $scope.data_editable.email=$scope.user_info.email;  // For editing store it in local variable
//         $scope.data_editable.password="";
//
//         $scope.$apply();
//
//         sharedUtils.hideLoading();
//
//       }
//
//     });
//
//     $scope.addManipulation = function(edit_val) {  // Takes care of address add and edit ie Address Manipulator
//
//
//       if(edit_val!=null) {
//         $scope.data = edit_val; // For editing address
//         var title="Edit Address";
//         var sub_title="Edit your address";
//       }
//       else {
//         $scope.data = {};    // For adding new address
//         var title="Add Address";
//         var sub_title="Add your new address";
//       }
//       // An elaborate, custom popup
//       var addressPopup = $ionicPopup.show({
//         template: '<input type="text"   placeholder="Nick Name"  ng-model="data.nickname"> <br/> ' +
//                   '<input type="text"   placeholder="Address" ng-model="data.address"> <br/> ' +
//                   '<input type="number" placeholder="Pincode" ng-model="data.pin"> <br/> ' +
//                   '<input type="number" placeholder="Phone" ng-model="data.phone">',
//         title: title,
//         subTitle: sub_title,
//         scope: $scope,
//         buttons: [
//           { text: 'Close' },
//           {
//             text: '<b>Save</b>',
//             type: 'button-positive',
//             onTap: function(e) {
//               if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone ) {
//                 e.preventDefault(); //don't allow the user to close unless he enters full details
//               } else {
//                 return $scope.data;
//               }
//             }
//           }
//         ]
//       });
//
//       addressPopup.then(function(res) {
//
//         if(edit_val!=null) {
//           //Update  address
//           if(res!=null){ // res ==null  => close
//             fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({    // set
//               nickname: res.nickname,
//               address: res.address,
//               pin: res.pin,
//               phone: res.phone
//             });
//           }
//         }else{
//           //Add new address
//           fireBaseData.refUser().child($scope.user_info.uid).child("address").push({    // set
//             nickname: res.nickname,
//             address: res.address,
//             pin: res.pin,
//             phone: res.phone
//           });
//         }
//
//       });
//
//     };
//
//     // A confirm dialog for deleting address
//     $scope.deleteAddress = function(del_id) {
//       var confirmPopup = $ionicPopup.confirm({
//         title: 'Delete Address',
//         template: 'Are you sure you want to delete this address',
//         buttons: [
//           { text: 'No' , type: 'button-stable' },
//           { text: 'Yes', type: 'button-assertive' , onTap: function(){return del_id;} }
//         ]
//       });
//
//       confirmPopup.then(function(res) {
//         if(res) {
//           fireBaseData.refUser().child($scope.user_info.uid).child("address").child(res).remove();
//         }
//       });
//     };
//
//     $scope.save= function (extras,editable) {
//       //1. Edit Telephone doesnt show popup 2. Using extras and editable  // Bugs
//       if(extras.telephone!="" && extras.telephone!=null ){
//         //Update  Telephone
//         fireBaseData.refUser().child($scope.user_info.uid).update({    // set
//           telephone: extras.telephone
//         });
//       }
//
//       //Edit Password
//       if(editable.password!="" && editable.password!=null  ){
//         //Update Password in UserAuthentication Table
//         firebase.auth().currentUser.updatePassword(editable.password).then(function(ok) {}, function(error) {});
//         sharedUtils.showAlert("Account","Password Updated");
//       }
//
//       //Edit Email
//       if(editable.email!="" && editable.email!=null  && editable.email!=$scope.user_info.email){
//
//         //Update Email/Username in UserAuthentication Table
//         firebase.auth().currentUser.updateEmail(editable.email).then(function(ok) {
//           $window.location.reload(true);
//           //sharedUtils.showAlert("Account","Email Updated");
//         }, function(error) {
//           sharedUtils.showAlert("ERROR",error);
//         });
//       }
//
//     };
//
//     $scope.cancel=function(){
//       // Simple Reload
//       $window.location.reload(true);
//       console.log("CANCEL");
//     }
//
// })
//
// .controller('supportCtrl', function($scope,$rootScope) {
//
//     $rootScope.extras=true;
//
// })
//
// .controller('forgotPasswordCtrl', function($scope,$rootScope) {
//     $rootScope.extras=false;
//   })
//
// .controller('checkoutCtrl', function($scope,$rootScope,sharedUtils,$state,$firebaseArray,
//                                      $ionicHistory,fireBaseData, $ionicPopup,sharedCartService,SessionService) {
//
//     $rootScope.extras=true;
//     var user = SessionService.getUser();
//     //Check if user already logged in
//     firebase.auth().onAuthStateChanged(function(user) {
//       if (user) {
//         $scope.addresses= $firebaseArray( fireBaseData.refUser().child(user.uid).child("address") );
//         $scope.user_info=user;
//       }else if (!!user.guestID) {
//         $scope.addresses= $firebaseArray( fireBaseData.refUser().child(guestUser.guestID).child("address") );
//         $scope.user_info=user;
//       }
//     });
//
//     $scope.payments = [
//       {id: 'CREDIT', name: 'Credit Card'},
//       {id: 'NETBANK', name: 'Net Banking'},
//       {id: 'COD', name: 'COD'}
//     ];
//
//     $scope.pay=function(address,payment){
//
//       if(address==null || payment==null){
//         //Check if the checkboxes are selected ?
//         sharedUtils.showAlert("Error","Please choose from the Address and Payment Modes.")
//       }
//       else {
//         // Loop throw all the cart item
//         for (var i = 0; i < sharedCartService.cart_items.length; i++) {
//           //Add cart item to order table
//           fireBaseData.refOrder().push({
//
//             //Product data is hardcoded for simplicity
//             product_name: sharedCartService.cart_items[i].item_name,
//             product_price: sharedCartService.cart_items[i].item_price,
//             product_image: sharedCartService.cart_items[i].item_image,
//             product_id: sharedCartService.cart_items[i].$id,
//
//             //item data
//             item_qty: sharedCartService.cart_items[i].item_qty,
//
//             //Order data
//             user_id: $scope.user_info.uid,
//             user_name:$scope.user_info.displayName,
//             address_id: address,
//             payment_id: payment,
//             status: "Queued"
//           });
//
//         }
//
//         //Remove users cart
//         fireBaseData.refCart().child($scope.user_info.uid).remove();
//
//         sharedUtils.showAlert("Info", "Order Successfull");
//
//         // Go to past order page
//         $ionicHistory.nextViewOptions({
//           historyRoot: true
//         });
//         $state.go('lastOrders', {}, {location: "replace", reload: true});
//       }
//     }
//
//
//
//     $scope.addManipulation = function(edit_val) {  // Takes care of address add and edit ie Address Manipulator
//
//
//       if(edit_val!=null) {
//         $scope.data = edit_val; // For editing address
//         var title="Edit Address";
//         var sub_title="Edit your address";
//       }
//       else {
//         $scope.data = {};    // For adding new address
//         var title="Add Address";
//         var sub_title="Add your new address";
//       }
//       // An elaborate, custom popup
//       var addressPopup = $ionicPopup.show({
//         template: '<input type="text"   placeholder="Nick Name"  ng-model="data.nickname"> <br/> ' +
//         '<input type="text"   placeholder="Address" ng-model="data.address"> <br/> ' +
//         '<input type="number" placeholder="Pincode" ng-model="data.pin"> <br/> ' +
//         '<input type="number" placeholder="Phone" ng-model="data.phone">',
//         title: title,
//         subTitle: sub_title,
//         scope: $scope,
//         buttons: [
//           { text: 'Close' },
//           {
//             text: '<b>Save</b>',
//             type: 'button-positive',
//             onTap: function(e) {
//               if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone ) {
//                 e.preventDefault(); //don't allow the user to close unless he enters full details
//               } else {
//                 return $scope.data;
//               }
//             }
//           }
//         ]
//       });
//
//       addressPopup.then(function(res) {
//
//         if(edit_val!=null) {
//           //Update  address
//           fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({    // set
//             nickname: res.nickname,
//             address: res.address,
//             pin: res.pin,
//             phone: res.phone
//           });
//         }else if (!!user.guestID) {
//           fireBaseData.refUser().child(user.guestID).child("address").push({    // set
//             nickname: res.nickname,
//             address: res.address,
//             pin: res.pin,
//             phone: res.phone
//           });
//         }else{
//           //Add new address
//           fireBaseData.refUser().child($scope.user_info.uid).child("address").push({    // set
//             nickname: res.nickname,
//             address: res.address,
//             pin: res.pin,
//             phone: res.phone
//           });
//         }
//
//       });
//
//     };
//
//
//   })
