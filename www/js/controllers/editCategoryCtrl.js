angular.module('app')
.controller('editCategoryCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService,$window) {

    $rootScope.extras=true;
$scope.userData = SessionService.getUser();
//update code start
$scope.loadCategory = function() {
  $scope.category = $firebaseArray(fireBaseData.refCategory());
  console.log("$scope.category : " + angular.toJson($scope.category , ' '));
};
    $scope.categoryId = $stateParams.category_id;
    console.log("$scope.categoryId for admin  : " + $scope.categoryId );

    // Fetch Product from Firebase
    console.log("userid for database  : " + $scope.categoryId );
    $scope.updatecategorydetails = '' ;

    var refCategory = firebase.database().ref('category/' +  $scope.categoryId);
    // new Firebase("https://shopping-42daf.firebaseio.com/product/" + $scope.productId);
    var userData = $firebaseObject(refCategory);
    userData.$loaded().then(function(response) {
      $scope.updatecategorydetails = response;
      console.log("Response data for fetch data from response item ",angular.toJson($scope.updatecategorydetails,' '));
    });

    $scope.updateCategory = function(updatecategorydetails){
			$scope.data = updatecategorydetails;
			console.log("catObj test: first " + angular.toJson(updatecategorydetails.image, ' '));
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
			console.log("catObj test breofre : " + angular.toJson(updatecategorydetails.image , ' '));

            var catObj = {
                name : updatecategorydetails.name,
                image : updatecategorydetails.image
            }
          //console.log("menuObj test: " + angular.toJson(menuObj , ' '));
          //console.log("product ID " + angular.toJson($scope.productId , ' '));

          var catRef = firebase.database().ref().child('category/'+$scope.categoryId).update(catObj);

			console.log("response test: " + angular.toJson(catRef , ' '));

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
