define(function (require) {
    let view = require('libraries/v');
    let list = require('libraries/list');
    var viewTpl = require("text!../templates/header/header.html");
    let header = view.extend({
        additionalEvents: {
            "click #logout": "logout"
        },
        logout: function () {
            this.database.createTable("user", this.utils.fields['user'], function () { }, true);
            window.location.href = "#login";
        },
        el: '.main_header',
        render: function () {
            this.$el.html(viewTpl);
        }
    });
    return header;
});