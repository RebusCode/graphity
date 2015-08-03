rcDimple.directive('z', ['$filter', 'd3', function ($filter, d3) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '@'
        },
        require: ['^chart'],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            chart.RegisterToParent(scope.$id);
            chart.Events[scope.$id] = {};

            function drawAxis() {
                var zAxis = chart.ChartObject.addMeasureAxis('z', scope.field);
            }

            scope.$watch(function () {
                    return chart.DataChanged;
                },
                function (newVal) {
                    if (newVal === true) {
                        drawAxis();
                        chart.BindComplete(scope.$id);
                    }
                });
        }
    }
}]);
