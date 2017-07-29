angular.module('app')
.controller('addSizeCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService,$window) {

                                       $scope.$on('$ionicView.enter', function(ev) {
                                         if(ev.targetScope !== $scope){
                                           $ionicHistory.clearHistory();
                                           $ionicHistory.clearCache();
                                         }

                                       });
                                       $rootScope.extras=true;

                                       $scope.addsize = function (type,size) {
                                           var sizeObj = {
                                               type : type,
                                               size : size
                                           }

                                         var SizeRef = firebase.database().ref().child('size').push(sizeObj).key.then(function (data) {
                                                IonicPopupService.alert("Your Product Add successfully..")
                                                $window.location.reload(true)
                                         });
                                         console.log("sizeObj : " + angular.toJson(sizeObj , ' '));

                                       };
                                       $scope.backaddminaddpg = function(){
                                         $state.go('adminadd');
                                       };
});
