rcDimple.controller("MainController", function ($scope, $location, $timeout) {

    $scope.data;

    d3.tsv("../data/data.tsv", function (data) {
        $scope.data = data;

        $scope.$apply();
    });
});
