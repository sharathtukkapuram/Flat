/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(function (require) {
    var Backbone = require('backbone');
    var _ = require('underscore');
    var db = require('libraries/database');
    var view = Backbone.View.extend({
        database: new db,
        initialize: function (options) {
            this.utils = window.Veon;
            if (!_.isEmpty(this.collection)) {
                that = this;
                this.collection.on('fetch', function () {
                    that.utils.loader.show();
                });
                this.collection.on('error', this.showErrors);
            }
            if (!_.isEmpty(this.model)) {
                that = this;
                this.model.on('save fetch', function () {
                    that.utils.loader.show();
                });
                this.model.on('error', this.showErrors);
            }
            var self = this;
            _.each(options, function (v, i) {
                self[i] = v;
            });
        },
        removeFilter: function (field) {
            delete this.filters.and[field];
        },
        add: function (type, value) {
            if (_.isEmpty(this.filters)) {
                this.filters = {};
            }
            this.filters[type] = value;
        },
        addSelect: function (value) {
            if (_.isEmpty(this.filters)) {
                this.filters = {};
            }
            if (_.isEmpty(this.filters['select'])) {
                this.filters['select'] = [];
            }
            this.filters['select'] = value;
        },
        addFilter: function (field, value, type, replace) {
            if (_.isEmpty(this.filters)) {
                this.filters = {};
            }
            if (replace == undefined) {
                replace = true;
            }
            if (_.isEmpty(this.filters['and'])) {
                this.filters['and'] = {};
            }
            if (_.isEmpty(value)) {
                this.removeFilter(field);
            } else {
                if (type == undefined) {
                    this.filters.and[field] = value;
                } else {
                    if (replace || this.filters.and[field] == undefined) {
                        this.filters.and[field] = {};
                    }
                    this.filters.and[field][type] = value;
                }
            }
        },
        alert: {
            init: function () {
                var size = $(window).width() * 30 / 100;
                $(".status").css({ "padding-left": size, "padding-right": size });
            },
            success: function (msg) {
                window.plugins.toast.showWithOptions({
                    message: msg,
                    duration: 5000, // 2000 ms
                    position: "bottom",
                    addPixelsY: -40,
                    styling: {
                        opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                        backgroundColor: '#0e960e', // make sure you use #RRGGBB. Default #333333
                        textColor: '#FFFFFF', // Ditto. Default #FFFFFF
                        textSize: 20.5, // Default is approx. 13
                    }
                });
            },
            error: function (msg) {
                window.plugins.toast.showWithOptions({
                    message: msg,
                    duration: 5000, // 2000 ms
                    position: "bottom",
                    addPixelsY: -40,
                    styling: {
                        opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                        backgroundColor: '#dc3545', // make sure you use #RRGGBB. Default #333333
                        textColor: '#FFFFFF', // Ditto. Default #FFFFFF
                        textSize: 20.5, // Default is approx. 13
                    }
                });
            }
        },
        showErrors: function (obj, response, options) {
            window.Veon.loader.hide();
            alert(JSON.stringify(response));
            console.error(response);
        },
        originalEvents: {
            "change input": "_bindChanges",
            "change select": "_bindChanges",
            "change textarea": "_bindChanges",
        },
        events: function () {
            return _.extend({}, this.originalEvents, this.additionalEvents);
        },
        search: function () {
            if (!_.isEmpty(this.collection)) {
                this.collection.fetch({ data: this.filters, reset: true, type: 'POST' });
            }
        },
        _bindChanges: function (e) {
            if (!_.isEmpty(this.model)) {
                this.model.set(e.target.id, $(e.target).val());
            }
        },
        animate: function () {
            this.$el.hide();
            this.$el.show(500);
        },
        remove: function () {
            this.undelegateEvents();
            this.unbind();
            this.stopListening();
            this.$el.empty();
        },
        closeSlider: function () {
            var self = this;
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
            this.$el.find('.slider_background').css({ display: "block" });
            this.$el.append("<div class='slide_down sd_" + this.slider_unique + "'><div class='slide_down_body sdb_" + this.slider_unique + "' id='relate_" + this.slider_unique + "' style='overflow:auto;'></div></div>");
            this.$el.find(".sd_" + this.slider_unique).css({ position: "fixed", top: "0", left: "0", 'z-index': "9999", width: "100%" });
            this.$el.find(".sdb_" + this.slider_unique).animate({
                "min-height": ((screen.height / 4) * 3) + "px",
                "max-height": ((screen.height / 4) * 3) + "px",
                "background-color": "#fff"
            });
            return 'relate_' + this.slider_unique;
        },
    });
    return view;
});

