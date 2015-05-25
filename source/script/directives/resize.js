.directive('resize', function ($window, $rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var w = angular.element($window);
            scope.$watch(function () {
                return {
                    'h': window.innerHeight,
                    'w': window.innerWidth
                };
            }, function (newValue) {
                if (newValue) {
                    $rootScope.$broadcast("WindowResized");
                }
            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    }
})
