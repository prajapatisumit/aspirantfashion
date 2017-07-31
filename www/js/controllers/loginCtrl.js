angular.module('app')
    .controller('loginCtrl', function($scope, $rootScope, $ionicHistory, sharedUtils, $state, $ionicSideMenuDelegate, SessionService, $firebaseObject, $firebaseArray, $window, $cordovaDevice, IonicPopupService, $cordovaOauth, $location) {
        $rootScope.extras = false; // For hiding the side bar and nav icon

        ////for get device tocken :
        var init = function() {
            console.log("initializing device");
            try {
                $scope.deviceId = $cordovaDevice.getUUID();
            } catch (err) {
                console.log("Error " + err);
            }
        };

        ionic.Platform.ready(function() {
            init();
        });

        $scope.goAdminPage = function(id){
          $state.go('admin' , {'product_id' : id});
        };

        // console.log("result of login : " + result);
        firebase.auth().onAuthStateChanged(function(authData) {
          // debugger
            // console.log("user check login or not : " + angular.toJson(user , ' '));
            if (authData) {
              // debugger
              var userData = $firebaseObject(firebase.database().ref('users/' + authData.uid));
              userData.$loaded().then(function(response) {
                var user = response;
                var userObj = {
                    displayName: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                    providerData: user.providerData,
                    isAdmin: user.isAdmin
                };
                SessionService.setUser(userObj);
                $scope.sessionUser = SessionService.getUser();
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = true;
                sharedUtils.hideLoading();
                $state.go('home', {}, {
                    location: "replace"
                });
              });
            }
        });

        $scope.gotomenupage = function() {
            $state.go('home');
        };
        ////for login with email :
        $scope.loginEmail = function(formName, cred) {
            if (formName.$valid) { // Check if the form data is valid or not
                sharedUtils.showLoading();
                firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(function(result) {
                  console.log('login successfully..');
                  // debugger
                        // console.log("result : " + angular.toJson(result , ' '));
                        // var usersRef = firebase.database().ref('users/' + result.uid);
                        // var userData = $firebaseObject(usersRef);

                        // userData.$loaded().then(function(response) {
                        //   debugger
                        //         // $scope.data = response;
                        //         // console.log("$scope.data : " + angular.toJson($scope.data, ' '));
                        //                 $scope.userObj = response;
                        //                 var obj = {
                        //                     uid: $scope.userObj.uid,
                        //                     displayName: $scope.userObj.displayName,
                        //                     email: $scope.userObj.email,
                        //                     photoURL: $scope.userObj.photoURL,
                        //                     isAdmin: $scope.userObj.isAdmin
                        //                 }
                        //                 $rootScope.userLog = obj;
                        //                 // console.log("$rootScope.user when user alredy signin with email..: " + angular.toJson($rootScope.userLog , ' '));
                        //                 SessionService.setUser(obj);
                        //                 $scope.sessionUser = SessionService.getUser();
                        //                 // console.log("$scope.sessionUser when already user signup : " + angular.toJson($scope.sessionUser , ' '));
                        //                 //console.log("user is alreay signp with email");
                        //
                        //             sharedUtils.hideLoading();
                        //             debugger
                        //             $state.go('home', {}, {
                        //                 location: "replace"
                        //             });
                        //
                        //         // else {
                        //         //     var userObj = {
                        //         //         uid: user.uid,
                        //         //         displayName: user.displayName,
                        //         //         email: user.email,
                        //         //         photoURL: user.photoURL,
                        //         //         isAdmin: false
                        //         //
                        //         //     }
                        //         //     $rootScope.userLog = userObj;
                        //         //     // console.log("$rootScope.userLog when new facebook user login : " + angular.toJson($rootScope.userLog , ' ') );
                        //         //     var ref = firebase.database().ref('users/' + user.uid);
                        //         //     ref.set(userObj).then(function(snapshot) {
                        //         //         console.log('user set successfully...');
                        //         //     });
                        //         //     SessionService.setUser(userObj);
                        //         //     $scope.sessionUser = SessionService.getUser();
                        //         //     $state.go('home', {}, {
                        //         //         location: "replace"
                        //         //     });
                        //         //     sharedUtils.hideLoading();
                        //         // }
                        //
                        //     })
                        //     .catch(function(error) {
                        //       debugger
                        //         sharedUtils.hideLoading();
                        //         console.log("Error at facebook login :", error);
                        //     });

                    },
                    function(error) {
                      // debugger
                        sharedUtils.hideLoading();
                        sharedUtils.showAlert("Please note", "Authentication Error");
                    });

            } else {
              // debugger
                sharedUtils.hideLoading();
                sharedUtils.showAlert("Please note", "Entered data is not valid");

            }
        };


        ////for facebook login:
        var facebookProvider = new firebase.auth.FacebookAuthProvider();
        $scope.loginWithFacebook = function() {
            // $scope.userData = [];
            // sharedUtils.showLoading();
            firebase.auth().signInWithPopup(facebookProvider).then(function(result) {
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                console.log("user.uid " + user.uid);
                var usersRef = firebase.database().ref('users/' + user.uid);
                // console.log("usersRef: " + usersRef);
                var userData = $firebaseArray(usersRef);
                userData.$loaded().then(function(response) {
                        $scope.data = response;
                        // console.log("$scope.data : " + angular.toJson($scope.data , ' '));
                        if ($scope.data.length > 0) {
                            var userDataById = $firebaseObject(usersRef);
                            userDataById.$loaded().then(function(resp) {
                                $scope.userObj = resp;
                                var obj = {
                                    uid: $scope.userObj.uid,
                                    displayName: $scope.userObj.displayName,
                                    email: $scope.userObj.email,
                                    photoURL: $scope.userObj.photoURL,
                                    isAdmin: $scope.userObj.isAdmin

                                }
                                $rootScope.userLog = obj;
                                console.log("$rootScope.user when user alredy signin with facebook..: " + angular.toJson($rootScope.userLog, ' '));
                                // console.log("$scope.userObj: " + angular.toJson($scope.userObj, ' '));
                                SessionService.setUser(obj);
                                $scope.sessionUser = SessionService.getUser();
                                console.log("$scope.sessionUser when already user signup : " + angular.toJson($scope.sessionUser, ' '));

                            });
                            // sharedUtils.hideLoading();
                            $state.go('home', {}, {
                                location: "replace"
                            });
                            console.log("user already saved..");
                        } else {
                            var userObj = {
                                uid: user.uid,
                                displayName: user.displayName,
                                email: user.email,
                                photoURL: user.photoURL,
                                isAdmin: false

                            }
                            $rootScope.userLog = userObj;
                            console.log("$rootScope.userLog when new facebook user login : " + angular.toJson($rootScope.userLog, ' '));
                            var ref = firebase.database().ref('users/' + user.uid);
                            ref.set(userObj).then(function(snapshot) {
                                console.log('user set successfully...');
                            });
                            SessionService.setUser(userObj);
                            $scope.sessionUser = SessionService.getUser();
                            $state.go('home', {}, {
                                location: "replace"
                            });

                        }

                    })
                    .catch(function(error) {
                        sharedUtils.hideLoading();
                        console.log("Error at facebook login :", error);
                    });


                // ...
            }).catch(function(error) {
                // Handle Errors here.

                sharedUtils.hideLoading();
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                IonicPopupService.alert("oops..", errorMessage)
                // ...
            });

        };
        $scope.logout = function() {

            sharedUtils.showLoading();

            // Main Firebase logout
            firebase.auth().signOut().then(function() {


                $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                $ionicSideMenuDelegate.canDragContent(false); // To remove the sidemenu white space
                SessionService.setUser(null);
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });


                $rootScope.extras = false;
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {}, {
                    location: "replace"
                });

            }, function(error) {
                sharedUtils.showAlert("Error", "Logout Failed")
            });

        };

        $scope.showProductInfo = function(id) {
            $state.go('details', {
                'category_id': id
            });
        };

        ///for custom user :
        $scope.guestUser = function() {
            ///for check condition :
            // debugger
            $scope.deviceId = '5afaa714fd8d2997';
            sharedUtils.showLoading();
            var ref = firebase.database().ref('users/' + $scope.deviceId);
            // var ref = firebase.database().ref('users/5afaa714fd8d2997');
            console.log("ref : " + ref);
            var userData = $firebaseArray(ref);
            userData.$loaded().then(function(resp) {
                $scope.data = resp;
                // console.log("  $scope.data : " + angular.toJson(  $scope.data , ' '));
                if ($scope.data.length > 0) {
                    var saveUserData = $firebaseObject(ref);
                    saveUserData.$loaded().then(function(response) {
                        $scope.saveUserData = response;
                        var saveGuestObj = {
                            isAdmin: $scope.saveUserData.isAdmin,
                            isGuest: $scope.saveUserData.isGuest,
                            uid: $scope.saveUserData.uid
                        }
                        $rootScope.userLog = saveGuestObj;
                        SessionService.setUser(saveGuestObj);
                        console.log("$rootScope.userLog when guest alresdy added... : " + angular.toJson($rootScope.userLog, ' '));
                    });
                    console.log("user saved already...");
                    sharedUtils.hideLoading();
                    IonicPopupService.alert("guest user signup successfully")
                    $state.go('home', {}, {
                        location: "replace"
                    });
                } else {
                    var guestObj = {
                        isAdmin: false,
                        isGuest: true,
                        uid: $scope.deviceId
                    }
                    console.log("ref : " + ref);
                    $rootScope.userLog = guestObj;
                    console.log("$rootScope.userLog at new guest added : " + angular.toJson($rootScope.userLog, ' '));
                    ref.set(guestObj).then(function(response) {
                        // console.log('guest user set successfully...' + angular.toJson(response , ' '));
                    });
                    SessionService.setUser(guestObj);
                    $scope.sessionUser = SessionService.getUser();
                    // console.log("$scope.sessionUser for guest user"  + angular.toJson($scope.sessionUser , ' '));
                    sharedUtils.hideLoading();
                    IonicPopupService.alert("new guest user signup successfully")
                    $state.go('home', {}, {
                        location: "replace"
                    });
                }
            }).catch(function(error) {
                // Handle Errors here.
                IonicPopupService.alert("oops error at guest user login")
                sharedUtils.hideLoading();
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        };


    });
