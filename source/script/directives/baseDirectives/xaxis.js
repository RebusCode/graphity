rcDimple.directive('x', ['d3', '$filter', 'enums', function (d3, $filter, enums) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '@',
            type: '@',
            groupBy: '@',
            format: '@',
            orderBy: '@',
            title: '@',
            showLine: '@',
            showAxis: '@',
            textDirection: '@',
            prefix: '@',
            suffix: '@'
        },
        require: ['^chart'],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            chart.RegisterToParent(scope.$id);
            chart.Events[scope.$id] = {};

            function drawAxis() {
                var xAxis;
                scope.type = scope.type || '';
                switch (CheckNumber(scope.type)) {
                case enums.AxisType.measure:
                    if (scope.groupBy && scope.groupBy !== '')
                        xAxis = chart.ChartObject.addMeasureAxis('x', [scope.groupBy, scope.field]);
                    else
                        xAxis = chart.ChartObject.addMeasureAxis('x', scope.field);
                    break;
                case enums.AxisType.percent:
                    xAxis = chart.ChartObject.addPctAxis('x', scope.field);
                    break;
                case enums.AxisType.time:
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

                xAxis.axisId = scope.$id;
                if (scope.orderBy && scope.orderBy !== '') {
                    if (scope.groupBy && scope.groupBy !== '')
                        xAxis.addGroupOrderRule(scope.orderBy);
                    else
                        xAxis.addOrderRule(scope.orderBy);
                }

                if (!chart.String.IsUndefinedOrEmptyOrNull(scope.title))
                    xAxis.title = scope.title;
                else
                    xAxis.title = null;

                if (!chart.String.IsUndefinedOrEmptyOrNull(scope.showAxis))
                    xAxis.hidden = !(scope.showLine === 'true');

                chart.Events[scope.$id].xTextTransformation = textTransformation;
            }

            function textTransformation() {
                var x = $filter('filter')(chart.ChartObject.axes, function (value, index, array) {
                        if (value.position == "x" && value.axisId == scope.$id)
                            return value;
                    })[0],
                    isPrefix = !chart.String.IsUndefinedOrEmptyOrNull(scope.prefix),
                    isSuffix = !chart.String.IsUndefinedOrEmptyOrNull(scope.suffix),
                    isTextDirection = !chart.String.IsUndefinedOrEmptyOrNull(scope.textDirection);

                if (isPrefix || isSuffix || isTextDirection) {
                    var textShapes = x.shapes.selectAll("text");

                    textShapes
                        .text(function (d) {
                            var textValue = isPrefix ? scope.prefix + d3.select(this).text() : d3.select(this).text();
                            textValue += isSuffix ? scope.suffix : "";

                            return textValue;
                        })

                    //                        .attr("transform",
                    //                            function (d) {
                    //                                //                                if (isTextDirection)
                    //                                //                                    return d3.select(this).attr("transform") + "rotate(0)";
                    //                            });
                }
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
}]);
