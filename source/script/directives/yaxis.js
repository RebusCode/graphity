rcDimple.directive('y', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '@',
            type: '@',
            format: '@',
            orderBy: '@',
            title: '@'
        },
        require: ['^chart'],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            var chartObject = chart.GetChartObject();

            function drawAxis() {
                var yAxis;
                scope.type = scope.type || '';
                switch (scope.type.toLowerCase()) {
                case 'category':
                    yAxis = chartObject.addCategoryAxis('y', scope.field);
                case 'percent':
                    yAxis = chartObject.addPctAxis('y', scope.field);
                case 'time':
                    yAxis = chartObject.addTimeAxis('y', scope.field);
                    if (scope.format)
                        yAxis.tickFormat = scope.format;
                default:
                    yAxis = chartObject.addMeasureAxis('y', scope.field);
                }

                if (scope.orderBy && scope.orderBy !== '') {
                    if (scope.groupBy && scope.groupBy !== '')
                        yAxis.addGroupOrderRule(scope.orderBy);
                    else
                        yAxis.addOrderRule(scope.orderBy);
                }

                if (scope.title && scope.title !== '')
                    yAxis.title = scope.title;
                else
                    yAxis.title = null;
            }

            scope.$on("dataChanged", function () {
                drawAxis();
            })
        }
    }
})
