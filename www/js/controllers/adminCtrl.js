angular.module('app')
    .controller('adminCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,
                                         $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService ) {

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
				  // Cleanup the modal when we're done with it!
				  $scope.$on('$destroy', function() {
					$scope.modal1.remove();
				  });

      ///for show and hide div :
        $scope.showsCategory = false;
        $scope.showMenu = true;
        $scope.showProductDescription = false;

      $scope.showCategoryDiv = function() {
          $scope.showsCategory = true;
          $scope.showMenu = false;
          $scope.showProductDescription = false;
      };
      $scope.showMenuDiv = function() {
          $scope.showMenu = true;
          $scope.showsCategory = false;
          $scope.showProductDescription = false;
      };
      ///for category show:
      $scope.loadCategory = function() {

        $scope.category = $firebaseArray(fireBaseData.refCategory());
        console.log("$scope.category : " + angular.toJson($scope.category , ' '));
      };
      // $scope.showProdDescDiv = function() {
      //     $scope.showMenu = false;
      //     $scope.showsCategory = false;
      //       $scope.showProductDescription = true;
      // };


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
      } else if (CommonService.validateEmpty(item.category, 'Oops!', 'Please enter product category') === false) {
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

      //this is for add category :
        $scope.addCategory = function (categoryName) {
            var catObj = {
                name : categoryName
            }
          var categoryRef = firebase.database().ref().child('category').push(catObj).key;
          console.log("catObj : " + angular.toJson(catObj , ' '));
        };
        ///for upload image :
        $scope.uploadFile = function(event) {
          var files = event.target.files;
          var storage = firebase.storage();
          var storageRef = storage.ref();
          $scope.determinateValue = $scope.determinateValue + 5;
          var uploadTask = storageRef.child('profileimages/' + 'photo_' + firebase.auth().currentUser.uid + '_' + new Date().getTime()).put(files[0], { contentType: 'image/jpeg' });

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              $scope.determinateValue = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100) - 5;
              $scope.$apply();
              // console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }

            },
            function(error) {
              console.log('At error : ' + angular.toJson(error));
            },
            function() {
              // Upload completed successfully, now we can get the download URL
              $scope.downloadURL = uploadTask.snapshot.downloadURL;
              $scope.updateproductdetails.image = $scope.downloadURL;
              console.log("downloadURL : " + $scope.downloadURL);
              // $scope.currentUser.photo = downloadURL;
              var inProgressData = {};

              $scope.determinateValue = 0;
            });
        };


                $scope.productId = $stateParams.product_id;
    console.log("$scope.productId for admin  : " + $scope.productId );

        $scope.addItem = function (item) {

        if ($scope.validate(item) === false) {
              return;
            }
          //console.log("item .category : " + item.category);
          $scope.globalcategory = item.category;
          //console.log("$scope.globalcategory "+ $scope.globalcategory);
            var menuObj = {
                name : item.name,
                available : item.available,
                category : item.category,
                description : item.description,
                image : $scope.downloadURL,
                price : item.price,
                stock : item.stock
            }
          //console.log("menuObj : " + angular.toJson(menuObj , ' '));
          var menuRef = firebase.database().ref().child('product').push(menuObj).key;
          $scope.globalproductID = menuRef;
          console.log("$scope.globalcategory "+ $scope.globalproductID);
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
        }

        // Fetch Product from Firebase
        console.log("userid for database  : " + $scope.productId );
        $scope.updateproductdetails = '' ;

        var refProduct = firebase.database().ref('product/' +  $scope.productId);
        // new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.productId);
        var userData = $firebaseObject(refProduct);
        userData.$loaded().then(function(response) {
          $scope.updateproductdetails = response;
          console.log("Response data for fetch data from response ",angular.toJson($scope.updateproductdetails,' '));
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
            var menuObj = {
                name : updateproductdetails.name,
                available : updateproductdetails.available,
                category : updateproductdetails.category,
                description : updateproductdetails.description,
                image : updateproductdetails.image,
                price : updateproductdetails.price,
				stock : updateproductdetails.stock
            }
          //console.log("menuObj test: " + angular.toJson(menuObj , ' '));
          //console.log("product ID " + angular.toJson($scope.productId , ' '));

          var menuRef = firebase.database().ref().child('product/'+$scope.productId).update(menuObj);
			//console.log("response test: " + angular.toJson(menuRef , ' '));
		}

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

		}

        })
  //////complete admin controller
