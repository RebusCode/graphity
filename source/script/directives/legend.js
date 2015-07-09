rcDimple.directive('legend', ['d3', 'dimple', function (d3, dimple) {
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
            chart.RegisterToParent(scope.$id, true);

            function addLegend() {
                var left = attrs.left ? attrs.left : "10%";
                var top = attrs.top ? attrs.top : "5%";
                var height = attrs.height ? attrs.height : "20%";
                var width = attrs.width ? attrs.width : "80%";
                var position = attrs.position ? attrs.position : 'right';
                var legends = chart.ChartObject.addLegend(left, top, width, height, position);

                if (scope.enableClick)
                    chart.Events.onLegendClick = addOnClick;
            }

            function addOnClick(chartObject) {
                var legends = chart.ChartObject.legends[0];

                chart.ChartObject.legends = [];
                // Get a unique list
                var filterValues = dimple.getUniqueValues(chart.ChartObject.data, scope.field);
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

            function removeLegends() {
                chart.ChartObject.svg
                    .selectAll(".dimple-legend")
                    .remove();
            }

            scope.$watch(function () {
                    return chart.DataChanged;
                },
                function (newVal) {
                    if (newVal === true) {
                        addLegend();
                        chart.BindComplete(scope.$id);
                    }
                });

            scope.$watch(function () {
                    return chart.ChartResized;
                },
                function (newVal) {
                    if (newVal === true) {
                        removeLegends();
                        addLegend();
                        chart.BindComplete(scope.$id);
                    }
                });

        }
    };
}])
