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
            this.model.set('user_name', "");
            this.model.set('password', "");
        },
        additionalEvents: {
            "click #login_button": "login"
        },
        success: function (model, self, res) {
            if (model.get('id') != undefined && model.get('id') != "") {
                self.database.createTable('user', self.utils.fields['user'], function (res) { }, false);
                self.database.select(self.utils.fields['user']);
                self.database.table('user');
                self.database.execute(function (res) {
                    if (res.rows.length > 0) {
                        let row = res.rows.item(0);
                        if (row.id != model.get('id')) {
                            self.database.createTable('user', self.utils.fields['user'], function (res) {
                                self.database.insertData([{ id: model.get('id'), description: model.toJSON(), login_status: "1" }], 'user', function (res) {
                                    console.log('insert', res);
                                });
                            }, true);
                            self.database.createTable('meetings', self.utils.fields['meetings'], function (res) { }, true);
                            self.database.createTable('sahiya', self.utils.fields['sahiya'], function (res) { }, true);
                            self.database.createTable('home', self.utils.fields['home'], function (res) { }, true);
                        }
                    } else {
                        self.database.createTable('user', self.utils.fields['user'], function (res) {
                            self.database.insertData([{ id: model.get('id'), description: model.toJSON(), login_status: "1" }], 'user', function (res) {
                            });
                        }, true);
                    }
                });
                self.$el.html('');
                window.Veon.user = model.toJSON();
                window.localStorage.setItem("token_id", window.Veon.user.token);
                self.utils.router.app_router.navigate('home', { trigger: true });
                self.utils.loader.hide();
            } else {
                model.unset("message");
                self.utils.loader.hide();
                self.alert.error("Login Failed. Please check Username and Password");
            }
        },
        login: function () {
            if (this.model.get('user_name') == undefined || this.model.get('password') == undefined || this.model.get('user_name') == "" || this.model.get('password') == "") {
                this.alert.error("Please fill in the fields.");
                return;
            }
            var self = this;
            this.utils.loader.show();
            this.utils.checkInternet({
                success: function (res) {
                    if (res) {
                        self.model.endPoint = "mauth/authenticate";
                        self.model.altPostSave({ error: self.showErrors, success: self.success, self: self });
                    } else {
                        self.database.select(self.utils.fields['user']);
                        self.database.table('user');
                        self.database.where('AND', 'login_status', "0");
                        self.database.execute(function (res) {
                            if (res.rows.length > 0) {
                                let row = res.rows.item(0);
                                let data = JSON.parse(row.description);
                                if (data.user_name == self.model.get('user_name') && data.password == self.model.get('password')) {
                                    _.each(data, function (v, i) {
                                        self.model.set(i, v);
                                    });
                                    window.Veon.user = self.model.toJSON();
                                    self.utils.router.app_router.navigate('home', { trigger: true });
                                } else {
                                    self.alert.error("Login Failed. Please check Username and Password");
                                }
                                self.utils.loader.hide();
                            } else {
                                self.utils.loader.hide();
                                self.alert.error("Login Failed. Please check Username and Password");
                            }
                        });
                    }
                }
            });
        },
        render: function () {
            this.database.createTable('user', this.utils.fields['user'], function (res) {
            }, false);
            var self = this;
            $(".main_header").html("");
            $("#sidebar").html("");
            this.database.select(self.utils.fields['user']);
            this.database.table('user');
            this.database.where('AND', 'login_status', "1");
            this.database.execute(function (res) {
                if (res.rows.length > 0) {
                    let row = res.rows.item(0);
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
            this.utils.loader.hide();
        }
    });
    return login;
});