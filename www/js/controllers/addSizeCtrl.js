angular.module('app')
.controller('addSizeCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService,$window) {

    $ionicModal.fromTemplateUrl('templates/addsize.html', {
         scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(id) {
      $scope.selectedId = id;
        for (var i = 0; i < $scope.updatesize.length; i++) {
          if ($scope.updatesize[i].$id === $scope.selectedId) {
              $scope.size = $scope.updatesize[i].size;
              $scope.type = $scope.updatesize[i].type;
              console.log("$scope.size : " + $scope.size);
              console.log("$scope.type : " + $scope.type);
          }
        }
      console.log('$scope.selectedId : ' + $scope.selectedId);
      $scope.modal.show();
  }
        $rootScope.extras=true;

        $scope.loadSize = function() {
          // debugger
          $scope.sizeload=$firebaseArray(fireBaseData.refSize());
        };


        $scope.$on('$ionicView.enter', function(ev) {
       if(ev.targetScope !== $scope){
         return;
        }
        $scope.sizeObj = {};
        });
        $scope.productId = $stateParams.product_id;
        console.log("$scope.productId for admin  : " + $scope.productId );

      $scope.addsize = function () {
              //  var sizeObj = {
              //      type : type,
              //      size : size
              //  }

  var SizeRef = firebase.database().ref().child('size').push($scope.sizeObj).key;
  // then(function (data) {
      $scope.globalproductID = SizeRef;
      console.log('$scope.globalproductID : ' + $scope.globalproductID );
  console.log("sizeObj : " + angular.toJson($scope.sizeObj , ' '));
          IonicPopupService.alert("size added successfully..")
            $scope.sizeObj = {};
    //   }).catch(function (error) {
    //
    //  console.log('Error : ' + error);
    //   });

   };

   var userdata = [];
   var refSize = firebase.database().ref('size/');
       //  new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.productId +"/product_specification");
       var userData = $firebaseArray(refSize);
       userData.$loaded().then(function(response) {
         $scope.updatesize = response;

         console.log("admin pro se d ",angular.toJson($scope.updatesize,' '));
       });

       $scope.sizeupdate = function(type,size){
         console.log("update fun ",angular.toJson($scope.updatesize,' '));
                 var sizeUpdateObj = {
                   size : size,
                   type : type
                 };
           var sizerefup = firebase.database().ref().child('size/' + $scope.selectedId).update(sizeUpdateObj);

                        console.log("update Angular "+ angular.toJson(sizeUpdateObj,' '));
       };
   $scope.deletesize = function(globalproductID,data) {
     IonicPopupService.confirm('Delete Size', 'Are you sure you want to delete this Size?').then(function(res) {
     if (res) {
         var deleteSizeRef = firebase.database().ref('size/' + globalproductID);
         deleteSizeRef.remove().then(function (response) {
           console.log("Size removed successfully..");
       });
     }
   });
 };

});
