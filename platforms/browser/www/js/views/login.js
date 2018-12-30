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
            if (this.model.get('user_name') == "Admin" && this.model.get('user_password') == "Admin") {
                window.Veon["user"] = response;
                window.Veon.router.app_router.navigate("home", { trigger: true });
            } else {
                this.alert.error("Login Failed. Please check Username and Password");
            }
        },
        login: function () {
            console.log(this.model);
            // this.model.set("id", "login");
            // this.model.url = this.utils.url + "../backEnd/login";
            // this.model.save({}, { error: this.showErrors, success: this.success });

        },
        render: function () {
            this.utils.loader.hide();
            var self = this;
            $(".main_header").html("");
            $("#sidebar").html("");
            var tpl = _.template(template);
            self.$el.html(tpl({}));
            let window_height = ($(window).height() - $('#loginForm').height()) / 3;
            this.$el.find('.login_div').css({ "margin-top": window_height });
        }
    });
    return login;
});