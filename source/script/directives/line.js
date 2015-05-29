rcDimple.directive('line', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '@',
            filter: '@'
        },
        require: ['^chart'],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            var chartObject = chart.GetChartObject();

            function drawLine() {
                var line;
                var filteredData;

                line = chartObject.addSeries([scope.field], dimple.plot.line);
                if (scope.filter)
                    chart.ApplyFilter(scope.filter);

                line.lineMarkers = true;
            }

            scope.$on("dataChanged", function () {
                drawLine();
            })

            scope.$on("drawComplete", function () {
                if (chart.onLegendClick)
                    chart.onLegendClick(chartObject.legends[0])
            })
        }
    };
})
