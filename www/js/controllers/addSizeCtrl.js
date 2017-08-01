angular.module('app')
.controller('addSizeCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,$interval,
                                     $state,fireBaseData,$ionicHistory,SessionService,$ionicModal,$firebaseArray,$firebaseObject,$stateParams,CommonService,IonicPopupService,$window) {


                                       $rootScope.extras=true;

                                       $scope.$on('$ionicView.enter', function(ev) {
                                         if(ev.targetScope !== $scope){
                                          return;
                                         }
                                          $scope.sizeObj = {};
                                       });

                                       $scope.addsize = function () {
                                          //  var sizeObj = {
                                          //      type : type,
                                          //      size : size
                                          //  }

                                         var SizeRef = firebase.database().ref().child('size').push($scope.sizeObj).then(function (data) {
                                           console.log("sizeObj : " + angular.toJson($scope.sizeObj , ' '));
                                                IonicPopupService.alert("size added successfully..")
                                                  $scope.sizeObj = {};
                                         }).catch(function (error) {
                                          //  debugger
                                           console.log('Error : ' + error);
                                         });

                                       };

});
