rcDimple.directive('chart', ["$rootScope", "$compile", "$window", function ($rootScope, $compile, $window) {
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
                    chart.DataChanged = true;
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
                this.ChartObject = new dimple.chart(d3.select(svg));

                // auto style
                this.ChartObject.noFormats = $attrs.autoStyle === 'false' ? true : false;

                if ($attrs.margin)
                    this.ChartObject.setMargins($attrs.margin);
                else
                    this.ChartObject.setMargins("60px", "30px", "110px", "70px");
            }

            this.SetData = function (data) {
                this.ChartObject.data = data;
            }

            this.GetChartObject = function () {
                return this.ChartObject;
            }

            this.Draw = function (transition, noDataChange) {
                this.ChartObject.draw(transition, noDataChange);
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
                        this.Draw(800);
                    } else if (filter.indexOf(':') === -1) {
                        this.ChartObject.data = dimple.filterData($scope.data, field, filter);
                        this.Draw(800);
                    }
                } else if (Array.isArray(filter)) {
                    this.ChartObject.data = dimple.filterData($scope.data, field, filter);
                    this.Draw(800);
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

                var noDataChange = this.ChartResized ? true : false;
                this.Draw($attrs.transition, noDataChange);
                for (var event in this.Events)
                    if (typeof this.Events[event] === 'function')
                        this.Events[event](this.ChartObject);
            }

            this.Resize = function () {
                if (childrenToTrack.length > 0) {
                    for (var id in childrenToTrack)
                        children[childrenToTrack[id]] = false;
                    this.ChartResized = true;
                } else
                    this.Draw($attrs.transition);
            }
        }]
    };
 }]);
