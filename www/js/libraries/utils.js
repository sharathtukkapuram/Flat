/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Veon = {
    setMain: function (d) {
        this.main = d;
    },
    fields: {
        home: ["id", "data", "name"],
        user: ['id', 'description', 'login_status'],
        sahiya: ["id",
            "unique_id",
            "name",
            "unitname",
            "unitid",
            "clustid",
            "phone",
            "name_of_tola",
            "health_sub_center",
            "education_level",
            "caste",
            "anm_incharge",
            "aadhar_no",
            "bank_account",
            "updated"],
        meetings: ["id", "eventname", "scheduled_date", "actual_date", "event_status_id", "distName", "clusterid", "unitid", "unitName", "factName", "factCode", "meetingName", "status", "st", "sc", "others", "women", "under15", "men", "pregnant_women", "updated"]
    },
    api_url: "http://testapp.flagjharkhand.com/api/index.php/",
    checkInternet: function (data) {
        if (navigator.connection.type !== Connection.NONE) {
            data.success(true);
        } else {
            data.success(false);
        }

    },
    cookie: {
        get: function (key) {
            var name = key + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        set: function (key, value, expires) {
            var d = new Date();
            d.setTime(d.getTime() + (expires * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = key + "=" + value + ";" + expires + ";path=/";
        }
    },
    url: {
        get: function (param) {
            var vars = [];
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                if (param == key) {
                    vars[key] = value;
                }
            });
            return vars;
        }
    },
    is_authenticated: function () {
        var self = this;
        this.checkInternet({
            success: function (res) {
                if (res) {
                    $.post(self.api_url + "mauth/isvalid", { token: self.user.token }, function (res) {
                        if (!res.message) {
                            require(['libraries/database'], function (db) {
                                let _db = new db();
                                _db.createTable("login", self.fields['login'], function () { }, true);
                                window.location.href = "#login";
                            });
                        }
                    });
                }
            }
        });
    },
    loader: {
        loader_count: 0,
        show: function () {
            $('#loader_background').css({ height: $(document).height() });
            $("#loader_background").css({ display: "block" });
            this.loader_count = this.loader_count + 1;
        },
        hide: function () {
            this.loader_count = this.loader_count - 1;
            if (this.loader_count < 1) {
                $('#loader_background').css({ height: $(document).height() });
                $("#loader_background").css({ display: "none" });
            }
        }
    },
    onScroll: function () {
        var scrollTopPos = $(window).scrollTop();
        var windowHeight = $(window).height();
        $('#loader').css({ top: scrollTopPos + (windowHeight / 2) });

        $.each($(".status"), function (i, v) {
            let x = i + 1;
            $(v).css({ top: $(window).scrollTop() + (50 * x) });
        });
    },
    onlyUnique: function (value, index, self) {
        return self.indexOf(value) === index;
    },
    object_key_exists: function (object, key) {
        var status = false;
        $.each(object, function (i, v) {
            if (!status) {
                if (i == key) {
                    status = true;
                }
            }
        });
        return status;
    },
    object_value_exists: function (obj, value) {
        var status = false;
        $.each(obj, function (i, v) {
            if (v.indexOf(value) > -1) {
                status = true;
            }
        });
        return status;
    }
};
$(document).on('touchmove', Veon.onScroll);
$(window).on('scroll', Veon.onScroll);
$(document).ready(function () {
    $.each($(".status"), function (i, v) {
        let top = $(v).css("top");
        if (top == undefined || top == null || top == "") {
            top = 0
        }
        $(v).css({ top: top + $(window).scrollTop() + 50 });
    });
});