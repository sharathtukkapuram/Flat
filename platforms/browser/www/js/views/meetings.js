define(function (require) {
    var view = require('libraries/v');
    var lview = require('libraries/list');
    var c = require('collections/meetings');
    var sftemplate = require('text!../templates/searchForm/form.html');
    var list = lview.extend({
        additionalEvents: {
            "click .table_row": "meetingRecord"
        },
        meetingRecord: function (e) {
            let id = this.$el.find($(e.target)).closest("tr").attr("id");
            this.utils.router.app_router.navigate('Meetings/record/' + id, { trigger: true });
        },
    });
    var meetings = view.extend({
        el: ".main",
        collection: new c(),
        initialize: function () {
            meetings.__super__.initialize.apply(this, arguments);
        },
        additionalEvents: {
            "change #cluster": "populateUnit",
            "click #search": "search",
            "click #back": "home"
        },
        home: function () {
            this.utils.router.app_router.navigate('home', { trigger: true });
        },
        populateUnit: function (e) {
            var self = this;
            var cluster = this.$el.find(e.target).val();
            var doc = this.$el.find('#units').html('');
            doc.append('<option value=""></option>');
            var count = 0;
            var units = [];
            _.each(this.utils.user.geodata[cluster].units, function (v, i) {
                units[units.length] = v.name;
            });
            units.sort();
            _.each(units, function (name) {
                _.each(self.utils.user.geodata[cluster].units, function (v, i) {
                    if (name == v.name) {
                        doc.append('<option value="' + i + '">' + v.name + '</option>');
                        count = count + 1;
                    }
                });
            });
            if (count == 1) {
                doc.find("option").eq(0).prop("selected", true);
            }
        },
        search: function () {
            let where = {
                clusterid: this.$el.find("#cluster").val()
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
            this.lv = new list({ headers: { meetingName: "Meeting", factName: "Sahiya", factCode: "Sahiya Code", unitName: "Unit" }, collection: coll, title: "Events", el: ".list", initialLoad: false });
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
                self.database.createTable("meetings", ["id", "eventname", "scheduled_date", "actual_date", "event_status_id", "distName", "clusterid", "unitid", "unitName", "factName", "factCode", "meetingName", "status", "st", "sc", "others", "women", "under15", "men", "pregnant_women", "updated"], function (res) { }, true);
            } else {
                self.database.createTable("meetings", ["id", "eventname", "scheduled_date", "actual_date", "event_status_id", "distName", "clusterid", "unitid", "unitName", "factName", "factCode", "meetingName", "status", "st", "sc", "others", "women", "under15", "men", "pregnant_women", "updated"], function () { }, false);
            }
            this.collection.forEach(function (model) {
                model.set("updated", "0");
            });
            self.database.insertData(this.collection.toJSON(), 'meetings', function (res) {
                console.log('insert - ');
                console.log(res);
            });
        },
        getRecords: function () {
            var self = this;
            // alert("getRecords");
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
                                // self.database.alert(res);
                                if (_.isEmpty(res.message)) {
                                    self.insertRecords({ dropTable: true });
                                }
                            },
                            error: function (res) {
                                self.utils.loader.hide();
                                self.alert.error("Error has occured while fetching data. Please try again");
                                // self.database.alert(res);
                            }
                        });
                    } else {
                        // alert("database");

                        self.database.select(["id", "eventname", "scheduled_date", "actual_date", "event_status_id", "distName", "clusterid", "unitid", "unitName", "factName", "factCode", "meetingName", "status", "st", "sc", "others", "women", "under15", "men", "pregnant_women", "updated"]);
                        self.database.table("meetings");
                        self.database.execute(function (res) {
                            self.collection.reset();
                            for (i = 0; i < res.rows.length; i++) {
                                let d = {
                                    "id": res.rows.item(i).id,
                                    "eventname": res.rows.item(i).eventname,
                                    "scheduled_date": res.rows.item(i).scheduled_date,
                                    "actual_date": res.rows.item(i).actual_date,
                                    "event_status_id": res.rows.item(i).event_status_id,
                                    "distName": res.rows.item(i).distName,
                                    "clusterid": res.rows.item(i).clusterid,
                                    "unitid": res.rows.item(i).unitid,
                                    "unitName": res.rows.item(i).unitName,
                                    "factName": res.rows.item(i).factName,
                                    "factCode": res.rows.item(i).factCode,
                                    "meetingName": res.rows.item(i).meetingName,
                                    "status": res.rows.item(i).status,
                                    "st": res.rows.item(i).st,
                                    "sc": res.rows.item(i).sc,
                                    "others": res.rows.item(i).others,
                                    "women": res.rows.item(i).women,
                                    "under15": res.rows.item(i).under15,
                                    "men": res.rows.item(i).men,
                                    "pregnant_women": res.rows.item(i).pregnant_women,
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
            var arr = [];
            var self = this;
            self.database.createTable("meetings", ["id", "eventname", "scheduled_date", "actual_date", "event_status_id", "distName", "clusterid", "unitid", "unitName", "factName", "factCode", "meetingName", "status", "st", "sc", "others", "women", "under15", "men", "pregnant_women", "updated"], function () { }, false);

            self.database.select(["id", "eventname", "scheduled_date", "actual_date", "event_status_id", "distName", "clusterid", "unitid", "unitName", "factName", "factCode", "meetingName", "status", "st", "sc", "others", "women", "under15", "men", "pregnant_women", "updated"]);
            self.database.table("meetings");
            self.database.where("AND", "updated", "1");
            self.database.execute(function (res) {
                if (res.rows.length > 0) {
                    for (i = 0; i < res.rows.length; i++) {
                        let d = {
                            "id": res.rows.item(i).id,
                            "eventname": res.rows.item(i).eventname,
                            "scheduled_date": res.rows.item(i).scheduled_date,
                            "actual_date": res.rows.item(i).actual_date,
                            "event_status_id": res.rows.item(i).event_status_id,
                            "distName": res.rows.item(i).distName,
                            "clusterid": res.rows.item(i).clusterid,
                            "unitid": res.rows.item(i).unitid,
                            "unitName": res.rows.item(i).unitName,
                            "factName": res.rows.item(i).factName,
                            "factCode": res.rows.item(i).factCode,
                            "meetingName": res.rows.item(i).meetingName,
                            "status": res.rows.item(i).status,
                            "st": res.rows.item(i).st,
                            "sc": res.rows.item(i).sc,
                            "others": res.rows.item(i).others,
                            "women": res.rows.item(i).women,
                            "under15": res.rows.item(i).under15,
                            "men": res.rows.item(i).men,
                            "pregnant_women": res.rows.item(i).pregnant_women,
                            "updated": res.rows.item(i).updated
                        };
                        arr[arr.length] = d;
                    }
                    self.utils.checkInternet({
                        success: function (res) {
                            if (res) {
                                let coll = new c();
                                coll.endPoint = "mevent/massupdate";
                                self.utils.loader.show();
                                // self.database.alert(arr);
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
    return meetings;
});