angular.module('app')
.controller('addProductCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService, $window) {
                                       $scope.backaddminaddpg = function(){
                                         $state.go('adminadd');
                                       };


              $ionicModal.fromTemplateUrl('templates/addproduct.html', {
                      scope: $scope
                }).then(function(modal) {
                     $scope.modal = modal;
              });

              $ionicModal.fromTemplateUrl('templates/addproduct.html', {
                      scope: $scope
                }).then(function(sizemodal) {
                     $scope.sizemodal = sizemodal;
              });
              $ionicModal.fromTemplateUrl('templates/addproduct-2.html', {
        id: '1', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
      }).then(function(sizemodal) {
        $scope.oModal1 = sizemodal;
      });

      // Modal 2
      $ionicModal.fromTemplateUrl('templates/addproduct-1.html', {
        id: '2', // We need to use and ID to identify the modal that is firing the event!
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.oModal2 = modal;
      });

      $scope.openModal = function(index) {
        $scope.loadSize();
        if (index == 1) $scope.oModal1.show();
        else $scope.oModal2.show();
      };

      $scope.closeModal = function(index) {
        if (index == 1) $scope.oModal1.hide();
        else $scope.oModal2.hide();
      };

      $scope.$on('modal.shown', function(event, modal) {
            console.log('Modal ' + modal.id + ' is shown!');
          });

          $scope.$on('modal.hidden', function(event, modal) {
            console.log('Modal ' + modal.id + ' is hidden!');
          });

          $scope.$on('$destroy', function() {
      console.log('Destroying modals...');
      $scope.oModal1.remove();
      $scope.oModal2.remove();
    });

              $scope.inputs = [];
              $scope.inputs.push({'attribute': '', 'value' : ''});
              $scope.addfield = function(){
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
              };
    $rootScope.extras=true;
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
    $scope.loadSize();

$scope.checkItems = { };
$scope.print = function() {
    console.log("$scope.checkItems" + angular.toJson($scope.checkItems , ' '));
};
$scope.finalSize = [];
$scope.save = function() {
    $scope.finalSize = [];
    for(i in $scope.checkItems) {

        console.log('check : '+$scope.checkItems[i]);
        if($scope.checkItems[i] == true) {
            $scope.finalSize.push(i);
        }
    }
console.log('final size : ' +  $scope.finalSize);
};




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
          } else if (CommonService.validateEmpty(item.description, 'Oops!', 'Please enter product description') === false) {
            return false;
          } else if (CommonService.validateEmpty(item.price, 'Oops!', 'Please enter product price') === false) {
            return false;
          } else if (CommonService.validateEmpty(item.stock, 'Oops!', 'Please enter product stocks') === false) {
            return false;
          }
        };

    $scope.loadSubCategory = function () {
      $scope.subCategory = $firebaseArray(fireBaseData.refSubCategory());
      console.log("$scope.subCategory : " + angular.toJson($scope.subCategory , ' '));
    };
    $scope.loadCategory();
    $scope.loadSubCategory();



    $scope.getSubCategory = function (categoryid) {
      $scope.selectedSubCategory = [];
      $scope.categoryid = categoryid;
      console.log("this function is calling.... : " +categoryid );
      // $scope.subCategory = $firebaseArray(fireBaseData.refSubCategory());
      // console.log("$scope.subCategory : " + angular.toJson($scope.subCategory , ' '));
      for (var i = 0; i < $scope.subCategory.length; i++) {
        if ($scope.subCategory[i].categoryid === $scope.categoryid) {
          $scope.selectedSubCategory.push($scope.subCategory[i]);
        }
      }
      console.log("$scope.selectedSubCategory : " + angular.toJson($scope.selectedSubCategory , ' '));
    };

    $scope.getSize = function (sizeid) {
      $scope.finalSize = [];
      $scope.sizeid = sizeid;
      console.log("this function is calling.... : " +sizeid );
      for (var i = 0; i < $scope.size.length; i++) {
        if ($scope.size[i].sizeid === $scope.sizeid) {
          $scope.finalSize.push($scope.size[i]);
        }
      }
      console.log("$scope.finalSize : " + angular.toJson($scope.finalSize , ' '));
    };

  $scope.productId = $stateParams.product_id;
  console.log("$scope.productId for admin  : " + $scope.productId );
  ///for upload image :
  $scope.imgset = [];

  $scope.uploadFile = function(event) {

  //  var quality: 5;
  var files = event.target.files;
  var storage = firebase.storage();
  var storageRef = storage.ref();
  $scope.determinateValue = $scope.determinateValue + 5;
  $scope.startprogress();
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
      $scope.downloadUrlOne = uploadTask.snapshot.downloadURL;
      $scope.downloadUrlTwo = uploadTask.snapshot.downloadURL;
      $scope.downloadUrlThree = uploadTask.snapshot.downloadURL;

      // $scope.updateproductdetails.image = $scope.downloadURL;
      console.log("downloadURL : " + $scope.downloadURL);
      console.log("downloadURL1 : " + $scope.downloadUrlOne);
      console.log("downloadURL2 : " + $scope.downloadUrlTwo);
      console.log("downloadURL3 : " + $scope.downloadUrlThree);
      $scope.progress = 100;

      $scope.imgset.push($scope.downloadURL);


      var inProgressData = {};
      $scope.determinateValue = 0;
    });
  };

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

  $scope.$on('$ionicView.enter', function(ev) {
    if(ev.targetScope !== $scope){
      return;
    }
    $scope.menuObj = {};
  });

  $scope.addItem = function (menuObj) {
    console.log("object menu calling: " + angular.toJson(menuObj,''));
console.log("$scope.menuObj : " + angular.toJson($scope.menuObj , ' '));
  if ($scope.validate($scope.menuObj) === false) {
        return;
      }
    console.log("$scope.menuObj : " + angular.toJson($scope.menuObj,' '));

    $scope.globalcategory = $scope.menuObj.categoryId;


    // console.log("$scope.globalcategory "+ $scope.globalcategory);
      // var menuObj = {
      //     name : item.name,
      //     brand : item.brandName,
      //     available : item.available,
      //     category : item.categoryId,
      //     subcategory : item.subCatID,
      //     size  : $scope.finalSize,
      //     weight : item.Weight,
      //     barcode:item.barCode,
      //     manufacturer:item.manufacturer,
      //     actualprice:item.actualPrice,
      //     description : item.description,
      //     image : $scope.downloadURL,
      //     price : item.price,
      //     stock : item.stock
      // }
    console.log("menuObj : " + angular.toJson($scope.menuObj , ' '));
    var menuRef = firebase.database().ref().child('product').push($scope.menuObj).key;
    $scope.globalproductID = menuRef;
    console.log("$scope.globalcategory "+ $scope.globalproductID);
    if (!!$scope.globalproductID) {
      var imgObj = {
        img : $scope.downloadURL,
        size : $scope.finalSize
      };
     firebase.database().ref().child('product/' + $scope.globalproductID + '/images' ).set($scope.imgset).then(function (data) {
        firebase.database().ref().child('product/' + $scope.globalproductID + '/size' ).set($scope.finalSize).then(function (sizedata) {
            IonicPopupService.alert("Your Product Add successfully..")
            $scope.menuObj = {};
            $scope.imgset = [];
        }).catch(function (error) {
         //  debugger
          console.log('Error : ' + error);
        });
     });


    }
  };


});
