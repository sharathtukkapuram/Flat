/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(function (require) {
    var v = require("libraries/v");
    require("jquery-datetime");
    var c = require("libraries/c");
    var listTpl = require("text!../templates/list/list.html");
    var listRowTpl = require("text!../templates/list/listrow.html");
    var pagination = require("text!../templates/list/pagination.html");
    var view = v.extend({
        initialize: function (options) {
            view.__super__.initialize.apply(this, arguments);
            this.listenTo(this.collection, 'reset', this.render);
            if (_.isEmpty(this.filters)) {
                this.filters = {};
            }
            this.showTitle = false;
            this.paginationTop = false;
            this.showCheckBox = false;
            this.showRadioButtons = false;
            this.actions_button = false;
            this.quickView = false;
            if (options.quickView) {
                this.quickView = true;
            }
            if (options.paginationTop) {
                this.paginationTop = true;
            }
            if (options.showRadioButtons) {
                this.showRadioButtons = true;
            }
            if (options.actions_button) {
                this.actions_button = true;
            }
            if (options.showCheckBox) {
                this.showCheckBox = true;
            }
            if (options.showTitle) {
                this.showTitle = options.showTitle;
            }
            if (typeof this.filters.limit === 'undefined') {
                this.add("limit", 10);
            }
            if (_.isEmpty(this.filters['order_by_field'])) {
                this.add("order_by", "DESC");
                this.add("order_by_field", "date_entered");
            }
            this.list_unique = Math.floor(Math.random() * 1000);
            let d = new Date();
            this.add("sid", "sid" + d.getTime());
            if (this.loadInitialList == undefined || this.loadInitialList) {
                this.collection.fetch({reset: true, data: this.filters, type: "POST", error: this.showErrors});
            }
            this.checkboxFactory.removeAll(this);
        },
        additionalEvents: {
        },
        delete: function () {
            var self = this;
            var checkbox = this.checkboxFactory.getSelectedIds();
            if (checkbox == undefined || _.isEmpty(checkbox)) {
                return;
            }
            var collection = c.extend({
                module: this.collection.models[0].get("module"),
                endPoint: "delete",
                parse: function (response) {
                    return response.result;
                }
            });
            var Colls = new collection();
            Colls.on('fetch', function () {
                self.utils.loader.show();
            });
            var r = confirm("Are you sure you want to delete record?");
            if (r == true) {
                if (checkbox == "All") {
                    Colls.fetch({data: this.filters, reset: true, type: "POST", success: function (coll, res) {
                            if (res.result.status == "success") {
                                self.alert.success("Successfully deleted " + res.result.updated_rows + " records");
                                self.search();
                                self.checkboxFactory.removeAll(self);
                            }
                            self.utils.loader.hide();
                        }});
                } else if (!_.isEmpty(checkbox)) {
                    Colls.fetch({data: {id: checkbox}, reset: true, type: "POST", success: function (coll, res) {
                            if (res.result.status == "success") {
                                self.alert.success("Successfully deleted " + res.result.updated_rows + " records");
                                self.search();
                                self.checkboxFactory.removeAll(self);
                            }
                            self.utils.loader.hide();
                        }});
                }
            } else {
                self.checkboxFactory.removeAll(self);
            }
        },
        export: function () {
            var checkbox = this.checkboxFactory.getSelectedIds();
            if (checkbox == undefined || _.isEmpty(checkbox)) {
                return;
            }
            var collection = c.extend({
                module: this.collection.models[0].attributes['module'],
                endPoint: "export",
                parse: function (response) {
                    return response.result;
                }
            });
            var col = new collection();
            col.on('fetch', function () {
                that.utils.loader.show();
            });
            if (checkbox == "All") {
                this.filters['limit'] = (this.collection.count.total > 10000) ? limit = 10000 : limit = this.collection.count.total;
                col.fetch({data: this.filters, reset: true, type: "POST", success: this.downlaod});
            } else if (!_.isEmpty(checkbox)) {
                col.fetch({data: {id: checkbox}, reset: true, type: "POST", success: this.downlaod});
            }
        },
        downlaod: function (coll, res, xhr) {
            if (!_.isEmpty(coll.models[0].get("csv"))) {
                if (!_.isEmpty(coll.models[0].get("csv"))) {
                    window.Veon.loader.hide();
                    window.open(coll.models[0].get("csv"));
                }
            }
        },
        loadPage: function () {

        },
        page: function (e) {
            var count = $(e.target).closest('ul').find('.page').val();
            if (this.collection.total_pages < count) {
                this.alert.error("Given Page Number is Greater Than Total Pages");
                return;
            } else if (count <= 0) {
                return;
            }
            this.add("offset", (count - 1) * this.filters.limit);
            this.add("total", this.collection.count.total);
            this.collection.current_page = Math.ceil(this.collection.count.end / this.filters.limit)
            if (this.collection.current_page == count) {
                return;
            }
            this.collection.fetch({data: this.filters, reset: true, type: 'POST'});
        },
        checkboxFactory: {
            setSelectedId: function (id) {
                if (_.isEmpty(this.selectedIds)) {
                    this.selectedIds = [];
                }
                this.selectedIds[this.selectedIds.length] = id;
            },
            removeSelectedId: function (id) {
                self = this;
                _.each(this.selectedIds, function (v, i) {
                    if (v === id) {
                        self.selectedIds.splice(i, 1)
                    }
                });
            },
            removeAll: function (view) {
                this.selectedIds = [];
                view.$el.find(".thisPage").prop("checked", false);
                view.$el.find(".thisPage").prop("disabled", false);
                view.$el.find(".select-menu").val("");
                view.$el.find('.checkbox').prop("checked", false);
                view.$el.find('.checkbox').prop("disabled", false);
            },
            getSelectedIds: function () {
                return this.selectedIds;
            },
            selectAll: function (view) {
                this.selectedIds = "All";
                view.$el.find(".thisPage").prop("checked", true);
                view.$el.find(".thisPage").prop("disabled", true);
                view.$el.find(".select-menu").val("all");
                view.$el.find('.checkbox').prop("checked", true);
                view.$el.find('.checkbox').prop("disabled", true);
            },
            checkSelected: function (view) {
                if (_.isEmpty(view)) {
                    console.error("view missing");
                }
                view.$el.find(".thisPage").prop("checked", false);
                view.$el.find(".thisPage").prop("disabled", false);
                view.$el.find(".select-menu").val("");
                var self = this;
                var type = typeof this.selectedIds;
                if (type === "object") {
                    var length = 0;
                    view.$el.find('.checkbox').each(function (i, v) {
                        if (self.selectedIds.indexOf($(v).val()) > -1) {
                            length = i + 1;
                            $(v).prop("checked", true);
                        }
                    });
                    if (length == view.filters.limit) {
                        view.$el.find(".select-menu").val("thisPage");
                        view.$el.find(".thisPage").prop("checked", true);
                    }
                } else if (type === "string") {
                    if (this.selectedIds == "All") {
                        self.selectAll(view);
                    }
                }
            }
        },
        checkbox: function (e) {
            var self = this;
            if ($(e.target).hasClass("thisPage")) {
                this.$el.find('.checkbox').each(function (i, v) {
                    if (e.target.checked) {
                        self.checkboxFactory.setSelectedId($(v).val());
                        $(v).prop("checked", true);
                    } else {
                        self.checkboxFactory.removeSelectedId($(v).val());
                        $(v).prop("checked", false);
                    }
                });
            } else if ($(e.target).hasClass("select-menu")) {
                switch ($(e.target).val()) {
                    case "thisPage":
                        self.$el.find(".thisPage").trigger("click");
                        break;
                    case "all":
                        self.checkboxFactory.selectAll(self);
                        break;
                    case "deselect":
                        self.checkboxFactory.removeAll(self);
                        break;
                }
            } else if ($(e.target).hasClass("checkbox")) {
                if (e.target.checked) {
                    self.checkboxFactory.setSelectedId($(e.target).val());
                } else {
                    self.checkboxFactory.removeSelectedId($(e.target).val());
                }
            }
        },
        clearsubsearch: function () {
            this.$el.find('input[type=text]').val('');
            this.$el.find('select').val('');
            this.$el.find('input[type=text]').each(function (i, v) {
                $(v).trigger("change");
            });
            this.$el.find('select').each(function (i, v) {
                $(v).trigger("change");
            });
            this.search();
        },
        search: function () {
            this.collection.fetch({reset: true, data: this.filters, type: "POST", error: this.showErrors});
        },
        pagination: function (e) {
            if (e.target.innerText == "First") {
                this.firstPagination();
            } else if (e.target.innerText == "Prev") {
                this.previousPagination();
            } else if (e.target.innerText == "Next") {
                this.nextPagination();
            } else if (e.target.innerText == "Last") {
                this.lastPagination();
            }
        },
        firstPagination: function () {
            if (this.collection.count.start == 0) {
                return;
            }
            this.collection.reset();
            this.collection.current_page = 1;
            this.add("offset", (this.collection.current_page - 1) * this.filters.limit);
            this.add("total", this.collection.count.total);
            this.collection.fetch({data: this.filters, reset: true, type: 'POST'});
        },
        lastPagination: function () {
            if (this.collection.total_pages == this.collection.current_page) {
                return;
            }
            this.collection.reset();
            this.collection.current_page = Math.ceil(this.collection.count.total / this.filters.limit);
            this.add("offset", (this.collection.current_page - 1) * this.filters.limit);
            this.add("total", this.collection.count.total);
            this.collection.fetch({data: this.filters, reset: true, type: 'POST'});
        },
        nextPagination: function () {
            if (this.collection.count.end == this.collection.count.total) {
                return;
            }
            this.collection.reset();
            this.collection.current_page = this.collection.current_page + 1;
            this.add("offset", (this.collection.current_page - 1) * this.filters.limit);
            this.add("total", this.collection.count.total);
            this.collection.fetch({data: this.filters, reset: true, type: 'POST'});
        },
        previousPagination: function () {
            if (this.collection.count.start == 0) {
                return;
            }
            this.collection.reset();
            this.collection.current_page = this.collection.current_page - 1;
            this.add("offset", (this.collection.current_page - 1) * this.filters.limit);
            this.add("total", this.collection.count.total);
            this.collection.fetch({data: this.filters, reset: true, type: 'POST'});
        },
        removeFilter: function (field) {
            delete this.filters.and[field];
        },
        sort: function (e) {
            if (this.filters['order_by_field'] != this.$el.find($(e.target)).attr("sort_id")) {
                this.filters['order_by_field'] = this.$el.find($(e.target)).attr("sort_id");
                this.filters['order_by'] = "ASC";
            } else {
                if (this.filters['order_by_field'] == this.$el.find($(e.target)).attr("sort_id")) {
                    if (this.filters['order_by'] == 'ASC') {
                        this.filters['order_by'] = 'DESC';
                    } else if (this.filters['order_by'] == 'DESC') {
                        this.filters['order_by'] = 'ASC';
                    }
                }
            }
            this.$el.find("th a img").replaceWith('<img src="images/arrow.gif" align="absmiddle" border="0" alt="sort">');
            this.search();
        },
        _bindChanges: function (e) {
            var field = $(e.target).attr("field");
            if (_.isEmpty(field)) {
                return;
            }
            if (field.indexOf("filter") > -1) {
                $(e.target).parent().parent().find('input').trigger("change");
                return;
            }
            if ($(e.target).attr("type") == "text" && !$(e.target).hasClass("datepicker")) {
                this.addFilter(field, $(e.target).val(), "like_after");
                return;
            }
            if ($(e.target).hasClass("datepicker") && $(e.target).val() != "") {
                var date = $(e.target).datetimepicker("getValue");
                var d = new Date(date);
                var month = ('0' + (d.getMonth() + 1)).slice(-2);
                var day = ('0' + d.getDate()).slice(-2);
                if ($(e.target).attr("field_type") == "datetime") {
                    this.addFilter(field, d.getFullYear() + "-" + month + "-" + day + " 00:00:00", $(e.target).parent().parent().find("select").val());
                } else {
                    this.addFilter(field, d.getFullYear() + "-" + month + "-" + day, $(e.target).parent().parent().find("select").val());
                }
                return;
            }
            this.addFilter(field, $(e.target).val());
        },
        closeSlider: function () {
            var self = this;
            if (this.quickView['id'] != undefined) {
                this.quickView[this.quickView['id']].remove();
            }
            this.$el.find('.sdb_' + this.slider_unique).animate({
                "min-height": "0px"
            }, "normal", function () {
                self.$el.find(".sd_" + self.slider_unique).remove();
                self.$el.find(".sb_" + self.slider_unique).remove();
            });
        },
        openSlider: function () {
            this.slider_unique = Math.floor(Math.random() * 1000);
            this.$el.append("<div class='slider_background sb_" + this.slider_unique + "'></div>");
            this.$el.find('.slider_background').css({display: "block"});
            this.$el.append("<div class='slide_down sd_" + this.slider_unique + "'><div class='slide_down_body sdb_" + this.slider_unique + "' id='create_" + this.slider_unique + "' style='overflow:auto;'></div></div>");
            this.$el.find(".sd_" + this.slider_unique).css({position: "fixed", top: "0", left: "0", 'z-index': "9999", width: "100%"});
            this.$el.find(".sdb_" + this.slider_unique).animate({
                "min-height": ((screen.height / 4) * 3) + "px",
                "max-height": ((screen.height / 4) * 3) + "px",
                "background-color": "#fff"
            });
            return 'create_' + this.slider_unique;
        },
        quick_view: function (e) {
            let id = this.$el.find($(e.target)).closest("tr").find(".checkbox").val();
            let v = this.utils.router.g.getView(this.collection.module, id);
            if (_.isEmpty(this.quickView)) {
                this.quickView = {};
            }
            this.quickView[id] = new v({id: id, quickView: true, el: "#" + this.openSlider(), showHeaders: false, showSubpanels: false, parent: this});
            this.quickView[id].animate = function () {};
            this.quickView['id'] = id;
        },
        loadedHeaders: function () {
            this.loadHeaders = true;
        },
        render: function () {
            this.utils.loader.hide();
            this.beforeRender();
            var self = this;
            if (_.isEmpty(this.listTpl)) {
                this.listTpl = listTpl;
            }
            if (_.isEmpty(this.listRowTpl)) {
                this.listRowTpl = listRowTpl;
            }
            if (_.isEmpty(this.paginationTpl)) {
                this.paginationTpl = pagination;
            }

            var tpl = _.template(this.listTpl);
            if (!this.loadHeaders) {
                if (!_.isEmpty(this.collection.language) && Backbone.history.getFragment() != "home" && Backbone.history.getFragment().indexOf(this.collection.module + "/record") == -1) {
                    if (!_.isEmpty(this.collection.language['LBL_MODULE_' + this.collection.module.toUpperCase()])) {
                        $("title").html(this.collection.language['LBL_MODULE_' + this.collection.module.toUpperCase()] + " List");
                    }
                }
                this.$el.html(tpl({headers: this.collection.headers, language: this.collection.language, fields: this.collection.fields, showCheckBox: this.showCheckBox, actions_button: this.actions_button, showRadioButtons: this.showRadioButtons, module: this.collection.module, quickView: this.quickView, unique: this.list_unique}));
                if (this.showTitle) {
                    this.$el.prepend('<p class="dashboard_header">My ' + this.collection.module + '</p>');
                }

                _.each(this.collection.headers, function (header, key) {
                    if (!_.isEmpty(header.sort_field)) {
                        if (!_.isEmpty(self.collection.fields[key]) && self.collection.fields[key]['type'] == "relate") {
                            var def = self.collection.fields[key];
                        } else {
                            def = self.collection.fields[header.sort_field];
                        }
                        if (def["html_type"] == "datetime") {
                            self.$el.find("input[field='" + header.sort_field + "']").datetimepicker({
                                step: 15,
                                format: 'd-m-Y H:i',
                                timepicker: false
                            });
                        } else if (def["html_type"] == "date") {
                            self.$el.find("input[field='" + header.sort_field + "']").datetimepicker({
                                step: 15,
                                format: 'd-m-Y',
                                timepicker: false
                            });
                        }
                    } else {
                        var def = self.collection.fields[key];
                        if (def["html_type"] == "datetime") {
                            self.$el.find("input[field='" + key + "']").datetimepicker({
                                step: 15,
                                format: 'd-m-Y H:i',
                                timepicker: false
                            });
                        } else if (def["html_type"] == "date") {
                            self.$el.find("input[field='" + key + "']").datetimepicker({
                                step: 15,
                                format: 'd-m-Y',
                                timepicker: false
                            });
                        }
                    }
                });
                let module = this.collection.module;
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + " .search"] = "search";
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + ".pagination a"] = "pagination";
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + ".clearsubsearch a"] = "clearsubsearch";
                this.additionalEvents["change ." + module + ".list_" + this.list_unique + " .select-menu"] = "checkbox";
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + " .thisPage"] = "checkbox";
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + " .checkbox"] = "checkbox";
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + " .searchpage"] = "page";
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + " .delete"] = "delete";
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + " .export"] = "export";
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + " .quick_view"] = "quick_view";
                this.additionalEvents["click ." + module + ".list_" + this.list_unique + " th a"] = "sort";
                this.undelegateEvents();
                this.delegateEvents();
            }
            if (this.collection.length > 0) {
                this.loadedHeaders();
                this.collection.total_pages = Math.ceil(this.collection.count.total / this.filters.limit);
                this.$el.find('tbody').empty();
                var rowtpl = _.template(this.listRowTpl);
                var paginationtpl = _.template(this.paginationTpl);
                this.$el.find('tbody').append(rowtpl({data: this.collection.toJSON(), module: this.collection.module, headers: this.collection.headers, fields: this.collection.fields, language: this.collection.language, showCheckBox: this.showCheckBox, showRadioButtons: this.showRadioButtons, quickView: this.quickView, sid: this.filters.sid, count: this.collection.count}));
                this.$el.find(".pagination").remove();
                this.$el.append(paginationtpl({count: this.collection.count, total_pages: this.collection.total_pages, current_page: Math.ceil(this.collection.count.end / this.filters.limit), module: this.collection.module, unique: this.list_unique}));
                if (this.paginationTop) {
                    this.$el.prepend(paginationtpl({count: this.collection.count, total_pages: this.collection.total_pages, current_page: Math.ceil(this.collection.count.end / this.filters.limit), module: this.collection.module, unique: this.list_unique}));
                }
            } else {
                this.$el.find(".pagination").remove();
                this.$el.find('tbody').empty();
                this.$el.find('tbody').append("<tr><td colspan='" + this.$el.find('thead tr th').length + "'>No Records Found!!</td></tr>");
            }
            if (this.$el.find("a[sort_id='" + this.filters.order_by_field + "']").length > 0) {
                if (this.filters.order_by == "ASC") {
                    this.$el.find("a[sort_id='" + this.filters.order_by_field + "'] img").replaceWith('<img src="images/arrow_up.gif" align="absmiddle" border="0" alt="sort">');
                } else {
                    this.$el.find("a[sort_id='" + this.filters.order_by_field + "'] img").replaceWith('<img src="images/arrow_down.gif" align="absmiddle" border="0" alt="sort">');
                }
            }
            this.checkboxFactory.checkSelected(this);
            this.afterRender();
        },
        beforeRender: function () {

        },
        afterRender: function () {

        }
    });
    return view;
});
