define(function (require) {
    var m = require("libraries/m");
    var accounts = m.extend({
        module: "Accounts",
        endPoint: "getNewModel"
    });
    return accounts; 
});
