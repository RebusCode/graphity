rcDimple.directive('resize', function ($window, $rootScope) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {

            //            var w = angular.element($window);
            //            scope.$watch(function () {
            //                return {
            //                    'h': window.innerHeight,
            //                    'w': window.innerWidth
            //                };
            //            }, function (newValue, oldValue) {
            //                if (newValue !== oldValue) {
            //                    $rootScope.$broadcast("windowResized");
            //                }
            //            }, true);
            //
            //            w.bind('resize', function () {
            //                scope.$apply();
            //            });

            angular.element($window).on('resize', function (e) {

                $rootScope.$broadcast("windowResized");
            });
        }
    }
})
