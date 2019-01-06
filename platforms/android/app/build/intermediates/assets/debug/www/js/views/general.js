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
            // if (_.isEmpty($(".main_header").html())) {
            //     this.init("header");
            // }
            // if (_.isEmpty($("#sidebar").html())) {
            //     this.init("sidebar");
            // }
        };
        this.getView = function (m, id) {
            let v;
            switch (m) {
                // case "home":
                //     v = require("views/home");
                //     break;
                // case "header":
                //     v = require("views/header");
                //     break;
                // case "sidebar":
                //     v = require("views/sidebar");
                //     break;
                // case "Contacts":
                //     if (id == undefined) {
                //         v = require("views/Contacts");
                //     } else {
                //         v = require("views/Record/Contacts");
                //     }
                //     break;
                // case "Jobs":
                //     if (id == undefined) {
                //         v = require("views/Jobs");
                //     } else {
                //         v = require("views/Record/Jobs");
                //     }
                //     break;
                case "Accounts":
                    if (id == undefined) {
                        v = require("views/Accounts");
                    } else {
                        // v = require("views/Record/Accounts");
                    }
                    break;
                // case "Calls":
                //     if (id == undefined) {
                //         v = require("views/Calls");
                //     } else {
                //         v = require("views/Record/Calls");

                //     }
                //     break;
                // case "Notes":
                //     if (id == undefined) {
                //         v = require("views/Notes");
                //     } else {
                //         v = require("views/Record/Notes");
                //     }
                //     break;
                // case "Regions":
                //     v = require("views/Regions");
                //     break;
                // case "HiringActivity":
                //     if (id == undefined) {
                //         v = require("views/HiringActivity");
                //     } else {
                //         v = require("views/Record/HiringActivity");
                //     }
                //     break;
                // case "Leads":
                //     if (id == undefined) {
                //         v = require("views/Leads");
                //     } else {
                //         v = require("views/Record/Leads");
                //     }
                //     break;
                // case "Users":
                //     if (id == undefined) {
                //         v = require("views/Users");
                //     } else {
                //         v = require("views/Record/Users");
                //     }
                //     break;
                // case "Notification":
                //     if (id == undefined) {
                //         v = require("views/Notification");
                //     } else {
                //         v = require("views/Record/Notification");
                //     }
                //     break;
                // case "CollegeAttended":
                //     if (id == undefined) {
                //         v = require("views/CollegeAttended");
                //     } else {
                //         v = require("views/Record/CollegeAttended");
                //     }
                //     break;
                // case "Certificates":
                //     if (id == undefined) {
                //         v = require("views/Certificates");
                //     } else {
                //         v = require("views/Record/Certificates");
                //     }
                //     break;
                // case "Documents":
                //     if (id == undefined) {
                //         v = require("views/Documents");
                //     } else {
                //         v = require("views/Record/Documents");
                //     }
                //     break;
                // case "Agencies":
                //     if (id == undefined) {
                //         v = require("views/Agencies");
                //     } else {
                //         v = require("views/Record/Agencies");
                //     }
                //     break;
                // case "Bookmark":
                //     if (id == undefined) {
                //         v = require("views/Bookmark");
                //     } else {
                //     }
                //     break;

                // case "Companies":
                //     if (id == undefined) {
                //         v = require("views/Companies");
                //     } else {
                //         v = require("views/Record/Companies");
                //     }
                //     break;
                // case "ADONames":
                //     if (id == undefined) {
                //         v = require("views/ADONames");
                //     } else {
                //         v = require("views/Record/ADONames");
                //     }
                //     break;
                // case "Administration":
                //     v = require("views/Administrator");
                //     break;

                // case "UsersLog":
                //     v = require("views/UsersLog");
                //     break;

                // case "OutBoundEmail":
                //     if (id == undefined) {
                //         v = require("views/OutBoundEmail");
                //     } else {
                //         v = require("views/Record/OutBoundEmail");
                //     }
                //     break;
                // case "Email":
                //     if (id == undefined) {
                //         v = require("views/Email");
                //     } else {
                //         v = require("views/Record/Email");
                //     }
                //     break;
            }
            return v;
        }
    };
});
