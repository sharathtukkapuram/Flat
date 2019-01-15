define(function (require) {
    let view = require('libraries/v');
    let list = require('libraries/list');
    let tempC = require('libraries/c');
    var c = require('collections/home');
    var sftemplate = require('text!../templates/home.html');
    var listView = list.extend({
        initialize: function (options) {
            listView.__super__.initialize.apply(this, arguments);
        }
    });
    var home = view.extend({
        el: '.main',
        additionalEvents: {
            "click #meetings": "meetings",
            "click #sahiya": "sahiya",
            "click #refresh": "refresh"
        },
        meetings: function () {
            this.utils.router.app_router.navigate('Meetings', { trigger: true });
        },
        sahiya: function () {
            this.utils.router.app_router.navigate('Sahiya', { trigger: true });
        },
        refresh: function () {
            this.render();
        },
        initialize: function (options) {
            home.__super__.initialize.apply(this, arguments);
        },
        collection: new c(),
        insertData: function (data) {
            var self = this;
            if (data.dropTable) {
                self.database.createTable("home", ["id", "data", "name"], function (res) { }, true);
            } else {
                self.database.createTable("home", ["id", "data", "name"], function () { }, false);
            }
            self.database.insertData(this.collection.toJSON(), 'home', function (res) {
                console.log('insert - ');
                console.log(res);
            });
        },
        loadDashboard: function () {
            let len = this.collection.length;
            if (len > 0) {
                // var html = "<div class='row'><div class='col-xs-4'><button id='meetings' class='btn btn-primary button'>Meetings</button></div><div class='col-xs-4'><button id='sahiya' class='btn btn-primary button'>Sahiya</button></div><div class='col-xs-4'><button id='refresh' class='btn btn-primary button'>Refresh</button></div></div><hr class='hr_line'><div class='row'><div class='col-sm-12'><h3><strong>" + this.utils.user.dashboard_title + "</strong><h3></div></div>";
                let tpl = _.template(sftemplate);
                var html = tpl({
                    utils: this.utils
                });
                for (i = 0; i < len; i++) {
                    if (i % 2 == 0) {
                        html = html + "<div class='row'>";
                    }
                    html = html + "<div class='col-sm-6'><div class='dashboard dashboard_" + i + "'></div></div><br>"
                    if (i % 2 == 1) {
                        html = html + "</div>";
                    }
                }
                this.$el.html(html);
                var i = 0;
                this.collection.forEach(function (model) {
                    let coll = new tempC(model.get("data"));
                    let lv = new listView({ headers: { meeting: "Meeting", Planned: "Planned", Complete: "Complete", Pending: "Pending", Reject: "Reject" }, collection: coll, title: model.get('name'), el: ".dashboard_" + i, initialLoad: false });
                    lv.render();
                    i = i + 1;
                });
            } else {
                this.$el.html("No records found!!");
            }
            this.utils.loader.hide();
        },
        render: function () {
            var self = this;
            this.$el.html();
            this.utils.loader.show();
            this.utils.checkInternet({
                success: function (res) {
                    if (res) {
                        // get data froom server and dump to database
                        self.utils.loader.show();
                        self.collection.fetch({
                            type: "POST",
                            data: {
                                // userid: self.utils.user.id
                                userid: 1
                            },
                            success: function (coll) {
                                self.insertData({ dropTable: true });
                                self.loadDashboard();
                                self.utils.loader.hide();
                            }
                        });
                    } else {
                        // get data from local
                        self.utils.loader.show();
                        self.database.select(['id', 'data', 'name']);
                        self.database.table('home');
                        self.database.execute(function (res) {
                            for (i = 0; i < res.rows.length; i++) {
                                let d = {
                                    id: res.rows.item(i).id,
                                    name: res.rows.item(i).name,
                                    data: JSON.parse(res.rows.item(i).data)
                                }
                                self.collection.add(d);
                            }
                            self.loadDashboard();
                            self.utils.loader.hide();
                        });
                    }
                    self.utils.loader.hide();
                }
            });
        }

    });
    return home;
});