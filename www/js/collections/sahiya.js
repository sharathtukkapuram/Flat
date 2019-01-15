define(function (require) {
    let c = require("libraries/c");
    let sahiya = c.extend({
        endPoint: "msahiya/list",
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
    return sahiya;
});