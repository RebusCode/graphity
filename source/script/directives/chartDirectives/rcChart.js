rcDimple.directive('rcChart', ['$compile', '$filter', function ($compile, $filter) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data: '=',
            series: '@',
            category: '@',
            y: '@',
            y2: '@',
            z: '@',
            chartProperties: '=',
            chartType: '@'
        },
        require: ['rcChart'],
        transclude: true,
        link: function (scope, element, attrs, controllers, transclude) {
            var rcChartCtrl = controllers[0],
                dynamicHtml = null;

            scope.chartDraw = false;

            scope.$watchCollection('[data, series, category, y, y2, z, chartProperties, chartType]', function (newValue, oldValue) {
                if (newValue !== oldValue && newValue[0].length > 0) {
                    bindChart();
                }
            }, true);

            transclude(scope, function (clone) {
                element.append(clone);
            });

            function bindChart() {
                rcChartCtrl.ChartElements = {
                    xAxis: null,
                    yAxis: null,
                    y2Axis: null,
                    zAxis: null,
                    series: []
                };
                dynamicHtml = rcChartCtrl.CreateDynamicHtml();

                if (Object.keys(rcChartCtrl.ErrorList).length === 0) {
                    element.empty();
                    element.append(dynamicHtml);
                    $compile(element.contents())(scope);
                    scope.chartDraw = true;
                }
            }
        },
        controller: ['$scope', '$element', '$attrs', '$filter', 'PropertiesService', 'enums', 'dimple', function ($scope, $element, $attrs, $filter, PropertiesService, enums, dimple) {
            $scope.distributeData = {};

            this.ErrorList = {};
            this.ChartElements = {
                xAxis: null,
                yAxis: null,
                y2Axis: null,
                zAxis: null,
                series: []
            };

            var properties = PropertiesService.GetDefaultProperties(CheckNumber($scope.chartType))
            properties = PropertiesService.OverwriteDefaultProperties(properties, $scope.chartProperties);

            this.CreateDynamicHtml = function () {
                var distributedSeries = filterSeries(),
                    html = null,
                    seriesValue = PropertiesService.String.IsUndefinedOrEmptyOrNull($scope.series) ? null : $scope.series;

                if (Object.keys(distributedSeries).length > 0) {
                    $scope.distributeData = {};
                    var dataLeft = angular.copy($scope.data),
                        uniqueValues = dimple.getUniqueValues($scope.data, seriesValue);

                    html = this.GetChart(false);
                    for (var charttype in distributedSeries)
                        for (var axis in distributedSeries[charttype])
                            if (distributedSeries[charttype][axis].length > 0) {
                                var seriesToProcess = distributedSeries[charttype][axis];
                                if (containsInArray(uniqueValues, seriesToProcess)) {
                                    var toRemoveIndexes = [],
                                        dataToProcess = $filter('filter')(dataLeft, function (value, index) {
                                            if (seriesToProcess.indexOf(value[seriesValue]) !== -1) {
                                                toRemoveIndexes.push(index);
                                                return value;
                                            }
                                        })

                                    if (toRemoveIndexes.length > 0)
                                        for (var index in toRemoveIndexes)
                                            dataLeft.splice(toRemoveIndexes[index] - index, 1);
                                    if (dataToProcess.length > 0)
                                        this.GenerateHTML(charttype, seriesValue, axis, dataToProcess);
                                }
                            }
                    if (dataLeft.length > 0)
                        this.GenerateHTML($scope.chartType, seriesValue, null, dataLeft);

                } else {
                    html = this.GetChart(true);
                    this.GenerateHTML($scope.chartType, seriesValue, null);
                }

                $scope.seriesColors = getColors();
                html.attr('color', 'seriesColors');

                for (var key in this.ChartElements) {
                    if (key === 'series') {
                        if (this.ChartElements[key].length > 0)
                            for (var index = this.ChartElements[key].length; index >= 0; index--)
                                html.append(this.ChartElements[key][index]);
                    } else {
                        if (this.ChartElements[key] !== null)
                            html.append(this.ChartElements[key]);
                    }
                }
                if (seriesValue)
                    html.append(this.GetLegend($scope.series));

                return html;
            }

            this.GenerateHTML = function (chatType, seriesValue, yaxis, data) {
                var elementKey = chatType + '@' + (yaxis === null ? enums.YAxes.Y : yaxis);
                if (data)
                    $scope.distributeData[elementKey] = data;
                else
                    elementKey = null;

                switch (CheckNumber(chatType)) {
                case enums.ChartType.Line:
                default:
                    this.ChartElements.series.push(this.GetLine(seriesValue, yaxis, elementKey));
                    break;

                case enums.ChartType.Trend:
                    this.ChartElements.xAxis = this.GetX($scope.category, enums.AxisType.time);
                    this.ChartElements.series.push(this.GetLine(seriesValue, yaxis, elementKey));
                    break;

                case enums.ChartType.Bar:
                    if (yaxis == enums.YAxes.Y2) {
                        this.ChartElements.xAxis = this.GetX($scope.y2, enums.AxisType.measure);
                        this.ChartElements.y2Axis = this.GetY2($scope.category, enums.AxisType.category);
                    } else {
                        this.ChartElements.xAxis = this.GetX($scope.y, enums.AxisType.measure);
                        this.ChartElements.yAxis = this.GetY($scope.category, enums.AxisType.category);
                    }
                    this.ChartElements.series.push(this.GetBar(seriesValue, yaxis, elementKey, enums.BarType.Grouped));
                    break;

                case enums.ChartType.StackedBar:
                    if (yaxis == enums.YAxes.Y2) {
                        this.ChartElements.xAxis = this.GetX($scope.y2, enums.AxisType.measure);
                        this.ChartElements.y2Axis = this.GetY2($scope.category, enums.AxisType.category);
                    } else {
                        this.ChartElements.xAxis = this.GetX($scope.y, enums.AxisType.measure);
                        this.ChartElements.yAxis = this.GetY($scope.category, enums.AxisType.category);
                    }
                    this.ChartElements.series.push(this.GetBar(seriesValue, yaxis, elementKey, enums.BarType.Stacked));
                    break;

                case enums.ChartType.Column:
                    this.ChartElements.series.push(this.GetBar(seriesValue, yaxis, elementKey, enums.BarType.Grouped));
                    break;

                case enums.ChartType.StackedColumn:
                    this.ChartElements.series.push(this.GetBar(seriesValue, yaxis, elementKey, enums.BarType.Stacked));
                    break;

                case enums.ChartType.Area:
                    this.ChartElements.series.push(this.GetArea(seriesValue, yaxis, elementKey));
                    break;

                case enums.ChartType.Bubble:
                    this.ChartElements.xAxis = this.GetX($scope.category, enums.AxisType.measure);
                    if (yaxis == enums.YAxes.Y2)
                        this.ChartElements.y2Axis = this.GetY2($scope.y2, enums.AxisType.measure);
                    else
                        this.ChartElements.yAxis = this.GetY($scope.y, enums.AxisType.measure);

                    if (this.ChartElements.zAxis === null)
                        this.ChartElements.zAxis = this.GetZ($scope.z);
                    this.ChartElements.series.push(this.GetBubble(seriesValue, yaxis, elementKey));
                    break;

                case enums.ChartType.Scatter:
                    this.ChartElements.xAxis = this.GetX($scope.category, enums.AxisType.measure);
                    if (yaxis == enums.YAxes.Y2)
                        this.ChartElements.y2Axis = this.GetY2($scope.y2, enums.AxisType.measure);
                    else
                        this.ChartElements.yAxis = this.GetY($scope.y, enums.AxisType.measure);
                    this.ChartElements.series.push(this.GetBubble(seriesValue, yaxis, elementKey));
                    break;
                }

                if (this.ChartElements.xAxis === null)
                    this.ChartElements.xAxis = this.GetX($scope.category);

                if ((yaxis == enums.YAxes.Y || yaxis == null) && this.ChartElements.yAxis === null)
                    this.ChartElements.yAxis = this.GetY($scope.y);

                if (yaxis == enums.YAxes.Y2 && this.ChartElements.y2Axis === null)
                    this.ChartElements.y2Axis = this.GetY2($scope.y2);
            }


            //all the public functions to draw a chart
            {
                this.GetChart = function (isData) {
                    var element = angular.element('<chart draw="{{chartDraw}}" ></chart>');
                    if (isData)
                        element.attr('data', 'data');
                    else
                        element.attr('distributed-data', 'distributeData');

                    if (properties.Chart.ShowAnimations)
                        element.attr('transition', "0");
                    else
                        element.attr('transition', "0");

                    if (properties.Chart.ShowChartTitle) {
                        if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(properties.Chart.ChartName))
                            element.attr('title', properties.Chart.ChartName);
                    }

                    return element;
                }

                this.GetX = function (field, measure) {
                    var element = null;
                    if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(field)) {
                        element = angular.element('<x></x>');
                        element.attr('field', field);

                        if (measure)
                            element.attr('type', measure);

                        if (properties.Axes.xTextDirection)
                            element.attr('text-direction', properties.Axes.xTextDirection);

                        if (properties.Chart.ShowAxisTitles && properties.Chart.ShowXTitle)
                            element.attr('title', properties.XAxisName);

                        if (properties.Chart.ShowAxes && properties.Chart.ShowX)
                            element.attr('show-axis', properties.Axes.ShowX);

                        if (properties.Chart.ShowAxes && properties.Axes.XAxisPrefix)
                            element.attr('prefix', properties.Axes.XAxisPrefix);

                        if (properties.Chart.ShowAxes && properties.Axes.XAxisPrefix)
                            element.attr('suffix', properties.Axes.XAxisSuffix);
                    } else {
                        if (!this.ErrorList.hasOwnProperty('X'))
                            this.ErrorList['X'] = [];
                        this.ErrorList['X'].push('x field configured incorrectlly');
                    }

                    return element;
                }

                this.GetY = function (field, measure) {
                    var element = null;
                    if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(field)) {
                        element = angular.element('<y></y>');
                        element.attr('field', field);

                        if (measure)
                            element.attr('type', measure);

                        if (properties.Chart.ShowGridLines == true)
                            element.attr('show-grid-lines', properties.Chart.ShowGridLines);

                        if (properties.Axes.Y1Max)
                            element.attr('max', properties.Axes.Y1Max);

                        if (properties.Axes.Y1Min)
                            element.attr('min', properties.Axes.Y1Min);

                        if (properties.Axes.Y1MajorInterval)
                            element.attr('major-interval', properties.Axes.Y1MajorInterval);

                        if (properties.Axes.Y1AxisPrefix)
                            element.attr('prefix', properties.Axes.Y1AxisPrefix);

                        if (properties.Axes.Y1AxisPrefix)
                            element.attr('suffix', properties.Axes.Y1AxisSuffix);

                        if (properties.Chart.ShowAxes && properties.Chart.ShowY1)
                            element.attr('show-axis', properties.Axes.ShowY1);

                        if (properties.Chart.ShowAxisTitles && properties.Chart.ShowY1Title)
                            element.attr('title', properties.Y1AxisName);
                    } else {
                        if (!this.ErrorList.hasOwnProperty('Y'))
                            this.ErrorList['Y'] = [];
                        this.ErrorList['Y'].push('Y field configured incorrectlly');
                    }

                    return element;
                }

                this.GetY2 = function (field, measure) {
                    var element = null;
                    if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(field)) {
                        element = angular.element('<y></y>');
                        element.attr('field', field);

                        if (measure)
                            element.attr('type', measure);

                        if (properties.Axes.Y2Max)
                            element.attr('max', properties.Axes.Y2Max);

                        if (properties.Axes.Y2Min)
                            element.attr('min', properties.Axes.Y2Min);

                        if (properties.Axes.Y2MajorInterval)
                            element.attr('major-interval', properties.Axes.Y2MajorInterval);

                        if (properties.Axes.Y2AxisPrefix)
                            element.attr('prefix', properties.Axes.Y2AxisPrefix);

                        if (properties.Chart.ShowAxes && properties.Chart.ShowY2)
                            element.attr('show-axis', properties.Axes.ShowY2);

                        if (properties.Chart.ShowAxisTitles && properties.Chart.ShowY2Title)
                            element.attr('title', properties.Y2AxisName);
                    } else {
                        if (!this.ErrorList.hasOwnProperty('Y2'))
                            this.ErrorList['Y2'] = [];
                        this.ErrorList['Y2'].push('Y2 field configured incorrectlly');
                    }

                    return element;
                }

                this.GetZ = function (field) {
                    var element = null;
                    if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(field)) {
                        element = angular.element('<z></z>');
                        element.attr('field', field);
                    }
                    return element;
                }

                this.GetLegend = function (field) {
                    var element = null;
                    if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(field)) {
                        element = angular.element('<legend></legend>');
                        element.attr('field', field);

                        if (properties.Legend.EnableClick)
                            element.attr('enable-click', properties.Legend.EnableClick);
                    } else {
                        if (!this.ErrorList.hasOwnProperty('legend'))
                            this.ErrorList['legend'] = [];
                        this.ErrorList['legend'].push('legend field configured incorrectlly');
                    }

                    return element;
                }

                this.GetLine = function (field, yaxis, elementName) {
                    var element = null;
                    if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(field)) {
                        element = angular.element('<line></line>');
                        element.attr('field', field);

                        var y = yaxis == 1 ? 'Y' : yaxis == 2 ? 'Y2' : 'Y';
                        yaxis = yaxis === null ? 1 : yaxis;

                        if (y != null)
                            if (!this.ErrorList.hasOwnProperty(y)) {
                                element.attr('yaxis', yaxis);
                            } else {
                                if (!this.ErrorList.hasOwnProperty('line'))
                                    this.ErrorList['line'] = [];
                                this.ErrorList['line'].push(y + ' axis configured incorrectlly');
                            }

                        if (elementName)
                            element.attr('data', "distributedData['" + elementName + "']");
                    } else {
                        if (!this.ErrorList.hasOwnProperty('line'))
                            this.ErrorList['line'] = [];
                        this.ErrorList['line'].push('line field configured incorrectlly');
                    }
                    return element;
                }

                this.GetArea = function (field, yaxis, elementName) {
                    var element = null;
                    if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(field)) {
                        element = angular.element('<area></area>');
                        element.attr('field', field);

                        var y = yaxis == 1 ? 'Y' : yaxis == 2 ? 'Y2' : 'Y';
                        yaxis = yaxis === null ? 1 : yaxis;

                        if (y != null)
                            if (!this.ErrorList.hasOwnProperty(y)) {
                                element.attr('yaxis', yaxis);
                            } else {
                                if (!this.ErrorList.hasOwnProperty('area'))
                                    this.ErrorList['area'] = [];
                                this.ErrorList['area'].push(y + ' axis configured incorrectlly');
                            }

                        if (elementName)
                            element.attr('data', "distributedData['" + elementName + "']");
                    } else {
                        if (!this.ErrorList.hasOwnProperty('area'))
                            this.ErrorList['area'] = [];
                        this.ErrorList['area'].push('area field configured incorrectlly');
                    }
                    return element;
                }

                this.GetBubble = function (field, yaxis, elementName) {
                    var element = null;
                    if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(field)) {
                        element = angular.element('<bubble></bubble>');
                        element.attr('field', field);

                        var y = yaxis == 1 ? 'Y' : yaxis == 2 ? 'Y2' : 'Y';
                        yaxis = yaxis === null ? 1 : yaxis;

                        if (y != null)
                            if (!this.ErrorList.hasOwnProperty(y)) {
                                element.attr('yaxis', yaxis);
                            } else {
                                if (!this.ErrorList.hasOwnProperty('bubble'))
                                    this.ErrorList['bubble'] = [];
                                this.ErrorList['bubble'].push(y + ' axis configured incorrectlly');
                            }

                        if (elementName)
                            element.attr('data', "distributedData['" + elementName + "']");
                    } else {
                        if (!this.ErrorList.hasOwnProperty('bubble'))
                            this.ErrorList['bubble'] = [];
                        this.ErrorList['bubble'].push('bubble field configured incorrectlly');
                    }
                    return element;
                }

                this.GetBar = function (field, yaxis, elementName, barType) {
                    var element = null;
                    if (!PropertiesService.String.IsUndefinedOrEmptyOrNull(field)) {
                        element = angular.element('<bar></bar>');
                        element.attr('field', field);

                        var y = yaxis == 1 ? 'Y' : yaxis == 2 ? 'Y2' : 'Y';
                        yaxis = yaxis === null ? 1 : yaxis;

                        if (y != null)
                            if (!this.ErrorList.hasOwnProperty(y)) {
                                element.attr('yaxis', yaxis);
                            } else {
                                if (!this.ErrorList.hasOwnProperty('bar'))
                                    this.ErrorList['bar'] = [];
                                this.ErrorList['bar'].push(y + ' axis configured incorrectlly');
                            }

                        if (elementName)
                            element.attr('data', "distributedData['" + elementName + "']");

                        if (barType)
                            element.attr('type', barType);

                    } else {
                        if (!this.ErrorList.hasOwnProperty('bar'))
                            this.ErrorList['bar'] = [];
                        this.ErrorList['bar'].push('bar field configured incorrectlly');
                    }
                    return element;
                }
            }

            //Private functions
            function filterSeries() {
                var chartWiseSeries = {},
                    chartType;
                for (var seriesName in properties.Series)
                    if (properties.Series[seriesName].SeriesDisplayAs && !isNaN(chartType = CheckNumber(properties.Series[seriesName].SeriesDisplayAs)) && $scope.chartType != chartType && properties.Series[seriesName].SeriesYAxis !== enums.YAxes.Y) {
                        if (!chartWiseSeries.hasOwnProperty(chartType)) {
                            chartWiseSeries[chartType] = {};
                            chartWiseSeries[chartType][enums.YAxes.Y] = [];
                            chartWiseSeries[chartType][enums.YAxes.Y2] = [];
                        }

                        var yAxis = isNaN(CheckNumber(properties.Series[seriesName].SeriesYAxis)) ? enums.YAxes.Y : properties.Series[seriesName].SeriesYAxis;
                        chartWiseSeries[chartType][yAxis].push(seriesName);
                    }

                return chartWiseSeries;
            }

            function getColors() {
                var colors = {};
                for (var seriesName in properties.Series)
                    if (properties.Series[seriesName].SeriesColor != null)
                        colors[seriesName] = properties.Series[seriesName].SeriesColor;
                return colors;
            }

            function containsInArray(sourceArray, toCompareArray) {
                for (var index in toCompareArray)
                    if (sourceArray.indexOf(toCompareArray[index]) >= 0)
                        return true;

                return false;
            }

        }]
    }
}]);
