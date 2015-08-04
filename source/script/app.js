var rcDimple = angular.module('rcDimple', ['d3js', 'dimplejs']);

function CheckNumber(value) {
    if (value) {
        if (typeof (value) === 'number')
            return value;
        else
            return parseFloat(value);
    } else
        return NaN;
}
