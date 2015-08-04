rcDimple.directive('y', ['$filter', 'd3', 'enums', function ($filter, d3, enums) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '@',
            type: '@',
            format: '@',
            orderBy: '@',
            title: '@',
            showLine: '@',
            showAxis: '@',
            showGridLines: '@',
            min: '=',
            max: '=',
            majorInterval: '=',
            prefix: '@',
            suffix: '@'
        },
        require: ['^chart'],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            chart.RegisterToParent(scope.$id);
            chart.Events[scope.$id] = {};

            function drawAxis() {
                var yAxis;
                scope.type = scope.type || '';

                switch (CheckNumber(scope.type)) {
                case enums.AxisType.category:
                    yAxis = chart.ChartObject.addCategoryAxis('y', scope.field);
                    break;
                case enums.AxisType.percent:
                    yAxis = chart.ChartObject.addPctAxis('y', scope.field);
                    break;
                case enums.AxisType.time:
                    yAxis = chart.ChartObject.addTimeAxis('y', scope.field);
                    if (scope.format)
                        yAxis.tickFormat = scope.format;
                    break;
                default:
                    yAxis = chart.ChartObject.addMeasureAxis('y', scope.field);
                    break;
                }

                yAxis.axisId = scope.$id;

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

                if (scope.showLine && scope.showLine != '')
                    yAxis.hidden = !(scope.showLine === 'true');

                if (!chart.String.IsUndefinedOrEmptyOrNull(scope.showAxis))
                    yAxis.showGridlines = (scope.showGridLines === 'true');

                if (scope.min)
                    yAxis.overrideMin = scope.min;

                if (scope.max)
                    yAxis.overrideMax = scope.max;

                if (scope.majorInterval)
                    yAxis.ticks = scope.majorInterval;

                //chart.Events[scope.$id].yTextTransformation = textTransformation;
            }

            function textTransformation() {
                var y = $filter('filter')(chart.ChartObject.axes, function (value, index, array) {
                        if (value.position == "y" && value.axisId == scope.$id)
                            return value;
                    })[0],
                    isPrefix = !chart.String.IsUndefinedOrEmptyOrNull(scope.prefix),
                    isSuffix = !chart.String.IsUndefinedOrEmptyOrNull(scope.suffix);

                if (isPrefix || isSuffix) {
                    var textShapes = y.shapes.selectAll("text");

                    textShapes
                        .text(function (d) {
                            var textValue = isPrefix ? scope.prefix + d3.select(this).text() : d3.select(this).text();
                            textValue += isSuffix ? scope.suffix : "";

                            return textValue;
                        })
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
    }
}]);
