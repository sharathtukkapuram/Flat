/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(function (require) {
    var c = require("libraries/c");
    var accounts = c.extend({
        module: "Accounts",
        view: "list",

    });
    var map = c.extend({
        module: "Accounts",
        endPoint: "map",
    });
    var form = c.extend({
        module: "Accounts",
        endPoint: "getMeta",

    });
    return {view: accounts, form: form, map: map};
});