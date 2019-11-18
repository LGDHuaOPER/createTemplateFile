var isString = require('./isString.js');

module.exports = function (array) {
    if (Array.isArray(array)) {
        var result = {};
        var stringToBooleanOrString = function (str) {
            if (!isString(str)) return false;
            if (str === '') return false;
            if ((/^true$/).test(str) || (/^TRUE$/).test(str) || (/^True$/).test(str)) return true;
            if ((/^false$/).test(str) || (/^FALSE$/).test(str) || (/^False$/).test(str)) return false;
            return str;
        };
        array.forEach(function (item, index) {
            if (item.trim() === '') return
            var arr = item.split('=');
            if (arr.length > 1) {
                result[arr[0].replace(/^\-+/, '')] = stringToBooleanOrString(arr[1]);
            } else {
                result[item.replace(/^\-+/, '')] = true;
            }
        });
        return result;
    } else {
        return {};
    }
};