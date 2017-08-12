angular.module('app')
.controller('detailsCtrl', function($scope,$state,$rootScope,$stateParams, $firebaseObject, $firebaseArray,SessionService,sharedCartService,$ionicModal,$http,IonicPopupService) {

    // $rootScope.extras=true;
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }
    });
      $scope.user = SessionService.getUser();
      $scope.selectedId = $stateParams.category_id;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          $scope.user=user; //Saves data to user_info
          $scope.loadFavourite();
      }
      });
      $scope.loadFavourite = function () {
        var refFavoriteData = firebase.database().ref('favourits/' + $scope.user.uid + '/' +  $scope.selectedId);
            var favouriteData = $firebaseObject(refFavoriteData);
            favouriteData.$loaded().then(function(resp) {
              $scope.favouritProduct = resp;
              // console.log("$scope.favouritProduct : " + angular.toJson($scope.favouritProduct , ''));
              if (!!$scope.favouritProduct.productId) {
                  $scope.isFavourite = true;
                  // console.log("$scope.isFavourite true callinf.. : " + $scope.isFavourite);
              } else {
                  $scope.isFavourite = false;
                  // console.log("$scope.isFavourite false calling ... : " + $scope.isFavourite);
              }

            });
      };

      ////for remove favourite :
          $scope.deletefevorite = function(productId) {
              var deleteFevoriteRef = firebase.database().ref('favourits/' + $scope.user.uid + '/' + $scope.selectedId);
              var deleteFevoriteProductRef = firebase.database().ref('product/' + $scope.selectedId + '/favouriteBy/' + $scope.user.uid);
              deleteFevoriteRef.remove().then(function (response) {
                deleteFevoriteProductRef.remove().then(function (response) {
                  $scope.loadFavourite();
                });
              });
        };
      ////////
        // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/addAddress.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeAddressModal = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.openAddressModal = function() {
        $scope.modal.show();
      };


        if (!!$scope.selectedId) {
            var refProduct = firebase.database().ref('product/' + $scope.selectedId);
                var userData = $firebaseObject(refProduct);
                userData.$loaded().then(function(response) {
                  $scope.showproductdetails = response;
                  // console.log("$scope.showproductdetails : " + angular.toJson($scope.showproductdetails , ' '));
                  if (!!response.product_specification) {
                      $scope.productSpdetails = response.product_specification;
                      // console.log("$scope.productSpdetails : " + angular.toJson($scope.productSpdetails , ' '));
                  }
                  if (!!response.images) {
                  var refProductImage = firebase.database().ref('product/' + $scope.selectedId +'/images');
                      var imageData = $firebaseArray(refProductImage);
                      imageData.$loaded().then(function(resp) {
                        $scope.productimages = resp;
                        // console.log("$scope.productimages : " + angular.toJson($scope.productimages , ' '));
                      });
                  }
                });
        }
          $scope.setFavourite = function (productDetail) {
              $scope.productDetail = productDetail;
                // console.log("productDetail : " + angular.toJson(productDetail , ' '));
                var productObj = {
                  productName: $scope.productDetail.name,
                  productId: $scope.productDetail.$id,
                  image : $scope.productDetail.image,
                  categoryId: $scope.productDetail.category,
                  subcategoryId : $scope.productDetail.subcategory,
                  brand: $scope.productDetail.brand,
                  price : $scope.productDetail.price,
                  userId : $scope.user.uid
                };
                var userObj = {
                  name: $scope.user.displayName,
                  email: $scope.user.email,
                  userId : $scope.user.uid,
                  image: $scope.user.photoURL
                };

              firebase.database().ref().child('product/' + $scope.productDetail.$id + '/favouriteBy/' + $scope.user.uid).set(productObj).then(function (response) {
                    //  console.log("favourite added successfully at product...");
                     firebase.database().ref().child('favourits/' + $scope.user.uid + '/' + $scope.productDetail.$id).set(productObj).then(function (response) {
                      console.log("favourite added successfully at favourites...");
                      $scope.loadFavourite();
                     }).catch(function (error) {
                       console.log('Error at set favourite : ' + error);
                     });
              }).catch(function (error) {
                console.log('Error at set favourite : ' + error);
              });

          };

          $scope.addToCart=function(item){
            IonicPopupService.alert("Item added to cart");
              // console.log("item : " + angular.toJson(item , ' '));
            sharedCartService.add(item);
          };
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              $scope.user_info=user; //Saves data to user_info
              // console.log("scope.user_info at home controller : " + angular.toJson($scope.user_info , ' '));
              $scope.get_total= function() {
                var total_qty=0;
                for (var i = 0; i < sharedCartService.cart_items.length; i++) {
                  total_qty += sharedCartService.cart_items[i].item_qty;
                }
                return total_qty;
              };
            }else if ($scope.user.isGuest === 'true') {
              $scope.user_info = $scope.user;
              $scope.get_total= function() {
                var total_qty=0;
                for (var i = 0; i < sharedCartService.cart_items.length; i++) {
                  total_qty += sharedCartService.cart_items[i].item_qty;
                }
                return total_qty;
              };
              // console.log("$scope.user_info for guest : " + angular.toJson($scope.user_info , ' '));
            }else if (!!$rootScope.userLog) {
              $scope.user = $rootScope.userLog;
              $scope.get_total= function() {
                var total_qty=0;
                for (var i = 0; i < sharedCartService.cart_items.length; i++) {
                  total_qty += sharedCartService.cart_items[i].item_qty;
                }
                return total_qty;
              };

            }else {

              // $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
              // $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
              //
              // $ionicHistory.nextViewOptions({
              //   historyRoot: true
              // });
              //
              // $rootScope.extras = false;
              // sharedUtils.hideLoading();
              // $state.go('tabsController.login', {}, {location: "replace"});

            }
          });

        $scope.buyNow = function () {
          $state.go('checkout');
        };
        ////for show and hide div :
        $scope.isEnterPin = false;
        $scope.isSelectLocation = false;
        $scope.addressByPin = function () {
            $scope.isSelectLocation = false;
            $scope.isEnterPin = true;

        };
      var geocoder;
      var geocoder = new google.maps.Geocoder();
      $scope.userCity = '';
      $scope.uaerPostalCode = '';
      $scope.uaerCountry = '';
      $scope.userPostalCode = '';
      // $scope.userAddressByZip={};
      $scope.addPinCode = function (pincode) {
            $scope.userAddress = ''
            $scope.pincode = pincode;
            var zipCode = pincode;
            var country = 'India';
            geocoder.geocode({ 'address': pincode + ',' + country }, function (results, status) {
              $scope.address = results[0].formatted_address;
              // console.log("$scope.address : " + $scope.address);
              // console.log("result : " + angular.toJson(results[0].formatted_address , ' '));
              // console.log("result : " + angular.toJson(results , ' '));
              if (!!results[0]) {

               //find country name
                   for (var i=0; i<results[0].address_components.length; i++) {
                  for (var b=0;b<results[0].address_components[i].types.length;b++) {

                  //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate

                        if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
                            //this is the object you are looking for
                            $scope.city= results[0].address_components[i];
                            break;
                        }
                      if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                          //this is the object you are looking for
                          $scope.state= results[0].address_components[i];
                          break;
                      }
                      if (results[0].address_components[i].types[b] == "country") {
                          //this is the object you are looking for
                          $scope.county= results[0].address_components[i];
                          break;
                      }
                      if (results[0].address_components[i].types[b] == "postal_code") {
                          //this is the object you are looking for
                          $scope.postalCode= results[0].address_components[i];
                          break;
                      }
                  }
              }
              //full address data

                $scope.userCity = $scope.city.long_name;
                $scope.uaerState = $scope.state.long_name;
                $scope.uaerCountry = $scope.county.long_name;
                $scope.userPostalCode = $scope.postalCode.long_name;
                $scope.userAddressByZip = {
                          city : $scope.city.long_name,
                          state: $scope.state.long_name,
                          country : $scope.county.long_name,
                          postalCode : $scope.postalCode.long_name
                  }
                  SessionService.setUserLocation($scope.userAddressByZip);
                  $scope.getuserLocation = SessionService.getUserLocation();
                  console.log('$scope.getuserLocation' + angular.toJson($scope.getuserLocation, ' '));
                  $scope.modal.hide();

                // console.log("userAddressByZip : " + angular.toJson($scope.userAddressByZip , ' '));
                // console.log("user current addres  : " + $scope.city.long_name + " " + $scope.state.long_name + " " + $scope.county.long_name + " " + $scope.postalCode.long_name);


              } else {

                console.log("no result found");
              }

          });
      };
    // $scope.userAddress = {};
    $scope.userAddressArray=[];
    $scope.addressByLocation = function () {
            $scope.userAddressByZip = '';
            $scope.isEnterPin = false;
            $scope.isSelectLocation = true;
        var geocoder;
        var geocoder = new google.maps.Geocoder();
        // console.log("this is calling...");
    //      if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function (position) {
    //           console.log("position : " + angular.toJson(position , ' '));
    //             mysrclat = position.coords.latitude;
    //             mysrclong = position.coords.longitude;
    //         console.log("mysrclat : " + mysrclat);
    //         console.log("mysrclong : " + mysrclong);
    //     });
    //
    // }

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
        }
          //Get the latitude and the longitude;
          function successFunction(position) {
              console.log("position data at success : " + angular.toJson(position , ' '));
              var lat = position.coords.latitude;
              var lng = position.coords.longitude;
              codeLatLng(lat, lng)
          }

          function errorFunction(status){

              console.log("error at geocoder ");
          }

                  function codeLatLng(lat, lng) {
                  // console.log("yes comes here at last fun....");
                  var latlng = new google.maps.LatLng(lat, lng);
                  geocoder.geocode({'latLng': latlng}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                    // console.log("results[0].formatted_address : " + angular.toJson(results[0].formatted_address , ' '));
                    // console.log("result of geocode : " + angular.toJson(results , ' '))
                      if (results[1]) {
                       //formatted address
                      // console.log("results[0].formatted_address : " + angular.toJson(results[0].formatted_address , ' '));
                      //find country name
                           for (var i=0; i<results[0].address_components.length; i++) {
                          for (var b=0;b<results[0].address_components[i].types.length;b++) {

                          //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate

                                if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
                                    //this is the object you are looking for
                                    $scope.city= results[0].address_components[i];
                                    break;
                                }
                              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                                  //this is the object you are looking for
                                  $scope.state= results[0].address_components[i];
                                  break;
                              }
                              if (results[0].address_components[i].types[b] == "country") {
                                  //this is the object you are looking for
                                  $scope.county= results[0].address_components[i];
                                  break;
                              }
                              if (results[0].address_components[i].types[b] == "postal_code") {
                                  //this is the object you are looking for
                                  $scope.postalCode= results[0].address_components[i];
                                  break;
                              }
                          }
                      }
                      //full address data

                        $scope.userAddress = {
                                  city : $scope.city.long_name,
                                  state: $scope.state.long_name,
                                  country : $scope.county.long_name,
                                  postalCode : $scope.postalCode.long_name
                          }
                            SessionService.setUserLocation($scope.userAddress);
                            $scope.getuserLocation = SessionService.getUserLocation();
                            console.log('$scope.getuserLocation' + angular.toJson($scope.getuserLocation, ' '));
                        // $scope.userAddressArray.push($scope.userAddress);
                        $scope.modal.hide();
                        // console.log("$scope.userAddressArray : " +angular.toJson( $scope.userAddressArray , ' '));
                        // console.log("userAddress : " + angular.toJson($scope.userAddress , ' '));
                        // console.log("user current addres  : " + $scope.city.long_name + " " + $scope.state.long_name + " " + $scope.county.long_name + " " + $scope.postalCode.long_name);

                      } else {
                        console.log("no result found");
                      }
                    } else {
                      console.log("Geocoder failed due to: : " + angular.toJson(status , ' '));
                    }
                  });
                }
        };
        $scope.addressByLocation();
  		// var userdata = [];
  		// var refProduct = firebase.database().ref('product/' + $scope.selectedId +'/product_specification');
      //   console.log("$scope.selectedId: " + $scope.selectedId);
      //     // new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.selectedId +"/product_specification");
      //     var userData = $firebaseArray(refProduct);
      //     userData.$loaded().then(function(response) {
      //       $scope.productSpdetails = response;
      //       console.log("Response data for fetch data from response........... ",angular.toJson($scope.productSpdetails,' '));
      //     });






})
