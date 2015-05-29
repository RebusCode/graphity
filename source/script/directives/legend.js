rcDimple.directive('legend', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            enableClick: '=',
            field: '@'
        },
        require: ['^chart'],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            var chartObject = chart.GetChartObject();

            function addLegend() {
                var left = attrs.left ? attrs.left : "-100px";
                var top = attrs.top ? attrs.top : "30px";
                var height = attrs.height ? attrs.height : "-70px";
                var width = attrs.width ? attrs.width : "100px";
                var position = attrs.position ? attrs.position : 'right';
                var legends = chartObject.addLegend(left, top, width, height, position);

                if (scope.enableClick)
                    chart.onLegendClick = addOnClick;
            }

            function addOnClick(legends) {
                chartObject.legends = [];
                // Get a unique list
                var filterValues = dimple.getUniqueValues(chartObject.data, scope.field);
                // Get all the rectangles from our now orphaned legend
                legends.shapes.selectAll("rect")
                    // Add a click event to each rectangle
                    .on("click", function (e) {
                        // This indicates whether the item is already visible or not
                        var hide = false;
                        var newFilters = [];
                        // If the filters contain the clicked shape hide it
                        filterValues.forEach(function (f) {
                            if (f === e.aggField.slice(-1)[0]) {
                                hide = true;
                            } else {
                                newFilters.push(f);
                            }
                        });
                        // Hide the shape or show it
                        if (hide) {
                            d3.select(this).style("opacity", 0.2);
                        } else {
                            newFilters.push(e.aggField.slice(-1)[0]);
                            d3.select(this).style("opacity", 0.8);
                        }
                        // Update the filters
                        filterValues = newFilters;
                        // Filter the data
                        chart.FilterData(filterValues, scope.field);
                    });
            }

            scope.$on("dataChanged", function () {
                addLegend();
            })
        }
    };
})
