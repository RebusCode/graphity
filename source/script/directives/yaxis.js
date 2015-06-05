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
            chart.RegisterToParent(scope.$id);

            function drawAxis() {
                var yAxis;
                scope.type = scope.type || '';

                switch (scope.type.toLowerCase()) {
                case 'category':
                    yAxis = chart.ChartObject.addCategoryAxis('y', scope.field);
                    break;
                case 'percent':
                    yAxis = chart.ChartObject.addPctAxis('y', scope.field);
                    break;
                case 'time':
                    yAxis = chart.ChartObject.addTimeAxis('y', scope.field);
                    if (scope.format)
                        yAxis.tickFormat = scope.format;
                    break;
                default:
                    yAxis = chart.ChartObject.addMeasureAxis('y', scope.field);
                    break;
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
})
