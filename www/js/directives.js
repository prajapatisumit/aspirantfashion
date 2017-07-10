angular.module('app')
.directive('blankDirective', [function(){

}])

.directive('fileModel', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.fileModel);
      element.bind('change', onChangeHandler);
    }
  };
});
