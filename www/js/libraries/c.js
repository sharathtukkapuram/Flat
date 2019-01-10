/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(function (require) {
    var _ = require('underscore');
    var Backbone = require('backbone');
    var c = Backbone.Collection.extend({
        endPoint: "",
        url: function () {
            return window.Veon.api_url + this.endPoint;
        },
        fetch: function (options) {
            this.trigger('fetch', this, options);
            return Backbone.Collection.prototype.fetch.call(this, options);
        }
    });
    return c;
});

