/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(function (require) {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var c = Backbone.Collection.extend({
        module: "",
        view: "",
        endPoint: "",
        current_page: 1,
        url: function () {
            if (this.view == "" && this.endPoint == "") {
                return "../backEnd/" + this.module;
            }
            if (this.endPoint != "") {
                return "../backEnd/" + this.module + "/" + this.endPoint;
            }
            return "../backEnd/" + this.module + "/getList/" + this.view;
        },
        fetch: function (options) {
            this.trigger('fetch', this, options);
            return Backbone.Collection.prototype.fetch.call(this, options);
        },
        parse: function (response, options) {
            var self = this;
            _.each(response, function (v, i) {
                if (i != "result" && i != "module") {
                    self[i] = v;
                }
            });
            if (!_.isEmpty(response.count)) {
                this.count = response.count;
            } else {
                this.count = {
                    start: 0,
                    end: 0,
                    total: 0
                };
            }
            return response.result;
        }
    });
    return c;
});

