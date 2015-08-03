rcDimple.directive('chart', ["$window", function ($window) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=',
            distributedData: '=',
            height: '@',
            width: '@',
            transition: '@',
            title: '@',
            draw: '@',
            color: '=' //should be an object with key as series name and value as color to assign ( example : {'Hypermarkets':'red', 'Supermarkets' : '#FFDAB9'})
        },
        require: ['chart'],
        transclude: true,
        link: function (scope, element, attrs, controllers, transclude) {
            var chart = controllers[0];
            //chart.GenerateChart();

            scope.$watch('data', function (newValue, oldValue) {
                if (newValue && newValue !== oldValue && newValue.length > 0) {
                    chart.SetData(scope.data);
                    chart.Draw(0);
                }
            });

            scope.$watch('draw', function (newValue, oldValue) {
                if (newValue && newValue === 'true') {
                    chart.ChartObject = {};
                    chart.GenerateChart();
                    chart.DataChanged = true;
                    scope.draw = false;
                }
            });

            angular.element($window).on('resize', function (e) {
                chart.Resize();
                scope.$apply();
            });

            transclude(scope, function (clone) {
                element.append(clone);
            });
        },
        controller: ['$scope', '$element', '$attrs', 'd3', 'dimple', function ($scope, $element, $attrs, d3, dimple) {
            //Private variables
            var children = {},
                childrenToTrack = [];

            //Public variables
            this.ChartObject = {};
            this.DataChanged = false;
            this.ChartResized = false;
            this.Events = {};
            this.Margin = {
                left: '60px',
                top: '30px',
                right: '110px',
                bottom: '70px',
            };

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

                $element.parent().append(svg);

                // create the dimple chart using the d3 selection of our <svg> element
                var d3Svg = d3.select(svg);
                this.ChartObject = new dimple.chart(d3Svg);
                if ($scope.title && $scope.title != "") {
                    d3Svg.append("text")
                        .attr("x", this.ChartObject._xPixels() + this.ChartObject._widthPixels() / 2)
                        .attr("y", this.ChartObject._yPixels())
                        .style("text-anchor", "middle")
                        .style("font-family", "sans-serif")
                        .style("font-weight", "bold")
                        .text($scope.title);
                }
                // auto style
                this.ChartObject.noFormats = $attrs.autoStyle === 'false' ? true : false;
                //
                //                if ($attrs.margin)
                //                    this.ChartObject.setMargins($attrs.margin);
                //                else
                // this.ChartObject.setMargins("100px", "30px", "110px", "200px");
                this.ChartObject.setMargins("60px", "30px", "110px", "20%,70px");
            }

            this.SetData = function (data) {
                this.ChartObject.data = data;
            }

            this.SetOptions = function (options) {
                this.ChartObject.options = options;
            }

            this.GetChartObject = function () {
                return this.ChartObject;
            }

            this.Draw = function (transition, noDataChange) {
                this.ChartObject.draw(CheckNumber($scope.transition), noDataChange);
                this.DataChanged = false;
                this.ChartResized = false;
            }

            this.FilterData = function (filter, field) {
                // apply filters
                if (typeof filter === 'string') {
                    if ((filter !== undefined || filter !== '') && filter.indexOf(':') !== -1) {
                        var filterData = filter.split(':');
                        var field = filterData[0];
                        var value = [filterData[1]];

                        this.ChartObject.data = dimple.filterData($scope.data, field, value);
                        this.Draw();
                    } else if (filter.indexOf(':') === -1 && filter.indexOf('!') === -1) {
                        this.ChartObject.data = dimple.filterData($scope.data, field, filter);
                        this.Draw();
                    }
                } else if (Array.isArray(filter)) {
                    this.ChartObject.data = dimple.filterData($scope.data, field, filter);
                    this.Draw();
                }
            }

            this.GetUniqueValues = function (fields) {
                return dimple.getUniqueValues($scope.data, fields);
            }

            this.RegisterToParent = function (childId, trackOnResize) {
                trackOnResize = trackOnResize || false;
                children[childId] = false;
                if (trackOnResize)
                    childrenToTrack.push(childId);
            }

            this.BindComplete = function (childId) {
                children[childId] = true;
                for (var id in children)
                    if (children[id] === false)
                        return;

                this.BindColors();
                var noDataChange = this.ChartResized ? true : false;
                this.Draw($attrs.transition, noDataChange);
                for (var id in this.Events)
                    for (var event in this.Events[id])
                        if (typeof this.Events[id][event] === 'function')
                            this.Events[id][event](this.ChartObject);
            }

            this.Resize = function () {
                if (childrenToTrack.length > 0) {
                    for (var id in childrenToTrack)
                        children[childrenToTrack[id]] = false;
                    this.ChartResized = true;
                } else
                    this.Draw($attrs.transition);
            }

            this.String = {
                IsUndefinedOrEmptyOrNull: function (stringValue) {
                    if (stringValue === undefined || stringValue === "" || stringValue === null || stringValue === 'null')
                        return true;
                    return false;
                }
            }

            this.BindColors = function () {
                if ($scope.color && Object.keys($scope.color).length > 0)
                    for (var series in $scope.color)
                        this.ChartObject.assignColor(series, $scope.color[series]);
            }
        }]
    }
}]);
