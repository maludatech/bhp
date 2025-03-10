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
            r("Error while detecting user location");
            n = !1
        }, e()) : (r("Your browser does not support geolocation"), n = !1))
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
XA.component.search = {};
XA.component.search.facet = {};
XA.component.search.results = {};
XA.component.search.vent = _.extend({}, Backbone.Events);
XA.component.search.ajax = function() {
    var n;
    return n = Backbone.Model.extend({
        getData: function(n) {
            var t = this.getPrameterByName("sc_site"),
                i = typeof n.excludeSiteName != "undefined" && n.excludeSiteName ? n.url : XA.component.search.url.createSiteUrl(n.url, t);
            Backbone.ajax({
                dataType: "json",
                url: i,
                success: function(t) {
                    n.callback(t)
                }
            })
        },
        getPrameterByName: function(n, t) {
            t || (t = window.location.href);
            n = n.replace(/[\[\]]/g, "\\$&");
            var r = new RegExp("[?&]" + n + "(=([^&#]*)|&|#|$)"),
                i = r.exec(t);
            return i ? i[2] ? decodeURIComponent(i[2].replace(/\+/g, " ")) : "" : null
        }
    }), new n
}(jQuery, document);
XA.component.search.baseModel = function() {
    return Backbone.Model.extend({
        sortFacetArray: function(n, t) {
            switch (n) {
                case "SortByCount":
                    t.sort(function(n, t) {
                        return t.Count - n.Count
                    })
            }
        }
    })
}(jQuery, document);
XA.register("searchBaseModel", XA.component.search.baseModel);
XA.component.search.baseView = function(n) {
    return Backbone.View.extend({
        initialize: function() {},
        translateSignatures: function(n, t) {
            var i, r;
            if (t = t.toLowerCase(), typeof n == "undefined" || n === null) return [t];
            if (i = n.split(","), n === "") return [t];
            for (r = 0; r < i.length; r++) i[r] = i[r] + "_" + t;
            return i
        },
        updateSignaturesHash: function(n, t, i) {
            for (var r = 0; r < n.length; r++) i[n[r]] = t;
            return i
        },
        manageVisibilityByData: function(t, i) {
            _.size(i) === 0 || typeof i.Values != "undefined" && i.Values.length == 0 ? n(t).hide() : n(t).show()
        }
    })
}(jQuery, document);
XA.register("searchBaseView", XA.component.search.baseView);
XA.component.search.box = function(n) {
    var i = {},
        u = [],
        f = [],
        r, t, e, o = Backbone.Model.extend({
            defaults: {
                searchEngine: "",
                typeahead: "",
                dataProperties: {},
                searchQuery: "",
                loadingInProgress: !1,
                sig: []
            },
            initSearchEngine: function() {
                var i = this,
                    r = XA.component.search.ajax.getPrameterByName("sc_site"),
                    u = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        limit: i.get("dataProperties").p,
                        remote: {
                            url: t.createSiteUrl(i.createSuggestionsUrl(n.extend({
                                l: i.getLanguage()
                            }, i.get("dataProperties")), i.get("searchQuery")), r),
                            filter: function(n) {
                                return _.map(n.Results, function(n) {
                                    return {
                                        html: n.Html
                                    }
                                })
                            },
                            replace: function() {
                                var u = i.get("valueProvider"),
                                    f = u(),
                                    e = n.extend({
                                        l: i.getLanguage()
                                    }, i.get("dataProperties"));
                                return t.createSiteUrl(i.createSuggestionsUrl(e, f), r)
                            },
                            ajax: {
                                beforeSend: function() {
                                    i.set({
                                        loadingInProgress: !0
                                    })
                                },
                                complete: function() {
                                    i.set({
                                        loadingInProgress: !1
                                    })
                                }
                            }
                        }
                    });
                u.initialize();
                this.set({
                    searchEngine: u
                })
            },
            createSuggestionsUrl: function(n, i) {
                var r = this.get("dataProperties").suggestionsMode,
                    u = this.get("dataProperties").endpoint,
                    f = this.get("dataProperties").suggestionEndpoint;
                switch (r) {
                    case "ShowPredictions":
                        return t.createPredictiveSearchUrl(f, n, i);
                    default:
                        return t.createPredictiveSearchUrl(u, n, i)
                }
            },
            getSignature: function() {
                var n = this.get("dataProperties").searchResultsSignature,
                    t;
                return typeof n == "undefined" || n === null ? "" : (t = n.split(","), n === "" ? "" : t[0])
            },
            getLanguage: function() {
                var t = this.get("dataProperties"),
                    i = XA.component.search.results.searchResultModels,
                    r = t.languageSource,
                    u = this.getSignature(),
                    n;
                switch (r) {
                    case "CurrentLanguage":
                    case "AllLanguages":
                        return t.l;
                    default:
                        if (n = i.filter(function(n) {
                                return n.get("dataProperties").sig === u
                            })[0], typeof n != "undefined") return n.get("dataProperties").l
                }
                return ""
            }
        }),
        s = XA.component.search.baseView.extend({
            initialize: function() {
                var t = this,
                    n = this.$el.data(),
                    i;
                n.properties.targetSignature = n.properties.targetSignature !== null ? n.properties.targetSignature : "";
                this.model.set({
                    dataProperties: n.properties
                });
                this.model.set("sig", this.translateSignatures(n.properties.searchResultsSignature, "q"));
                this.model.initSearchEngine();
                this.model.on("change:loadingInProgress", this.loading, this);
                i = this.$el.find(".search-box-input").typeahead({
                    hint: !0,
                    minLength: n.properties.minSuggestionsTriggerCharacterCount
                }, {
                    source: t.model.get("searchEngine").ttAdapter(),
                    displayKey: function() {
                        return t.$el.find(".search-box-input.tt-input").val()
                    },
                    templates: {
                        suggestion: function(t) {
                            var r = n.properties.suggestionsMode,
                                i = t.html.replace(/(<([^>]+)>)/ig, ""),
                                u = i !== "" ? i : t.html;
                            switch (r) {
                                case "ShowPredictions":
                                case "ShowSearchResultsAsPredictions":
                                    return '<div class="sugesstion-item">' + u + "<\/div>";
                                default:
                                    return '<div class="sugesstion-item">' + t.html + "<\/div>"
                            }
                        }
                    }
                }).on("typeahead:selected", this.suggestionSelected.bind(t));
                this.model.set({
                    typeahead: i
                });
                this.model.set({
                    valueProvider: function() {
                        return t.$el.find(".search-box-input.tt-input").val()
                    }
                });
                XA.component.search.vent.on("hashChanged", this.updateSearchBoxValue.bind(this))
            },
            events: {
                "click .search-box-button": "updateQueryModelClick",
                "click .search-box-button-with-redirect": "updateQueryWithRedirect",
                "keypress .search-box-input.tt-input": "predictiveSearch",
                "keydown .search-box-input.tt-input": "predictiveSearch"
            },
            loading: function() {
                this.$el.toggleClass("loading-in-progress")
            },
            suggestionSelected: function(t, i) {
                var f, r, e, u;
                t.preventDefault();
                f = this.model.get("dataProperties").suggestionsMode;
                try {
                    r = n(i.html).text()
                } catch (o) {
                    r = ""
                }
                e = r != "" ? r : i.html;
                switch (f) {
                    case "ShowPredictions":
                    case "ShowSearchResultsAsPredictions":
                        this.performSearch(e);
                        break;
                    default:
                        u = n(i.html).find("a");
                        u.length && (window.location.href = n(u[0]).attr("href"))
                }
            },
            updateQueryWithRedirect: function(n) {
                n.preventDefault();
                var f = this.model.get("dataProperties").resultPage,
                    i = this.model.get("dataProperties").targetSignature,
                    e = this.model.get("dataProperties").searchResultsSignature,
                    r = encodeURIComponent(this.$el.find(".search-box-input.tt-input").val()),
                    o = this.model.get("sig"),
                    u = {};
                u = i !== "" ? this.updateSignaturesHash([i + "_q"], r, this.createOffsetObject()) : this.updateSignaturesHash(o, r, this.createOffsetObject());
                window.location.href = t.createRedirectSearchUrl(f, u, e, i)
            },
            updateQueryModelClick: function(n) {
                n.preventDefault();
                var t = this.$el.find(".search-box-input.tt-input").val();
                this.closeDropdown();
                this.updateQueryModel(t)
            },
            updateQueryModel: function(n) {
                for (var i = {}, f = this.translateSignatures(this.model.get("dataProperties").searchResultsSignature, "e"), u = this.model.get("sig"), t = 0; t < u.length; t++) i[u[t]] = n, i[f[t]] = 0;
                r.updateHash(i, this.model.get("dataProperties").targetUrl)
            },
            predictiveSearch: function(n) {
                n.keyCode === 13 && (n.preventDefault(), this.performSearch(this.$el.find(".search-box-input.tt-input").val()))
            },
            performSearch: function(i) {
                var r = this.model.get("dataProperties"),
                    u = r.targetSignature,
                    o = r.searchResultsSignature,
                    f = r.resultPage,
                    s = this.model.get("sig"),
                    e = {};
                this.closeDropdown();
                f === "" ? (this.updateQueryModel(i), n(".search-box-input").typeahead("val", i)) : (i = encodeURIComponent(i), e = u !== "" ? this.updateSignaturesHash([u + "_q"], i, this.createOffsetObject()) : this.updateSignaturesHash(s, i, this.createOffsetObject()), window.location.href = t.createRedirectSearchUrl(f, e, o, u))
            },
            createOffsetObject: function() {
                for (var r = this.model.get("sig"), t = this.model.get("dataProperties").targetSignature, u = t !== "" ? t : this.model.get("dataProperties").searchResultsSignature, f = this.translateSignatures(u, "e"), i = {}, n = 0; n < r.length; n++) i[f[n]] = 0;
                return i
            },
            updateSearchBoxValue: function() {
                for (var i = r.parseHashParameters(window.location.hash), u = this.$el.find(".search-box-input.tt-input"), t = this.model.get("sig"), n = 0; n < t.length; n++) i.hasOwnProperty(t[n]) ? u.val(decodeURIComponent(i[t[n]])) : u.val("")
            },
            closeDropdown: function() {
                this.$el.find(".search-box-input").typeahead("close")
            }
        });
    return i.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            r = XA.component.search.query;
            e = XA.component.search.results.searchResultModels;
            t = XA.component.search.url;
            var i = n(".search-box:not(.initialized)");
            _.each(i, function(t) {
                var i = n(t),
                    r = new o;
                f.push(r);
                u.push(new s({
                    el: i,
                    model: r
                }));
                i.addClass("initialized")
            })
        }
    }, i.searchBoxViews = u, i.searchBoxModels = f, i
}(jQuery, document);
XA.register("searchBox", XA.component.search.box);
XA.component.search.facet.data = function(n) {
    var t = Backbone.Model.extend({
        defaults: {},
        initialize: function() {},
        getInitialFacetData: function() {
            var r = this.getFacetRequestData(),
                i = r.data,
                n = [],
                u;
            for (var t in i) i.hasOwnProperty(t) && (n = n.concat(i[t].normalFiltering), n = n.concat(i[t].partialFiltering), u = this.getSearchResultsLanguage(t), n.length > 0 && XA.component.search.ajax.getData({
                callback: function(n) {
                    XA.component.search.vent.trigger("facet-data-loaded", n)
                },
                url: XA.component.search.url.createMultiFacetUrl({
                    endpoint: r.endpoint,
                    s: r.s,
                    l: u
                }, n, t)
            }))
        },
        filterFacetData: function(t) {
            var f = this.getFacetRequestData(t),
                r = f.data,
                u, e, o, h, s;
            for (var i in r) r.hasOwnProperty(i) && (e = this.getSearchResultsLanguage(i), o = this.getSearchResultsScope(i), h = this.getSearchResultsModelBySignature(i), s = h.get("dataProperties").itemid, r[i].normalFiltering.length > 0 && (u = n.extend({
                endpoint: f.endpoint,
                s: o,
                l: e
            }, t), XA.component.search.ajax.getData({
                callback: function(n) {
                    XA.component.search.vent.trigger("facet-data-filtered", n)
                },
                url: XA.component.search.url.createMultiFacetUrl(u, r[i].normalFiltering, i, s)
            })), r[i].partialFiltering.length > 0 && _.each(r[i].partialFiltering, function(r) {
                var h = n.extend({}, t);
                delete h[i !== "" ? i + "_" + r : r];
                delete h[i !== "" ? i + "_" + r.toLowerCase() : r.toLowerCase()];
                u = n.extend({
                    endpoint: f.endpoint,
                    s: o,
                    l: e
                }, h);
                XA.component.search.ajax.getData({
                    callback: function(n) {
                        XA.component.search.vent.trigger("facet-data-partial-filtered", n)
                    },
                    url: XA.component.search.url.createMultiFacetUrl(u, [r], i, s)
                })
            }))
        },
        getFacetRequestData: function(n) {
            var o = this,
                f = [],
                t = {},
                e, i, r, u;
            for (e in XA.component.search.facet) i = XA.component.search.facet[e], typeof i.getFacetDataRequestInfo == "function" && (f = i.getFacetDataRequestInfo(), _.each(f, function(i) {
                u = i.signature !== "" ? i.signature + "_" + i.facetName : i.facetName;
                t.hasOwnProperty(i.signature) || o.initRequestObject(t, i);
                i.filterWithoutMe && (n === undefined || n.hasOwnProperty(u) || n.hasOwnProperty(u.toLowerCase())) ? (t[i.signature].partialFiltering.push(i.facetName), r = i.endpoint) : (t[i.signature].normalFiltering.push(i.facetName), r = i.endpoint)
            }));
            return {
                endpoint: r,
                data: t
            }
        },
        initRequestObject: function(n, t) {
            n[t.signature] = {};
            n[t.signature].normalFiltering = [];
            n[t.signature].partialFiltering = []
        },
        getSearchResultsLanguage: function(n) {
            var t = this.getSearchResultsModelBySignature(n);
            return typeof t != "undefined" ? t.get("dataProperties").l : ""
        },
        getSearchResultsScope: function(n) {
            var t = this.getSearchResultsModelBySignature(n);
            return typeof t != "undefined" ? t.get("dataProperties").s : ""
        },
        getSearchResultsModelBySignature: function(n) {
            var t = XA.component.search.results.searchResultModels;
            return t.filter(function(t) {
                return t.get("dataProperties").sig === n
            })[0]
        }
    });
    return new t
}(jQuery, document);
XA.component.search.facet.summary = function(n) {
    var i = {},
        r = XA.component.search.url,
        t = XA.component.search.query,
        u = XA.component.search.ajax,
        f = "summary",
        e = Backbone.Model.extend({
            defaults: {
                dataProperties: {},
                sig: [],
                hash: ""
            },
            initialize: function() {
                var n = this;
                this.set("resultData", {});
                XA.component.search.vent.on("facet-data-loaded", n.processData.bind(n));
                XA.component.search.vent.on("facet-data-partial-filtered", n.processData.bind(n));
                XA.component.search.vent.on("facet-data-filtered", n.processData.bind(n))
            },
            requestFacetData: function(n, t) {
                return _.find(n, function(n) {
                    return n.Key.toLowerCase() === t.facetName.toLowerCase()
                })
            },
            translateSignatures: function(n, t) {
                var i, r;
                if (t = t.toLowerCase(), typeof n == "undefined" || n === null) return [t];
                if (i = n.split(","), n === "") return [t];
                for (r = 0; r < i.length; r++) i[r] = i[r] + "_" + t;
                return i
            },
            processData: function(n) {
                var w = t.parseHashParameters(window.location.hash),
                    i, h = this,
                    c, l = [],
                    b, a, k = XA.component.search.facet,
                    r, v, y, u, f, e, p, o, s;
                for (b in k)
                    if (a = XA.component.search.facet[b], typeof a.getFacetDataRequestInfo == "function")
                        for (l = a.getFacetDataRequestInfo(), r = 0; r < l.length; r++)
                            for (v = l[r], y = v.signature.split(","), u = 0; u < y.length; u++)
                                if (f = y[u], n.Signature == f && h.get("sig") == f && (i = h.requestFacetData(n.Facets, v), typeof i != "undefined")) {
                                    for (c = i.Name, e = this.get("resultData"), p = h.translateSignatures(f, i.Key.toLowerCase()), o = 0; o < p.length; o++) s = p[o], w[s] ? e[c] = {
                                        value: w[s],
                                        key: i.Key,
                                        signature: n.Signature,
                                        facetHashName: s
                                    } : delete e[c];
                                    this.set("resultData", e);
                                    this.trigger("change", this)
                                }
            }
        }),
        o = XA.component.search.baseView.extend({
            tagName: "div",
            className: "facet-search-summary",
            template: "<% if(Object.keys(resultData).length){ %> <div class='facet-summary-wrapper clearfix'>" + "<% _.forEach(resultData, function(obj,key){ %>" + "<div class='active-facet-summary-element' data-hash='" + "<%=obj.facetHashName%>" + "' data-key='" + "<%=obj.key%>" + "' data-signature='" + "<%=obj.signature%>" + "'>" + "<span class='facet-summary-name'><%= key  %>:<\/span> " + "<%= renderFacetValues(obj.value) %>" + "<\/div>" + "<% }); %>" + "<\/div><% }%>",
            renderFacetValues: function(n) {
                var t = n.split("||");
                return t.map(function(n) {
                    return "<div class='facet-summary-value' data-value=" + encodeURIComponent(n) + "><p>" + n + "<\/p><span class='removeFacetValue'>x<\/span><\/div>"
                }).join(" ")
            },
            clearButtons: function(t) {
                var i = n(t.currentTarget),
                    r = i.closest(".facet-summary");
                r.find(".clear-all-active-facets").trigger("click")
            },
            initialize: function() {
                var n = this.$el.data(),
                    t = this,
                    i = n.properties,
                    r;
                Backbone.$(".facet-summary .clear-filter").on("click", function(n) {
                    t.clearButtons(n)
                });
                Backbone.$(".facet-summary .bottom-remove-filter").on("click", function(n) {
                    t.clearButtons(n)
                });
                r = this.translateSignatures(i.searchResultsSignature, f);
                this.model.set("sig", i.searchResultsSignature);
                n = this.$el.data("properties");
                this.model.on("change", this.render, this);
                this.render()
            },
            events: {
                "click .removeFacetValue": "removeFacetValue",
                "click .clear-filter": "clearAllActiveFacets",
                "click .bottom-remove-filter button": "clearAllActiveFacets"
            },
            createHash: function(n) {
                var t = "#";
                for (option in n) t += option + "=" + n[option] + "&";
                return t
            },
            updateLocation: function(n) {
                XA.component.search.query.updateHash(n)
            },
            getFacetParams: function(t) {
                var i = n(t).closest(".active-facet-summary-element");
                return {
                    key: i.data("key"),
                    signature: i.data("signature")
                }
            },
            clearAllActiveFacets: function() {
                var i = this,
                    r = t.parseHashParameters(window.location.hash);
                this.$el.find(".active-facet-summary-element").each(function() {
                    var t = i.getFacetParams(n(this)),
                        u = i.translateSignatures(t.signature, t.key);
                    _.each(u, function(n) {
                        r[n] = ""
                    })
                });
                i.updateLocation(r)
            },
            removeFacetValue: function(i) {
                var f = n(i.currentTarget).closest(".facet-summary-value"),
                    e = decodeURIComponent(f.data("value")),
                    u = this.getFacetParams(i.currentTarget),
                    r = t.parseHashParameters(window.location.hash),
                    o = this.translateSignatures(u.signature, u.key),
                    s = function(n) {
                        r[n] = r[n].split("||").filter(function(n) {
                            return n !== e
                        }).join("||")
                    };
                _.each(o, s);
                this.updateLocation(r)
            },
            render: function() {
                var r = this,
                    n = this.model.get("resultData"),
                    t, i, u = this.$el.data();
                (this.properties = u.properties, this.manageVisibilityByData(this.$el, n), this.model && (this.model.set({
                    dataProperties: this.properties
                }), this.model.set("sig", this.properties.searchResultsSignature)), window.location.href.startsWith("file://")) || (n !== undefined && (t = _.template(this.template, {
                    imports: {
                        renderFacetValues: this.renderFacetValues
                    }
                }), i = t({
                    resultData: n
                })), r.$el.find(".facet-summary-placeholder").html(i))
            }
        });
    return i.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            t = XA.component.search.query;
            u = XA.component.search.ajax;
            r = XA.component.search.url;
            var i = n(".facet-summary:not(.initialized)");
            _.each(i, function(t) {
                var i = n(t),
                    r = new e,
                    u = new o({
                        el: i,
                        model: r
                    });
                i.addClass("initialized")
            })
        }
    }, i
}(jQuery, document);
XA.register("facetSummary", XA.component.search.facet.summary);
XA.component.search.facet.dropdown = function(n) {
    "use strict";
    var i = {},
        r, t, u = XA.component.search.baseModel.extend({
            defaults: {
                template: "<% _.forEach(results, function(result){" + "%><option data-facetName=\"<%= result.Name !== '' ? encodeURIComponent(result.Name) : '_empty_' %>\" <%= result.Selected !== undefined ? 'selected' : '' %> ><%= result.Name !== '' ? result.Name : emptyText %> (<%= result.Count %>)<\/option><%" + "}); %>",
                dataProperties: {},
                blockNextRequest: !1,
                resultData: {},
                optionSelected: !1,
                sig: []
            },
            initialize: function() {
                XA.component.search.vent.on("facet-data-loaded", this.processData.bind(this));
                XA.component.search.vent.on("facet-data-filtered", this.processData.bind(this));
                XA.component.search.vent.on("facet-data-partial-filtered", this.processData.bind(this));
                XA.component.search.vent.on("hashChanged", this.updateComponent.bind(this))
            },
            toggleBlockRequests: function() {
                var n = this.get("blockNextRequest");
                this.set(this.get("blockNextRequest"), !n)
            },
            processData: function(n) {
                for (var o = this, s = t.parseHashParameters(window.location.hash), f = o.get("sig"), h = this.get("dataProperties"), c = h.searchResultsSignature.split(","), l = h.sortOrder, a = h.f, u, i, r, e = 0; e < c.length; e++)
                    if (n.Facets.length > 0 && n.Signature === c[e] || n.Signature === "" || n.Signature === null) {
                        if (i = _.find(n.Facets, function(n) {
                                return n.Key.toLowerCase() === a.toLowerCase()
                            }), i === undefined) return;
                        for (r = 0; r < f.length; r++) jQuery.isEmptyObject(_.pick(s, f[r])) || s[f[r]] !== "" && (u = _.where(i.Values, {
                            Name: s[f[r]]
                        }), u.length === 0 && (u = _.where(i.Values, {
                            Name: ""
                        })), u.length > 0 && (u[0].Selected = !0, o.optionSelected = !0));
                        this.sortFacetArray(l, i.Values);
                        o.set({
                            resultData: i.Values
                        })
                    }
            },
            updateComponent: function(n) {
                for (var r = this.get("sig"), i, t = 0; t < r.length; t++) i = r[t].toLowerCase(), n.hasOwnProperty(i) && n[i] !== "" ? this.set({
                    optionSelected: !0
                }) : this.set({
                    optionSelected: !1
                })
            }
        }),
        f = XA.component.search.baseView.extend({
            initialize: function() {
                var n = this.$el.data();
                this.properties = n.properties;
                this.model && (this.model.set({
                    dataProperties: this.properties
                }), this.model.set("sig", this.translateSignatures(this.properties.searchResultsSignature, this.properties.f)));
                this.model.on("change", this.render, this)
            },
            events: {
                "change .facet-dropdown-select": "updateFacet",
                "click .bottom-remove-filter, .clear-filter": "clearFilter"
            },
            updateFacet: function() {
                var i = this.$el.find(".facet-dropdown-select").find("option:selected"),
                    n = decodeURIComponent(i.data("facetname")),
                    r = this.model.get("sig");
                n === "" ? this.model.set({
                    optionSelected: !1
                }) : this.model.set({
                    optionSelected: !0
                });
                t.updateHash(this.updateSignaturesHash(r, n, {}))
            },
            render: function() {
                var t = this,
                    r = t.model.get("resultData"),
                    u = this.$el.find(".facet-dropdown-select"),
                    o = t.model.get("dataProperties").emptyValueText,
                    f = this.$el.find(".facet-heading > span"),
                    e = u.find("option:first"),
                    i = n("<option />"),
                    s = _.template(t.model.get("template")),
                    h = s({
                        results: r,
                        emptyText: o
                    });
                this.manageVisibilityByData(this.$el, r);
                i.text(e.text());
                i.data("facetname", "");
                this.model.get("optionSelected") ? f.addClass("has-active-facet") : e.data("facetname") === "" && f.removeClass("has-active-facet");
                u.empty().append(i).append(h)
            },
            clearFilter: function() {
                var n = this.$el.find(".facet-dropdown-select"),
                    i = this.$el.find(".facet-heading > span"),
                    r = this.model.get("sig");
                t.updateHash(this.updateSignaturesHash(r, "", {}));
                this.model.set({
                    optionSelected: !1
                });
                i.removeClass("has-active-facet");
                n.val(n.find("option:first").val())
            }
        });
    return i.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            t = XA.component.search.query;
            r = XA.component.search.url;
            var i = n(".facet-dropdown:not(.initialized)");
            _.each(i, function(t) {
                var i = n(t),
                    r = new f({
                        el: i,
                        model: new u
                    });
                i.addClass("initialized")
            })
        }
    }, i.getFacetDataRequestInfo = function() {
        var i = n(".facet-dropdown"),
            t = [];
        return _.each(i, function(i) {
            for (var u = n(i).data().properties, f = u.searchResultsSignature.split(","), r = 0; r < f.length; r++) t.push({
                signature: f[r] === null ? "" : f[r],
                facetName: u.f,
                endpoint: u.endpoint,
                filterWithoutMe: !0
            })
        }), t
    }, i
}(jQuery, document);
XA.register("facetDropdown", XA.component.search.facet.dropdown);
XA.component.search.facet.managedrange = function(n) {
    var i = {},
        r, t, u, f = Backbone.Model.extend({
            defaults: {
                dataProperties: {},
                sig: []
            }
        }),
        e = XA.component.search.baseView.extend({
            initialize: function() {
                if (this.properties = this.$el.data().properties, this.model && (this.model.set({
                        dataProperties: this.properties
                    }), this.model.set("sig", this.translateSignatures(this.properties.searchResultsSignature, this.properties.f))), this.$el.find(".filterButton").length === 0) {
                    this.$el.find(".manualRangeMin").on("blur", this.textBoxChange.bind(this, []));
                    this.$el.find(".manualRangeMax").on("blur", this.textBoxChange.bind(this, []))
                }
                this.model.on("change", this.render, this);
                XA.component.search.vent.on("hashChanged", this.updateComponent.bind(this))
            },
            events: {
                "click .faceLink": "linkClick",
                "click .facetRadio": "radioClick",
                "click .facetCheckbox": "checkBoxClick",
                "click .filterButton": "filter",
                "click .bottom-remove-filter, .clear-filter": "clearFilter",
                "keyup .manualRangeMin, .manualRangeMax": "configureKeyCodes"
            },
            configureKeyCodes: function(n) {
                n.keyCode == 13 && this.filter()
            },
            updateHash: function(i) {
                var u = this.model.get("sig"),
                    r = [];
                _.each(i, function(t) {
                    var i = n(t);
                    r.push(i.data().minvalue + "|" + i.data().maxvalue)
                });
                this.$el.find(".manualRangeMin").val("");
                this.$el.find(".manualRangeMax").val("");
                t.updateHash(this.updateSignaturesHash(u, r.join(","), {}))
            },
            render: function() {
                for (var u = t.parseHashParameters(window.location.hash), o = this.$el.find(".facet-heading > span"), r = this.model.get("sig"), f = this, e, i = 0; i < r.length; i++) u.hasOwnProperty(r[i]) && u[r[i]] !== "" && (e = u[r[i]].split(","), o.addClass("has-active-facet"), _.each(e, function(t) {
                    var u = t.split("|"),
                        i = u[0],
                        r = u[1],
                        e, o;
                    (i !== "" || r !== "") && (i !== "" && r !== "" ? e = ".facetCheckbox[data-minvalue='" + i + "'][data-maxvalue='" + r + "'], .facetRadio[data-minvalue='" + i + "'][data-maxvalue='" + r + "']" : i !== "" && r === "" ? e = ".facetCheckbox[data-minvalue='" + i + "'], .facetRadio[data-minvalue='" + i + "']" : i === "" && r !== "" && (e = ".facetCheckbox[data-maxvalue='" + r + "'], .facetRadio[data-maxvalue='" + r + "']"), o = n(e), o.length > 0 ? o.attr("checked", "checked") : (f.$el.find(".manualRangeMin").val(u[0]), f.$el.find(".manualRangeMax").val(u[1])))
                }))
            },
            radioClick: function(t) {
                var i = n(t.currentTarget);
                n(".facetRadio").attr("name", i.attr("name"));
                this.updateHash(i)
            },
            checkBoxClick: function(t) {
                var i = n(t.currentTarget);
                i.is(":checked") && (this.$el.find(".manualRangeMin").val(""), this.$el.find(".manualRangeMax").val(""))
            },
            linkClick: function(i) {
                var r = n(i.currentTarget),
                    u = r.data().minvalue + "|" + r.data().maxvalue;
                this.$el.find(".facetCheckbox[data-shortid!=" + r.data().shortid + "]").removeAttr("checked");
                this.$el.find(".facetCheckbox[data-shortid=" + r.data().shortid + "]").attr("checked", "checked");
                this.$el.find(".manualRangeMin").val("");
                this.$el.find(".manualRangeMax").val("");
                t.updateHash(this.updateSignaturesHash(sig, u, {}))
            },
            filter: function() {
                var o = this.model.get("dataProperties").multipleSelection,
                    f = this.$el.find(".facetCheckbox:checked"),
                    e = this.$el.find(".facetRadio:checked"),
                    n = this.$el.find(".manualRangeMin"),
                    i = this.$el.find(".manualRangeMax"),
                    s = this.model.get("sig"),
                    r, u;
                r = n.length > 0 && n.val() !== "" ? n.val() : "";
                u = i.length > 0 && i.val() !== "" ? i.val() : "";
                r !== "" || u !== "" ? (this.$el.find(".facetRadio").removeAttr("checked"), this.$el.find(".facetCheckbox").removeAttr("checked"), t.updateHash(this.updateSignaturesHash(s, r + "|" + u, {}))) : (f.length > 0 || e.length > 0) && (o ? this.updateHash(f) : this.radioClick({
                    currentTarget: e
                }))
            },
            clearFilter: function() {
                for (var u = this.$el.find(".manualRangeMin"), f = this.$el.find(".manualRangeMax"), e = this.model.get("dataProperties"), h = this.$el.find(".facet-heading > span"), i = t.parseHashParameters(window.location.hash), o = this.model.get("sig"), s = !1, n, r = 0; r < o.length; r++) n = o[r], typeof i[n] != "undefined" && i[n] !== "" && (delete e[n], i[n] = "", s = !0);
                s && (t.updateHash(i), this.model.set({
                    dataProperties: e
                }), this.$el.find(".facetCheckbox").removeAttr("checked"), this.$el.find(".facetRadio").removeAttr("checked"), h.removeClass("has-active-facet"), u.length > 0 && u.val(u.data().defaultvalue), f.length > 0 && f.val(f.data().defaultvalue))
            },
            textBoxChange: function() {
                var n = this.$el.find(".manualRangeMin"),
                    i = this.$el.find(".manualRangeMax"),
                    r = n.length > 0 && n.val() !== "" ? n.val() : "",
                    u = i.length > 0 && i.val() !== "" ? i.val() : "",
                    f = this.model.get("sig");
                this.$el.find(".facetRadio").removeAttr("checked");
                this.$el.find(".facetCheckbox").removeAttr("checked");
                r !== "" || u !== "" ? t.updateHash(this.updateSignaturesHash(f, r + "|" + u, {})) : t.updateHash(this.updateSignaturesHash(f, "", {}))
            },
            updateComponent: function(n) {
                for (var i = this.model.get("sig"), r, t = 0; t < i.length; t++) r = i[t].toLowerCase(), n.hasOwnProperty(r) ? this.render() : this.clearFilter()
            }
        });
    return i.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            t = XA.component.search.query;
            u = XA.component.search.ajax;
            r = XA.component.search.url;
            var i = n(".facet-managed-range:not(.initialized)");
            _.each(i, function(t) {
                var i = n(t),
                    r = new f,
                    u = new e({
                        el: i,
                        model: r
                    });
                i.addClass("initialized");
                u.render()
            })
        }
    }, i
}(jQuery, document);
XA.register("managedrange", XA.component.search.facet.managedrange);
XA.component.search.facet.rangeslider = function(n) {
    var i = {},
        r, t, u = Backbone.Model.extend({
            defaults: {
                dataProperties: {},
                sig: [],
                timeStamp: ""
            }
        }),
        f = XA.component.search.baseView.extend({
            initialize: function() {
                var n = this.$el.data();
                this.properties = n.properties;
                this.model && (this.model.set({
                    dataProperties: this.properties
                }), this.model.set("sig", this.translateSignatures(this.properties.searchResultsSignature, this.properties.f)));
                this.model.on("change", this.updateSelectedValue, this);
                XA.component.search.vent.on("hashChanged", this.updateModel.bind(this));
                this.render()
            },
            events: {
                "click .bottom-remove-filter, .clear-filter": "removeFacet",
                "mouseup .ui-slider-handle": "updateModel"
            },
            render: function() {
                for (var o = this, u = this.model.get("sig"), v = XA.component.search.query, c = v.parseHashParameters(window.location.hash), s = parseFloat(this.model.get("dataProperties").minRangeValue), h = parseFloat(this.model.get("dataProperties").maxRangeValue), f = parseFloat(this.model.get("dataProperties").changeStep), y = n("<div />").addClass("slider-value"), l = this.$el.find(".facet-heading > span"), a = this.$el.find(".slider"), t, i, e, r = 0; r < u.length; r++) jQuery.isEmptyObject(_.pick(c, u[r])) ? (t = parseFloat(this.model.get("dataProperties").selectedMinValue), i = parseFloat(this.model.get("dataProperties").selectedMaxValue), l.removeClass("has-active-facet")) : (e = _.values(_.pick(c, u[r]))[0], e && (t = e.split("|")[0], i = e.split("|")[1], l.addClass("has-active-facet")));
                isNaN(s) && (s = 0);
                isNaN(h) && (h = 0);
                (isNaN(f) || f === 0) && (f = 1);
                isNaN(t) && (t = 0);
                isNaN(i) && (i = 0);
                a.slider({
                    range: !0,
                    min: s,
                    max: h,
                    step: f,
                    values: [t, i],
                    create: function() {
                        n(".slider-value").remove();
                        a.after(y);
                        (t !== 0 || i !== 0) && o.updateText(t, i)
                    },
                    slide: _.debounce(function(n, t) {
                        o.updateModel(o.updateSignaturesHash(u, t.values[0] + "|" + t.values[1], {}))
                    }, 500)
                })
            },
            removeFacet: function() {
                var r = this.$el,
                    u = this.model.get("sig"),
                    f = this.$el.find(".slider"),
                    e = r.find(".facet-heading > span"),
                    n = this.model.get("dataProperties"),
                    i = t.parseHashParameters(window.location.hash);
                e.removeClass("has-active-facet");
                n.selectedMinValue = n.minRangeValue;
                n.selectedMaxValue = n.maxRangeValue;
                this.updateText(n.minRangeValue, n.maxRangeValue);
                f.slider("values", [n.minRangeValue, n.maxRangeValue]);
                this.model.set({
                    dataProperties: n
                });
                i.hasOwnProperty(this.model.get("sig")) && t.updateHash(this.updateSignaturesHash(u, "", i))
            },
            updateModel: function(n) {
                var s = this.model.get("sig"),
                    f, i, r, e, o, u;
                for (n || (n = t.parseHashParameters(window.location.hash)), u = 0; u < s.length; u++)
                    if (f = s[u].toLocaleString(), n.hasOwnProperty(f))
                        if (r = _.values(_.pick(n, f))[0], r !== "") {
                            if (e = r.split("|")[0], o = r.split("|")[1], typeof o == "undefined" || typeof e == "undefined") continue;
                            i = this.model.get("dataProperties");
                            i.selectedMinValue = e;
                            i.selectedMaxValue = o;
                            this.model.set("dataProperties", i);
                            this.model.set("timeStamp", (new Date).getTime())
                        } else this.removeFacet()
            },
            updateSelectedValue: function() {
                var r = this.model.get("dataProperties"),
                    n = r.selectedMinValue,
                    i = r.selectedMaxValue,
                    u = this.$el.find(".slider"),
                    f = this.model.get("sig");
                u.slider("values", [n, i]);
                this.updateText(n, i);
                this.$el.find(".facet-heading > span").addClass("has-active-facet");
                t.updateHash(this.updateSignaturesHash(f, n + "|" + i, {}))
            },
            updateText: function(n, t) {
                var r = this.$el.find(".slider-value"),
                    i = this.model.get("dataProperties").formatingString;
                i = i.replace("{from}", n).replace("{to}", t);
                r.html(i)
            }
        });
    return i.init = function() {
        t = XA.component.search.query;
        r = XA.component.search.url;
        var i = n(".facet-range-selector:not(.initialized)");
        _.each(i, function(t) {
            var i = n(t),
                r = new u,
                e = new f({
                    el: i,
                    model: r
                });
            i.addClass("initialized")
        })
    }, i
}(jQuery, document);
XA.register("searchFacetRangeSlider", XA.component.search.facet.rangeslider);
XA.component.search.facet.slider = function(n) {
    var i = {},
        r, t, u = Backbone.Model.extend({
            defaults: {
                dataProperties: {},
                selectedValue: null,
                sig: [],
                timeStamp: ""
            }
        }),
        f = XA.component.search.baseView.extend({
            initialize: function() {
                var n = this.$el.data(),
                    t = this;
                this.properties = n.properties;
                this.model && (this.model.set({
                    dataProperties: this.properties
                }), this.model.set("sig", this.translateSignatures(this.properties.searchResultsSignature, this.properties.f)));
                this.model.on("change", this.updateSelectedValue, this);
                XA.component.search.vent.on("hashChanged", this.updateModel.bind(this));
                this.render()
            },
            events: {
                "click .bottom-remove-filter, .clear-filter": "removeFacet",
                "mouseup .ui-slider-handle": "updateModel"
            },
            render: function() {
                var s = this,
                    a = this.model.get("sig"),
                    i = this.model.get("dataProperties"),
                    h = t.parseHashParameters(window.location.hash),
                    f = parseFloat(i.minValue),
                    e = parseFloat(i.maxValue),
                    u = _.isEmpty(_.pick(h, i.f)) ? parseFloat(i.selectedValue) : _.values(_.pick(h, i.f))[0],
                    o = parseFloat(i.changeStep),
                    c = n("<div />").addClass("slider-value"),
                    l = this.$el.find(".slider");
                t = XA.component.search.query;
                r = XA.component.search.url;
                isNaN(f) && (f = 0);
                isNaN(e) && (e = 0);
                isNaN(o) && (o = 1);
                isNaN(u) && (u = 0);
                l.slider({
                    min: f,
                    max: e,
                    step: o,
                    value: u,
                    slide: _.debounce(function(n, t) {
                        s.updateModel(s.updateSignaturesHash(a, t.value, {}))
                    }, 500)
                });
                n(".slider-value").remove();
                c.html(i.formatingString.replace("{value}", u));
                l.after(c)
            },
            removeFacet: function() {
                var n = this.$el,
                    u = this.model.get("sig"),
                    f = this.$el.find(".slider"),
                    e = this.$el.find(".slider-value"),
                    o = n.find(".facet-heading > span"),
                    i = this.model.get("dataProperties"),
                    r = n.data("properties"),
                    s = r.f;
                o.removeClass("has-active-facet");
                e.html("");
                f.slider("value", r.minValue);
                i[s] = "";
                t.updateHash(this.updateSignaturesHash(u, "", {}));
                this.model.set({
                    dataProperties: i
                })
            },
            updateModel: function(n) {
                var e = this.model.get("sig"),
                    r, u, f, i;
                for (n || (n = t.parseHashParameters(window.location.hash)), i = 0; i < e.length; i++) u = e[i].toLowerCase(), n.hasOwnProperty(u) && (f = _.values(_.pick(n, u))[0], f !== "" ? (r = this.model.get("dataProperties"), r.selectedValue = f, this.model.set("dataProperties", r), this.model.set("timeStamp", (new Date).getTime())) : this.removeFacet())
            },
            updateSelectedValue: function() {
                var i = this.model.get("dataProperties"),
                    n = i.selectedValue,
                    u = this.$el.find(".slider-value"),
                    f = this.$el.find(".slider"),
                    e = this.model.get("sig"),
                    r;
                f.slider("value", n);
                r = i.formatingString.replace("{value}", n);
                u.html(r);
                this.$el.find(".facet-heading > span").addClass("has-active-facet");
                t.updateHash(this.updateSignaturesHash(e, n, {}))
            }
        });
    return i.init = function() {
        t = XA.component.search.query;
        r = XA.component.search.url;
        var i = n(".facet-slider:not(.initialized)");
        _.each(i, function(t) {
            var i = n(t),
                r = new u,
                e = new f({
                    el: i,
                    model: r
                });
            i.addClass("initialized")
        })
    }, i
}(jQuery, document);
XA.register("searchFacetSlider", XA.component.search.facet.slider);
XA.component.search.loadMore = function(n) {
    var t = {},
        i, r;
    return i = Backbone.Model.extend({
        defaults: {
            dataProperties: {},
            sig: []
        }
    }), r = Backbone.View.extend({
        initialize: function() {
            var n = this.$el.data(),
                t = this;
            n.properties.searchResultsSignature === null && (n.properties.searchResultsSignature = "");
            this.model && this.model.set("sig", n.properties.searchResultsSignature.split(","));
            XA.component.search.vent.on("results-loaded", function(n) {
                for (var r = t.model.get("sig"), u = typeof n.offset != "undefined" ? n.offset : 0, i = 0; i < r.length; i++) r[i] === n.searchResultsSignature && (n.pageSize >= n.dataCount || u + n.pageSize >= n.dataCount ? t.$el.hide() : t.$el.show())
            })
        },
        events: {
            "mousedown input": "loadMore"
        },
        loadMore: function() {
            for (var t = this.model.get("sig"), n = 0; n < t.length; n++) XA.component.search.vent.trigger("loadMore", {
                sig: t[n]
            })
        }
    }), t.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            var t = n(".load-more:not(.initialized)");
            _.each(t, function(t) {
                var u = n(t),
                    f = new r({
                        el: u,
                        model: new i
                    });
                u.addClass("initialized")
            })
        }
    }, t
}(jQuery, document);
XA.register("searchLoadMore", XA.component.search.loadMore);
XA.component.search.locationfilter = function(n) {
    "use strict";
    var i = {},
        r = [],
        t, h, u = !1,
        f = XA.connector.mapsConnector,
        o, s, e;
    return e = function() {
        for (var t, n = 0; n < r.length; n++) t = new s({
            el: r[n],
            model: new o
        })
    }, o = Backbone.Model.extend({
        defaults: {
            dataProperties: {},
            sig: []
        },
        initAutocompleteEngine: function() {
            var n = this,
                t;
            n.get("dataProperties").p > 0 && (t = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                limit: n.get("dataProperties").p,
                remote: {
                    url: "-",
                    replace: function() {
                        return Date.now().toString()
                    },
                    transport: function(t, i, r) {
                        var u = n.get("queryParams");
                        if (!u.text) {
                            i([]);
                            return
                        }
                        f.locationAutocomplete(u, function(n) {
                            var t = n.map(function(n) {
                                return n.hasOwnProperty("text") ? n.text : n
                            });
                            i(t)
                        }, function() {
                            r("Could not autocomplete")
                        })
                    }
                }
            }), t.initialize(), this.set({
                searchEngine: t
            }))
        }
    }), s = XA.component.search.baseView.extend({
        initialize: function() {
            var u = this,
                n = this.$el.data(),
                i = this.$el.find(".location-search-box-input"),
                t = n.properties.searchResultsSignature.split(","),
                r;
            if (n.properties.searchResultsSignature === null && (n.properties.searchResultsSignature = ""), this.model.set({
                    dataProperties: n.properties
                }), this.model.set({
                    sig: t
                }), this.model.set({
                    queryParams: {
                        maxResults: n.p,
                        text: ""
                    }
                }), this.model.initAutocompleteEngine(), r = this.model.get("searchEngine"), r) i.typeahead({
                hint: !0,
                minLength: 2
            }, {
                source: r.ttAdapter(),
                templates: {
                    suggestion: function(n) {
                        return '<div class="suggestion-item">' + n + "<\/div>"
                    }
                }
            }).on("typeahead:selected", function(n, t) {
                u.translateUserLocation(t);
                i.typeahead("val", t)
            });
            this.addressLookup(!0);
            XA.component.search.vent.on("hashChanged", function(n) {
                var r = n[t.length > 0 && t[0] !== "" ? t[0] + "_a" : "a"];
                typeof r != "undefined" && r !== null && r !== "" && i.val(r)
            })
        },
        events: {
            "click .location-search-box-button": "addressLookup",
            "keypress .location-search-box-input": "searchTextChanges",
            "keyup .location-search-box-input": "autocomplete"
        },
        addressLookup: function(n) {
            var i = this.model.get("dataProperties"),
                t = {
                    text: this.getAddress(n),
                    maxResults: 1
                },
                r;
            t.text === "" && (r = this.createHashObject("", "", ""), this.updateHash(r, i));
            switch (i.mode) {
                case "Location":
                    this.detectLocation();
                    break;
                case "UserProvided":
                    this.translateUserLocation(t);
                    break;
                case "Mixed":
                    typeof t.text == "undefined" || t.text === "" ? this.detectLocation() : this.translateUserLocation(t)
            }
        },
        getAddress: function(n) {
            var f = this.$el.find(".location-search-box-input.tt-input"),
                i = f.length !== 0 ? f.val() : this.$el.find(".location-search-box-input").val(),
                e = t.parseHashParameters(window.location.hash),
                r = this.model.get("sig"),
                u;
            return n !== !0 && (i === "" || typeof i == "undefined") ? "" : ((i === "" || typeof i == "undefined") && (u = e[r.length > 0 && r[0] !== "" ? r[0] + "_a" : "a"], u !== "" && (i = u), typeof i == "undefined" && (i = "")), i)
        },
        autocomplete: function(n) {
            var t, i, r = this.model.get("dataProperties");
            (n.stopPropagation(), n.keyCode !== 13) && (t = this.$el.find(".location-search-box-input.tt-input"), i = {
                text: t.length !== 0 ? t.val() : this.$el.find(".location-search-box-input").val(),
                maxResults: r.p
            }, this.model.set({
                queryParams: i
            }))
        },
        searchTextChanges: function(n) {
            return (n.stopPropagation(), n.keyCode === 13) ? (this.addressLookup(!1), !1) : !0
        },
        translateUserLocation: function(n) {
            var r = this,
                u = this.model.get("dataProperties"),
                t = typeof n.text != "undefined" ? n.text : n,
                i = this.$el.find(".location-search-box-input.tt-input"),
                e = {};
            t !== "" && (f.addressLookup({
                text: t
            }, function(n) {
                e = r.createHashObject(n[0] + "|" + n[1], u.f + ",Ascending");
                r.updateHash(e, u)
            }, function() {
                console.error("Error while getting '" + t + "' location")
            }), i.blur(), i.val() === "" && i.val(t))
        },
        detectLocation: function() {
            var n = this.model.get("dataProperties"),
                r = this.$el.find(".location-search-box-input"),
                f = this.model.get("sig"),
                e = t.parseHashParameters(window.location.hash),
                u = {},
                i = this;
            XA.component.locationService.detectLocation(function(t) {
                u = i.createHashObject(t[0] + "|" + t[1], n.f + ",Ascending");
                i.updateHash.call(i, u, n);
                r.length > 0 && r.attr("placeholder", n.myLocationText)
            }, function(n) {
                console.log(n)
            })
        },
        updateHash: function(n, i) {
            for (var u = this.model.get("sig"), f, o = typeof XA.component.search != "undefined" ? XA.component.search.results.searchResultModels : [], h = this.$el.find(".location-search-box-input.tt-input"), s = h.length !== 0 ? h.val() : this.$el.find(".location-search-box-input").val(), e, r = 0; r < o.length; r++)
                for (e = 0; e < u.length; e++) f = u[e], o[r].get("dataProperties").sig === f && o[r].set("loadMoreOffset", 0);
            if (s !== null && s !== "")
                for (r = 0; r < u.length; r++) f = u[r], n[f !== "" ? f + "_a" : "a"] = s;
            for (t.updateHash(n, i.targetUrl), r = 0; r < u.length; r++) XA.component.search.vent.trigger("my-location-coordinates-changed", {
                sig: u[r],
                coordinates: n[u[r] !== "" ? u[r] + "_g" : "g"].split("|")
            })
        },
        createHashObject: function(n, t, i) {
            for (var e = this.model.get("sig"), r, u = {}, f = 0; f < e.length; f++) r = e[f], u[r !== "" ? r + "_g" : "g"] = n, u[r !== "" ? r + "_o" : "o"] = t, typeof i != "undefined" && (u[r !== "" ? r + "_a" : "a"] = i);
            return u
        }
    }), i.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            t = XA.component.search.query;
            h = XA.component.search.url;
            var i = n(".location-filter:not(.initialized)");
            _.each(i, function(t) {
                var i = n(t),
                    o = i.data("properties");
                r.push(i);
                u || o.mode === "Location" ? e() : f.loadScript(o.key, XA.component.search.locationfilter.scriptsLoaded);
                i.addClass("initialized")
            })
        }
    }, i.scriptsLoaded = function() {
        u || (console.log("Maps api loaded"), u = !0, e())
    }, i
}(jQuery, document);
XA.register("locationfilter", XA.component.search.locationfilter);
XA.component.search.pageSelector = function(n) {
    var i = {},
        t, r, u;
    return facetName = "e", r = Backbone.Model.extend({
        defaults: {
            dataProperties: {},
            resultsCount: 0,
            offset: 0,
            selectedValue: 1,
            pageSize: 0,
            repeatRequest: !1,
            template: "<ul class='page-selector-list'> " + "<li class='page-selector-item-first'><a href='#'><%= data.first %><\/a><\/li>" + "<li class='page-selector-item-previous'><a href='#'><%= data.previous %><\/a><\/li>" + "<% var beforePage = 0; %>" + "<% _.each(data.pages, function(page){ %>" + "<% if((beforePage+1) != page.number){ %>" + "<li><span class='page-selector-more'>...<\/span><\/li>" + "<% } %>" + "<% beforePage = page.number; %>" + "<% if(data.selectedValue === page.number){ %>" + "<% active = 'active'; %>" + "<% }else { active = '' } %>" + "<li><a class='page-selector-item-link <%= active %>' data-offset='<%= page.offset %>' data-itemNumber='<%= page.number %>' href='#'><%= page.number %><\/a><\/li>" + "<% }); %>" + "<li class='page-selector-item-next'><a href='#'><%= data.next %><\/a><\/li>" + "<li class='page-selector-item-last'><a href='#'><%= data.last %><\/a><\/li>" + "<\/ul>",
            sig: [],
            timeStamp: (new Date).getTime()
        }
    }), u = XA.component.search.baseView.extend({
        initialize: function() {
            var n = this.$el.data();
            n.properties.searchResultsSignature === null && (n.properties.searchResultsSignature = "");
            this.model.set("dataProperties", n);
            this.model.set("sig", this.translateSignatures(n.properties.searchResultsSignature, facetName));
            this.model.on("change", this.render, this);
            XA.component.search.vent.on("results-loaded", this.handleLoadedData.bind(this));
            window.location.href.startsWith("file://") && this.model.set({
                resultsCount: 10,
                pageSize: 2,
                selectedValue: 2
            })
        },
        events: {
            "click .page-selector-item-link": "updateSelectedValue",
            "click .page-selector-item-first a": "showFirstPage",
            "click .page-selector-item-last a": "showLastPage",
            "click .page-selector-item-previous a": "showPrevPage",
            "click .page-selector-item-next a": "showNextPage"
        },
        updateModelAfterSearch: function(n, t) {
            this.model.set({
                pageSize: parseInt(n.pageSize),
                resultsCount: parseInt(n.dataCount),
                offset: parseInt(n.offset),
                selectedValue: parseInt(t)
            });
            this.model.set("timeStamp", (new Date).getTime());
            this.updateElementCssClass(n)
        },
        updateElementCssClass: function(n) {
            this.el.classList.remove("page-selector-empty");
            this.el.classList.remove("page-selector-single-page");
            n.dataCount === 0 ? this.el.classList.add("page-selector-empty") : (n.pageSize > n.dataCount || n.offset > n.dataCount) && this.el.classList.add("page-selector-single-page")
        },
        updateSelectedValue: function(i) {
            i.preventDefault();
            var r = this.model.get("sig"),
                u = n(i.target).data();
            t.updateHash(this.updateSignaturesHash(r, u.offset, {}))
        },
        showFirstPage: function(i) {
            i.preventDefault();
            var r = this.model.get("sig"),
                u = n(i.target).data();
            t.updateHash(this.updateSignaturesHash(r, 0, {}))
        },
        showLastPage: function(n) {
            n.preventDefault();
            var i = this.model.get("resultsCount") % this.model.get("pageSize"),
                r = this.model.get("resultsCount") - (i === 0 ? this.model.get("pageSize") : i),
                u = this.model.get("sig");
            t.updateHash(this.updateSignaturesHash(u, r, {}))
        },
        showNextPage: function(n) {
            n.preventDefault();
            var i = this.model.get("offset"),
                r = this.model.get("sig");
            i + this.model.get("pageSize") < this.model.get("resultsCount") && (i += this.model.get("pageSize"));
            t.updateHash(this.updateSignaturesHash(r, i, {}))
        },
        showPrevPage: function(i) {
            i.preventDefault();
            var r = this.model.get("offset"),
                f = n(i.target).data(),
                u = this.model.get("sig");
            r - this.model.get("pageSize") >= 0 && (r -= this.model.get("pageSize"));
            t.updateHash(this.updateSignaturesHash(u, r, {}))
        },
        render: function() {
            var l = this,
                t = this.model.get("dataProperties").properties,
                a = this.model.get("resultsCount"),
                r = this.model.get("pageSize"),
                u = this.model.get("selectedValue"),
                i = Math.ceil(a / r),
                f = [],
                e = u - t.treshold / 2,
                o = u + t.treshold / 2,
                s, n, h, c;
            if (e < 0 && (o += Math.abs(e)), o > i && (e -= o - i), t.treshold >= i)
                for (n = 0; n < i; n++) f.push({
                    number: n + 1,
                    offset: n * r
                });
            else
                for (n = 1; n <= i; n++) n === 1 || n === i ? f.push({
                    number: n,
                    offset: (n - 1) * r
                }) : n >= e && n <= o && f.push({
                    number: n,
                    offset: (n - 1) * r
                });
            s = {
                previous: t.previous,
                first: t.first,
                next: t.next,
                last: t.last,
                pages: f,
                selectedValue: u
            };
            h = _.template(l.model.get("template"));
            c = h({
                data: s
            });
            this.$el.html(c);
            this.handleButtonState(u, i)
        },
        handleButtonState: function(n, t) {
            this.$el.find(".page-selector-item-last, .page-selector-item-next").removeClass("inactive");
            this.$el.find(".page-selector-item-first, .page-selector-item-previous").removeClass("inactive");
            t == 0 ? (this.$el.find(".page-selector-item-first, .page-selector-item-previous").addClass("inactive"), this.$el.find(".page-selector-item-last, .page-selector-item-next").addClass("inactive")) : (n == 1 && this.$el.find(".page-selector-item-first, .page-selector-item-previous").addClass("inactive"), n == t && this.$el.find(".page-selector-item-last, .page-selector-item-next").addClass("inactive"))
        },
        handleLoadedData: function(n) {
            var o = this,
                f = this.model.get("dataProperties").properties.searchResultsSignature.split(","),
                s = t.parseHashParameters(window.location.hash),
                e, r, u, i;
            for (typeof n.offset == "undefined" && (n.offset = 0), i = 0; i < f.length; i++) encodeURIComponent(f[i]) === n.searchResultsSignature && (n.pageSize > n.dataCount || n.offset > n.dataCount ? (this.updateModelAfterSearch(n, 1), setTimeout(function() {
                u = t.parseHashParameters(window.location.hash);
                r = n.searchResultsSignature !== "" ? n.searchResultsSignature + "_e" : "e";
                s[r] !== "0" && (u[r] = 0, Backbone.history.navigate(o.createFirstPageUrlHash(u), {
                    trigger: !0,
                    replace: !0
                }))
            }, 100)) : (e = Math.ceil(n.offset / n.pageSize) + 1, this.updateModelAfterSearch(n, e)))
        },
        createFirstPageUrlHash: function(n) {
            var t = "",
                i = 0;
            return _.each(n, function(n, r) {
                i > 0 && (t += "&");
                i++;
                t += r + "=" + n
            }), t
        }
    }), i.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            t = XA.component.search.query;
            var i = n(".page-selector:not(.initialized)");
            _.each(i, function(t) {
                var i = n(t);
                new u({
                    el: i,
                    model: new r
                });
                i.addClass("initialized")
            })
        }
    }, i
}(jQuery, document);
XA.register("searchPageSelector", XA.component.search.pageSelector);
XA.component.search.pageSize = function(n) {
    var t = {},
        i, r, u, f = "p",
        e = Backbone.Model.extend({
            defaults: {
                sig: []
            }
        }),
        o = XA.component.search.baseView.extend({
            clicks: 0,
            initialize: function() {
                var n = this,
                    i = this.getCurrentPageSize(),
                    t = this.$el.data().properties;
                this.model.set("sig", this.translateSignatures(t.searchResultsSignature, f));
                this.selectOption(i);
                typeof i == "undefined" && t.defaultPageSize !== "" && n.selectOption(t.defaultPageSize);
                XA.component.search.vent.on("hashChanged", function(t) {
                    for (var r = n.model.get("sig"), i = 0; i < r.length; i++) t.hasOwnProperty(r[i]) && n.selectOption(t[r[i]])
                })
            },
            events: {
                "click select": "updatePageSizeClick",
                "change select": "updatePageSizeSelect"
            },
            getCurrentPageSize: function() {
                for (var r = i.parseHashParameters(window.location.hash), t = this.model.get("sig"), n = 0; n < t.length; n++)
                    if (hash.hasOwnProperty(t[n])) return hash[t[n]]
            },
            selectOption: function(n) {
                if (n !== undefined) {
                    var t = this.$el.find("select option[value='" + n + "']");
                    t.siblings().removeAttr("selected");
                    t.attr("selected", "selected")
                }
            },
            updatePageSizeClick: function(t) {
                if (this.clicks++, this.clicks === 2) {
                    var i = n(t.target).find("option:selected").val();
                    i !== undefined && this.updatePageSize(i);
                    this.clicks = 0
                }
            },
            updatePageSize: function(n) {
                var t = this.model.get("sig");
                r.updateHash(this.updateSignaturesHash(t, n, {}))
            },
            updatePageSizeSelect: function(n) {
                var t = n.currentTarget.value;
                this.updatePageSize(t)
            }
        });
    return t.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            i = XA.component.search.query;
            r = XA.component.search.parameters;
            u = XA.component.search.results.searchResultModels;
            var t = n(".page-size:not(.initialized)");
            _.each(t, function(t) {
                var i = n(t),
                    r = new o({
                        el: i,
                        model: new e
                    });
                i.addClass("initialized")
            })
        }
    }, t.getDefaultPageSizes = function() {
        var i = n(".page-size"),
            r, t, u, e, f, o = [];
        if (i.length > 0) {
            for (t = 0; t < i.length; t++) f = n(i[t]), r = f.data(), e = r.properties.searchResultsSignature.split(","), u = r.properties.defaultPageSize, o.push({
                signatures: e,
                defaultPageSize: u !== "" ? u : f.find("select option:first-child").val()
            });
            return o
        }
        return -1
    }, t
}(jQuery, document);
XA.register("searchPageSize", XA.component.search.pageSize);
XA.component.search.parameters = function(n) {
    var t = {},
        i, f, r = !1,
        u = {};
    return t.init = function() {
        n("body").hasClass("on-page-editor") || r || (i = XA.component.search.query, f = XA.component.search.results.searchResultModels, r = !0)
    }, t.registerDefault = function(n) {
        _.each(n, function(t, i) {
            u[i] = n[i].toString()
        })
    }, t.updateHash = function(n) {
        _.each(n, function(t, i) {
            u[i] === n[i].toString() && (n[i] = "")
        });
        i.updateHash(n)
    }, t
}(jQuery, document);
XA.register("searchParameters", XA.component.search.parameters);
XA.component.search.query = function() {
    var n = Backbone.Model.extend({
        defaults: {
            hash: "",
            hashObj: {}
        },
        initialize: function() {
            var t = this,
                n = window.location.hash;
            n.length && (this.set({
                hash: n
            }), this.createHashObj())
        },
        createHashObj: function() {
            this.set({
                hashObj: this.parseHashParameters(this.get("hash"))
            })
        },
        parseHashParameters: function(n) {
            var u, t, i, r, f;
            if (n === null || n === "") return {};
            for (n = n || window.location.hash, u = {}, t = n.slice(n.indexOf("#") + 1).split("&"), t = t.filter(function(n) {
                    return n !== ""
                }), i = 0; i < t.length; i++) r = t[i].split("="), f = r[0].toLowerCase(), u[decodeURIComponent(f)] = r.length > 1 ? decodeURIComponent(r[1].replace(/[+]/g, " ")) : null;
            return u
        },
        updateHash: function(n, t) {
            var f = this,
                i = "#",
                r = this.parseHashParameters(window.location.hash),
                u;
            _.each(n, function(n, t) {
                n !== "" ? r[t] = n : delete r[t]
            });
            (t === "#" || t == undefined) && (t = window.location.pathname);
            u = 0;
            _.each(r, function(n, t) {
                u > 0 && (i += "&");
                u++;
                i += t + "=" + encodeURIComponent(n).replace(/%7C/g, "|")
            });
            Backbone.history.navigate(i, {
                trigger: !0
            });
            i.length && (this.set({
                hash: i
            }), this.createHashObj())
        },
        isSignaturePresentInHash: function(n, t) {
            for (var r = Object.keys(n), u = !1, f = r.length, i = 0; i < f; i++)
                if (r[i].startsWith(t)) {
                    u = !0;
                    break
                }
            return u
        }
    });
    return new n
}(jQuery, document);
XA.component.search.radiusFilter = function(n) {
    var t = {},
        i, r, u, f, e;
    return r = Backbone.Model.extend({
        defaults: {
            properties: [],
            selected: {},
            sig: []
        }
    }), u = XA.component.search.baseView.extend({
        initialize: function() {
            var i = _.map(this.$el.find("li[data-value][data-title]"), function(t) {
                    return n(t)
                }),
                t = this.$el.data("properties");
            _.each(i, function(n) {
                n.addClass("radius-button")
            });
            this.model.set({
                properties: t,
                selected: {}
            });
            this.model.bind("change", this.render, this);
            this.model.set("sig", this.translateSignatures(t.searchResultsSignature, t.f));
            XA.component.search.vent.on("hashChanged", this.hashChanged.bind(this));
            this.render()
        },
        events: {
            "click li": "radiusClick",
            "click .bottom-remove-filter, .clear-filter": "deselect"
        },
        render: function() {
            var i = this,
                t;
            t = this.model.get("selected");
            i.$el.find(".selected").removeClass("selected");
            typeof t != "undefined" && t.length ? t.addClass("selected") : (t = i.$el.find("[data-value='-1']"), t.length && t.length >= 1 && n(t[0]).addClass("selected"))
        },
        updateHash: function(n) {
            var t = this.model.get("sig");
            n = n == -1 ? "" : n;
            f.updateHash(this.updateSignaturesHash(t, n, {}))
        },
        radiusClick: function(t) {
            var i = this,
                r = n(t.currentTarget);
            i.updateHash(r.data("value"));
            i.model.set({
                selected: r
            })
        },
        deselect: function() {
            var n = this;
            n.updateHash("");
            n.model.set({
                selected: undefined
            })
        },
        hashChanged: function(t) {
            for (var f = this, o = this.model.get("sig"), e, i, r, u = 0; u < o.length; u++) e = o[u].toLowerCase(), t.hasOwnProperty(e) && (i = t[e], i = i === "" ? -1 : i, r = f.$el.find("[data-value='" + i + "']"), r.length && r.length >= 1 ? f.model.set({
                selected: n(r[0])
            }) : f.model.set({
                selected: undefined
            }))
        }
    }), i = function(n) {
        var t = new r,
            i = new u({
                el: n[0],
                model: t
            });
        n.addClass("initialized")
    }, t.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            var t = n(".radius-filter:not(.initialized)");
            _.each(t, function(t) {
                i(n(t))
            });
            f = XA.component.search.query;
            e = XA.component.search.url
        }
    }, t
}(jQuery, document);
XA.register("radiusFilter", XA.component.search.radiusFilter);
XA.component.search.results = function(n) {
    "use strict";
    var t = {},
        u = [],
        i = [],
        f, r, e, o = Backbone.Model.extend({
            defaults: {
                template: "<% if(!results.length){ %><div class='no-results'><%= noResultsText %><\/div> <% }else { %>" + "<ul class='search-result-list'> " + "<% _.forEach(results, function(result){ %>" + "<li " + "<% if(result.Geospatial){%>data-id='<%= result.Id %>' data-longitude='<%= result.Geospatial.Longitude %>' data-latitude='<%= result.Geospatial.Latitude %>'<% } %>" + "><%= result.Html %><\/li>" + "<% }); %>" + "<\/ul>" + "<% } %>" + "<div class='search-result-overlay'>",
                templateItems: "<% _.forEach(results, function(result){ %>" + "<li " + "<% if(result.Geospatial){%>data-id='<%= result.Id %>' data-longitude='<%= result.Geospatial.Longitude %>' data-latitude='<%= result.Geospatial.Latitude %>'<% } %>" + "><%= result.Html %><\/li>" + "<% }); %>",
                dataProperties: {},
                blockNextRequest: !1,
                noResultsText: "",
                resultData: {},
                loadingInProgress: !1,
                loadingMoreInProgress: !1,
                resultDataMore: {},
                loadMoreOffset: 0,
                loadMore: !1
            },
            initialize: function() {
                var n = r.parseHashParameters(window.location.hash),
                    t = encodeURIComponent(this.get("dataProperties").sig),
                    i = "e_" + t;
                n.hasOwnProperty("e") && t === "" && this.set("loadMoreOffset", parseInt(n.e));
                n.hasOwnProperty(i) && this.set("loadMoreOffset", parseInt(n[i]));
                XA.component.search.vent.on("results-loaded", this.resultsLoaded.bind(this));
                XA.component.search.vent.on("results-loading", this.resultsLoading.bind(this))
            },
            blockRequests: function(n) {
                this.set("blockNextRequest", n)
            },
            checkBlockingRequest: function() {
                return this.get("blockNextRequest")
            },
            getMyOffset: function() {
                var n = r.parseHashParameters(window.location.hash),
                    t = encodeURIComponent(this.get("dataProperties").sig);
                return n.hasOwnProperty("e_" + t) ? n["e_" + t] : 0
            },
            resultsLoaded: function(n) {
                var t = encodeURIComponent(this.get("dataProperties").sig);
                t === n.searchResultsSignature && (this.get("loadMore") ? (this.set({
                    resultDataMore: n
                }), this.set({
                    loadingMoreInProgress: !1
                }), this.unset("loadMore", {
                    silent: !0
                })) : (this.set({
                    resultData: n
                }), this.set({
                    loadingInProgress: !1
                })), this.blockRequests(!1))
            },
            resultsLoading: function(n) {
                this.cid == n && (this.get("loadMore") ? this.set({
                    loadingMoreInProgress: !0
                }) : this.set({
                    loadingInProgress: !0
                }))
            }
        }),
        s = Backbone.View.extend({
            initialize: function() {
                var t = this.$el.data(),
                    f = this.$el.find(".no-results").html(),
                    r = XA.component.search.router,
                    u = r ? r.routerInstance : undefined,
                    n = this;
                t.properties.sig === null && (t.properties.sig = "");
                this.model && this.model.set({
                    dataProperties: t.properties,
                    noResultsText: f
                });
                this.model.on("change:loadingInProgress", this.loading, this);
                this.model.on("change:loadingMoreInProgress", this.loadingMore, this);
                this.model.on("change:resultData", this.render, this);
                this.model.on("change:resultDataMore", this.renderPart, this);
                this.$el.on("remove", function() {
                    i = i.filter(function(t) {
                        return t.cid !== n.model.cid
                    })
                });
                XA.component.search.vent.on("add-variant-class", function(t) {
                    var i = n.model.get("dataProperties").sig;
                    t.sig === i && (n.$el.removeClass(n.$el.attr("data-class-variant")), n.$el.attr("data-class-variant", t.classes), n.$el.addClass(t.classes))
                });
                XA.component.search.vent.on("loadMore", function(t) {
                    var i = n.model.get("dataProperties").sig;
                    t.sig === i && XA.component.search.service.getData({
                        loadMore: "true",
                        p: n.model.get("dataProperties").p,
                        singleRequestMode: i
                    })
                });
                XA.component.search.vent.on("my-location-coordinates-changed", function(t) {
                    t.sig === n.model.get("dataProperties").sig && n.model.get("loadMore") && n.$el.find(".search-result-list").html("")
                });
                u && t.properties.autoFireSearch && this.$el.closest(".overlay-inner").length && u.checkUrl(window.location.hash, !0);
                this.render()
            },
            events: {
                "click .search-result-list > li[data-longitude][data-latitude]": "poiClick"
            },
            loading: function() {
                this.model.get("loadingInProgress") ? this.$el.addClass("loading-in-progress") : this.$el.removeClass("loading-in-progress")
            },
            loadingMore: function() {
                this.model.get("loadingMoreInProgress") ? this.$el.addClass("loading-more-in-progress") : this.$el.removeClass("loading-more-in-progress")
            },
            renderPart: function() {
                var n = _.template(this.model.get("templateItems")),
                    t = n({
                        results: this.model.get("resultDataMore").data
                    });
                this.$el.find(".search-result-list").append(t)
            },
            render: function() {
                var n = this,
                    t = n.model.get("resultData").data,
                    i, r;
                window.location.href.startsWith("file://") || (typeof t == "undefined" && (t = []), i = _.template(n.model.get("template")), r = i({
                    results: t,
                    noResultsText: n.model.get("noResultsText")
                }), this.$el.html(r))
            },
            poiClick: function(t) {
                var i = n(t.currentTarget);
                XA.component.search.vent.trigger("center-map", {
                    sig: this.model.get("dataProperties").sig,
                    coordinates: [i.data("latitude"), i.data("longitude")],
                    id: i.data("id")
                })
            }
        });
    return t.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            f = XA.component.search.url;
            r = XA.component.search.query;
            e = XA.component.search.ajax;
            var t = n(".search-results:not(.initialized)");
            _.each(t, function(t) {
                var r = n(t),
                    f = new o;
                i.push(f);
                u.push(new s({
                    el: r,
                    model: f
                }));
                r.addClass("initialized")
            })
        }
    }, t.searchResultViews = u, t.searchResultModels = i, t
}(jQuery, document);
XA.register("searchResults", XA.component.search.results);
XA.component.search.results.count = function(n) {
    var t = {},
        i = Backbone.View.extend({
            initialize: function() {
                var i = this.$el.data(),
                    t = this.$el.find(".results-count"),
                    n = this;
                if (this.resultsCountText = t.html(), window.location.href.startsWith("file://")) {
                    t.html(n.resultsCountText.replace("{count}", 1));
                    n.$el.find(".results-count").show();
                    return
                }
                XA.component.search.vent.on("results-loaded", function(i) {
                    if (n.$el.find(".results-count").length > 0) {
                        var r = n.$el.data("properties").targetSignature;
                        if (r != "" && r != i.searchResultsSignature) return;
                        t.html(n.resultsCountText.replace("{count}", i.dataCount));
                        n.$el.find(".results-count").show()
                    }
                })
            }
        });
    return t.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            var t = n(".search-results-count:not(.initialized)");
            _.each(t, function(t) {
                var r = n(t),
                    u = new i({
                        el: r
                    });
                r.addClass("initialized")
            })
        }
    }, t
}(jQuery, document);
XA.register("searchResultsCount", XA.component.search.results.count);
XA.component.search.facet.resultsfilter = function(n) {
    var r = {},
        u, t, f, e = XA.component.search.baseModel.extend({
            defaults: {
                template: "<div class='facet-search-filter <% if(!showAllFacets){%>facet-hided<%}%>'><% " + "_.forEach(facet.Values, function(value,key){" + "%><p class='facet-value <% if(highlightBehaviour<=key){ %> hide-facet-value <% } %>' data-facetValue='<%= value.Name !== '' ? encodeURI(value.Name) : '_empty_' %>'>" + "<span><%= value.Name !== '' ? value.Name : emptyText %> " + "<span class='facet-count'>(<%= value.Count %>)<\/span>" + "<\/span><\/p><% }); %>" + "<% if(highlightBehaviour>=1 && resultsCount>highlightBehaviour){ %>" + "<div class='toogle-facet-visibility'><% if(showAllFacets){ %><%=showLessText%><%}else{%><%=showMoreText%><%} %><\/div>" + "<%}%>" + "<\/div>",
                templateMulti: "<div class='facet-search-filter <% if(!showAllFacets){%>facet-hided<%}%>'><% " + "_.forEach(facet.Values, function(value,key){" + "%><p class='facet-value <% if(highlightBehaviour<=key){ %> hide-facet-value <% } %>' data-facetValue='<%= value.Name !== '' ? encodeURI(value.Name) : '_empty_' %>'>" + "<input type='checkbox' name='facetValue' />" + "<label for='facetName'><%= value.Name !== '' ? value.Name : emptyText %> " + "<span class='facet-count' data-facetCount='<%= value.Count %>'>(<%= value.Count %>)<\/span>" + "<\/label><\/p><% }); %>" + "<% if(highlightBehaviour>=1 && resultsCount>highlightBehaviour){ %>" + "<div class='toogle-facet-visibility'><% if(showAllFacets){ %><%=showLessText%><%}else{%><%=showMoreText%><%} %><\/div>" + "<%}%>" + "<\/div>",
                dataProperties: {},
                blockNextRequest: !1,
                resultData: {},
                timeStamp: "",
                showAllFacets: !1,
                sig: []
            },
            initialize: function() {
                XA.component.search.vent.on("facet-data-loaded", this.processData.bind(this));
                XA.component.search.vent.on("facet-data-partial-filtered", this.processData.bind(this));
                XA.component.search.vent.on("facet-data-filtered", this.processData.bind(this));
                XA.component.search.vent.on("hashChanged", this.updateComponent.bind(this));
                this.set({
                    facetArray: []
                })
            },
            toggleBlockRequests: function() {
                var n = this.get("blockNextRequest");
                this.set(this.get("blockNextRequest"), !n)
            },
            processData: function(n) {
                var r = this,
                    u = this.get("dataProperties"),
                    f = u.searchResultsSignature.split(","),
                    e = u.sortOrder,
                    t, i;
                for (n.Signature === null && (n.Signature = ""), t = 0; t < f.length; t++) n.Facets.length > 0 && n.Signature === f[t] && (i = _.find(n.Facets, function(n) {
                    return n.Key.toLowerCase() === r.get("dataProperties").f.toLowerCase()
                }), i !== undefined && (this.sortFacetArray(e, i.Values), r.set({
                    resultData: i
                })))
            },
            updateFacetArray: function(n) {
                var i, r, t;
                if (n) {
                    for (i = n.split("||"), r = [], t = 0; t < i.length; t++) r.push(i[t]);
                    this.set({
                        facetArray: _.unique(r)
                    })
                }
            },
            updateComponent: function(n) {
                var t = this.get("sig");
                for (i = 0; i < t.length; i++) n.hasOwnProperty(t[i]) ? this.updateFacetArray(n[t[i]]) : this.set({
                    facetArray: []
                }), this.set("timeStamp", (new Date).getTime())
            }
        }),
        o = XA.component.search.baseView.extend({
            initialize: function() {
                var r = this.$el.data(),
                    f = t.parseHashParameters(window.location.hash),
                    u = r.properties,
                    n, i, e;
                for (r.properties.searchResultsSignature === null && (r.properties.searchResultsSignature = ""), n = this.translateSignatures(u.searchResultsSignature, u.f), this.model.set({
                        dataProperties: u
                    }), this.model.set("sig", n), i = 0; i < n.length; i++) jQuery.isEmptyObject(_.pick(f, n[i])) || (e = _.values(_.pick(f, n[i]))[0], this.model.updateFacetArray(e));
                this.model.on("change", this.render, this)
            },
            events: {
                "click .facet-value": "updateFacet",
                "click .filterButton": "updateFacet",
                "click .clear-filter": "removeFacet",
                "click .bottom-remove-filter > button": "removeFacet",
                "click .toogle-facet-visibility": "toogleFacetVisibility"
            },
            toogleFacetVisibility: function() {
                var n = this.model.get("showAllFacets");
                this.model.set("showAllFacets", !n)
            },
            updateFacet: function(i) {
                var u = n(i.currentTarget),
                    e = this.model.get("facetArray"),
                    l = this.model.get("dataProperties"),
                    v = this.$el.find(".facet-heading > span"),
                    y = u.parents(".component-content").find(".facet-search-filter"),
                    a = l.f.toLowerCase(),
                    h = u.data("facetvalue"),
                    f = typeof h != "undefined" ? decodeURIComponent(h) : h,
                    s = this.model.get("sig"),
                    c, o = {},
                    r;
                if (l.multi) {
                    if (f && (u.is(":not(.active-facet)") ? (this.setActiveFacet(a, f), e.push(f)) : (u.removeClass("active-facet"), u.find("[type=checkbox]").prop("checked", !1), u.find("[type=checkbox] + label:after").css({
                            background: "#fff"
                        }), c = e.indexOf(f), c > -1 && e.splice(c, 1), e.length == 0 && v.removeClass("has-active-facet")), this.model.set({
                            facetArray: e
                        })), u[0].type == "button") {
                        for (r = 0; r < s.length; r++) o[s[r]] = _.uniq(e, function(n) {
                            return JSON.stringify(n)
                        }).join("||");
                        t.updateHash(o)
                    }
                } else if (f) {
                    for (r = 0; r < s.length; r++) o[s[r]] = f;
                    y.data("active-facet", o);
                    this.setActiveFacet(a, f);
                    t.updateHash(o)
                }
            },
            removeFacet: function(i) {
                i.preventDefault();
                var r = this.$el,
                    u = r.find(".facet-heading > span"),
                    f = r.find(".facet-value"),
                    e = this.model.get("sig");
                t.updateHash(this.updateSignaturesHash(e, "", {}));
                u.removeClass("has-active-facet");
                _.each(f, function(t) {
                    var i = n(t);
                    i.hasClass("active-facet") && (i.removeClass("active-facet"), i.find("[type=checkbox]").prop("checked", !1), i.find("[type=checkbox] + label:after").css({
                        background: "#fff"
                    }))
                });
                this.model.set({
                    facetArray: []
                })
            },
            render: function() {
                var n = this,
                    i = this.model.get("resultData"),
                    u = this.$el.find(".facet-heading > span"),
                    c = this.model.get("dataProperties").f.split("|"),
                    l = this.model.get("dataProperties").emptyValueText,
                    f = this.model.get("dataProperties").highlightThreshold,
                    a = this.model.get("dataProperties").showLessText,
                    v = this.model.get("dataProperties").showMoreText,
                    y = parseInt(this.model.get("dataProperties").highlightBehaviour),
                    p = this.model.get("showAllFacets"),
                    e = t.parseHashParameters(window.location.hash),
                    r = this.model.get("sig"),
                    o, s, h;
                window.location.href.startsWith("file://") || (this.manageVisibilityByData(this.$el, i), i !== undefined && (o = n.model.get("dataProperties").multi === !0 ? _.template(n.model.get("templateMulti")) : _.template(n.model.get("template")), h = o({
                    facet: i,
                    emptyText: l,
                    showLessText: a,
                    showMoreText: v,
                    highlightBehaviour: y,
                    showAllFacets: p,
                    resultsCount: i.Values ? i.Values.length : -1
                })), n.$el.find(".contentContainer").html(h), _.each(c, function(t) {
                    var i, u;
                    for (s = t.toLowerCase(), i = 0; i < r.length; i++)
                        if (!jQuery.isEmptyObject(_.pick(e, r)) && (u = _.values(_.pick(e, r))[0], u)) {
                            n.setActiveFacet(s, u);
                            return
                        }
                }), f && this.handleThreshold(f), this.model.get("facetArray").length === 0 ? u.removeClass("has-active-facet") : u.addClass("has-active-facet"))
            },
            setActiveFacet: function(t, i) {
                var f = this.model.get("dataProperties"),
                    e = this.$el.find("p[data-facetvalue]"),
                    o = this.$el.find(".facet-heading > span"),
                    s = this,
                    r, u;
                if (i = i.toString().toLowerCase(), r = this.$el.find("[data-facetvalue]").filter(function() {
                        return decodeURIComponent(n(this).attr("data-facetvalue").toLowerCase()) === i
                    }), typeof i != "undefined" && i !== null) u = i.split("||");
                else return;
                u.length > 1 && (f.multi = !0);
                f.multi ? _.each(e, function(t) {
                    if (u.length > 1)
                        for (var i = 0, f = u.length; i < f; i++) r = s.$el.find("[data-facetvalue]").filter(function() {
                            return decodeURIComponent(n(this).attr("data-facetvalue").toLowerCase()) === u[i]
                        }), t === r[0] && (n(t).addClass("active-facet"), n(t).find("[type=checkbox]").prop("checked", !0));
                    t === r[0] && (n(t).addClass("active-facet"), n(t).find("[type=checkbox]").prop("checked", !0))
                }) : _.each(e, function(t) {
                    t !== r[0] ? (n(t).removeClass("active-facet"), n(t).find("[type=checkbox]").prop("checked", !1), n(t).find("[type=checkbox] + label:after").css({
                        background: "#fff"
                    })) : n(t).addClass("active-facet")
                });
                o.addClass("has-active-facet")
            },
            handleThreshold: function(t) {
                var i = this.$el.find(".facet-search-filter").children("p");
                _.each(i, function(i) {
                    var u = n(i),
                        r = u.find(".facet-count"),
                        f = r.data("facetcount");
                    f > t && r.addClass("highlighted")
                })
            }
        });
    return r.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            t = XA.component.search.query;
            f = XA.component.search.ajax;
            u = XA.component.search.url;
            var i = n(".facet-single-selection-list:not(.initialized)");
            _.each(i, function(t) {
                var i = n(t),
                    r = new e,
                    u = new o({
                        el: i,
                        model: r
                    });
                i.addClass("initialized")
            })
        }
    }, r.getFacetDataRequestInfo = function() {
        var i = n(".facet-single-selection-list"),
            t = [];
        return _.each(i, function(i) {
            for (var r = n(i).data().properties, f = r.searchResultsSignature.split(","), u = 0; u < f.length; u++) t.push({
                signature: f[u] === null ? "" : f[u],
                facetName: r.f,
                endpoint: r.endpoint,
                showMoreText: r.showMoreText,
                showLessText: r.showLessText,
                highlightBehaviour: r.highlightBehaviour,
                s: r.s,
                filterWithoutMe: !r.collapseOnSelection
            })
        }), t
    }, r
}(jQuery, document);
XA.register("facetResultsFilter", XA.component.search.facet.resultsfilter);
XA.component.search.sort = function(n) {
    var t = {},
        r, i, u = Backbone.Model.extend({
            defaults: {
                updateOrder: !1,
                sig: []
            }
        }),
        f = XA.component.search.baseView.extend({
            initialize: function() {
                var n = this.$el.data();
                this.model && this.model.set("sig", this.translateSignatures(n.properties.sig, "o"));
                XA.component.search.vent.on("hashChanged", this.updateComponent.bind(this))
            },
            events: {
                "click .sort-results-group a": "sortSearchResultsLink",
                "change select": "sortSearchResultsSelect"
            },
            sortSearchResultsLink: function(t) {
                t.preventDefault();
                this.sortSearchResults(n(t.currentTarget).parent())
            },
            sortSearchResultsSelect: function(t) {
                this.sortSearchResults(n(t.currentTarget[t.currentTarget.options.selectedIndex]))
            },
            sortSearchResults: function(n) {
                var t = n.data(),
                    r = this.model.get("sig"),
                    u = t.facet + "," + t.direction;
                t.direction !== "" ? i.updateHash(this.updateSignaturesHash(r, u, {})) : i.updateHash(this.updateSignaturesHash(r, "", {}))
            },
            updateComponent: function(n) {
                for (var i, r, u = this.model.get("sig"), t = 0; t < u.length; t++) n.hasOwnProperty(u[t]) ? (r = n[u[t]].split(","), i = this.$el.find("[data-facet='" + r[0] + "'][data-direction='" + r[1] + "']")) : i = this.$el.find("[data-facet][data-direction]:first");
                this.$el.find("[data-facet][data-direction]").removeAttr("selected");
                i.attr("selected", "selected")
            }
        });
    return t.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            r = XA.component.search.query;
            i = XA.component.search.parameters;
            var t = n(".sort-results:not(.initialized)");
            _.each(t, function(t) {
                var i = n(t),
                    r = new u,
                    e = new f({
                        el: i,
                        model: r
                    });
                i.addClass("initialized")
            })
        }
    }, t.getFirstSortingOption = function(t) {
        for (var f = n(".sort-results"), o, r, e, s, u, i = 0; i < f.length; i++)
            if (typeof t != "undefined")
                for (s = n(f[i]).data(), e = s.properties.sig.split(","), u = 0; u < e.length; u++)
                    if (e[u] === t && (o = n(f[i]).find("[data-facet][data-direction]"), r = o.data(), r.direction !== "")) return r.facet + "," + r.direction;
        return -1
    }, t
}(jQuery, document);
XA.register("searchSort", XA.component.search.sort);
XA.component.search.url = function(n) {
    var t = function(n) {
            n = n + "";
            var r = n.split("||"),
                i = [],
                t;
            return _.each(r, function(n) {
                t = n.split("|");
                _.contains(n, "|") && t.length === 3 ? i.push(t[1] + "|" + t[2]) : i.push(n)
            }), i.join("||")
        },
        i = Backbone.Model.extend({
            createSearchUrl: function(n, t) {
                var i = this.setEndpoint(n.endpoint);
                return i += n.l ? "&l=" + n.l : "", i += n.s ? "&s=" + n.s : "", i += n.itemid ? "&itemid=" + n.itemid : "", i += this.getFacetParams(n, t), this.fixUrl(i)
            },
            createRedirectSearchUrl: function(t, i, r, u) {
                var s = XA.component.search.query.get("hashObj"),
                    o = {},
                    h = {},
                    a = 0,
                    c, e, f, l;
                if (r !== "")
                    for (f in s) c = f.substring(f.indexOf("_") + 1), e = f.substr(0, f.indexOf("_")), e === r && (h[f] = s[f]);
                else h = s;
                if (i = n.extend({}, h, i), u !== "")
                    for (f in i) c = f.substring(f.indexOf("_") + 1), e = f.substr(0, f.indexOf("_")), e === r ? o[u + "_" + c] = i[f] : e === u && (o[f] = i[f]);
                else o = i;
                return l = this.setEndpoint(t + "#"), _.each(o, function(n, t) {
                    l += (a === 0 ? "" : "&") + t + "=" + n;
                    a++
                }), l
            },
            createPredictiveSearchUrl: function(n, t, i) {
                var r = this.setEndpoint(n);
                return r += "?q=" + encodeURIComponent(i), r += "&v=" + t.v, r += "&p=" + t.p, r += t.l ? "&l=" + t.l : "", r += t.s ? "&s=" + t.s : "", r + (t.itemid ? "&itemid=" + t.itemid : "")
            },
            createFacetUrl: function(n, t) {
                var i = this.setEndpoint(n.endpoint);
                return i += "?f=" + n.f.toLowerCase(), i += n.s ? "&s=" + n.s : "", i += n.l ? "&l=" + n.l : "", i += t ? "&q=" + encodeURIComponent(t) : "", i + this.getFacetParams(n)
            },
            createMultiFacetUrl: function(n, t, i, r) {
                var u = this.setEndpoint(n.endpoint);
                return u += "?f=" + t.join("||").toLowerCase(), u += n.s ? "&s=" + n.s : "", u += n.l ? "&l=" + n.l : "", u += r ? "&itemid=" + r : "", u += this.getFacetParams(n, i), u + ("&sig=" + encodeURIComponent(i))
            },
            clearUrlParams: function(n, t) {
                var i = n.f.toLowerCase(),
                    r = {};
                return delete t[i], delete r[i], XA.component.search.query.updateHash(r), t
            },
            getFacetParams: function(n, i) {
                var r = "",
                    u, f, o = ["endpoint", "l", "s", "e", "f", "sig", "itemid"],
                    e = ["g", "o", "q", "p", "e", "v"];
                n.hasOwnProperty("sig") && (r += "&sig=" + encodeURIComponent(n.sig));
                for (facet in n) o.indexOf(facet) === -1 && facet && n[facet] && (u = facet.substring(facet.indexOf("_") + 1), f = facet.substr(0, facet.indexOf("_")), i === f && e.indexOf(u) === -1 && (r += "&" + u + "=" + encodeURIComponent(t(n[facet]))));
                return this.getSpecialParams(n, i, e, r)
            },
            getSpecialParams: function(n, t, i, r) {
                var u, e, f, o;
                for (u in n) f = u.substring(u.indexOf("_") + 1), o = u.substr(0, u.indexOf("_")), i.indexOf(f) !== -1 && (e = typeof n[u] != "undefined" ? n[u] : "", t === o && (r += "&" + f + "=" + encodeURIComponent(e)));
                return r
            },
            createGetPoiContentUrl: function(n, t, i) {
                var r = this.setEndpoint(n.endpoint);
                return r + ("/" + i + "/" + t)
            },
            createGetGeoPoiContentUrl: function(n, t, i, r, u, f) {
                var e = this.setEndpoint(n.endpoint);
                return e + ("/" + i + "/" + t + "/" + r + "/" + u + "/" + f)
            },
            createSiteUrl: function(n, t) {
                return typeof t != "undefined" && t !== null && t !== "" ? n + "&sc_site=" + t : n
            },
            setEndpoint: function(n) {
                var t = window.location.origin;
                return n.indexOf(t) !== -1 ? n : t + n
            },
            fixUrl: function(n) {
                var t;
                return n = n.replace(/[?]/g, "&"), t = n.indexOf("&"), n.substr(0, t) + "?" + n.substr(t + 1)
            }
        });
    return new i
}(jQuery, document);
XA.component.search.variantFilter = function(n) {
    var i = {},
        r, u, t = {},
        f = Backbone.Model.extend({
            defaults: {
                dataProperties: {},
                sig: []
            }
        }),
        e = XA.component.search.baseView.extend({
            initialize: function() {
                var u = r.parseHashParameters(window.location.hash),
                    f = this.$el.data(),
                    i = this.translateSignatures(f.properties.searchResultsSignature, "v"),
                    e = this,
                    n;
                for (f.properties.searchResultsSignature === null && (f.properties.searchResultsSignature = ""), this.model.set({
                        dataProperties: f
                    }), this.model.set("sig", i), n = 0; n < i.length; n++) u.hasOwnProperty(i[n]) && this.selectVariantIcon(u[i[n]]);
                XA.component.search.vent.on("results-loaded", function() {
                    var s = f.properties.searchResultsSignature.split(","),
                        o, h, c;
                    for (u = r.parseHashParameters(window.location.hash), n = 0; n < s.length; n++) o = s[n], u.hasOwnProperty(i[n]) && t.hasOwnProperty(o) ? (c = t[o], h = c[u[i[n]]], e.triggerAddVariant(h.cssClass, o), e.selectVariantIcon(u[i[n]])) : t.hasOwnProperty(o) && t[o].hasOwnProperty(0) && setTimeout(function() {
                        e.triggerAddVariant(t[o][0].cssClass, o);
                        e.selectVariantIcon(0)
                    }, 100)
                })
            },
            events: {
                "click div > div": "changeVariant"
            },
            changeVariant: function(t) {
                var i = n(t.currentTarget),
                    r = this.model.get("sig"),
                    f = i.data();
                this.$el.find(".active-variant").removeClass("active-variant");
                i.addClass("active-variant");
                u.updateHash(this.updateSignaturesHash(r, f.variantindex, {}));
                this.triggerAddVariant(n(t.currentTarget).attr("class"))
            },
            triggerAddVariant: function(n, t) {
                XA.component.search.vent.trigger("add-variant-class", {
                    classes: n,
                    sig: t
                })
            },
            selectVariantIcon: function(n) {
                this.$el.find("div[data-variantIndex]").removeClass("active-variant");
                this.$el.find("div[data-variantIndex=" + n + "]").addClass("active-variant")
            }
        });
    return i.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            r = XA.component.search.query;
            u = XA.component.search.parameters;
            var t = n(".variant-selector:not(.initialized)");
            _.each(t, function(t) {
                var i = n(t),
                    r = new e({
                        el: i,
                        model: new f
                    });
                i.addClass("initialized")
            })
        }
    }, i.getVariantMappings = function(i) {
        var u = n(".variant-selector"),
            f = {},
            e, o = [],
            s, r;
        if (!t.hasOwnProperty(i))
            for (r = 0; r < u.length; r++) s = n(u[r]).data().properties, o = s.searchResultsSignature.split(","), o.indexOf(i) !== -1 && (e = n(u[r]).find(".variant-option"), _.each(e, function(t) {
                var i = n(t).data();
                f[i.variantindex] = {
                    id: i.variant,
                    cssClass: n(t).attr("class")
                }
            }), t[i] = f);
        return t.hasOwnProperty(i) ? t[i] : {}
    }, i
}(jQuery, document);
XA.register("variantFilter", XA.component.search.variantFilter);
XA.component.search.service = function(n) {
    "use strict";
    var r = XA.component.search.results.searchResultModels,
        u = XA.component.search.url,
        t = XA.component.search.query,
        i = XA.component.search.parameters,
        f = XA.component.search.ajax,
        e;
    return e = Backbone.Model.extend({
        defaults: {},
        initialize: function() {
            var n = this;
            XA.component.search.vent.on("orderChanged", function(t) {
                n.getData(t)
            })
        },
        getData: function(n) {
            r.length > 0 ? this.getSearchResultsData(n) : this.getEndpointAndSearch(n)
        },
        getSearchResultsData: function(i) {
            var s = t.parseHashParameters(window.location.hash),
                h = this,
                a, c, v, y, o, e, l;
            _.each(r, function(r) {
                if ((o = r.get("dataProperties").sig !== null ? encodeURIComponent(r.get("dataProperties").sig) : "", c = o !== "" ? o + "_e" : "e", r.get("dataProperties").autoFireSearch || s && t.isSignaturePresentInHash(s, o)) && (a = r.get("dataProperties").defaultSortOrder, v = r.get("dataProperties").p, y = r.get("dataProperties").v, typeof i == "undefined" || !i.hasOwnProperty("singleRequestMode") || i.singleRequestMode == o)) {
                    if (s = h.getDefaultDefaultPageSize(o, v, s), s.hasOwnProperty("l") && s.l === "" && (s.l = r.get("dataProperties").l), e = n.extend({}, r.get("dataProperties"), s), e = n.extend(e, i), e.hasOwnProperty("loadMore")) {
                        r.set("loadMore", !0);
                        delete e.loadMore;
                        var p = r.get("loadMoreOffset") + e.p;
                        r.set("loadMoreOffset", p);
                        e[c] = p
                    } else r.get("loadMoreOffset") && (e.p !== 0 && (e.p = e.p * (1 + r.get("loadMoreOffset") / e.p), e[c] = 0, r.set("loadMoreOffset", 0)), delete e.variantChanged);
                    (e = h.getSortOrder(o, e, a), e = h.setVariant(o, e, y), l = u.createSearchUrl(e, o), l) && (r.checkBlockingRequest() || (r.blockRequests(!0), XA.component.search.vent.trigger("results-loading", r.cid), f.getData({
                        callback: function(n) {
                            n.Signature = n.Signature !== null ? n.Signature : "";
                            XA.component.search.vent.trigger("results-loaded", {
                                dataCount: n.Count,
                                data: n.Results,
                                pageSize: n.Signature !== "" && e.hasOwnProperty(n.Signature + "_p") ? e[n.Signature + "_p"] : e.p,
                                offset: n.Signature !== "" && e.hasOwnProperty(n.Signature + "_e") ? e[n.Signature + "_e"] : e.e,
                                searchResultsSignature: n.Signature,
                                loadMore: r.get("loadMore")
                            })
                        },
                        url: l
                    })))
                }
            })
        },
        getSearchData: function(i) {
            var c = t.parseHashParameters(window.location.hash),
                r = n.extend({}, c, r, i),
                o = [],
                s, h, e;
            for (r = this.getDefaultDefaultPageSize("", 0, r), r.hasOwnProperty("o") || typeof XA.component.search.sort == "undefined" || (s = XA.component.search.sort.getFirstSortingOption(), s !== -1 && (r.o = s)), r.endpoint = XA.component.map.getSearchEndpoint(), o = XA.component.map.getSignatures(), e = 0; e < o.length; e++) {
                if (r.sig = o[e], h = u.createSearchUrl(r, o[e]), !h) return;
                f.getData({
                    callback: function(n) {
                        n.Signature = n.Signature !== null ? n.Signature : "";
                        XA.component.search.vent.trigger("results-loaded", {
                            dataCount: n.Count,
                            data: n.Results,
                            pageSize: r.p,
                            offset: 0,
                            searchResultsSignature: n.Signature
                        })
                    },
                    url: h
                })
            }
        },
        getEndpointAndSearch: function() {
            XA.component.map && typeof XA.component.map.getSearchEndpoint() != "undefined" ? this.getSearchData() : setTimeout(this.getEndpointAndSearch.bind(this), 100)
        },
        getSortOrder: function(n, t, r) {
            var e = XA.component.search.sort.getFirstSortingOption(n),
                f = n !== "" ? n + "_o" : "o",
                u = "",
                o = {};
            return e !== -1 ? u = e : r !== "" && (u = r), t.hasOwnProperty(f) || u === "" || (delete t.defaultSortOrder, delete t.o, t[f] = u, {}[f] = u), o[f] = u, i.registerDefault(o), t
        },
        getDefaultDefaultPageSize: function(n, t, r) {
            var o = XA.component.search.pageSize.getDefaultPageSizes(),
                u = n !== "" ? n + "_p" : "p",
                f, e;
            return r.hasOwnProperty(u) || typeof XA.component.search.pageSize == "undefined" || o !== -1 && (f = o.filter(function(t) {
                return t.signatures.indexOf(n) !== -1
            }), f.length > 0 && (r[u] = f[0].defaultPageSize)), r.hasOwnProperty(u) || t == 0 || (r[u] = t), e = {}, e[u] = t, i.registerDefault(e), r
        },
        setVariant: function(t, r, u) {
            var e = XA.component.search.variantFilter.getVariantMappings(t),
                f = t !== "" ? t + "_v" : "v",
                o;
            return t === "" && n.isEmptyObject(e) || (t === "" && r.hasOwnProperty(f) && e.hasOwnProperty(r[f]) ? r[f] = e[r[f]].id : t === "" && e.hasOwnProperty(0) ? r[f] = e[0].id : (delete r.v, r[f] = r.hasOwnProperty(f) ? e[r[f]].id : e.hasOwnProperty(0) ? e[0].id : u)), o = {}, o[f] = 0, i.registerDefault(o), r
        }
    }), new e
}(jQuery, document);
XA.component.search.router = function(n) {
    "use strict";
    var t = {},
        i, r = !1,
        u, f;
    return f = Backbone.Router.extend({
        routes: {
            "*params": "checkUrl"
        },
        checkUrl: function(n, t) {
            var r = i.parseHashParameters(window.location.hash);
            XA.component.search.service.getData();
            r ? (t || JSON.stringify(r) !== JSON.stringify(u)) && (XA.component.search.facet.data.filterFacetData(r), u = r, XA.component.search.vent.trigger("hashChanged", r)) : (XA.component.search.facet.data.getInitialFacetData(), XA.component.search.vent.trigger("hashChanged", r))
        }
    }), t.init = function() {
        n("body").hasClass("on-page-editor") || r || (i = XA.component.search.query, this.api.routerInstance = new f, Backbone.History.started || Backbone.history.start(), r = !0)
    }, t
}(jQuery, document);
XA.register("searchRouter", XA.component.search.router);
XA.component.search.facet.daterange = function(n) {
    var u = {},
        t, o, i, r, f, e;
    return i = function(t) {
        return t !== null && t !== "" ? n.datepicker.formatDate("yymmdd", t) : ""
    }, r = function(n) {
        var i = n.substr(0, 4),
            r = n.substr(4, 2) - 1,
            u = n.substr(6, 2),
            t = new Date(i, r, u);
        if (n !== "") {
            if (t.getFullYear() == i && t.getMonth() == r && t.getDate() == u) return t;
            throw "Invalid date: " + n;
        }
    }, f = Backbone.Model.extend({
        defaults: {
            dataProperties: {},
            sig: []
        }
    }), e = XA.component.search.baseView.extend({
        initialize: function() {
            this.properties = this.$el.data().properties;
            this.model && (this.model.set({
                dataProperties: this.properties
            }), this.model.set("sig", this.translateSignatures(this.properties.searchResultsSignature, this.properties.f)));
            this.model.on("change", this.render, this);
            XA.component.search.vent.on("hashChanged", this.updateComponent.bind(this))
        },
        events: {
            "change .startDate": "updateFacet",
            "change .endDate": "updateFacet",
            "click .bottom-remove-filter, .clear-filter": "clearFilter"
        },
        render: function() {
            var h = parseInt(this.model.get("dataProperties").fromDateDefaultOffset),
                c = parseInt(this.model.get("dataProperties").toDateDefaultOffset),
                u = this.model.get("dataProperties").fromDateDisplayFormat,
                f = this.model.get("dataProperties").toDateDisplayFormat,
                l = this.model.get("dataProperties").fromDateMonthsShown,
                a = this.model.get("dataProperties").toDateMonthsShown,
                w = this.model.get("dataProperties").fromDatePastDays,
                b = this.model.get("dataProperties").toDateFutureDays,
                k = this.model.get("dataProperties").fromDateVisible,
                d = this.model.get("dataProperties").toDateVisible,
                v = this.$el.find(".startDate"),
                y = this.$el.find(".endDate"),
                o = t.parseHashParameters(window.location.hash),
                e = this.model.get("sig"),
                g = n("html").attr("lang") ? n("html").attr("lang") : "",
                p = this.$el.closest(".overlay-inner").length,
                s, i;
            for (f && (f = f.replace(/yy/g, "y")), u && (u = u.replace(/yy/g, "y")), k && v.datepicker({
                    dateFormat: u,
                    changeMonth: l,
                    changeYear: l,
                    minDate: w ? h != "" ? -1 * h : new Date(1900, 1, 1) : new Date,
                    beforeShow: p ? this.overrideZIndex : undefined
                }), d && y.datepicker({
                    dateFormat: f,
                    changeMonth: a,
                    changeYear: a,
                    maxDate: b ? c != "" ? c : new Date(2100, 1, 1) : new Date,
                    beforeShow: p ? this.overrideZIndex : undefined
                }), $xa.datepicker.setDefaults($xa.datepicker.regional[g]), i = 0; i < e.length; i++) o.hasOwnProperty(e[i]) && o[e[i]] != "" && (s = o[e[i]].split("|"), v.datepicker("setDate", r(s[0])), y.datepicker("setDate", r(s[1])))
        },
        updateFacet: function() {
            var u = this.$el.find(".facet-heading > span"),
                n = this.$el.find(".startDate"),
                r = this.$el.find(".endDate"),
                f = n.length > 0 ? n.datepicker("getDate") : null,
                e = r.length > 0 ? r.datepicker("getDate") : null,
                o = this.model.get("sig");
            t.updateHash(this.updateSignaturesHash(o, i(f) + "|" + i(e), {}));
            u.addClass("has-active-facet")
        },
        clearFilter: function() {
            var f = this.model.get("dataProperties"),
                o = this.$el.find(".facet-heading > span"),
                r = t.parseHashParameters(window.location.hash),
                u = this.model.get("sig"),
                e = !1,
                n, i;
            for (o.removeClass("has-active-facet"), i = 0; i < u.length; i++) n = u[i], typeof r[n] != "undefined" && r[n] !== "" && (delete f[n], e = !0);
            e && (t.updateHash(this.updateSignaturesHash(u, "", r)), this.model.set({
                dataProperties: f
            }), this.$el.find(".startDate").val(""), this.$el.find(".endDate").val(""))
        },
        updateComponent: function(n) {
            for (var f = this.$el.find(".startDate"), e = this.$el.find(".endDate"), u = this.model.get("sig"), i, t, r = 0; r < u.length; r++) i = u[r].toLowerCase(), n.hasOwnProperty(i) && n[i] !== "" ? (t = n[i].split("|"), t[0] !== "" && this.handleDate(f, t[0]), t[1] !== "" && this.handleDate(e, t[1])) : this.clearFilter()
        },
        handleDate: function(n, t) {
            var u = this.$el.find(".facet-heading > span");
            n.length !== 0 && i(n.datepicker("getDate")) !== t ? (n.datepicker("setDate", r(t)), u.addClass("has-active-facet")) : t === "" && n.datepicker("setDate", null)
        },
        overrideZIndex: function() {
            setTimeout(function() {
                var t = n(".ui-datepicker"),
                    i = t.attr("style");
                t.attr("style", i + "z-index: 10000 !important")
            }, 0)
        }
    }), u.init = function() {
        if (!n("body").hasClass("on-page-editor")) {
            t = XA.component.search.query;
            o = XA.component.search.url;
            var i = n(".facet-date-range:not(.initialized)");
            _.each(i, function(t) {
                var i = n(t),
                    r = new f,
                    u = new e({
                        el: i,
                        model: r
                    });
                u.render();
                i.addClass("initialized")
            })
        }
    }, u
}(jQuery, document);
XA.register("facetDateRange", XA.component.search.facet.daterange)