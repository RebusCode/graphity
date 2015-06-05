rcDimple.directive('bar', ['dimple', function (dimple) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '@',
            filter: '@'
        },
        require: ['^chart'],
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {}],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            chart.RegisterToParent(scope.$id);

            function drawBar() {
                var field = scope.field ? [scope.field] : null;
                var bar = chart.ChartObject.addSeries(field, dimple.plot.bar);
            }

            //            scope.$on("dataChanged", function (event, chart) {
            //                drawBar(chart.ChartObject);
            //            })
            //
            //            scope.$on("drawComplete", function (event, chart) {
            //                if (chart.onLegendClick)
            //                    chart.onLegendClick(chart)
            //            })
            //

            scope.$watch(function () {
                    return chart.DataChanged;
                },
                function (newVal) {
                    if (newVal === true) {
                        drawBar();
                        chart.BindComplete(scope.$id);
                    }
                });

        }
    };
}]);
