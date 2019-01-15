define(function (require) {
    return function () {
        this.utils = window.Veon;
        this.init = function (m, t, id) {
            // this.utils.is_authenticated();
            if (!_.isEmpty(this.utils[m])) {
                this.utils[m].remove();
            }
            if (!_.isEmpty(this.utils["record"])) {
                this.utils["record"].remove();
            }
            let v;
            v = this.getView(m, id);
            if (t == undefined && id == undefined) {
                this.utils[m] = new v();
            } else if (id != undefined) {
                m = "record";
                this.utils[m] = new v({ id: id });
            } else {
                this.utils[m] = new v({ initial_filter: t });
            }
            this.utils.lastView = (m != "header" && m != "sidebar" && m != "record") ? m : this.utils.lastView;
            this.utils[m].render();
            this.utils[m].animate();
            if (_.isEmpty($(".main_header").html())) {
                this.init("header");
            }
            // if (_.isEmpty($("#sidebar").html())) {
            //     this.init("sidebar");
            // }
        };
        this.getView = function (m, id) {
            let v;
            switch (m) {
                case "home":
                    v = require("views/home");
                    break;
                case "header":
                    v = require("views/header");
                    break;
                case "Meetings":
                    if (id == undefined) {
                        v = require("views/meetings");
                    } else {
                        v = require("views/meetingRecord");
                    }
                    break;
                case "Sahiya":
                    if (id == undefined) {
                        v = require("views/sahiya");
                    } else {
                        v = require("views/sahiyaRecord");
                    }
                    break;
                
            }
            return v;
        }
    };
});
