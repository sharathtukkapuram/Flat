/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(function (require) {
    var list = require("libraries/list");
    var v = require("libraries/v");
    var f = require("libraries/searchForm");
    var viewTpl = require("text!../templates/list/view.html");
    var ListView = list.extend({
        initialize: function (options) {
            this.add("limit", 50);
            if (!_.isEmpty(options.initial_filter)) {
                if (options.initial_filter == "Active") {
                    this.addFilter("status_active", "1");
                } else {
                    this.addFilter("status_active", "0");
                }
            }
            ListView.__super__.initialize.apply(this, arguments);
        },
        render: function () {
            ListView.__super__.render.apply(this, arguments);
        },

    });
    var searchFormView = f.extend({
         _bindChanges: function (e) {
            var field = $(e.target).attr("field");
            var location_val = 0;
            if (field == "cust_location") {
                if (this.$el.find(".zipcodelookup").length > 0) {
                    this.$el.find(".zipcodelookup").html("");
                }
                location_val = $("input[field='cust_location']").val();
                if ($.isNumeric(location_val) && location_val.length == 5) {
                    this.getZipCode(location_val);
                }
            }
            searchFormView.__super__._bindChanges.apply(this, arguments);
        },
        getZipCode: function (val) {
            this.zipColl = new location();
            let filters = {
                and: {
                    zip: val
                }
            }
            this.listenToOnce(this.zipColl, "reset", this.zipCodeRender);
            this.zipColl.fetch({reset: true, data: filters, type: "POST"});

        },
        zipCodeRender: function () {
            var loc = "<span>" + this.zipColl.models[0].get("city") + ", " + this.zipColl.models[0].get("state") + "</span>";
            if (this.$el.find(".zipcodelookup").length < 1) {
                this.$el.find("input[field=cust_location]").parent().append("<div class='zipcodelookup'></div>");
            }
            this.$el.find(".zipcodelookup").append(loc);
        }
    });
    var view = v.extend({
        initialize: function (options) {
            this.options = options;
            view.__super__.initialize.apply(this, arguments);
            if (!_.isEmpty(this.utils.lastView)) {
                this.utils[this.utils.lastView].remove();
            }
        },
        render: function () {
            this.setElement(".main");
            this.remove();
            this.$el.html(viewTpl);
            var lvc = require("collections/accounts");
            this.searchForm = new searchFormView({collection: new lvc.form(), el: ".search_form"});
            if (this.options == undefined) {
                this.lv = new ListView({collection: new lvc.view(), el: ".List", paginationTop: true, showCheckBox: true, actions_button: true, quickView: true});
            } else {
                this.lv = new ListView({collection: new lvc.view(), el: ".List", paginationTop: true, showCheckBox: true, actions_button: true, initial_filter: this.options.initial_filter, quickView: true});
            }
            this.searchForm.setListView(this.lv);
            this.searchForm.map = new map({el: ".map", collection: new lvc.map()});
            this.lv.render();
        },
        remove: function () {
            if (!_.isEmpty(this.lv)) {
                this.lv.remove();
                this.searchForm.remove();
            }
            view.__super__.remove.apply(this, arguments);
        }
    });
    return view;
});
