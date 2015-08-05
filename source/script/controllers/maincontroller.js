rcDimple.controller("MainController", ['$scope', '$location', '$timeout', 'ChartProperties', 'enums', function ($scope, $location, $timeout, ChartProperties, enums) {

    $scope.ChartType = enums.ChartType.Line;
    $scope.seriesValue = 'Owner';

    $scope.Change = function () {
        $scope.seriesValue = 'Channel';

    }

    $scope.ChartTypes = [
        {
            key: enums.ChartType.Line,
            value: 'Line'
                    },
        {
            key: enums.ChartType.Trend,
            value: 'Trend'
                    },
        {
            key: enums.ChartType.Bar,
            value: 'Bar'
                    },
        {
            key: enums.ChartType.StackedBar,
            value: 'StackedBar'
                    },
        {
            key: enums.ChartType.Column,
            value: 'Column'
                    },
        {
            key: enums.ChartType.StackedColumn,
            value: 'StackedColumn'
                    },
        {
            key: enums.ChartType.Area,
            value: 'Area'
                    },
        {
            key: enums.ChartType.Bubble,
            value: 'Bubble'
                    },
        {
            key: enums.ChartType.Scatter,
            value: 'Scatter'
                    }

                ];

    $scope.sdfg = {};
    $scope.sdfg[2] = {};
    $scope.sdfg[2][4] = {
        data: []
    }

    $scope.ddfgh = {};

    $scope.sdfg[2][4].data = ['asd', 'asd'];

    $scope.options = new ChartProperties.Properties();
    $scope.options.Chart.ShowChartTitle = true;
    $scope.options.Chart.ChartName = "Line Chart 1";
    $scope.options.Chart.ShowAnimations = false;
    $scope.options.Chart.ShowY2 = true;
    $scope.options.Axes.Y2AxisPrefix = '$ ';
    $scope.options.Axes.Y1AxisPrefix = '$er ';
    $scope.options.Axes.ShowY2AxisLine = true;
    $scope.options.Legend.LegendPosition = "left";
    //    $scope.options.Axes.xTextDirection = "0";

    //    $scope.options.Axes.Y1Max = 10000;
    //    $scope.options.Axes.Y1Min = 0;
    //    $scope.options.Axes.Y1MajorInterval = 10;

    $scope.Series1 = new ChartProperties.Series();
    $scope.Series1.SeriesColor = "green";
    $scope.Series1.SeriesDisplayAs = enums.ChartType.StackedColumn;
    $scope.Series1.SeriesYAxis = enums.YAxes.Y2;
    $scope.Series1.SeriesDataPrefix = "rcp ";
    $scope.Series1.SeriesDataSuffix = " rcs";
    $scope.options.Series["Aperture"] = $scope.Series1;

    $scope.Series2 = new ChartProperties.Series();
    $scope.Series2.SeriesColor = "yellow";
    $scope.Series2.SeriesDisplayAs = enums.ChartType.StackedColumn;
    $scope.Series2.SeriesYAxis = enums.YAxes.Y2;
    $scope.Series2.SeriesDataPrefix = "rcp ";
    $scope.Series2.SeriesDataSuffix = " rcs";
    $scope.options.Series["Rekall"] = $scope.Series2;
    //$scope.options.Series["Supermarkets"] = $scope.Series1;
    $scope.fields = {};
    $scope.fields.x = ['Month'];
    $scope.fields.y1 = ['Sales Value'];
    $scope.fields.y2 = ['Pack Size'];
    $scope.series = ['Channel'];

    $scope.distributeData = {};
    $scope.seriesColors = {};

    $scope.data = [];
    d3.tsv("../data/data.tsv", function (data) {
        $scope.data = data;

        $scope.$apply();
        //        var svg = dimple.newSvg("#chartContainer2");
        //        //            var barData = dimple.filterData($scope.data, "Owner", ["Aperture", "Rekall"]);
        //        //            var lineData = dimple.filterData($scope.data, "Owner", ["Black Mesa", "LexCorp", "MomCorp", "Stark Ind", "Tyrell Corp", "Wayne Ent"]);
        //
        //        var myChart = new dimple.chart(svg, data);
        //        //myChart.setBounds(60, 30, 500, 330);
        //
        //        var x = myChart.addCategoryAxis("x", "Month");
        //        var y = myChart.addMeasureAxis("y", "Unit Sales");
        //        //            var y2 = myChart.addMeasureAxis("y", "Sales Value");
        //
        //        //            var bar = myChart.addSeries("Owner", dimple.plot.bar, [x, y2]);
        //        //            bar.data = barData;
        //
        //        var line = myChart.addSeries("Owner", dimple.plot.line);
        //        //            line.data = lineData;
        //
        //        myChart.addLegend(200, 10, 360, 20, "right");
        //        myChart.draw();
    });

    //    $scope.$watch('data', function (newVal) {
    //        if (newVal && newVal.length > 0) {
    //            //            var barData = dimple.filterData($scope.data, "Owner", ["Aperture", "Rekall"]);
    //            //            var lineData = dimple.filterData($scope.data, "Owner", ["Black Mesa", "LexCorp", "MomCorp", "Stark Ind", "Tyrell Corp", "Wayne Ent"]);
    //            //
    //            //            $scope.distributeData['8@2'] = barData;
    //            //            $scope.distributeData['1@1'] = lineData;
    //
    //            //            $scope.$apply();
    //
    //        }
    //    })
}]);
