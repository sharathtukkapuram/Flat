/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Veon = {
    setMain: function (d) {
        this.main = d;
    },
    url: "http://localhost/test/",
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
    getServerTime: function () {
        var time = "";
        $.ajax({
            url: "../backEnd/login/time",
            type: 'GET',
            cache: false,
            async: false,
            error: function (msg, res) {
                console.error(res);
            },
            success: function (msg) {
                time = new Date(msg.date);
            }
        });
        return time;
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
        if (this.cookie.get("user_id") == "" || this.cookie.get("rest_id") == "") {
            window.location.href = "#login";
            window.location.reload();
        }
        $.post("../backEnd/login/authenticate", function (res) {
            if (!res.status) {
                window.location.href = "#login";
                window.location.reload();
            }
        });
    },
    loader: {
        loader_count: 0,
        show: function () {
            $('#loader_background').css({height: $(document).height()});
            $("#loader_background").css({display: "block"});
            this.loader_count = this.loader_count + 1;
        },
        hide: function () {
            this.loader_count = this.loader_count - 1;
            if (this.loader_count < 1) {
                $('#loader_background').css({height: $(document).height()});
                $("#loader_background").css({display: "none"});
            }
        }
    },
    onScroll: function () {
        var scrollTopPos = $(window).scrollTop();
        var windowHeight = $(window).height();
        $('#loader').css({top: scrollTopPos + (windowHeight / 2)});

        $.each($(".status"), function (i, v) {
            let x = i + 1;
            $(v).css({top: $(window).scrollTop() + (50 * x)});
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
        $(v).css({top: top + $(window).scrollTop() + 50});
    });
});