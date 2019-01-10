define(function (require) {
    let view = require('libraries/v');
    var header = require("text!../templates/list/header.html");
    var row = require("text!../templates/list/row.html");
    var list = view.extend({
        initialize: function () {
            var self = this;
            list.__super__.initialize.apply(this, arguments);
            if (this.initialLoad == undefined || this.initialLoad) {
                this.utils.checkInternet({
                    success: function (res) {
                        if (res) {
                            self.getDatafromServer();
                        } else {
                            self.getDatafromLocal();
                        }
                    }
                });
            }
        },
        table: "",
        headers: {},
        getDatafromServer: function () {
            if (_.isEmpty(this.collection)) {
                return;
            }
            this.searchFromServer();
        },
        searchFromServer: function () {
            var self = this;
            this.collection.fetch({
                type: "POST", data: this.filter,
                success: function (coll) {
                    self.render();
                }
            });
        },
        getDatafromLocal: function () {
            if (_.isEmpty(this.table)) {
                throw 'Table not defined';
            }
            var self = this;
            this.database.select(['*']);
            this.database.table(this.table);
            this.database.execute(function (res) {
                for (i = 0; i < res.rows.length; i++) {
                    self.collection.add(res.rows.item(i));
                }
                self.render();
            });
        },
        loadHeaders: true,
        render: function () {
            if (this.collection.length > 0) {
                if (this.loadHeaders) {
                    if (!_.isEmpty(this.title)) {
                        this.$el.html('<div class="row"><p class="title">' + this.title + '</p></div>');
                    }
                    let headerTpl = _.template(header);
                    this.$el.append(headerTpl({ headers: this.headers }));
                    this.loadHeaders = false;
                }
                let rowTpl = _.template(row);
                this.$el.find('tbody').append(rowTpl({ rows: this.collection.toJSON(), headers: this.headers }));
            } else {
                this.$el.html('No records found!!');
            }
        }
    });
    return list;
});