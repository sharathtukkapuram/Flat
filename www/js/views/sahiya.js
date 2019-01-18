define(function (require) {
    var view = require('libraries/v');
    var lview = require('libraries/list');
    var c = require('collections/sahiya');
    var sftemplate = require('text!../templates/searchForm/form.html');
    var list = lview.extend({
        additionalEvents: {
            "click .table_row": "sahiyaRecord"
        },
        sahiyaRecord: function (e) {
            let id = this.$el.find($(e.target)).closest("tr").attr("id");
            this.utils.router.app_router.navigate('Sahiya/record/' + id, { trigger: true });
        },
    });
    var sahiya = view.extend({
        el: ".main",
        collection: new c(),
        initialize: function () {
            sahiya.__super__.initialize.apply(this, arguments);
        },
        additionalEvents: {
            "change #cluster": "populateUnit",
            "click #search": "search"
        },
        populateUnit: function (e) {
            let cluster = this.$el.find(e.target).val();
            var doc = this.$el.find('#units').html('');
            doc.append('<option value=""></option>');
            var count = 0;
            _.each(this.utils.user.geodata[cluster].units, function (v, i) {
                doc.append('<option value="' + i + '">' + v.name + '</option>');
                count = count + 1;
            });
            if (count == 1) {
                doc.find("option").eq(0).prop("selected", true);
            }
        },
        search: function () {
            let where = {
                clustid: this.$el.find("#cluster").val()
            };
            let unit = this.$el.find("#units").val();
            if (unit != "") {
                where["unitid"] = unit;
            }
            let model = this.collection.where(where);
            let coll = new c(model);
            if (!_.isEmpty(self.lv)) {
                this.lv.remove();
            }
            this.lv = new list({ headers: { name: "Name", education_level: "Education", anm_incharge: "Incharge", name_of_tola: "Tola" }, collection: coll, title: "Sahiya", el: ".list", initialLoad: false });
            this.lv.render();
        },
        afterRender: function () {
            if (this.$el.find("#cluster").find("option").length == 1) {
                this.$el.find("#cluster").find("option").eq(0).prop("selected", true);
                this.$el.find("#cluster").trigger("change");
                this.$el.find("#cluster").prop("disabled", true);
            }
            if (this.$el.find("#units").find("option").length == 1) {
                this.$el.find("#units").find("option").eq(0).prop("selected", true);
                this.$el.find("#units").trigger("change");
                this.$el.find("#units").prop("disabled", true);
            } else {
                this.$el.find("#units").prop("disabled", false);
            }
        },
        insertRecords: function (data) {
            var self = this;
            if (data.dropTable) {
                self.database.createTable("sahiya", this.utils.fields['sahiya'], function (res) { }, true);
            } else {
                self.database.createTable("sahiya", this.utils.fields['sahiya'], function () { }, false);
            }
            this.collection.forEach(function (model) {
                model.set("updated", "0");
            });
            self.database.insertData(this.collection.toJSON(), 'sahiya', function (res) {
                console.log('insert - ');
                console.log(res);
            });
        },
        getRecords: function () {
            var self = this;
            this.utils.checkInternet({
                success: function (res) {
                    if (res) {
                        self.collection.fetch({
                            type: "POST",
                            data: {
                                userid: self.utils.user.id
                                // userid: 1
                            },
                            success: function (res) {
                                self.utils.loader.hide();
                                self.insertRecords({ dropTable: true });
                            }
                        });
                    } else {
                        self.database.select(self.utils.fields['sahiya']);
                        self.database.table("sahiya");
                        self.database.execute(function (res) {
                            self.collection.reset();
                            for (i = 0; i < res.rows.length; i++) {
                                let d = {
                                    "id": res.rows.item(i).id,
                                    "unique_id": res.rows.item(i).unique_id,
                                    "name": res.rows.item(i).name,
                                    "unitname": res.rows.item(i).unitname,
                                    "unitid": res.rows.item(i).unitid,
                                    "clustid": res.rows.item(i).clustid,
                                    "phone": res.rows.item(i).phone,
                                    "name_of_tola": res.rows.item(i).name_of_tola,
                                    "health_sub_center": res.rows.item(i).health_sub_center,
                                    "education_level": res.rows.item(i).education_level,
                                    "caste": res.rows.item(i).caste,
                                    "anm_incharge": res.rows.item(i).anm_incharge,
                                    "aadhar_no": res.rows.item(i).aadhar_no,
                                    "bank_account": res.rows.item(i).bank_account,
                                    "updated": res.rows.item(i).updated
                                };
                                self.collection.add(d);
                            }
                        });
                    }
                }
            });
        },
        syncRecords: function () {
            this.utils.loader.show();
            var arr = [];
            var self = this;
            self.database.createTable("sahiya", this.utils.fields['sahiya'], function () { }, false);
            self.database.select(this.utils.fields['sahiya']);
            self.database.table("sahiya");
            self.database.where("AND", "updated", "1");
            self.database.execute(function (res) {
                if (res.rows.length > 0) {
                    for (i = 0; i < res.rows.length; i++) {
                        let d = {
                            "id": res.rows.item(i).id,
                            "unique_id": res.rows.item(i).unique_id,
                            "name": res.rows.item(i).name,
                            "unitname": res.rows.item(i).unitname,
                            "unitid": res.rows.item(i).unitid,
                            "clustid": res.rows.item(i).clustid,
                            "phone": res.rows.item(i).phone,
                            "name_of_tola": res.rows.item(i).name_of_tola,
                            "health_sub_center": res.rows.item(i).health_sub_center,
                            "education_level": res.rows.item(i).education_level,
                            "caste": res.rows.item(i).caste,
                            "anm_incharge": res.rows.item(i).anm_incharge,
                            "aadhar_no": res.rows.item(i).aadhar_no,
                            "bank_account": res.rows.item(i).bank_account,
                            "updated": res.rows.item(i).updated
                        };
                        arr[arr.length] = d;
                    }
                    self.utils.checkInternet({
                        success: function (res) {
                            if (res) {
                                let coll = new c();
                                coll.endPoint = "msahiya/massupdate";
                                self.utils.loader.show();
                                coll.fetch({
                                    type: "POST", data: JSON.stringify(arr), success: function (res) {
                                        self.utils.loader.hide();
                                        self.getRecords();
                                    },
                                    error: function (res, err) {
                                        self.utils.loader.hide();
                                        self.alert.error("Error has occured while Updating old data. Please try again");
                                        // self.database.alert(err);
                                    }
                                });
                            } else {
                                self.getRecords();
                            }
                        }
                    });
                } else {
                    self.utils.loader.hide();
                    self.getRecords();
                }
            });
        },
        render: function () {
            this.utils.loader.hide();
            let sfTpl = _.template(sftemplate);
            this.$el.html(sfTpl({}));
            this.afterRender();
            this.syncRecords(); // synchronizes records and also gets new records
        }
    });
    return sahiya;
});