rcDimple.directive('line', ['dimple', function (dimple) {
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
            chart.RegisterToParent(scope.$id);

            function drawLine() {
                var line,
                    field = scope.field ? [scope.field] : null;

                line = chart.ChartObject.addSeries(field, dimple.plot.line);
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
