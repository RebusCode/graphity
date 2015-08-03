rcDimple.directive('area', ['dimple', '$filter', function (dimple, $filter) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '@',
            filter: '@',
            yaxis: '@',
            data: '='
                //color: '=', //should be an object with key as series name and value as color to assign ( example : {'Hypermarkets':'red', 'Supermarkets' : '#FFDAB9'})
        },
        require: ['^chart'],
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {}],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            chart.RegisterToParent(scope.$id);
            chart.Events[scope.$id] = {};

            function drawArea() {
                var field = scope.field ? scope.field : null,
                    area;

                if (!chart.String.IsUndefinedOrEmptyOrNull(scope.yaxis)) {
                    var ys = $filter('filter')(chart.ChartObject.axes, {
                        position: 'y'
                    });

                    if (ys.length > 1) {
                        var x = $filter('filter')(chart.ChartObject.axes, {
                            position: 'x'
                        })[0];

                        var y = ys[CheckNumber(scope.yaxis) - 1];

                        area = chart.ChartObject.addSeries(field, dimple.plot.area, [x, y]);
                    } else
                        area = chart.ChartObject.addSeries(field, dimple.plot.area);
                } else
                    area = chart.ChartObject.addSeries(field, dimple.plot.area);

                if (scope.data)
                    area.data = scope.data;
            }

            scope.$watch(function () {
                    return chart.DataChanged;
                },
                function (newVal) {
                    if (newVal === true) {
                        drawArea();
                        chart.BindComplete(scope.$id);
                    }
                });

        }
    };
}]);
