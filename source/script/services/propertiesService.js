rcDimple.service('PropertiesService', ['ChartProperties', 'enums', function (ChartProperties, enums) {
    //public function(s)
    return {
        GetDefaultProperties: function (chartType) {
            switch (chartType) {
            case enums.ChartType.Line:
                return lineChartProperties();
            case enums.ChartType.Trend:
                return trendChartProperties();
            case enums.ChartType.Bar:
                return barChartProperties();
            case enums.ChartType.Column:
                return columnChartProperties();
            }
        },

        OverwriteDefaultProperties: function (defaultProperties, userProperties) {
            var properties = angular.copy(defaultProperties);

            if (userProperties)
                for (var property in properties) {
                    if (property === 'Series' || property === 'Category' || property === 'Data')
                        properties[property] = userProperties[property];
                    else {
                        for (var subProperty in property)
                            properties[property][subProperty] = userProperties[property][subProperty];
                    }
                }

            return properties;
        },

        String: {
            IsUndefinedOrEmptyOrNull: function (stringValue) {
                if (stringValue === undefined || stringValue === "" || stringValue === null || stringValue === 'null')
                    return true;
                return false;
            }
        }
    }

    //private function(s)
    {
        function lineChartProperties() {
            var properties = new ChartProperties.Properties();
            //Set Chart Properties
            properties.Chart.ShowAxes = true;
            properties.Chart.ShowX = true;
            properties.Chart.ShowY1 = true;
            properties.Chart.ShowY2 = false;
            properties.Chart.ShowAxisTitles = true;
            properties.Chart.ShowXTitle = true;
            properties.Chart.ShowY1Title = true;
            properties.Chart.ShowY2Title = false;
            properties.Chart.ShowChartTitle = true;
            properties.Chart.ShowDataLabels = false;
            properties.Chart.ShowValues = false;
            properties.Chart.ShowSeriesName = false;
            properties.Chart.ShowCategoryName = false;
            properties.Chart.ShowDataTable = true;
            properties.Chart.ShowGridLines = true;
            properties.Chart.ShowLegend = true;
            properties.Chart.ShowAnimations = true;

            // Set Axes Properties
            properties.Axes.XAxisName = "X-Axis";
            properties.Axes.ShowXAxisLine = true;
            properties.Axes.xTextDirection = 90;
            properties.Axes.XAxisSort = "Default";
            properties.Axes.Y1AxisName = "Y-Axis";
            properties.Axes.ShowY1AxisLine = true;

            //set legend properties
            properties.Legend.LegendPosition = "bottom";
            return properties;
        }

        function trendChartProperties() {
            var properties = new ChartProperties.Properties();
            //Set Chart Properties
            properties.Chart.ShowAxes = true;
            properties.Chart.ShowX = true;
            properties.Chart.ShowY1 = true;
            properties.Chart.ShowY2 = false;
            properties.Chart.ShowAxisTitles = true;
            properties.Chart.ShowXTitle = true;
            properties.Chart.ShowY1Title = true;
            properties.Chart.ShowY2Title = false;
            properties.Chart.ShowChartTitle = true;
            properties.Chart.ShowDataLabels = false;
            properties.Chart.ShowValues = false;
            properties.Chart.ShowSeriesName = false;
            properties.Chart.ShowCategoryName = false;
            properties.Chart.ShowDataTable = true;
            properties.Chart.ShowGridLines = true;
            properties.Chart.ShowLegend = true;
            properties.Chart.ShowAnimations = true;

            // Set Axes Properties
            properties.Axes.XAxisName = "X-Axis";
            properties.Axes.ShowXAxisLine = true;
            properties.Axes.xTextDirection = 90;
            properties.Axes.Y1AxisName = "Y-Axis";

            //set legend properties
            properties.Legend.LegendPosition = "bottom";
            return properties;
        }

        function barChartProperties() {
            var properties = new ChartProperties.Properties();
            //Set Chart Properties
            properties.Chart.ShowAxes = true;
            properties.Chart.ShowX = true;
            properties.Chart.ShowY1 = true;
            properties.Chart.ShowY2 = false;
            properties.Chart.ShowAxisTitles = true;
            properties.Chart.ShowXTitle = true;
            properties.Chart.ShowY1Title = true;
            properties.Chart.ShowY2Title = false;
            properties.Chart.ShowChartTitle = true;
            properties.Chart.ShowDataLabels = false;
            properties.Chart.ShowValues = false;
            properties.Chart.ShowSeriesName = false;
            properties.Chart.ShowCategoryName = false;
            properties.Chart.ShowDataTable = true;
            properties.Chart.ShowGridLines = true;
            properties.Chart.ShowLegend = true;
            properties.Chart.ShowAnimations = true;

            // Set Axes Properties
            properties.Axes.XAxisName = "X-Axis";
            properties.Axes.ShowXAxisLine = true;
            properties.Axes.xTextDirection = 90;
            properties.Axes.XAxisSort = "Default";
            properties.Axes.Y1AxisName = "Y-Axis";

            //set legend properties
            properties.Legend.LegendPosition = "bottom";
            return properties;
        }

        function columnChartProperties() {
            var properties = new ChartProperties.Properties();
            //Set Chart Properties
            properties.Chart.ShowAxes = true;
            properties.Chart.ShowX = true;
            properties.Chart.ShowY1 = true;
            properties.Chart.ShowY2 = false;
            properties.Chart.ShowAxisTitles = true;
            properties.Chart.ShowXTitle = true;
            properties.Chart.ShowY1Title = true;
            properties.Chart.ShowY2Title = false;
            properties.Chart.ShowChartTitle = true;
            properties.Chart.ShowDataLabels = false;
            properties.Chart.ShowValues = false;
            properties.Chart.ShowSeriesName = false;
            properties.Chart.ShowCategoryName = false;
            properties.Chart.ShowDataTable = true;
            properties.Chart.ShowGridLines = true;
            properties.Chart.ShowLegend = true;
            properties.Chart.ShowAnimations = true;

            // Set Axes Properties
            properties.Axes.XAxisName = "X-Axis";
            properties.Axes.ShowXAxisLine = true;
            properties.Axes.xTextDirection = 90;
            properties.Axes.XAxisSort = "Default";
            properties.Axes.Y1AxisName = "Y-Axis";

            //set legend properties
            properties.Legend.LegendPosition = "Bottom";
            return properties;
        }
    }

}]);
