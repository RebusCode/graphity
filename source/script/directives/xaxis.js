rcDimple.directive('x', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            groupBy: '@',
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
                var xAxis;
                scope.type = scope.type || '';
                switch (scope.type.toLowerCase()) {
                case 'measure':
                    if (scope.groupBy && scope.groupBy !== '')
                        xAxis = chartObject.addMeasureAxis('x', [scope.groupBy, scope.field]);
                    else
                        xAxis = chartObject.addMeasureAxis('x', scope.field);
                case 'percent':
                    xAxis = chartObject.addPctAxis('x', scope.field);
                case 'time':
                    xAxis = chartObject.addTimeAxis('x', scope.field);
                    if (scope.format)
                        xAxis.tickFormat = scope.format;
                default:
                    if (scope.groupBy && scope.groupBy !== '')
                        xAxis = chartObject.addCategoryAxis('x', [scope.groupBy, scope.field]);
                    else
                        xAxis = chartObject.addCategoryAxis('x', scope.field);
                }

                if (scope.orderBy && scope.orderBy !== '') {
                    if (scope.groupBy && scope.groupBy !== '')
                        xAxis.addGroupOrderRule(scope.orderBy);
                    else
                        xAxis.addOrderRule(scope.orderBy);
                }

                if (scope.title && scope.title !== '')
                    xAxis.title = scope.title;
                else
                    xAxis.title = null;
            }

            scope.$on("dataChanged", function () {
                drawAxis();
            })
        }
    };
});
