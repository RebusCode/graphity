/* global rcDimple */
rcDimple.directive('lineChart', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            options: "=",
            data: "=",
            fields: "=",
            series: "=",
            category: "="
        },
        link: function (scope, element, attrs, controllers, transclude) {
            function initChart() {
                var chartElem = createChart();
                createAxes(chartElem);
                createLegend(chartElem);
                chartElem.append(controllers.createSeries(chartElem));
                chartElem.append('<line field="Channel"></line>'); //createSeries());
                element.append(chartElem);
                $compile(element.contents())(scope);
            }


            function createChart() {
                var chartElem = angular.element('<chart data="data" options="adjustOptions"></chart>');
                if (scope.options.Chart.ShowAnimations) {
                    chartElem.attr('transition', "800");
                } else {
                    chartElem.attr('transition', "0");
                }
                if (scope.options.Chart.ShowChartTitle) {
                    if (scope.options.Chart.ChartName != null && scope.options.Chart.ChartName != "")
                        chartElem.attr('title', scope.options.Chart.ChartName);
                }
                return chartElem;
            }

            function createAxes(chartElem) {
                if (scope.options.Chart.ShowAxes) {
                    if (scope.options.Chart.ShowX) {
                        var xAxisElem = angular.element('<x></x>');
                        if (scope.fields.x) {
                            xAxisElem.attr('field', '"' + scope.fields.x + '"'); //'xfield');
                        }
                        if (scope.options.Axes.xTextDirection) {
                            xAxisElem.attr('text-direction', scope.options.Axes.xTextDirection);
                        }

                        if (scope.options.Chart.ShowAxisTitles) {
                            if (scope.options.Chart.ShowXTitle) {
                                xAxisElem.attr('title', scope.options.Axes.XAxisName);
                            }
                        }
                        if (scope.options.Axes.ShowXAxisLine) {
                            xAxisElem.attr('show-line', scope.options.Axes.ShowXAxisLine);
                        }
                        chartElem.append(xAxisElem);
                    }
                    if (scope.options.Chart.ShowY1) {
                        var y1AxisElem = angular.element('<y></y>');
                        if (scope.fields.y1) {
                            y1AxisElem.attr('field', '"' + scope.fields.y1 + '"');
                        }
                        if (scope.options.Chart.ShowAxisTitles) {
                            if (scope.options.Chart.ShowY1Title) {
                                y1AxisElem.attr('title', scope.options.Axes.Y1AxisName);
                            }
                        }
                        if (scope.options.Axes.ShowXAxisLine) {
                            y1AxisElem.attr('show-line', scope.options.Axes.ShowY1AxisLine);
                        }
                        if (scope.options.Chart.ShowGridLines != undefined) {
                            y1AxisElem.attr('show-grid-lines', scope.options.Chart.ShowGridLines);
                        }
                        if (scope.options.Axes.Y1Max) {
                            y1AxisElem.attr('max', scope.options.Axes.Y1Max);
                        }
                        if (scope.options.Axes.Y1Min) {
                            y1AxisElem.attr('min', scope.options.Axes.Y1Min);
                        }
                        if (scope.options.Axes.Y1MajorInterval) {
                            y1AxisElem.attr('major-interval', scope.options.Axes.Y1MajorInterval);
                        }
                        if (scope.options.Axes.Y1AxisPrefix) {
                            y1AxisElem.attr('prefix', scope.options.Axes.Y1AxisPrefix);
                        }

                        chartElem.append(y1AxisElem);
                    }
                    if (scope.options.Chart.ShowY2) {
                        var y2AxisElem = angular.element('<y></y>');
                        if (scope.fields.y2) {
                            y2AxisElem.attr('field', '"' + scope.fields.y2 + '"');
                        }
                        if (scope.options.Chart.ShowAxisTitles) {
                            if (scope.options.Chart.ShowY2Title) {
                                y2AxisElem.attr('title', scope.options.Axes.Y2AxisName);
                            }
                        }
                        if (scope.options.Axes.ShowXAxisLine) {
                            y2AxisElem.attr('show-line', scope.options.Axes.ShowY2AxisLine);
                        }
                        if (scope.options.Axes.Y2Max) {
                            y2AxisElem.attr('max', scope.options.Axes.Y2Max);
                        }
                        if (scope.options.Axes.Y2Min) {
                            y2AxisElem.attr('min', scope.options.Axes.Y2Min);
                        }
                        if (scope.options.Axes.Y2MajorInterval) {
                            y2AxisElem.attr('major-interval', scope.options.Axes.Y2MajorInterval);
                        }
                        if (scope.options.Axes.Y2AxisPrefix) {
                            y2AxisElem.attr('prefix', scope.options.Axes.Y2AxisPrefix);
                        }
                        chartElem.append(y2AxisElem);
                    }
                }
            }

            function createLegend(chartElem) {
                if (scope.options.Chart.ShowLegend) {
                    var legendElem = angular.element('<legend enable-click = "true"></legend>');
                    legendElem.attr('field', 'legendArr');
                    if (scope.options.Legend.LegendPosition) {
                        legendElem.attr('position', scope.options.Legend.LegendPosition);
                    }
                    chartElem.append(legendElem);
                }

            }
            scope.$watch('data', function (newValue, oldValue) {
                if (newValue) {
                    controllers.SetData(scope.data);
                }
            });
            scope.$watch('options', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    controllers.SetUserOptions(scope.options);
                    controllers.AdjustProperties();
                    initChart();
                }
            }, true);

            controllers.SetUserOptions(scope.options);
            controllers.AdjustProperties();
            initChart();
            transclude(scope, function (clone) {
                element.append(clone)
            });

        },
        controller: ['$scope', 'DefaultProperties', 'DataService', 'dimple', function ($scope, DefaultProperties, DataService, dimple) {
            $scope.defaultOptions = DefaultProperties.GetDefaultChartProperties('LineChart');
            $scope.legendArr = ['Brand', 'Owner', 'Channel'];
            //            $scope.options = defaultOptions;
            this.SetData = function (data) {
                $scope.data = data;
            };
            this.SetUserOptions = function (options) {
                $scope.userOptions = options;
            }
            this.GetDefaultOptions = function () {
                return $scope.defaultOptions;
            }
            this.AdjustProperties = function () {
                $scope.adjustOptions = DataService.AdjustProperties($scope.userOptions, $scope.defaultOptions);
                $scope.options = $scope.adjustOptions;
            }
            this.createSeries = function (chartElement) {
                var seriesElement = angular.element('<series>'); //DataService.getSeriesElement('line');
                if ($scope.series != null) {
                    seriesElement.attr('field', $scope.series);
                }
                seriesElement.attr('type', 'line');
                var filters = [];
                angular.forEach($scope.options.Series, function (series, key) {
                    if (series && typeof series === "object") {
                        var filterSeriesElement = angular.element('<series>');
                        filterSeriesElement.attr('field', $scope.series);
                        filterSeriesElement.attr('filter', key);
                        if (series.SeriesColor)
                            filterSeriesElement.attr('color', series.SeriesColor);
                        if (series.SeriesDisplayAs)
                            filterSeriesElement.attr('type', series.SeriesDisplayAs);
                        if (series.SeriesYAxis)
                            filterSeriesElement.attr('yaxis', series.SeriesYAxis);
                        filters.push(key);
                        chartElement.append(filterSeriesElement);
                    }
                });
                seriesElement.attr('filter', "!" + filters);
                chartElement.append(seriesElement);
            }
        }]
    };
            }]);
