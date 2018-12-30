/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(function (require) {
    var template = require('text!../templates/login/login.html');
    var View = require('../libraries/v');
    var login = View.extend({
        el: '.main',
        initialize: function () {
            login.__super__.initialize.apply(this, arguments);
        },
        additionalEvents: {
            "click #login_button": "login"
        },
        success: function (model, response, options) {
            window.Veon["user"] = response;
            window.Veon.router.app_router.navigate("home", {trigger: true});
        },
        login: function () {
            this.model.set("id", "login");
            this.model.url = "../backEnd/login";
            this.model.save({}, {error: this.showErrors, success: this.success});
        },
        render: function () {
            this.utils.loader.hide();
            var self = this;
            $.post("../backEnd/login/authenticate", function (res) {
                if (!res.status) {
                    $(".main_header").html("");
                    $("#sidebar").html("");
                    var tpl = _.template(template);
                    self.$el.html(tpl({}));
                } else {
                    window.location.href = "#home";
                }
            });
        }
    });
    return login;
});