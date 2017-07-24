angular.module('app')
.controller('addProductCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService) {

    $rootScope.extras=true;
    $scope.loadCategory = function() {
      $scope.category = $firebaseArray(fireBaseData.refCategory());
      console.log("$scope.category : " + angular.toJson($scope.category , ' '));
    };

    $scope.loadBrand = function() {
      $scope.brand = $firebaseArray(fireBaseData.refBrand());
      console.log("$scope.brand : " + angular.toJson($scope.brand , ' '));
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


      // var inProgressData = {};
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

  $scope.addItem = function (item) {
console.log("item : " + angular.toJson(item , ' '));
  if ($scope.validate(item) === false) {
        return;
      }
    //console.log("item .category : " + item.category);
    $scope.globalcategory = item.categoryId;
    // console.log("$scope.globalcategory "+ $scope.globalcategory);
      var menuObj = {
          name : item.name,
          brand : item.brandName,
          available : item.available,
          category : item.categoryId,
          subcategory : item.subCatID,
          description : item.description,
          image : $scope.downloadURL,
          price : item.price,
          stock : item.stock
      }
    //console.log("menuObj : " + angular.toJson(menuObj , ' '));
    var menuRef = firebase.database().ref().child('product').push(menuObj).key;
    $scope.globalproductID = menuRef;
    console.log("$scope.globalcategory "+ $scope.globalproductID);
    if (!!$scope.globalproductID) {
      var imgObj = {
        img : $scope.downloadURL
      };
     firebase.database().ref().child('product/' + $scope.globalproductID + '/images' ).set($scope.imgset);
    }
  };


});
