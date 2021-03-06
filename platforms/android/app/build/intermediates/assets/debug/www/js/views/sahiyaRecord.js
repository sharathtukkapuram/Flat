define(function (require) {
    let v = require("libraries/v");
    var model = require("libraries/m");
    var template = require('text!../templates/Record/sahiya.html');
    var record = v.extend({
        el: ".main",
        initialize: function () {
            record.__super__.initialize.apply(this, arguments);
        },
        additionalEvents: {
            "click #save": "save",
            "click #cancel": "cancel"
        },
        cancel: function () {
            this.utils.router.app_router.navigate('Sahiya', { trigger: true });
        },
        save: function () {
            var self = this;
            this.model.set('updated', "1");
            this.utils.loader.show();
            // alert(this.model.get('id'));
            self.utils.loader.hide();
            this.database.updateData(this.model.toJSON(), "sahiya", { id: this.model.get('id') }, function (res) {
                self.alert.success("Successfully saved. Pushing to server...");
                self.pushToServer();
                self.utils.loader.hide();
            });
        },
        pushToServer: function () {
            var self = this;
            this.utils.checkInternet({
                success: function (res) {
                    if (res) {
                        self.model.endPoint = "msahiya/update";
                        self.utils.loader.show();
                        self.model.altPostSave({
                            data: self.model.toJSON(), self: self, success: function (model, self, response) {
                                // self.database.alert(response);
                                self.alert.success("Successfully pushed to server");
                                self.utils.router.app_router.navigate('Sahiya', { trigger: true });
                                self.utils.loader.hide();
                            }
                        });
                    } else {
                        self.alert.error("Device offline.");
                        self.utils.router.app_router.navigate('Sahiya', { trigger: true });
                    }
                }
            });
        },
        model: new model(),
        render: function () {
            if (this.id == undefined && this.id == "") {
                return;
            }
            var self = this;
            this.database.select(this.utils.fields['sahiya']);
            this.database.table("sahiya");
            this.database.where("AND", "id", this.id);
            this.database.execute(function (res) {
                if (res.rows.length > 0) {
                    let row = res.rows.item(0);
                    // self.database.alert(row);
                    _.each(row, function (v, i) {
                        self.model.set(i, v);
                    });
                    let tpl = _.template(template);
                    self.$el.html(tpl({ model: self.model }));
                } else {
                    // self.alert.error("no record found");
                }
            });

        }
    });
    return record;
});