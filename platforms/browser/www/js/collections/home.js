define(function (require) {
    var c = require("libraries/c");
    var home = c.extend({
        endPoint: "mreport/dashboard",
        // parse: function (res) {
        //     var result = [];
        //     _.each(res, function (v, i) {
        //         result[i] = {
        //             id: v.name,
        //             data: v.data
        //         };
        //     });
        //     return result;
        // }
    });
    return home;
});