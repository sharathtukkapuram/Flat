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
        module: "",
        endPoint: "",
        url: function () {
            if (this.endPoint != "") {
                return "../backEnd/" + this.module + "/" + this.endPoint;
            }
            return "../backEnd/" + this.module + "/record/" + this.id;
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
        validate: function (attributes, option) {
            let fields = this.get("fields");
            var meta_view = this.get("meta_view");
            var ret = [];
            var self = this;
            if (!_.isEmpty(fields)) {
                _.each(fields, function (field, name) {
                    if (field.required != undefined && field.required) {
                        if (_.isEmpty(attributes[name]) && attributes[name] != undefined) {
                            ret[ret.length] = {
                                "field": name,
                                "label": self.get("language")[field.label],
                                "message": "Please Fill in required field"
                            }
                        }
                    }
                });
            }
            if (!_.isEmpty(meta_view)) {
                _.each(meta_view.record.panel, function (i, j) {
                    _.each(i, function (field, m) {
                        _.each(field, function (p, q) {
                            if (!_.isEmpty(p.merge_fields)) {
                                return;
                            }
                            if (p.required != undefined && p.required == true) {
                                let name = q;
                                let link_name = "";
                                if (!_.isEmpty(fields[q])) {
                                    if (fields[q]['type'] == "link") {
                                        link_name = name + "_name";
                                        name = name + "_id";
                                    }
                                }
                                if (_.isEmpty(attributes[name]) && attributes[name] != undefined) {
                                    ret[ret.length] = {
                                        "field": (link_name == "") ? name : link_name,
                                        "label": self.get("language")[p.label],
                                        "message": "Please Fill in required field"
                                    }
                                }
                            }
                        });
                    });
                });
            }
            let extraValidations = this.additionalValidation();
            if (extraValidations != undefined && extraValidations.length > 0) {
                _.each(extraValidations, function (v, i) {
                    ret[ret.length] = v;
                });
            }
            if (ret.length > 0) {
                return ret;
            }
        },
        additionalValidation: function () {
            /**
             * ret[] = {
             *  field:"",
             *  "message":
             * }
             */
        }
    });
    return c;
});

