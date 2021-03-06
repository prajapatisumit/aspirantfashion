angular.module('app')
.controller('addSubCategoryCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService,$window) {

    $rootScope.extras=true;

    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
      return;
      }
      $scope.subcatObj = {};
    });

    $scope.addSubCategory = function (subcatObj) {
      console.log('calling object' + angular.toJson(subcatObj, ''));
      // console.log("categoryid : " + categoryid);
        var subcatAdd = {
            name : subcatObj.subcategoryName,
            type : subcatObj.subcategoryType,
            image : $scope.downloadURL,
            categoryid : subcatObj.$id
        }
          $scope.subcatObj.image = $scope.downloadURL;
      var SubcategoryRef = firebase.database().ref().child('subcategory').push(subcatAdd).key;
      console.log("subcatObj : " + angular.toJson($scope.subcatObj , ' '));
      $scope.globalproductID = SubcategoryRef;
      console.log("$scope.globalcategory "+ $scope.globalproductID);
      if (!!$scope.globalproductID) {
        var imgObj = {
          image : $scope.downloadURL
        };
       firebase.database().ref().child('subcategory/' + $scope.globalproductID + '/images' ).set($scope.imgset2).then(function (data) {
              IonicPopupService.alert("Subcategory added successfully..");
              $scope.subcatObj.image = '';
              $scope.subcatObj.subcategoryName = '';
              $scope.subcatObj.subcategoryType = '';
              $scope.imgset2 = [];
       }).catch(function (error) {
        //  debugger
         console.log('Error : ' + error);
       });
      }
    };
    $scope.loadCategory = function() {
      $scope.category = $firebaseArray(fireBaseData.refCategory());
      console.log("$scope.category : " + angular.toJson($scope.category , ' '));
    };
    $scope.imgset2 = [];

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
              $scope.imgset2.push($scope.downloadUrlThree);
          $scope.determinateValue = 0;
        });
    };

    $scope.deleteImage = function(id) {
        console.log("id : " + id);
      // $scope.imgset.remove(downloadURL);
       $scope.imgset3 = firebase.database().ref().child('subcategory/' + $scope.globalproductID + '/images'  ).remove(id);
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
