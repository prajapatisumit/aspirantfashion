angular.module('app')
.controller('addSizeCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService) {

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

                                         var SizeRef = firebase.database().ref().child('size').push(sizeObj).key;
                                         console.log("sizeObj : " + angular.toJson(sizeObj , ' '));

                                       };
});
