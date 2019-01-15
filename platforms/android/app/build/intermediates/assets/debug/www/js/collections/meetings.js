define(function (require) {
    let c = require("libraries/c");
    let home = c.extend({
        endPoint: "mevent/list",
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