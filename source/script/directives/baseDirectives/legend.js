rcDimple.directive('legend', ['d3', 'dimple', function (d3, dimple) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            enableClick: '@',
            field: '@'
        },
        require: ['^chart'],
        link: function (scope, element, attrs, controllers) {
            var chart = controllers[0];
            chart.RegisterToParent(scope.$id, true);
            chart.Events[scope.$id] = {};

            function addLegend() {
                var x = attrs.x ? attrs.x : "10%";
                var y = attrs.y ? attrs.y : "5%";
                var height = attrs.height ? attrs.height : "100%";
                var width = attrs.width ? attrs.width : "10%";
                var position = attrs.position ? attrs.position : 'right';
                //var legend = calculateLegend('right');
                var legends = chart.ChartObject.addLegend(x, y, width, height, position);

                if (scope.enableClick)
                    chart.Events[scope.$id].onLegendClick = addOnClick;
            }

            function addOnClick() {
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

            function calculateLegend(position) {
                var legend = {
                    x: 0,
                    y: 0,
                    height: 0,
                    width: 0
                }
                switch (position.toLowerCase()) {
                case 'bottom':
                    legend.x = 0;
                    legend.y = 300; //height of svg
                    legend.height = '10%';
                    legend.width = "100%";
                    break;
                case 'top':
                    legend.x = 0;
                    legend.y = 0; //height of svg
                    legend.height = '10%';
                    legend.width = "100%";
                    break;
                case 'right':
                    legend.x = 1200;
                    legend.y = 0; //height of svg
                    legend.height = '100%';
                    legend.width = "10%";
                    break;
                case 'left':
                    legend.x = '20%,60px';
                    legend.y = 0; //height of svg
                    legend.height = '100%';
                    legend.width = "10%";
                    break;
                }
                return legend;
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
