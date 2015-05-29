rcDimple.directive('resize', function ($window, $rootScope) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {

            var w = angular.element($window);
            scope.$watch(function () {
                return {
                    'h': window.innerHeight,
                    'w': window.innerWidth
                };
            }, function (newValue) {
                if (newValue) {
                    $rootScope.$broadcast("windowResized");
                }
            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    }
})
