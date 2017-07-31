angular.module('app')
.controller('addCategoryCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService,$window) {

    $rootScope.extras=true;

    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
        return;
      }
      $scope.catObj = {};
    });


  $scope.addCategory = function () {
    // debugger
    // $scope.image =
      // var catObj = {
      //     name : $scope.categoryName,
      //     image : $scope.downloadURL
      // }
    $scope.catObj.image = $scope.downloadURL;
      // $scope.image = $scope.downloadURL;
    var categoryRef = firebase.database().ref().child('category').push($scope.catObj).key;
    console.log("catObj : " + angular.toJson($scope.catObj , ' '));
    $scope.globalproductID = categoryRef;
    console.log("$scope.globalcategory "+ $scope.globalproductID);
    if (!!$scope.globalproductID) {
      var imgObj = {
        image : $scope.downloadURL
      };
     firebase.database().ref().child('category/' + $scope.globalproductID + '/images' ).set($scope.imgset1).then(function (data) {
      //  debugger
      IonicPopupService.alert("Your category added successfully..");
      $scope.catObj = {};
      $scope.imgset1 = [];

     }).catch(function (error) {
      //  debugger
       console.log('Error : ' + error);
     });
    }
  };

    // $scope.productId = $stateParams.product_id;
    // console.log("$scope.productId for admin  : " + $scope.productId );

    $scope.imgset1 = [];

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
              $scope.imgset1.push($scope.downloadUrlOne);
          $scope.determinateValue = 0;
        });
    };
    $scope.deleteImage = function(id) {
        console.log("id : " + id);
      // $scope.imgset.remove(downloadURL);
       $scope.imgset1 = firebase.database().ref().child('product/' + $scope.globalproductID + '/images'  ).remove(id);
       console.log("yes delete image.");
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

});
