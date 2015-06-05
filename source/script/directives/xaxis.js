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
            chart.RegisterToParent(scope.$id);

            function drawAxis() {
                var xAxis;
                scope.type = scope.type || '';
                switch (scope.type.toLowerCase()) {
                case 'measure':
                    if (scope.groupBy && scope.groupBy !== '')
                        xAxis = chart.ChartObject.addMeasureAxis('x', [scope.groupBy, scope.field]);
                    else
                        xAxis = chart.ChartObject.addMeasureAxis('x', scope.field);
                    break;
                case 'percent':
                    xAxis = chart.ChartObject.addPctAxis('x', scope.field);
                    break;
                case 'time':
                    xAxis = chart.ChartObject.addTimeAxis('x', scope.field);
                    if (scope.format)
                        xAxis.tickFormat = scope.format;
                    break;
                default:
                    if (scope.groupBy && scope.groupBy !== '')
                        xAxis = chart.ChartObject.addCategoryAxis('x', [scope.groupBy, scope.field]);
                    else
                        xAxis = chart.ChartObject.addCategoryAxis('x', scope.field);
                    break;
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
    };
});
