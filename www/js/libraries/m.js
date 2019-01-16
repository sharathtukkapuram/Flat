/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(function (require) {
    var _ = require('underscore');
    var Backbone = require('backbone');
    require('backbone_upload');
    let c = Backbone.Model.extend({
        endPoint: "",
        url: function () {
            return window.Veon.api_url + this.endPoint;
        },
        altPostSave: function (data) {
            var self = this;
            if (data.success == undefined) {
                throw "Require Success Method!!";
            }
            var postData;
            if (data.data == undefined) {
                postData = this.toJSON();
            } else {
                postData = data.data;
            }
            $.ajax({
                url: this.url(),
                data: postData,
                type: 'POST',
                success: function (response) {
                    window.Veon.loader.hide();
                    _.each(response, function (v, i) {
                        self.set(i, v);
                    });
                    data.success(self, data.self, response);
                },
                error: function (response) {
                    window.Veon.loader.hide();
                    if (data.error != undefined) {
                        _.each(response, function (v, i) {
                            self.set(i, v);
                        });
                        data.error(self, data.self, response);
                    } else {
                        alert("Error -" + JSON.stringify(response));
                        console.log("Error -" + JSON.stringify(response));
                        console.log(response);
                    }
                }
            });
        },
        //        save: function (attr, options) {
        //            this.trigger("save", this, options);
        //            return Backbone.Model.prototype.save.call(this, attr, options);
        //        },
        fetch: function (options) {
            this.trigger('fetch', this, options);
            return Backbone.Model.prototype.fetch.call(this, options);
        },
        parse: function (res) {
            this.serverObj = res;
            return res;
        },
    });
    return c;
});

