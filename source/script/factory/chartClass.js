//rcDimple.factory('ChartClass', ['d3', 'dimple', function (d3, dimple) {
//
//    var ChartClass = function (data, height, width, element, attrs) {
//        this.ChartObject = {};
//
//        this.GenerateChart = function () {
//            // create svg $scope
//            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//
//            if (width)
//                svg.setAttribute('width', width);
//            else
//                svg.setAttribute('width', '100%');
//
//            if (height)
//                svg.setAttribute('height', height);
//            else
//                svg.setAttribute('height', '100%');
//
//            element.append(svg);
//
//            // create the dimple chart using the d3 selection of our <svg> element
//            this.ChartObject = new dimple.chart(d3.select(svg));
//
//            // auto style
//            this.ChartObject.noFormats = attrs.autoStyle === 'false' ? true : false;
//
//            if (attrs.margin)
//                this.ChartObject.setMargins(attrs.margin);
//            else
//                this.ChartObject.setMargins("60px", "30px", "110px", "70px");
//        }
//
//        this.SetData = function (dataToUpdate) {
//            data = dataToUpdate;
//            this.ChartObject.data = dataToUpdate;
//        }
//
//        this.GetChartObject = function () {
//            return this.ChartObject;
//        }
//
//        this.Draw = function (transition, noDataChange) {
//            this.ChartObject.draw(transition || 800, noDataChange);
//        }
//
//        this.FilterData = function (filter, field) {
//            // apply filters
//            if (typeof filter === 'string') {
//                if ((filter !== undefined || filter !== '') && filter.indexOf(':') !== -1) {
//                    var filterData = filter.split(':');
//                    var field = filterData[0];
//                    var value = [filterData[1]];
//
//                    this.ChartObject.data = dimple.filterData(data, field, value);
//                    this.ChartObject.draw(800);
//                } else if (filter.indexOf(':') === -1) {
//                    this.ChartObject.data = dimple.filterData(data, field, filter);
//                    this.ChartObject.draw(800);
//                }
//            } else if (Array.isArray(filter)) {
//                this.ChartObject.data = dimple.filterData(data, field, filter);
//                this.ChartObject.draw(800);
//            }
//        }
//
//        this.GetUniqueValues = function (fields) {
//            return dimple.getUniqueValues(data, fields);
//        }
//    }
//
//    return ChartClass;
//}]);
//

//var ChartClass = function (data, height, width, element, attrs) {
//    this.ChartObject = {};
//
//    dimple = new dimpleClass(d3);
//
//    this.GenerateChart = function () {
//        // create svg $scope
//        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//
//        if (width)
//            svg.setAttribute('width', width);
//        else
//            svg.setAttribute('width', '100%');
//
//        if (height)
//            svg.setAttribute('height', height);
//        else
//            svg.setAttribute('height', '100%');
//
//        element.append(svg);
//
//        // create the dimple chart using the d3 selection of our <svg> element
//        this.ChartObject = new dimple.chart(d3.select(svg));
//
//        // auto style
//        this.ChartObject.noFormats = attrs.autoStyle === 'false' ? true : false;
//
//        if (attrs.margin)
//            this.ChartObject.setMargins(attrs.margin);
//        else
//            this.ChartObject.setMargins("60px", "30px", "110px", "70px");
//    }
//
//    this.SetData = function (dataToUpdate) {
//        data = dataToUpdate;
//        this.ChartObject.data = dataToUpdate;
//    }
//
//    this.GetChartObject = function () {
//        return this.ChartObject;
//    }
//
//    this.Draw = function (transition, noDataChange) {
//        this.ChartObject.draw(transition || 800, noDataChange);
//    }
//
//    this.FilterData = function (filter, field) {
//        // apply filters
//        if (typeof filter === 'string') {
//            if ((filter !== undefined || filter !== '') && filter.indexOf(':') !== -1) {
//                var filterData = filter.split(':');
//                var field = filterData[0];
//                var value = [filterData[1]];
//
//                this.ChartObject.data = dimple.filterData(data, field, value);
//                this.ChartObject.draw(800);
//            } else if (filter.indexOf(':') === -1) {
//                this.ChartObject.data = dimple.filterData(data, field, filter);
//                this.ChartObject.draw(800);
//            }
//        } else if (Array.isArray(filter)) {
//            this.ChartObject.data = dimple.filterData(data, field, filter);
//            this.ChartObject.draw(800);
//        }
//    }
//
//    this.GetUniqueValues = function (fields) {
//        return dimple.getUniqueValues(data, fields);
//    }
//}

function ChartClass(data, height, width, element, attrs) {
    this.ChartObject = new Object();

    this.GenerateChart = function () {
        // create svg $scope
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        if (width)
            svg.setAttribute('width', width);
        else
            svg.setAttribute('width', '100%');

        if (height)
            svg.setAttribute('height', height);
        else
            svg.setAttribute('height', '100%');

        element.append(svg);

        // create the dimple chart using the d3 selection of our <svg> element
        this.ChartObject = new dimple.chart(d3.select(svg));

        // auto style
        this.ChartObject.noFormats = attrs.autoStyle === 'false' ? true : false;

        if (attrs.margin)
            this.ChartObject.setMargins(attrs.margin);
        else
            this.ChartObject.setMargins("60px", "30px", "110px", "70px");
    }

    this.SetData = function (dataToUpdate) {
        data = dataToUpdate;
        this.ChartObject.data = dataToUpdate;
    }

    this.GetChartObject = function () {
        return this.ChartObject;
    }

    this.Draw = function (transition, noDataChange) {
        this.ChartObject.draw(transition || 800, noDataChange);
    }

    this.FilterData = function (filter, field) {
        // apply filters
        if (typeof filter === 'string') {
            if ((filter !== undefined || filter !== '') && filter.indexOf(':') !== -1) {
                var filterData = filter.split(':');
                var field = filterData[0];
                var value = [filterData[1]];

                this.ChartObject.data = dimple.filterData(data, field, value);
                this.ChartObject.draw(800);
            } else if (filter.indexOf(':') === -1) {
                this.ChartObject.data = dimple.filterData(data, field, filter);
                this.ChartObject.draw(800);
            }
        } else if (Array.isArray(filter)) {
            this.ChartObject.data = dimple.filterData(data, field, filter);
            this.ChartObject.draw(800);
        }
    }

    this.GetUniqueValues = function (fields) {
        return dimple.getUniqueValues(data, fields);
    }
}
