define(function (require) {
    var v = require("libraries/v");
    var mo = require("libraries/m");
    var list = require("libraries/list");
    // var bookmarkMod = require("models/Bookmark");
    // var bookmarkColl = require("collections/Bookmark");
    var formTpl = require("text!../templates/list/searchForm.html");
    var filterTpl = require("text!../templates/list/addFilters.html");
    var breadCrumbTpl = require("text!../templates/list/breadcrumbs.html");
    var m = new mo();
    var form = v.extend({
        initialize: function (options) {
            var self = this;
            _.each(options, function (v, i) {
                self[i] = v;
            });
            form.__super__.initialize.apply(this, arguments);
            this.listenTo(this.collection, 'reset', this.render);
            this.collection.fetch({reset: true, type: "POST", error: this.showErrors});
            this.form_unique = Math.floor(Math.random() * 1000);
            this.additionalEvents["click .form_" + this.form_unique + " .search"] = "search";
            this.additionalEvents["click .form_" + this.form_unique + " .clear"] = "clear";
            this.additionalEvents["click .form_" + this.form_unique + " .add_filters"] = "add_filters";
            this.additionalEvents["change .form_" + this.form_unique + " .filterSelect"] = "filterSelect";
            this.additionalEvents["click .form_" + this.form_unique + " .remove"] = "filterRemove";
            this.additionalEvents["click .form_" + this.form_unique + " .save_search"] = "saveSearch";
            this.additionalEvents["change .form_" + this.form_unique + " .searchedVal"] = "populateSearchedField";
            this.undelegateEvents();
            this.delegateEvents();
        },
        saveSearch: function () {
            var self = this;
            // if (!_.isEmpty(this.$el.find(".name").val())) {
            //     this.search(false);
            //     let bookmark = new bookmarkMod();
            //     bookmark.endPoint = "";
            //     bookmark.set("name", this.$el.find(".name").val());
            //     bookmark.set("bean_type", this.collection.module);
            //     bookmark.set("description", this.filters);
            //     bookmark.set("assigned_user_id", this.utils.user.id);
            //     bookmark.set("type", "SaveSearch");
            //     bookmark.save({}, {success: function (model) {
            //             let res = model.get('result');
            //             if (res.status == "success") {
            //                 self.saveSearchVal();
            //             }
            //         }});
            // }
            this.$el.find(".name").val('');
        },
        saveSearchVal: function () {
            var self = this;
            if (this.utils.user == undefined) {
                setTimeout(function () {
                    self.saveSearchVal();
                }, 400);
                return;
            }
            // let bookmarCollection = new bookmarkColl.view();
            // bookmarCollection.endPoint = "getList";
            // bookmarCollection.fetch({type: "POST", data: {
            //         and: {
            //             type: "SaveSearch",
            //             assigned_user_id: self.utils.user.id,
            //             bean_type: self.collection.module
            //         }
            //     }, success: function (coll) {
            //         self.$el.find(".searchedVal").empty();
            //         self.$el.find(".searchedVal").append("<option></option>");
            //         _.each(coll.models, function (model) {
            //             self.$el.find(".searchedVal").append("<option value =" + model.get("id") + ">" + model.get("name") + "</option>");
            //         });
            //     }});
        },
        populateSearchedField: function () {
            this.clear();
            var self = this;
            // let bookmark = new bookmarkMod();
            // bookmark.endPoint = "";
            // bookmark.set('id', this.$el.find(".searchedVal").val());
            // bookmark.fetch({success: function (model) {
            //         let desc = JSON.parse(model.get("description"));
            //         self.populateFilters(desc);
            //     }});
        },
        populateFilters: function (json) {
            var self = this;
            _.each(json, function (v, i) {
                switch (i) {
                    case "and":
                        _.each(v, function (value, field) {
                            if (typeof value === "object" && value.constructor !== Array) {
                                _.each(value, function (val, cond) {
                                    self.populateFilterFormData(field, val, cond);
                                });
                            } else {
                                self.populateFilterFormData(field, value);
                            }
                        });
                        break;
                    case "order_by":
                        self.add("order_by", v);
                        break;
                    case "order_by_field":
                        self.add("order_by_field", v);
                        break;
                    case "map":
                        self.$el.find(".form_" + self.form_unique + " input[field='cust_radius']").val(v.radius).trigger("change");
                        self.$el.find(".form_" + self.form_unique + " input[field='cust_location']").val(v.location).trigger("change");
                        break;
                }
            });
        },
        populateFilterFormData: function (field, value, type) {
            let selector = this.$el.find(".form_" + this.form_unique + " input[field='" + field + "']");
            if (selector.length > 0) {
                selector.val(value).trigger("change");
            } else {
                selector = this.$el.find(".form_" + this.form_unique + " select[field='" + field + "']");
                if (selector.length > 0) {
                    selector.val(value).trigger("change");
                } else {
                    selector = this.$el.find(".form_" + this.form_unique + " textarea[field='" + field + "']");
                    if (selector.length > 0) {
                        selector.val(value).trigger("change");
                    } else {
                        selector = this.$el.find(".form_" + this.form_unique + " checkbox[field='" + field + "']");
                        if (selector.length > 0) {
                            if (value == 1) {
                                selector.prop("checked", true).trigger("change");
                            } else {
                                selector.prop("checked", false).trigger("change");
                            }
                        } else {
                            this.additionalFiltersFactory.parent = this;
                            this.additionalFiltersFactory.createFilter(field, value, type);
                        }
                    }
                }
            }
        },
        model: m,
        beforeRender: function () {},
        render: function () {
            if (_.isEmpty(this.search_view)) {
                this.search_view = "basic";
            }
            this.beforeRender();
            if (this.showBreadCrumb == undefined) {
                this.showBreadCrumb = true;
            }
            if (this.showBreadCrumb) {
                var breadCrumbTple = _.template(breadCrumbTpl);
                this.$el.before(breadCrumbTple({module: this.collection.module, menu: this.collection.meta_view.menu}));
            }
            var tpl = _.template(formTpl);
            this.$el.html(tpl({unique: this.form_unique, meta_view: this.collection.meta_view, language: this.collection.language, view: this.search_view, fields: this.collection.fields}));
            this.afterRender();
            this.saveSearchVal();
        },
        afterRender: function () {},
        additionalEvents: {
        },
        filterRemove: function (e) {
            this.additionalFiltersFactory.remove(e);
        },
        filterSelect: function (e) {
            var tpl = _.template(filterTpl);
            var str = e.target.id;
            var count = str.replace("field_", "");
            this.additionalFiltersFactory.addFilterType(tpl, count, e);
        },
        add_filters: function () {
            this.additionalFiltersFactory.parent = this;
            if (!this.additionalFiltersFactory.validate()) {
                this.alert.error("Please fill in the details");
                return;
            }
            var meta_view = this.collection.meta_view;
            var fields = this.collection.fields;
            var language = this.collection.language;
            var self = this;
            this.additionalFiltersFactory.fields = {};
            if (_.isEmpty(this.additionalFiltersFactory.getFields())) {
                _.each(fields, function (v, i) {
                    if ((i.indexOf("id") >= 0 && i != "assigned_user_id") || i == "deleted" || !fields[i]['filter']) {
                        return;
                    }
                    if (self.utils.object_key_exists(meta_view.search.basic, i) == false) {
                        self.additionalFiltersFactory.setFields(v, i);
                    }
                });
            }
            this.additionalFiltersFactory.showFields(language);
        },
        additionalFiltersFactory: {
            fields: {},
            field_count: 0,
            remove: function (e) {
                var id = $(e.target).attr("data_id");
                var count = id.replace("remove_", "");
                this.parent.$el.find(".filter_" + count).remove();
            },
            showFields: function (language) {
                var filter_count = this.field_count;
                var self = this;
                var options = "<option value=''></option>";
                _.each(this.fields, function (v, i) {
                    options = options + "<option value='" + i + "'>" + language[v.label] + "</option>";
                });
                self.parent.$el.find('.filters').append("<div class='row filter_" + filter_count + "'><div class='col-sm-1'><span>Field: </span></div><div class='col-sm-3'> <select style='height:23px;' id='field_" + filter_count + "' name='field_" + filter_count + "' class='filterSelect'>" + options + "</select></div></div>");
                this.field_count = this.field_count + 1;
            },
            addFilterType: function (tpl, count, e) {
                console.log(count);
                this.parent.$el.find('.filter_' + count).children().each(function (i, v) {
                    if (i > 1) {
                        $(v).remove();
                    }
                });
                var language = this.parent.collection.language;
                var fields = this.parent.collection.fields;
                this.parent.$el.find('.filter_' + count).append(tpl({field: fields[$(e.target).val()], language: language, count: count}));
                if (fields[$(e.target).val()]['html_type'] == "datetime" || fields[$(e.target).val()]['html_type'] == "date") {
                    this.parent.$el.find("#value_" + count).datetimepicker({
                        step: 15,
                        format: 'd-m-Y',
                        timepicker: false
                    });
                }
            },
            setFields: function (v, i) {
                this.fields[i] = v;
            },
            getFields: function () {
                return this.fields;
            },
            validate: function () {
                var status = true;
                this.parent.$el.find('.filters').children().each(function (i, v) {
                    if ($(v).children().length <= 2) {
                        status = false;
                        return;
                    }
                    var classes = $(v).attr("class").split(" ");
                    var count = "";
                    _.each(classes, function (val) {
                        if (val.indexOf("filter_") >= 0) {
                            count = val.replace("filter_", "");
                        }
                    });
                    if (count != undefined && count != "") {
                        $(v).css({"border": "unset"});
                        if ($(v).find('#value_' + count).val() == undefined || $(v).find('#value_' + count).val() == "") {
                            $(v).css({"border": "1px solid red"});
                            status = false;
                        }
                    }
                });
                return status;
            },
            createFilter: function (field, value, type) {
                this.parent.add_filters();
                let field_count = this.field_count - 1;
                this.parent.$el.find('#field_' + field_count).val(field).trigger("change");
                switch (type) {
                    case "like":
                        this.parent.$el.find('#filter_type_' + field_count).val('contains').trigger("change");
                        break;
                    case "not_equal":
                        this.parent.$el.find('#filter_type_' + field_count).val('e_not').trigger("change");
                        break;
                    case "e":
                        this.parent.$el.find('#filter_type_' + field_count).val('contains').trigger("change");
                        break;
                    default:
                        this.parent.$el.find('#filter_type_' + field_count).val(type).trigger("change");
                        break;
                }
                this.parent.$el.find('#value_' + field_count).val(value).trigger("change");
            }
        },
        clear: function () {
            var self = this;
//            console.log(this.$el.find(".filters").children());
            this.$el.find(".filters").children().each(function (i, v) {
                var classes = $(v).attr("class").split(" ");
                var count = "";
                _.each(classes, function (val) {
                    if (val.indexOf("filter_") >= 0) {
                        count = val.replace("filter_", "");
                    }
                });
                var field = "field_" + count;
                self.removeFilter(self.$el.find('#' + field).val());
            });
            this.$el.find('input[type=text]').val('');
            this.$el.find('select').each(function (i, v) {
                if (!$(v).hasClass("searchedVal")) {
                    $(v).val("");
                }
            });
            this.$el.find('input[type=text]').each(function (i, v) {
                $(v).trigger("change");
            });
            this.$el.find('select').each(function (i, v) {
                if (!$(v).hasClass("filterSelect") && !$(v).hasClass("searchedVal")) {
                    $(v).trigger("change");
                }
            });
            this.$el.find(".filters").empty();
        },
        search: function (bool) {
            if (bool == undefined) {
                bool = true;
            }
            if (!this.validate()) {
                this.alert.error("Please fill in the required fields");
                return;
            }
            this.add("limit", 50);
            var self = this;
            this.$el.find(".filters").children().each(function (i, v) {
                var classes = $(v).attr("class").split(" ");
                var count = "";
                _.each(classes, function (val) {
                    if (val.indexOf("filter_") >= 0) {
                        count = val.replace("filter_", "");
                    }
                });
                var field = "field_" + count;
                var filter_type = "filter_type_" + count;
                var value = "value_" + count;
                switch (self.$el.find('#' + filter_type).val()) {
                    case "e":
//                        console.log(self.$el.find('#' + value).prop("tagName").toLowerCase());
                        if (self.$el.find('#' + value).attr('type') == "date" || self.$el.find('#' + value).attr('type') == "datetime") {
                            self.addFilter(self.$el.find('#' + field).val(), self.$el.find('#' + value).val(), "e");
                            break;
                        }
                        self.addFilter(self.$el.find('#' + field).val(), self.$el.find('#' + value).val());
                        break;
                    case "contains":
                        self.addFilter(self.$el.find('#' + field).val(), self.$el.find('#' + value).val(), "like");
                        break;
                    case "gte":
                        var date = self.$el.find('#' + value).datetimepicker("getValue");
                        var d = new Date(date);
                        var month = ('0' + (d.getMonth() + 1)).slice(-2);
                        var day = ('0' + d.getDate()).slice(-2);
                        self.addFilter(self.$el.find('#' + field).val(), d.getFullYear() + "-" + month + "-" + day, "gte");
                        break;
                    case "lt":
                        self.addFilter(self.$el.find('#' + field).val(), self.$el.find('#' + value).val(), "lt");
                        break;
                    case "lte":
                        self.addFilter(self.$el.find('#' + field).val(), self.$el.find('#' + value).val(), "lte");
                        break;
                    case "e_not":
                        self.addFilter(self.$el.find('#' + field).val(), self.$el.find('#' + value).val(), "not_equal");
                        break;
                }
            });
            this.lv.filters = this.filters;
            if (bool) {
                this.lv.search();
                if (this.$el.find("#cust_map").length > 0 && this.$el.find("#cust_map").val() == 1) {
                    this.map.filters = _.clone(this.filters);
                    this.map.parent = this;
                    this.map.search();
                }
            }
        },
        validate: function () {
            var meta_view = this.collection.meta_view;
            var search_fields = meta_view.search.basic;
            var self = this;
            var status = true;
            _.each(search_fields, function (v, i) {
                if (v.required != undefined) {
                    if (v.required) {
                        if (self.$el.find("input[field='" + i + "']").length) {
                            self.$el.find("input[field='" + i + "']").css({"border": "unset"});
                            if (self.$el.find("input[field='" + i + "']").val() == "") {
                                self.$el.find("input[field='" + i + "']").css({"border": "1px solid red"});
                                status = false;
                            }
                        } else if (self.$el.find("select[field='" + i + "']").length) {
                            self.$el.find("select[field='" + i + "']").css({"border": "unset"});
                            if (self.$el.find("select[field='" + i + "']").val() == "") {
                                self.$el.find("select[field='" + i + "']").css({"border": "1px solid red"});
                                status = false;
                            }
                        }
                    }
                }
            });
            return status;
        },
        setListView: function (lv) {
            this.lv = lv;
            if (!_.isEmpty(lv.filters)) {
                this.filters = lv.filters;
            }
        },
        _bindChanges: function (e) {
            var field = $(e.target).attr("field");
            if (_.isEmpty(field)) {
                return;
            }
            if (field.indexOf("filter") > 0) {
                field = field.replace("_filter", "");
                $(e.target).parent().parent().find("[field='" + field + "']").trigger("change");
                return;
            }
            if (field == "cust_location" || field == "cust_radius") {
                this.add("map", {radius: $("input[field='cust_radius']").val(), location: $("input[field='cust_location']").val()});
                return;
            }
            if (field == "full_name") {
                var n = $(e.target).val();
                n = n.replace(/\s/g, '');
                this.addFilter(field, n, "like_after");
                return;
            }
            if ($(e.target).attr("type") == "text" && !$(e.target).hasClass("datepicker")) {
                this.addFilter(field, $(e.target).val(), "like_after");
                return;
            }
            if ($(e.target).hasClass("datepicker") && $(e.target).val() != "") {
                var date = $(e.target).datepicker("getDate");
                var d = new Date(date);
                var month = ('0' + (d.getMonth() + 1)).slice(-2);
                var day = ('0' + d.getDay()).slice(-2);
                if ($(e.target).attr("field_type") == "datetime") {
                    this.addFilter(field, d.getFullYear() + "-" + month + "-" + day + " 00:00:00", $(e.target).parent().parent().find("select").val());
                } else {
                    this.addFilter(field, d.getFullYear() + "-" + month + "-" + day, $(e.target).parent().parent().find("select").val());
                }
                return;
            }
            this.addFilter(field, $(e.target).val());
        }
    });
    return form;
});