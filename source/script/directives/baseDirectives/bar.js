rcDimple.directive('bar', ['dimple', '$filter', 'enums', function (dimple, $filter, enums) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            field: '@',
            filter: '@',
            yaxis: '@',
            data: '=',
            //color: '=', //should be an object with key as series name and value as color to assign ( example : {'Hypermarkets':'red', 'Supermarkets' : '#FFDAB9'})
            type: '@' //should be an enum value
        },
        require: ['^chart'],
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {}],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            chart.RegisterToParent(scope.$id);
            chart.Events[scope.$id] = {};

            function drawBar() {
                var field = scope.field ? scope.field : null,
                    bar;

                if (field)
                    switch (CheckNumber(scope.type)) {
                    case enums.BarType.Stacked:
                        break;
                    case enums.BarType.Grouped:
                    default:
                        var categoryAxes = $filter('filter')(chart.ChartObject.axes, function (value, index, array) {
                            if (value.categoryFields !== null)
                                return value;
                        })[0]

                        categoryAxes.categoryFields.push(field);
                        break;
                    }

                if (!chart.String.IsUndefinedOrEmptyOrNull(scope.yaxis)) {
                    var ys = $filter('filter')(chart.ChartObject.axes, {
                        position: 'y'
                    });

                    if (ys.length > 1) {
                        var x = $filter('filter')(chart.ChartObject.axes, {
                            position: 'x'
                        })[0];

                        var y = ys[CheckNumber(scope.yaxis) - 1];

                        bar = chart.ChartObject.addSeries(field, dimple.plot.bar, [x, y]);
                    } else
                        bar = chart.ChartObject.addSeries(field, dimple.plot.bar);
                } else
                    bar = chart.ChartObject.addSeries(field, dimple.plot.bar);


                bar = chart.ChartObject.addSeries(field, dimple.plot.bar);

                if (scope.data)
                    bar.data = scope.data;
            }

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
