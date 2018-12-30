define(function (require) {
    let v = require("libraries/v");
    require("google-map");
    let map = v.extend({
        options: {},
        initialize: function () {
            map.__super__.initialize.apply(this, arguments);
            this.listenTo(this.collection, "reset", this.render);
        },
        init: function () {
            this.map = new google.maps.Map(this.$el[0], this.options);
        },
        setOptions: function () {
            this.options = {
                zoom: this.getZoom(),
                center: this.latlng(this.collection.zipData.lat, this.collection.zipData.lng),
                streetViewControl: false
            };

        },
        getZoom: function () {
            let rad = this.filters.map.radius;
            let zoom = 1;
            if (rad <= 6) {
                zoom = 11;
            } else if (rad <= 12) {
                zoom = 10;
            } else if (rad <= 25) {
                zoom = 9;
            } else if (rad <= 50) {
                zoom = 8;
            } else if (rad <= 100) {
                zoom = 7;
            } else if (rad <= 200) {
                zoom = 6;
            } else if (rad <= 400) {
                zoom = 5;
            } else if (rad <= 800) {
                zoom = 4;
            } else if (rad <= 1600) {
                zoom = 3;
            } else {
                zoom = 2;
            }
            return zoom;
        },
        search: function () {
            if (this.parent.$el.find("#cust_show_facilities").val() == "1") {
                this.add("cust_show_facilities", 1);
            } else if (this.parent.$el.find("#cust_show_contacts").val() == "1") {
                this.add("cust_show_contacts", 1);
            }
            this.collection.fetch({reset: true, data: this.filters, type: "POST", error: this.showErrors});
        },
        latlng: function (lat, lng) {
            return new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
        },
        addMarker: function (model) {
            let marker = new google.maps.Marker(this.markerOptions(model));
            if (!_.isEmpty(model.get("info"))) {
                this.addInfo(marker, model.get("info"));
            }
            return marker;
        },
        markerOptions: function (model) {
            let options = {
                map: this.map,
                position: this.latlng(model.get("latitude"), model.get("longitude")),
                animation: google.maps.Animation.DROP,
            };
            if (!_.isEmpty(model.get("map_marker_img"))) {
                options.icon = model.get("map_marker_img");

                if (model.get("label") != undefined) {
                    options.label = model.get("label").toString();
                    options.labelAnchor = new google.maps.Point(13, 28);
                    var cssCls = 'map_icon_labels';
                    if (options.icon.indexOf("green") != -1) {
                        cssCls = 'map_icon_labels_green';
                    } else if (options.icon.indexOf("blue") != -1) {
                        cssCls = 'map_icon_labels_blue';
                    } else {
                        cssCls = 'map_icon_labels';
                    }
                    options.draggable = true;
                    options.labelClass = cssCls;
                    options.labelInBackground = false;
                }
            }
            if (!_.isEmpty(model.get("title"))) {
                options.title = model.get("title");
            }
            return options;
        },
        addInfo: function (marker, content) {
            let infoWindow = new google.maps.InfoWindow;
            var self = this;
            marker.addListener('click', function () {
                infoWindow.setContent(content);
                infoWindow.open(self.map, marker);
            });
        },
        showCircle: function () {
            let circleOptions = {
                strokeColor: '#C3F0FF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#C3F0FF',
                fillOpacity: 0.35,
                map: this.map,
                center: this.latlng(this.collection.zipData.lat, this.collection.zipData.lng),
                radius: 1000 * 1.60934 * this.filters.map.radius,
            };
            new google.maps.Circle(circleOptions);
        },
        render: function () {
            var self = this;
            this.utils.loader.hide();
            if (this.collection.length > 0) {
                this.$el.css({"height": "400px"});
                this.setOptions();
                this.init();
                this.collection.forEach(function (model) {
                    self.addMarker(model);
                });
                this.showCircle();
            } else {
                this.$el.html("<p>No results found to plot on the map</p>");
                this.$el.css({"height": "auto"});
            }
        }
    });
    return map;
});