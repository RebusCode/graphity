rcDimple.directive('chart', function ($rootScope, $compile) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=',
            height: '@',
            width: '@',
            transition: '@'
        },
        require: ['chart'],
        transclude: true,
        link: function (scope, element, attrs, controllers, transclude) {

            var chart = controllers[0];
            chart.GenerateChart();

            scope.$watch('data', function (newValue, oldValue) {
                if (newValue) {
                    chart.SetData(scope.data);
                    $rootScope.$broadcast("dataChanged");
                    chart.Draw(attrs.transition);
                    $rootScope.$broadcast("drawComplete");
                }
            });

            scope.$on("windowResized", function () {
                chart.Draw(800);
            })

            transclude(scope, function (clone) {
                element.append(clone);
            });
        },
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            var chartObject;

            this.GenerateChart = function () {
                // create svg $scope
                var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

                if ($scope.width)
                    svg.setAttribute('width', $scope.width);
                else
                    svg.setAttribute('width', '100%');

                if ($scope.height)
                    svg.setAttribute('height', $scope.height);
                else
                    svg.setAttribute('height', '100%');

                $element.append(svg);

                //binding resize directive to parent to capture resize event
                var resizeTemplate = '<resize></resize>';
                $compile(resizeTemplate)($scope);
                $element.append(resizeTemplate);

                // create the dimple chart using the d3 selection of our <svg> element
                chartObject = new dimple.chart(d3.select(svg));

                // auto style
                chartObject.noFormats = $attrs.autoStyle === 'false' ? true : false;

                if ($attrs.margin)
                    chartObject.setMargins($attrs.margin);
                else
                    chartObject.setMargins("60px", "30px", "110px", "70px");
            }

            this.SetData = function (data) {
                chartObject.data = data;
            }

            this.GetChartObject = function () {
                return chartObject;
            }

            this.Draw = function (transition) {
                chartObject.draw(transition || 800);
            }

            this.FilterData = function (filter, field) {
                // apply filters
                if (typeof filter === 'string') {
                    if ((filter !== undefined || filter !== '') && filter.indexOf(':') !== -1) {
                        var filterData = filter.split(':');
                        var field = filterData[0];
                        var value = [filterData[1]];

                        chartObject.data = dimple.filterData($scope.data, field, value);
                        chartObject.draw(800);
                    } else if (filter.indexOf(':') === -1) {
                        chartObject.data = dimple.filterData($scope.data, field, filter);
                        chartObject.draw(800);
                    }
                } else if (Array.isArray(filter)) {
                    chartObject.data = dimple.filterData($scope.data, field, filter);
                    chartObject.draw(800);
                }
            }

            this.GetUniqueValues = function (fields) {
                return dimple.getUniqueValues($scope.data, fields);
            }
        }]
    };
});
