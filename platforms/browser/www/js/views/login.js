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
        success: function (model, self) {
            model.unset('user_name');
            model.unset('password');
            console.log('success', model);

            if (model.get('id') != "") {
                self.database.select(['id', 'description', 'login_status']);
                self.database.table('user');
                self.database.execute(function (res) {
                    if (res.rows.length > 0) {
                        let row = res.rows.item(0);
                        if (row.id != model.get('id')) {
                            self.database.createTable('user', ['id', 'description', 'login_status'], function (res) {
                                self.database.insertData([{ id: model.get('id'), description: model.toJSON(), login_status: "1" }], 'user', function (res) {
                                    console.log('insert', res);
                                }, true);
                            });
                            self.database.createTable('home', ['id', 'description'], function (res) {
                            }, true);
                        }
                    } else {
                        self.database.createTable('user', ['id', 'description', 'login_status'], function (res) {
                            self.database.insertData([{ id: model.get('id'), description: model.toJSON(), login_status: "1" }], 'user', function (res) {
                                console.log('insert', res);
                            }, true);
                        });
                    }
                });
                window.Veon.user = model.toJSON();
                self.utils.router.app_router.navigate('home', { trigger: true });
            } else {
                self.alert.error("Login Failed. Please check Username and Password");
            }
        },
        login: function () {
            this.model.set('id', 'login');
            this.model.url = this.utils.api_url + "mauth/authenticate";
            this.model.altPostSave({ error: this.showErrors, success: this.success, self: this });
        },
        render: function () {
            this.utils.loader.hide();
            var self = this;
            $(".main_header").html("");
            $("#sidebar").html("");
            this.database.select(['id', 'description', 'login_status']);
            this.database.table('user');
            this.database.where('AND', 'login_status', "1");
            this.database.execute(function (res) {
                if (res.rows.length > 0) {
                    let row = res.rows.item(0);
                    alert(row.description);
                    let data = JSON.parse(row.description);
                    _.each(data, function (v, i) {
                        self.model.set(i, v);
                    });
                    window.Veon.user = self.model.toJSON();
                    self.utils.router.app_router.navigate('home', { trigger: true });
                } else {
                    var tpl = _.template(template);
                    self.$el.html(tpl({}));
                }
            });
            let window_height = ($(window).height() - $('#loginForm').height()) / 3;
            this.$el.find('.login_div').css({ "margin-top": window_height });

        }
    });
    return login;
});