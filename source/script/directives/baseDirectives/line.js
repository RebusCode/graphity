rcDimple.directive('line', ['dimple', '$filter', function (dimple, $filter) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '@',
            filter: '@',
            yaxis: '@',
            data: '='
        },
        require: ['^chart'],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            chart.RegisterToParent(scope.$id);
            chart.Events[scope.$id] = {};

            function drawLine() {
                var line,
                    field = scope.field ? scope.field : null;

                if (!chart.String.IsUndefinedOrEmptyOrNull(scope.yaxis)) {
                    var ys = $filter('filter')(chart.ChartObject.axes, {
                        position: 'y'
                    });

                    if (ys.length > 1) {
                        var x = $filter('filter')(chart.ChartObject.axes, {
                            position: 'x'
                        })[0];

                        var y = ys[CheckNumber(scope.yaxis) - 1];

                        line = chart.ChartObject.addSeries(field, dimple.plot.line, [x, y]);
                    } else
                        line = chart.ChartObject.addSeries(field, dimple.plot.line);
                } else
                    line = chart.ChartObject.addSeries(field, dimple.plot.line);

                if (scope.data)
                    line.data = scope.data;

                if (scope.color)
                    for (var series in scope.color)
                        chart.ChartObject.assignColor(series, scope.color[series]);

                if (scope.filter)
                    chart.ApplyFilter(scope.filter);

                line.lineMarkers = true;
            }

            scope.$watch(function () {
                    return chart.DataChanged;
                },
                function (newVal) {
                    if (newVal === true) {
                        drawLine();
                        chart.BindComplete(scope.$id);
                    }
                });
        }
    };
}]);
