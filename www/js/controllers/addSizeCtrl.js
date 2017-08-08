angular.module('app')
.controller('addSizeCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService,$window) {

    $ionicModal.fromTemplateUrl('templates/addsize.html', {
         scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
    });
    $ionicModal.fromTemplateUrl('templates/addbrand.html', function($ionicModal) {
    $scope.modal = $ionicModal;
    }, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
    animation: 'slide-in-up'
  });
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
   var refSize = firebase.database().ref('size/' + $scope.globalproductID );

       //  new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.productId +"/product_specification");
       var userData = $firebaseArray(refSize);
       userData.$loaded().then(function(response) {
         $scope.updatesize = response;

         console.log("admin pro se d ",angular.toJson($scope.updatesize,' '));
       });

       $scope.sizeupdate = function(updatesize){
         console.log("update fun ",angular.toJson($scope.updatesize,' '));
        $scope.data = [];

          $scope.size = $scope.updatesize.size;
          $scope.type = $scope.updatesize.type;
          $scope.id = $scope.updatesize.$id;

                 var sizeUpdateObj = {

                   size : $scope.size,
                   type : $scope.type,
                   id : $scope.id
                 };
           var sizerefup = firebase.database().ref().child('size/' + $stateParams.globalproductID ).update(sizeUpdateObj);
          //  var sizerefup1 = firebase.database().ref().child('size/' + $stateParams.product_id + '/type' ).update(sizeUpdateObj);
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
