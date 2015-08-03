rcDimple.factory('ChartProperties', [function () {

    var factory = {};

    factory.Properties = function () {
        this.Chart = {
            ShowAxes: null,
            ShowX: null,
            ShowY1: null,
            ShowY2: null,
            ShowAxisTitles: null,
            ShowXTitle: null,
            ShowY1Title: null,
            ShowY2Title: null,
            ShowChartTitle: null,
            ShowDataLabels: null,
            ShowValues: null,
            ShowSeriesName: null,
            ShowCategoryName: null,
            ShowDataTable: null,
            ShowGridLines: null,
            ShowLegend: null,
            ShowAnimations: null,
            ChartName: null
        };

        this.Axes = {
            XAxisName: null,
            ShowXAxisLine: null,
            xTextDirection: null,
            XAxisPrefix: null,
            XAxisSuffix: null,
            XAxisSort: null,
            Y1AxisName: null,
            Y1TargetLine: null,
            Y1Min: null,
            Y1Max: null,
            Y1MajorInterval: null,
            ShowY1AxisLine: null,
            Y1AxisPrefix: null,
            Y1AxisSuffix: null,
            Y2AxisName: null,
            Y2TargetLine: null,
            Y2Min: null,
            Y2Max: null,
            Y2MajorInterval: null,
            ShowY2AxisLine: null,
            Y2AxisPrefix: null,
            Y2AxisSuffix: null,
            ZAxisName: null,
            ZAxisMin: null,
            ZAxisMax: null
        };

        this.Legend = {
            LegendPosition: null,
            EnableClick: false
        };

        this.Series = {}; // will be a key value pair, where key is series name and value will be an object of Series class.
        this.Category = {}; // will be a key value pair, where key is category name and value will be an object of Category class.
        this.Data = []; // array of Data calss object.
    }

    factory.Series = function () {
        this.SeriesColor = null;
        this.SeriesDisplayAs = null;
        this.SeriesYAxis = null;
        this.SeriesDataPrefix = '';
        this.SeriesDataSuffix = '';
        this.HighlightDataGreaterThan = null;
        this.HighlightDataLessThan = null;
        this.HighlightLastPointIf = null;
    }

    factory.Category = function () {
        //        this.CategoryName = '';
        this.CategoryColor = null;
        this.CategoryAnnotation = null;
        this.ColorThreshold = null;
    }

    factory.Data = function () {
        this.SeriesName = '';
        this.CategoryName = null;
        this.DataPointColor = null;
        this.DataPointAnnotation = null;
        this.ShowLabel = null;
    }

    return factory;
}]);
