XA.component.locationService = function() {
    "use strict";
    var u = {},
        f, e, o, n = !1,
        t = [],
        i = [],
        r;
    return f = function(u, f) {
        var o;
        (t.push(f), i.push(u), n) || (n = !0, navigator.geolocation ? navigator.geolocation.getCurrentPosition(function(t) {
            for (o = 0; o < i.length; o++) i[o]([t.coords.latitude, t.coords.longitude]);
            n = !1
        }, function() {
            r("Error while detecting user location location");
            n = !1
        }, e()) : (r("Your browser doesn't support geolocation"), n = !1))
    }, e = function() {
        var n = o();
        return n.indexOf("Chrome") !== -1 ? {
            enableHighAccuracy: !0,
            timeout: 1e4,
            maximumAge: 0
        } : {
            timeout: 1e3,
            maximumAge: Infinity
        }
    }, o = function() {
        var i = navigator.userAgent,
            t, n = i.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        return /trident/i.test(n[1]) ? (t = /\brv[ :]+(\d+)/g.exec(i) || [], "IE " + (t[1] || "")) : n[1] === "Chrome" && (t = i.match(/\b(OPR|Edge)\/(\d+)/), t != null) ? t.slice(1).join(" ").replace("OPR", "Opera") : (n = n[2] ? [n[1], n[2]] : [navigator.appName, navigator.appVersion, "-?"], (t = i.match(/version\/(\d+)/i)) != null && n.splice(1, 1, t[1]), n.join(" "))
    }, r = function(n) {
        for (var i = 0; i < t.length; i++) typeof t[i] == "function" && t[i](n)
    }, u.detectLocation = function(n, t) {
        f(n, t)
    }, u
}(jQuery, document);
XA.register("locationService", XA.component.locationService);
XA.component.map = function(n, t) {
    "use strict";
    var r = {},
        e = [],
        a, v = [],
        y, o, s, f, i, p = !1,
        h, c, l, w, b, u, k = [],
        d, g;
    return w = function(n) {
        c = n
    }, b = function(n) {
        u = n
    }, h = function() {
        for (var t = e.length, n = 0; n < t; n++) k.push(new g({
            el: e[n],
            model: new d
        }));
        typeof XA.component.search != "undefined" && l()
    }, l = function() {
        var n, t = typeof c != "undefined",
            i = typeof u != "undefined";
        (t || i) && (n = k.filter(function(n) {
            return n.model.get("showed") === !1 ? !0 : !1
        }), n.length > 0 ? setTimeout(l, 1e3) : (t && XA.component.search.vent.trigger("internal-results-loaded", c), i && XA.component.search.vent.trigger("internal-my-location-coordinates-changed", u)))
    }, d = Backbone.Model.extend({
        defaults: {
            dataProperties: {},
            dynamicPoiList: [],
            showed: !1,
            myLocation: ["", ""],
            id: null,
            loadMore: !1
        },
        initialize: function() {
            var n = this.get("dataProperties").searchResultsSignature,
                t = f.parseHashParameters(window.location.hash),
                i = typeof n != "undefined" && n !== "" ? n + "_g" : "g";
            if (typeof XA.component.search != "undefined") {
                XA.component.search.vent.on("results-loaded", this.updateDynamicPoiList.bind(this));
                XA.component.search.vent.on("internal-results-loaded", this.updateDynamicPoiList.bind(this));
                XA.component.search.vent.on("my-location-coordinates-changed", this.changeMyLocation.bind(this));
                XA.component.search.vent.on("internal-my-location-coordinates-changed", this.changeMyLocation.bind(this));
                XA.component.search.vent.on("hashChanged", this.hashChanged.bind(this))
            }
            t.hasOwnProperty(i) && t[i] !== "" && this.set("myLocation", t[i].split("|"))
        },
        getPoiVariant: function(n, t) {
            var r = this.get("dataProperties").typeToVariantMapping,
                i;
            return typeof n != "undefined" && n != null ? (i = "{" + n.toUpperCase() + "}", r.hasOwnProperty(i) ? r[i] : t) : t
        },
        updateDynamicPoiList: function(n) {
            var r = [],
                f = this.get("dataProperties").searchResultsSignature,
                u = n.data.filter(function(n) {
                    return n.hasOwnProperty("Geospatial") ? !0 : !1
                }),
                i, t;
            if (f === n.searchResultsSignature) {
                for (this.set("loadMore", n.loadMore), i = 0; i < u.length; i++)(t = u[i], t.Geospatial.Latitude !== 0 && t.Geospatial.Longitude !== 0) && r.push({
                    id: t.Id,
                    type: "Dynamic",
                    title: t.Name,
                    latitude: t.Geospatial.Latitude,
                    longitude: t.Geospatial.Longitude,
                    icon: t.Geospatial.PoiIcon,
                    poiTypeId: t.Geospatial.PoiTypeId,
                    poiVariantId: this.getPoiVariant(t.Geospatial.PoiTypeId, t.Geospatial.PoiVariantId)
                });
                this.set("dynamicPoiList", r)
            }
        },
        changeMyLocation: function(n) {
            var t = this.get("dataProperties").searchResultsSignature;
            t === n.sig && this.set("myLocation", n.coordinates)
        },
        hashChanged: function(n) {
            var r = this.get("dataProperties").searchResultsSignature,
                t = n[r !== "" ? r + "_g" : "g"],
                f = typeof u != "undefined" ? u.sig : "",
                i;
            r === f && typeof t != "undefined" && t !== null && t !== "" && (i = t.split("|"), i.length > 1 && this.set("myLocation", [i[0], i[1]]))
        }
    }), g = Backbone.View.extend({
        initialize: function() {
            var n = this.$el.data(),
                t = n.properties;
            this.model && (this.model.set({
                dataProperties: t
            }), this.model.set({
                id: this.$el.find(".map-canvas").prop("id")
            }));
            this.render();
            this.model.on("change:dynamicPoiList", this.renderDynamicPois, this);
            this.model.on("change:myLocation", this.updateMyLocationPoi, this);
            if (typeof XA.component.search != "undefined") XA.component.search.vent.on("center-map", this.handleCenterMap.bind(this));
            this.updateMyLocationPoi()
        },
        render: function() {
            var u = this,
                n = this.model.get("showed"),
                r = t.getElementById(this.model.get("id"));
            n || r === null || this.getCentralPoint(function(n, t) {
                if (typeof n != "undefined") {
                    var u = typeof t != "undefined" ? t : this,
                        f = u.model.get("id"),
                        r = u.model.get("dataProperties"),
                        e = {
                            canvasId: f,
                            zoom: typeof r.zoom == "number" ? r.zoom : u.parseZoom(r.zoom, 15),
                            mode: r.mode,
                            poiCount: r.pois.length,
                            key: r.key,
                            disableMapScrolling: r.disableMapScrolling,
                            disableMapZoomOnScroll: r.disableMapZoomOnScroll
                        };
                    i.showMap(f, e, n);
                    u.renderPoiList(f, r.pois);
                    u.model.set("showed", !0)
                }
            })
        },
        renderDynamicPois: function() {
            var u = this.model.get("dataProperties"),
                t = this.model.get("dynamicPoiList"),
                f = this.model.get("dataProperties"),
                r = this.model.get("id"),
                n;
            for (this.model.get("loadMore") || i.clearMarkers(r), n = 0; n < t.length; n++) i.renderDynamicPoi(r, t[n], this.getGeoPoiContent.bind(this));
            u.centralPointMode === "MidOfPoi" && i.updateMapPosition(this.model.get("id"), this.parseZoom(f.zoom, 15))
        },
        renderPoiList: function(n, t) {
            for (var r, s, c = t.length, l = this.model.get("dataProperties"), h = l.searchResultsSignature, u = f.parseHashParameters(window.location.hash), e = h !== "" ? h + "_g" : "g", o = 0; o < c; o++) {
                if (r = t[o], r.Type === "MyLocation") s = this.model.get("myLocation"), r.Latitude = s[0], r.Longitude = s[1], !u.hasOwnProperty(e) || u.hasOwnProperty(e) && u[e] === "" ? this.getCurrentPosition(function(n) {
                    this.model.set("myLocation", n)
                }) : u.hasOwnProperty(e) && this.model.set("myLocation", u[e].split("|"));
                else if (r.Latitude === "" || r.Longitude === "") continue;
                i.renderPoi(n, {
                    id: r.Id.Guid,
                    title: r.Title,
                    description: r.Description,
                    latitude: r.Latitude,
                    longitude: r.Longitude,
                    icon: r.PoiIcon,
                    html: r.Html,
                    type: r.Type
                })
            }
        },
        getPoiContent: function(n, t, i, r) {
            var u = this.model.get("dataProperties"),
                f = o.createGetPoiContentUrl({
                    endpoint: u.variantsEndpoint
                }, n, i);
            s.getData({
                callback: r,
                url: f,
                excludeSiteName: !0
            })
        },
        getGeoPoiContent: function(n, t, i, r) {
            var u = this.model.get("myLocation"),
                h = u[0],
                c = u[1],
                e = this.model.get("dataProperties"),
                l = f.parseHashParameters(window.location.hash),
                a = l.o,
                v = o.createGetGeoPoiContentUrl({
                    endpoint: e.variantsEndpoint
                }, n, i, h + "," + c, a, e.itemId);
            s.getData({
                callback: r,
                url: v,
                excludeSiteName: !0
            })
        },
        getCentralPoint: function(n) {
            var t = this.model.get("dataProperties"),
                i = this;
            switch (t.centralPointMode) {
                case "Auto":
                    t.centralPoint !== "" ? n.call(i, [t.latitude, t.longitude]) : t.pois.length > 0 ? n.call(i, [t.pois[0].Latitude, t.pois[0].Longitude]) : this.getCurrentPosition(n);
                    break;
                case "MidOfPoi":
                    n.call(i, this.getPoisCentralPoint());
                    break;
                case "Location":
                    this.getCurrentPosition(n)
            }
        },
        getCurrentPosition: function(n) {
            var t = this;
            XA.component.locationService.detectLocation(function(i) {
                n.call(t, i, t)
            }, function(i) {
                n.call(t, [0, 0], t);
                console.log(i)
            })
        },
        getPoisCentralPoint: function() {
            for (var n, u = [], r = this.model.get("myLocation"), f = this.model.get("dataProperties"), e = f.pois.length, t = 0; t < e; t++) n = f.pois[t], n.TemplateId.Guid === "7dd9ece5-9461-498d-8721-7cbea8111b5e" ? r[0] !== "" && r[1] !== "" && (n.Latitude = r[0], n.Longitude = r[1], this.model.set("dataProperties", f), u.push({
                latitude: n.Latitude,
                longitude: n.Longitude
            })) : u.push({
                latitude: n.Latitude,
                longitude: n.Longitude
            });
            return i.getCentralPoint(u)
        },
        handleCenterMap: function(n) {
            var t = this.model.get("dataProperties").centerOnFoundPoi === "1",
                i = this.model.get("dataProperties").animateFoundPoi === "1";
            this.centerOnMap(n, t, i)
        },
        centerOnMap: function(n, t, r) {
            n.sig === this.model.get("dataProperties").searchResultsSignature && i.centerMap(this.model.get("id"), n, t, r)
        },
        updateMyLocationPoi: function() {
            var n = this.model.get("dataProperties"),
                r = this.model.get("myLocation"),
                t;
            r[0] !== "" && r[1] !== 0 ? i.updateMyPoiLocation(this.model.get("id"), r, this.parseZoom(n.zoom, 15)) : n.latitude !== "" && n.longitude !== "" && (t = {}, t.sig = n.searchResultsSignature, t.coordinates = [n.latitude, n.longitude], this.centerOnMap(t, !0, !1))
        },
        parseZoom: function(n, t) {
            var i = t;
            return n !== null && n.length > 0 && (isNaN(n) || (i = parseInt(n))), i
        }
    }), r.init = function() {
        var t, c = n(".map.component:not(.initialized)"),
            l = c.length,
            r, u;
        if (typeof XA.component.search != "undefined") {
            f = XA.component.search.query;
            o = XA.component.search.url;
            s = XA.component.search.ajax;
            XA.component.search.vent.on("results-loaded", w);
            XA.component.search.vent.on("my-location-coordinates-changed", b)
        }
        if (i = XA.connector.mapsConnector, l > 0) {
            for (t = 0; t < l; t++) r = n(c[t]), u = r.data("properties"), y = u.key, a = u.endpoint, v.push(u.searchResultsSignature), r.addClass("initialized"), e.push(r);
            p ? h() : i.loadScript(y, XA.component.map.scriptsLoaded)
        }
    }, r.scriptsLoaded = function() {
        console.log("Maps api loaded");
        p = !0;
        h()
    }, r.getSearchEndpoint = function() {
        return a
    }, r.getSignatures = function() {
        return v
    }, r
}(jQuery, document);
XA.register("map", XA.component.map)