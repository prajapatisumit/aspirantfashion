angular.module('app')
    .controller('adminCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                         $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService ) {
                                           $scope.$on('$ionicView.enter', function(ev) {
                                             if(ev.targetScope !== $scope){
                                               $ionicHistory.clearHistory();
                                               $ionicHistory.clearCache();
                                             }

                                           });

                $ionicModal.fromTemplateUrl('templates/admin.html', {
                    scope: $scope
                    }).then(function(modal) {
                          $scope.modal = modal;
                      });

					  $ionicModal.fromTemplateUrl('templates/admin.html', {
                    scope: $scope
                    }).then(function(updateModal) {
                          $scope.updateModal = updateModal;
                      });

                                    $ionicModal.fromTemplateUrl('templates/addproduct.html', {
                                            scope: $scope
                                      }).then(function(sizemodal) {
                                           $scope.sizemodal = sizemodal;
                                    });
                                    $ionicModal.fromTemplateUrl('templates/admin3.html', {
                              id: '1', // We need to use and ID to identify the modal that is firing the event!
                              scope: $scope,
                              backdropClickToClose: false,
                              animation: 'slide-in-up'
                            }).then(function(sizemodal) {
                              $scope.oModal1 = sizemodal;
                            });


					$ionicModal.fromTemplateUrl('templates/admin2.html', {
					scope: $scope,
					animation: 'slide-in-up'
				  }).then(function(modal) {
					console.log('before assign');
					$scope.modal1 = modal;
				  });

				  $scope.openModal1 = function() {
					$scope.modal1.show();
				  };

				  $scope.closeModal1 = function() {
					$scope.modal1.hide();
				  };
          $scope.openModal = function(index) {
            $scope.loadSize();
            if (index == 1) $scope.oModal1.show();
            else $scope.oModal2.show();
          };

          $scope.closeModal = function(index) {
            if (index == 1) $scope.oModal1.hide();
            else $scope.oModal2.hide();
          };
				  // Cleanup the modal when we're done with it!
				  $scope.$on('$destroy', function() {
					$scope.modal1.remove();
          $scope.oModal1.remove();
				  });

      ///for show and hide div :
        $scope.showsCategory = false;
        $scope.showSubCategory = false;
        $scope.showBrand = false;
        $scope.showMenu = true;
        $scope.showProductDescription = false;

      $scope.showCategoryDiv = function() {
          $scope.showsCategory = true;
          $scope.showSubCategory = false;
          $scope.showBrand = false;
          $scope.showMenu = false;
          $scope.showProductDescription = false;
      };
      $scope.showMenuDiv = function() {
          $scope.showMenu = true;
          $scope.showsCategory = false;
          $scope.showSubCategory = false;
          $scope.showBrand = false;
          $scope.showProductDescription = false;
      };
      $scope.showSubCategoryDiv = function () {
        $scope.showMenu = false;
        $scope.showsCategory = false;
        $scope.showSubCategory = true;
        $scope.showBrand = false;
        $scope.showProductDescription = false;
      };
      $scope.showBrandDiv = function () {
        $scope.showMenu = false;
        $scope.showsCategory = false;
        $scope.showSubCategory = false;
        $scope.showBrand = true;
        $scope.showProductDescription = false;
      };
      ///for category show:
      $scope.loadCategory = function() {
        $scope.category = $firebaseArray(fireBaseData.refCategory());
        console.log("$scope.category : " + angular.toJson($scope.category , ' '));
      };

      $scope.loadBrand = function() {
        $scope.brand = $firebaseArray(fireBaseData.refBrand());
        console.log("$scope.brand : " + angular.toJson($scope.brand , ' '));
      };

      $scope.loadSize = function() {
        $scope.size = $firebaseArray(fireBaseData.refSize());
        console.log("$scope.size : " + angular.toJson($scope.size , ' '));
      };

        $scope.userData = SessionService.getUser();
        // console.log("$scope.userData at admin page  : " + angular.toJson($scope.userData , ' '));

$scope.validate = function(item,downloadURL) {
        console.log("item : " + angular.toJson(item , ' '));
      if (CommonService.validateEmpty(item, 'Oops!', 'Please enter value') === false) {
        return false;
      }else if (CommonService.validateEmpty($scope.downloadURL, 'Oops!', 'Please Upload product Image') === false) {
        return false;
      }else if (CommonService.validateEmpty(item.name, 'Oops!', 'Please enter product name') === false) {
        return false;
      } else if (CommonService.validateEmpty(item.categoryId, 'Oops!', 'Please enter product category') === false) {
        return false;
      }else if (CommonService.validateEmpty(item.subCatID, 'Oops!', 'Please enter product subcategory') === false) {
        return false;
      } else if (CommonService.validateEmpty(item.available, 'Oops!', 'Please describe your product is available?(yes or no)') === false) {
        return false;
      } else if (CommonService.validateEmpty(item.description, 'Oops!', 'Please enter product description') === false) {
        return false;
      } else if (CommonService.validateEmpty(item.price, 'Oops!', 'Please enter product price') === false) {
        return false;
      } else if (CommonService.validateEmpty(item.stock, 'Oops!', 'Please enter product stocks') === false) {
        return false;
      }
    };

    $scope.productId = $stateParams.product_id;
    console.log("$scope.productId for admin  : " + $scope.productId );

    // /$scope.updateproductdetails.image = $scope.downloadURL;

    $scope.progressval = 0;
    $scope.stopinterval = null;

    $scope.startprogress = function() {
      $scope.progress = 0;
      if ($scope.stopinterval) {
        $interval.cancel($scope.stopinterval);
      }
      $scope.stopinterval = $interval(function() {
        $scope.progress = $scope.progress + 1;
        if ($scope.progress >= 100) {
          $interval.cancel($scope.stopinterval);
          // $state.go('second');
          return;
        }
      }, 100);
    };

        //add html dynamically to add more button clicks
        $scope.inputs = [];
        $scope.inputs.push({'attribute': '', 'value' : ''});
        $scope.addfield = function(){
          $scope.inputs.push({})
        };
		$scope.updatefield = function(){
          $scope.inputs.push({})
        };
        $scope.deleteImage = function(id) {
            console.log("id : " + id);
          // $scope.imgset.remove(downloadURL);
           $scope.imgset = firebase.database().ref().child('product/' + $scope.globalproductID + '/images'  ).remove(id);
           console.log("yes delete image.");
        };

        $scope.addspcification = function(){
  			console.log("$stateParams.product_id ----" + $stateParams.product_id);
  			console.log(" $scope.globalproductID   ----" +  $scope.globalproductID );
          $scope.data = [];
          for (var i = 0; i < $scope.inputs.length; i++) {
              $scope.name = $scope.inputs[i].attribute;
              $scope.atribute = $scope.inputs[i].value;
              var obj = {
                name : $scope.name,
                value: $scope.atribute
              };
          console.log(" $obj.obj "+ angular.toJson(obj,' '));

		  if(!!$stateParams.product_id){
			var refProduct = firebase.database().ref().child('product/' + $stateParams.product_id + '/product_specification' ).push(obj).key;
		  }

		  if(!!$scope.globalproductID){
            var refProduct = firebase.database().ref().child('product/' + $scope.globalproductID + '/product_specification' ).push(obj).key;
		  }

            console.log("refProduct : " + refProduct);
                // var refProduct = firebase.database().ref().push(obj).key;
            //$scope.datas = $scope.inputs[i];
            // var Obj = $scope.data.push($scope.inputs[i])
          }
          console.log(" $scope.datas "+ angular.toJson($scope.data,' '));
          //console.log(" $scope.datas "+ angular.toJson($scope.lol,' '));
          // var refProduct = firebase.database().ref().child('product/ID/Product Specification').push(Obj).key;
        };

        // Fetch Product from Firebase
        console.log("userid for database  : " + $scope.productId );
        $scope.updateproductdetails = '' ;

        var refProduct = firebase.database().ref('product/' +  $scope.productId);
        // new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.productId);
        var userData = $firebaseObject(refProduct);
        userData.$loaded().then(function(response) {
          $scope.updateproductdetails = response;
          console.log("Response data for fetch data from response item ",angular.toJson($scope.updateproductdetails,' '));
        });


		$scope.updateItem = function(updateproductdetails){
			$scope.data = updateproductdetails;
			console.log("menuObj test: first " + angular.toJson(updateproductdetails.image, ' '));
		/*	if(updateproductdetails.image === null){
				console.log("menuObj test: 11 " + angular.toJson(updateproductdetails.image, ' '));
				updateproductdetails.image = updateproductdetails.image;
			}
			else
			{
				updateproductdetails.image = $scope.downloadURL;
				console.log("menuObj test:  22" + angular.toJson(updateproductdetails.image, ' '));
			}
			*/
			console.log("menuObj test breofre : " + angular.toJson(updateproductdetails.image , ' '));
      console.log("menuObj test breofre : " + angular.toJson(updateproductdetails.finalSize , ' '));
            var menuObj = {
                name : updateproductdetails.name,
                brand : updateproductdetails.brand,
                available : updateproductdetails.available,
                category : updateproductdetails.category,
                subcategory : updateproductdetails.subcategory,
                size  : updateproductdetails.finalSize,
                weight : updateproductdetails.weight,
                barcode:updateproductdetails.barcode,
                manufacturer:updateproductdetails.manufacturer,
                actualprice:updateproductdetails.actualprice,
                description : updateproductdetails.description,
                image : updateproductdetails.image,
                price : updateproductdetails.price,
				        stock : updateproductdetails.stock
            }
          //console.log("menuObj test: " + angular.toJson(menuObj , ' '));
          //console.log("product ID " + angular.toJson($scope.productId , ' '));

          var menuRef = firebase.database().ref().child('product/'+$scope.productId).update(menuObj);

			console.log("response test: " + angular.toJson(menuRef , ' '));

		}
    // $scope.deleteupdateImage = function(id) {
    //     console.log("id : " + id);
    //   // $scope.imgset.remove(downloadURL);
    //    $scope.imgset = firebase.database().ref().child('product/' + $scope.globalproductID + '/images'  ).remove(id);
    //    console.log("yes delete image.");
    // };

		// Update Product Specification on model

		var userdata = [];
		var refProduct = firebase.database().ref('product/' + $scope.productId +'/product_specification');
        //  new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.productId +"/product_specification");
        var userData = $firebaseArray(refProduct);
        userData.$loaded().then(function(response) {
          $scope.productSpdetails = response;
          console.log("admin pro se d ",angular.toJson($scope.productSpdetails,' '));
        });

		$scope.updatespcification = function(productSpdetails){
			console.log("update fun ",angular.toJson($scope.productSpdetails,' '));


     $scope.data = [];
          for (var i = 0; i < $scope.productSpdetails.length; i++) {
              $scope.name = $scope.productSpdetails[i].name;
              $scope.atribute = $scope.productSpdetails[i].value;
			  $scope.id = $scope.productSpdetails[i].$id;
              var obj = {
                name : $scope.name,
                value: $scope.atribute,
				id: $scope.id
              };
			  var refProduct = firebase.database().ref().child('product/' + $stateParams.product_id + '/product_specification/' + $scope.id ).update(obj);
			  };
          console.log("update Angular "+ angular.toJson(obj,' '));

		 //var refProduct = firebase.database().ref().child('product/' + $scope.globalproductID + '/product_specification/' + $scope.id ).update(obj);

   };

        })
  //////complete admin controller
