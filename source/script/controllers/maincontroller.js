rcDimple.controller("MainController", function ($scope, $location, $timeout) {

    $scope.data;

    $scope.ddff = ['sadas', 'asdasd'];

    d3.tsv("../data/data.tsv", function (data) {
        //        $scope.data = data;
        //
        //        $scope.$apply();
        var svg = dimple.newSvg("#chartContainer2");
        var barData = dimple.filterData(data, "Owner", ["Aperture", "Rekall"]);
        var lineData = dimple.filterData(data, "Owner", ["Black Mesa", "LexCorp", "MomCorp", "Stark Ind", "Tyrell Corp", "Wayne Ent"]);

        var myChart = new dimple.chart(svg, data);
        //myChart.setBounds(60, 30, 500, 330);

        var x = myChart.addCategoryAxis("x", "Month");
        var y = myChart.addMeasureAxis("y", "Unit Sales");
        var y2 = myChart.addMeasureAxis("y", "Sales Value");

        var bar = myChart.addSeries("Owner", dimple.plot.bar, [x, y2]);
        bar.data = barData;

        var line = myChart.addSeries("Owner", dimple.plot.line, [x, y]);
        line.data = lineData;

        myChart.addLegend(200, 10, 360, 20, "right");
        myChart.draw();
    });
});
