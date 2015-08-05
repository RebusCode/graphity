rcDimple.directive('bubble', ['dimple', '$filter', function (dimple, $filter) {
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
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {}],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            chart.RegisterToParent(scope.$id);
            chart.Events[scope.$id] = {};

            function drawBubble() {
                var field = scope.field ? scope.field : null,
                    bubble;

                if (!chart.String.IsUndefinedOrEmptyOrNull(scope.yaxis)) {
                    var ys = $filter('filter')(chart.ChartObject.axes, {
                        position: 'y'
                    });

                    if (ys.length > 1) {
                        var x = $filter('filter')(chart.ChartObject.axes, {
                            position: 'x'
                        })[0];

                        var y = $filter('filter')(chart.ChartObject.axes, {
                            position: 'y'
                        })[CheckNumber(scope.yaxis) - 1];

                        bubble = chart.ChartObject.addSeries(field, dimple.plot.bubble, [x, y]);
                    } else
                        bubble = chart.ChartObject.addSeries(field, dimple.plot.bubble);
                } else
                    bubble = chart.ChartObject.addSeries(field, dimple.plot.bubble);

                if (scope.data)
                    bubble.data = scope.data;

                if (scope.color)
                    for (var series in scope.color)
                        chart.ChartObject.assignColor(series, scope.color[series]);
            }

            scope.$watch(function () {
                    return chart.DataChanged;
                },
                function (newVal) {
                    if (newVal === true) {
                        drawBubble();
                        chart.BindComplete(scope.$id);
                    }
                });
        }
    };
}]);
