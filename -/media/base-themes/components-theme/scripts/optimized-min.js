XA.component.accessibility = function(n) {
    var t = {},
        e = function() {
            return n("body").find("[tabindex]")
        },
        o = function() {
            t.indexedElements.eq(0).attr("tabindex", "0")
        },
        s = function() {
            var i = n(document.activeElement),
                t = i.closest(".initialized");
            return t.length ? t.attr("class").split(" ")[1] : ""
        },
        i = function(t) {
            var i = n(document.activeElement);
            return i.closest(t)
        },
        r = function(n, t) {
            var i = t;
            n == "left" && t.prev() ? (t.attr("tabindex", "-1"), i = t.prev()) : n == "right" && t.next() && (t.attr("tabindex", "-1"), i = t.next());
            i.attr("tabindex", "0").trigger("click").focus()
        },
        u = function(n, t) {
            var r = t.closest("li.item"),
                i = t,
                u = r.next(),
                f = r.prev();
            n == "down" && u ? (t.attr("tabindex", "-1"), i = u) : n == "up" && f && (t.attr("tabindex", "-1"), i = f);
            i.find(".toggle-header").attr("tabindex", "0").focus()
        },
        h = function(n) {
            var t = n.next().length ? n.next() : n.prev();
            n.attr("tabindex", "-1");
            t.trigger("click").attr("tabindex", "0").focus()
        },
        f = {
            tabs: function(n) {
                var u = i("li.active");
                u && (n == t.keys.right ? r("right", u) : n == t.keys.left && r("left", u))
            },
            accordion: function(n) {
                var r = i("div.toggle-header");
                r && (n == t.keys.down ? u("down", r) : n == t.keys.up && u("up", r))
            },
            flip: function(n) {
                var r = i("[class*='Side']");
                r && (n == t.keys.right || n == t.keys.left) && h(r)
            }
        },
        c = function(n) {
            var t = s();
            f[t] && f[t](n)
        };
    return t.keys = {
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        "delete": 46,
        enter: 13,
        space: 32
    }, t.indexedElements = e(), t.watchEvents = function() {
        n(document).on("keyup", function(n) {
            var t = n.keyCode;
            c(t)
        })
    }, t.initInstance = function() {
        t.watchEvents();
        o()
    }, t.init = function() {
        t.initInstance()
    }, t
}(jQuery, document);
XA.register("accessibility", XA.component.accessibility);
XA.component.accordions = function(n) {
    function r(t) {
        var i = n(t),
            r = n(t).find("img"),
            u = r.attr("src");
        u && (i.parents(".accordion").addClass("accordion-image"), i.css({
            background: "url(" + u + ")",
            "background-repeat": "no-repeat",
            "background-size": "cover",
            "background-position": "50% 100%"
        }), r.hide())
    }

    function u(t) {
        var u = n(t).width(),
            i = n(t).find(".item"),
            r = 0;
        _.each(i, function(f) {
            var s = n(f).find(".toggle-content"),
                e = n(f).find(".toggle-header"),
                o = u - i.length * e.outerWidth();
            n(f).hasClass("active") && n(f).css({
                width: o
            });
            s.css({
                width: n(t).hasClass("accordion-image") ? o + e.outerWidth() : o - e.outerWidth() - parseInt(e.css("padding"))
            });
            n(f).find(".toggle-content").height() > r && (r = n(f).find(".toggle-content").height())
        })
    }

    function f(n) {
        var t = n[0].id;
        return n.length > 0 && t != "" ? t.toLocaleLowerCase() : null
    }

    function e(f, e) {
        var s = "click",
            o = f.find(".toggle-header").filter(function(t, i) {
                return n(i).closest(".accordion").is(f)
            });
        e.expandOnHover && (s += " mouseenter");
        o.on("mouseover", i.focus);
        o.on("mouseleave", i.blur);
        o.on("focus", i.focus);
        o.on("blur", i.blur);
        o.on("keyup", function(t) {
            (t.keyCode == 13 || t.keyCode == 32) && n(this).click()
        });
        f.hasClass("accordion-horizontal") && (n(document).ready(function() {
            u(f)
        }), _.each(o, function(n) {
            r(n)
        }));
        o.on(s, function() {
            var r = n(this),
                i = r.closest(".item"),
                o = r.parents(".accordion"),
                u = i.find(".toggle-content:first"),
                f = i.siblings(),
                s = f.find(".toggle-content");
            o.hasClass("accordion-horizontal") ? t.animateHorizontal.call(this, e) : (e.canOpenMultiple || (f.removeClass("active"), s.stop().slideUp({
                duration: e.speed,
                easing: e.easing
            })), i.toggleClass("active"), e.canToggle ? u.slideToggle({
                duration: e.speed,
                easing: e.easing
            }) : u.slideDown({
                duration: e.speed,
                easing: e.easing
            }))
        })
    }
    var t = {},
        i = {
            focus: function() {
                n(this).addClass("show")
            },
            blur: function() {
                n(this).removeClass("show")
            }
        };
    return t.animateHorizontal = function(t) {
        var r = n(this).parents(".accordion"),
            i = n(this).closest(".item"),
            s = i.find(".toggle-header"),
            f = i.find(".toggle-content"),
            h = r.find(".item"),
            e = i.siblings(),
            c = e.find(".toggle-content"),
            u, o;
        i.toggleClass("active");
        e.removeClass("active");
        e.stop(!0).animate({
            width: 0
        }, t.speed, t.easing, function() {
            c.css({
                display: "none"
            })
        });
        i.hasClass("active") ? (u = r.hasClass("accordion-image") ? f.outerWidth() : r.width() - ((h.length - 1) * i.outerWidth() + 2), o = r.hasClass("accordion-image") ? u : u - s.outerWidth(), i.stop(!0).animate({
            width: u
        }, t.speed, t.easing, function() {}), f.css({
            width: o,
            display: "block"
        })) : i.stop(!0).animate({
            width: 0
        }, t.speed, t.easing, function() {
            f.css({
                display: "none"
            })
        })
    }, t.initInstance = function(t, i) {
        var u, h, o, r, s;
        if (t.find(".toggle-header").eq(0).attr("tabindex", "0"), t.hasClass("toggle") && n.extend(i, {
                canToggle: !0
            }), t.find(".toggle-content").hide(), u = XA.queryString.getQueryParam(f(t)), u != null)
            for (h = u.split(","), o = t.find("ul").first().children(), r = 0; r < o.length; r++) s = o[r], h.indexOf(r + "") > -1 && (n(s).addClass("active"), n(s).find(".toggle-content").show());
        else i.expandedByDefault && (t.find("li:first-child").addClass("active"), t.find("li:first-child").find(".toggle-content").show());
        e(t, i)
    }, t.init = function() {
        var i = n(".accordion:not(.initialized)");
        i.each(function() {
            var r = n(this).data("properties"),
                i = n(this);
            t.initInstance(i, r);
            i.addClass("initialized")
        })
    }, t
}(jQuery);
XA.register("accordions", XA.component.accordions);
XA.component.archive = function(n) {
    var t = {},
        i = function(t) {
            var i = n(t.target);
            i.siblings("ul").toggle();
            i.toggleClass("opened")
        };
    return t.initInstance = function(n) {
        var t = n.find(".group-header");
        t.on("click", i)
    }, t.init = function() {
        for (var u = n(".sxa-archive:not(.initialized)"), i, r = 0, f = u.length; r < f; r++) i = n(u[r]), t.initInstance(i), i.addClass("initialized")
    }, t
}(jQuery, _);
XA.register("archive", XA.component.archive);
XA.component.breadcrumb = function(n) {
    function t(n) {
        this.breadcrumb = n;
        this.hideHistory = [];
        this.hideHistory.elems = [];
        this.hideHistory.widths = []
    }
    var i = {};
    return t.prototype.getElements = function(n) {
        var t = [];
        return n.find("li").each(function() {
            t.push(this)
        }), t
    }, t.prototype.calculateListElementsWidth = function(t) {
        var i = 0;
        return t.find(">li").each(function() {
            i += n(this).width()
        }), i
    }, t.prototype.calculateWidth = function() {
        var t = this,
            r = n(t.breadcrumb).find("nav>ol"),
            o = r.width(),
            f = this.calculateListElementsWidth(r),
            i = this.getElements(r),
            e, u = 0,
            h = t.hideHistory.widths[t.hideHistory.widths.length - 1],
            s;
        for (o > f + h && (s = t.hideHistory.elems.pop(), t.hideHistory.widths.pop(), n(s).removeClass("item-hide")); o < f && i.length > 2;) u = Math.round(i.length / 2) - 1, e = n(i[u]), t.hideHistory.elems.push(i[u]), t.hideHistory.widths.push(e.width()), e.addClass("item-hide"), f = t.calculateListElementsWidth(r), i.splice(u, 1)
    }, t.prototype.init = function() {
        var t = this;
        t.calculateWidth();
        n(window).resize(function() {
            t.calculateWidth()
        })
    }, t.prototype.makeNavigation = function() {
        var t = n(this.breadcrumb),
            i = t.find("li > ol");
        i.length > 0 && t.addClass("breadcrumb-navigation")
    }, i.initInstance = function(i) {
        var r = new t(i),
            u = n(i);
        u.hasClass("breadcrumb-hide") ? r.init() : r.makeNavigation()
    }, i.init = function() {
        var t = n(".breadcrumb:not(.initialized)");
        t.each(function() {
            i.initInstance(n(this));
            n(this).addClass("initialized")
        })
    }, i
}(jQuery, document);
XA.register("breadcrumb", XA.component.breadcrumb);
XA.component.carousels = function(n) {
    function t() {
        this.elapsed = 0;
        this.stamp = null
    }

    function r(n, t, i) {
        this.view = t;
        this.view.init(i)
    }

    function e(n, t, i) {
        var r = n.extend(!0, {}, {
                isEnabled: !0,
                hasPrevNextItems: !0,
                item: {
                    label: "#{index}",
                    selector: null
                },
                prevItem: {
                    label: "<",
                    selector: null,
                    isContainer: !1
                },
                nextItem: {
                    label: ">",
                    selector: null,
                    isContainer: !1
                },
                slidesCount: 0
            }, i),
            u;
        this.$ = n;
        this.$items = n();
        this.$nextItem = n();
        this.$prevItem = n();
        this.$selectedItem = null;
        r.isEnabled && (u = this, setTimeout(function() {
            u.prepareItems(r.item, r.slidesCount, t);
            u.selectItem(0)
        }, 1e3), t.find(".nav").trigger("navigation-created", this))
    }

    function h() {
        this.canChangeSlide = !0;
        this.defaults = null;
        this.navigation = null;
        this.owner = null;
        this.preventScheduling = !1;
        this.settings = null;
        this.slideTimer = new t;
        this.timeIndicator = null;
        this.timers = [];
        this.timeoutId = null;
        this.transition = null;
        this.transitionSettings = new XA.component.carousels.Transitions.TransitionSettings;
        this.$slides = null;
        this.$wrapper = null;
        this.changeCurrentSlide = null;
        this.getCurrentSlide = null;
        this.timers.push(this.slideTimer)
    }

    function i(n, t, i) {
        var r = {
            navigation: {},
            timeout: 1e4,
            transition: "BasicTransition",
            isPauseEnabled: !0,
            timeIndicator: {
                isEnabled: !1,
                selector: null,
                view: "View",
                options: {}
            }
        };
        this.context = t;
        t.owner = this;
        t.defaults = r;
        t.settings = n.extend(!0, {}, r, i);
        t.transitionSettings.$slides = t.$slides
    }

    function u() {
        var n = this;
        this.slider = null;
        this.$currentSlide = null;
        this.$slides = null;
        this.changeCurrentSlide = function(t) {
            n.$currentSlide = t;
            n.slider.selectNavigationItem(t.index())
        };
        this.getCurrentSlide = function() {
            return n.$currentSlide
        };
        this.data = {}
    }
    var o = {},
        f = null,
        s = null;
    return t.prototype.update = function() {
        this.stamp !== null && (this.elapsed += this.newStamp() - this.stamp)
    }, t.prototype.set = function() {
        this.stamp = this.newStamp()
    }, t.prototype.newStamp = function() {
        return (new Date).valueOf()
    }, t.prototype.reset = function() {
        this.elapsed = 0
    }, r.prototype = new t, r.constructor = t, r.prototype.play = function() {
        this.view.play()
    }, r.prototype.pause = function() {
        this.view.pause()
    }, r.prototype.reset = function() {
        t.prototype.reset.call(this);
        this.view.reset()
    }, r.prototype.update = function() {
        t.prototype.update.call(this);
        this.view.update(this.elapsed)
    }, f = function(n) {
        function t(t) {
            var r = t.text,
                i = null;
            return t.text = "", t.href = "#", i = n("<a>", t), n("<span>", {
                text: r
            }).appendTo(i), i
        }
        return {
            getElement: function(t) {
                var i = n(t);
                return i.length === 0 && (i = null), i
            },
            createItems: function(n, i, r) {
                for (var e = /#\{index\}/g, f, u = 0; u < r; u++) f = {
                    text: i.replace(e, u + 1)
                }, t(f).appendTo(n)
            },
            createPrevNextItem: function(i, r, u) {
                var f = null,
                    e = i.selector !== null;
                return e && (u = this.getElement(i.selector)), u !== null && (i.isContainer || !e ? (f = t(n.extend({}, {
                    text: i.label
                }, r)), u.first()[i.method](f)) : f = u.first()), f
            }
        }
    }(n), e.prototype.selectedItemClass = "active", e.prototype.selectItem = function(n) {
        this.$selectedItem !== null && this.$selectedItem.removeClass(this.selectedItemClass);
        this.$selectedItem = this.$items.eq(n).addClass(this.selectedItemClass)
    }, e.prototype.prepareItems = function(t, i, r) {
        var u = null;
        return t.selector !== null ? u = f.getElement(t.selector) : (u = n("<div/>", {
            "class": "nav"
        }), u.appendTo(r)), u !== null && (u.children().length === 0 && f.createItems(u, t.label, i), this.$items = u.children().slice(0, i)), u
    }, e.prototype.preparePrevNextItems = function(n, t) {
        var i;
        n.prevItem.method = "prepend";
        i = f.createPrevNextItem(n.prevItem, {
            "class": "prev"
        }, t);
        this.$prevItem = i === null ? this.$prevItem : i;
        n.nextItem.method = "append";
        i = f.createPrevNextItem(n.nextItem, {
            "class": "next"
        }, t);
        this.$nextItem = i === null ? this.$nextItem : i
    }, i.prototype.executeOnTimers = function(n, t) {
        for (var i = null, r = null, u = t.timers, i = 0; i < u.length; i++) r = u[i], typeof r[n] == "function" && r[n]()
    }, i.prototype.descheduleSlide = function(n) {
        n.timeoutId !== null && (clearTimeout(n.timeoutId), n.timeoutId = null)
    }, i.prototype.scheduleSlide = function(n) {
        var t = n.owner;
        t.descheduleSlide(n);
        !n.preventScheduling && n.$slides.length > 1 && (t.executeOnTimers("set", n), n.canChangeSlide ? (n.timeIndicator !== null && n.timeIndicator.play(), n.timeoutId = setTimeout(function() {
            t.changeCurrentSlideBy(1, n)
        }, n.settings.timeout - n.slideTimer.elapsed)) : setTimeout(function() {
            t.scheduleSlide(n)
        }, 100))
    }, i.prototype.changeCurrentSlideBy = function(t, i) {
        var r = i.transitionSettings,
            f = i.getCurrentSlide(),
            u = i.$slides,
            e;
        t % u.length != 0 && (i.canChangeSlide = !1, r.offset = t, r.$currentSlide = f, r.$nextSlide = u.eq((f.index() + t) % u.length), i.changeCurrentSlide(r.$nextSlide), i.transition.perform(i.transitionSettings, t), i.owner.executeOnTimers("reset", i));
        e = n(i.$wrapper).parents(".carousel");
        e.trigger("slide-changed")
    }, i.prototype.run = function() {
        this.executeOnTimers("reset", this.context);
        this.scheduleSlide(this.context)
    }, i.prototype.onChangeCurrentSlide = function(n, t, i) {
        var r = i.owner;
        n.preventDefault();
        i.canChangeSlide && (r.descheduleSlide(i), r.changeCurrentSlideBy(t, i))
    }, i.prototype.selectNavigationItem = function(n) {
        this.context.navigation.selectItem(n)
    }, s = function(n) {
        function u(r) {
            var e = r.owner,
                u = r.$wrapper.find(".nav-items"),
                o = r.$wrapper.find(".prev-text"),
                s = r.$wrapper.find(".next-text"),
                h = r.$wrapper.parents(".carousel");
            r.navigation.$items.each(function(t) {
                var i = r.$slides.eq(t);
                n(this).click(function(n) {
                    e.onChangeCurrentSlide(n, i.index() - r.getCurrentSlide().index(), r)
                })
            });
            o.click(function(n) {
                i(n, r, t.PREV)
            });
            s.click(function(n) {
                i(n, r, t.NEXT)
            });
            r.navigation.$prevItem.click(function(n) {
                i(n, r, t.PREV)
            });
            r.navigation.$nextItem.click(function(n) {
                i(n, r, t.NEXT)
            });
            u.on("keydown", function(u) {
                switch (u.keyCode) {
                    case 37:
                        i(u, r, t.PREV);
                        n(this).parent().find(".active").focus();
                        break;
                    case 39:
                        i(u, r, t.NEXT);
                        n(this).parent().find(".active").focus();
                        break;
                    case 13:
                        f(e.context.getCurrentSlide())
                }
            });
            h.on("slide-changed", function() {
                var n = u.find(".active");
                n.attr("tabindex", "0");
                u.find(document.activeElement).length && n.focus();
                u.find(">div").not(".active").attr("tabindex", "-1")
            })
        }

        function i(n, t, i) {
            var u = t.owner,
                r = t.$wrapper.find(".nav-items");
            r.find(".active").attr("tabindex", "-1");
            u.onChangeCurrentSlide(n, i, t);
            r.find(".active").attr("tabindex", "0")
        }

        function f(n) {
            var t = n.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'),
                i;
            t.length !== 0 && (i = t[0], i.focus())
        }

        function o(n) {
            var t = n.owner,
                i = n.$wrapper,
                u = i.find(".nav a"),
                f = function() {
                    n.preventScheduling = !0;
                    t.descheduleSlide(n);
                    t.executeOnTimers("update", n);
                    n.timeIndicator !== null && n.timeIndicator.pause()
                },
                r;
            i.mouseenter(f);
            u.on("focus", f);
            r = function() {
                n.preventScheduling = !1;
                t.scheduleSlide(n)
            };
            i.mouseleave(r);
            u.on("blur", r)
        }

        function s(t) {
            var i = t.settings,
                u = null,
                f = XA.component.carousels.IndicatorViews[i.timeIndicator.view],
                e = null;
            f !== null && (e = new f(i.timeIndicator.selector, i.timeIndicator.options), u = new r(n, e, i.timeout), t.timeIndicator = u, t.timers.push(u))
        }

        function h(t) {
            t.settings.navigation.slidesCount = t.$slides.length;
            t.navigation = new e(n, t.$wrapper, t.settings.navigation);
            setTimeout(function() {
                u(t)
            }, 1e3);
            t.settings.isPauseEnabled && o(t)
        }

        function c(n) {
            var t = null,
                i = n.owner;
            n.transitionSettings.callback = function() {
                n.canChangeSlide = !0;
                n.preventScheduling ? i.executeOnTimers("reset", n) : i.scheduleSlide(n)
            };
            t = XA.component.carousels.Transitions[n.settings.transition];
            (t === null || t === undefined) && (t = XA.component.carousels.Transitions[n.defaults.transition]);
            n.transition = new t;
            n.transition.init(n.transitionSettings)
        }
        var t = {
            PREV: -1,
            NEXT: 1
        };
        return {
            initialize: function(n) {
                h(n);
                c(n);
                n.settings.timeIndicator.isEnabled && s(n)
            }
        }
    }(n), u.prototype.reset = function() {
        this.$slides.each(function() {
            n(this).hide()
        });
        this.changeCurrentSlide(this.$slides.first());
        this.$currentSlide.show()
    }, u.prototype.init = function(t, r) {
        var f = n("<div/>", {
                "class": "wrapper"
            }),
            u = null;
        f.append(t.children().detach());
        t.append(f);
        this.$slides = t.find(".slides li.slide");
        u = new h;
        u.changeCurrentSlide = this.changeCurrentSlide;
        u.getCurrentSlide = this.getCurrentSlide;
        u.$slides = this.$slides;
        u.$wrapper = f;
        this.slider = new i(n, u, r);
        s.initialize(u);
        this.reset();
        this.slider.run()
    }, u.prototype.swipeSlide = function() {
        var n = this,
            i = this.slider.context.$wrapper,
            t = new Hammer(i[0]);
        t.get("pan").set({
            direction: Hammer.DIRECTION_HORIZONTAL
        });
        t.on("swipeleft", function(t) {
            n.slider.context.owner.onChangeCurrentSlide(t, 1, n.slider.context)
        });
        t.on("swiperight", function(t) {
            n.slider.context.owner.onChangeCurrentSlide(t, -1, n.slider.context)
        })
    }, u.prototype.maxSlideInfoHeight = function() {
        var t = 0,
            n = this.$slides[0].querySelector(".slide-info"),
            i, r;
        for (n && (t = n.offsetHeight), i = 1; i < this.$slides.length; i++)(n = this.$slides[i].querySelector(".slide-info"), n) && (r = n.offsetHeight, t < r && (t = r));
        return t
    }, u.prototype.resizeWrapper = function() {
        var n = this.maxSlideInfoHeight(),
            t = this.slider.context.$wrapper;
        t.find(".slide-info").css({
            "min-height": n
        })
    }, o.initInstance = function(t) {
        var r = t.data("properties"),
            t = t.find(".carousel-inner"),
            s = t.attr("data-id"),
            a = t.eq(0),
            f = parseInt(XA.queryString.getQueryParam(t.closest(".component.carousel").attr("id") || "carousel")),
            c = typeof f != "undefined" && !isNaN(f) && f < t.find(".sxa-numbers").length,
            i, o, l, h, e;
        r && (r.navigation || (r.navigation = {
            item: {},
            prevItem: {},
            nextItem: {},
            isEnabled: c ? !1 : !0
        }), r.navigation.item.selector = "[data-id='" + s + "'] .nav-items", r.navigation.prevItem.selector = "#" + s + " .nav", r.navigation.nextItem.selector = "#" + s + " .nav", e = new u(n), e.init(t, r), n(document).ready(function() {
            e.resizeWrapper()
        }), c ? (i = e.slider.context, o = i.transitionSettings, l = i.getCurrentSlide(), h = i.$slides, i.canChangeSlide = !1, o.$currentSlide = l, o.$nextSlide = n(h[f]), i.changeCurrentSlide(o.$nextSlide), i.transition.perform(i.transitionSettings), i.owner.executeOnTimers("reset", i), i.navigation.prepareItems(r.navigation.item, h.length, n(i.$wrapper)), i.navigation.selectItem(f)) : e.swipeSlide())
    }, o.init = function() {
        n(".carousel:not(.initialized)").each(function() {
            o.initInstance(n(this));
            n(this).addClass("initialized")
        })
    }, o
}(jQuery);
XA.register("carousels", XA.component.carousels);
XA.component.carousels.Transitions = function() {
    function i() {}

    function n() {}

    function e() {}

    function r() {}

    function u() {}

    function f() {}
    var t = {};
    return i.prototype.$currentSlide = null, i.prototype.$nextSlide = null, i.prototype.$slides = null, i.prototype.offset = 0, i.prototype.callback = null, t.TransitionSettings = i, n.prototype = new n, n.prototype.init = function() {}, n.prototype.factor = function(n) {
        return n.offset > 0 ? 1 : -1
    }, n.prototype.perform = function(n) {
        n.callback()
    }, t.Transition = n, e.prototype = new n, e.constructor = e, e.prototype.perform = function(n) {
        n.$currentSlide.hide();
        n.$nextSlide.show();
        n.callback()
    }, t.BasicTransition = e, r.prototype = new n, r.constructor = r, r.prototype.init = function() {}, r.prototype.perform = function(n) {
        var t = "z-index",
            r = n.$slides.parent(),
            i = n.$nextSlide;
        r.css(t, 0);
        i.css(t, 1);
        n.$slides.css({
            position: "relative"
        });
        n.$nextSlide.css({
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0"
        });
        i.fadeIn(function() {
            n.$currentSlide.hide();
            n.$nextSlide.css({
                position: "relative",
                left: "0",
                transform: "none"
            });
            i.css(t, "");
            r.css(t, "");
            n.callback()
        })
    }, t.FadeInTransition = r, u.prototype = new n, u.constructor = u, u.prototype.onAnimationComplete = function(n, t) {
        n.$currentSlide.hide();
        n.$nextSlide.css({
            top: "",
            bottom: "",
            left: "",
            position: "",
            width: ""
        });
        t.css({
            left: ""
        });
        t.css("margin-left", "");
        n.callback()
    }, u.prototype.perform = function(n, t) {
        var r = this.factor(n),
            u = this.onAnimationComplete,
            f = n.$currentSlide.width(),
            i = n.$slides.parent();
        n.$nextSlide.css({
            top: "0",
            bottom: "0",
            left: "100%",
            position: "absolute",
            width: "100%"
        });
        t > 0 ? n.$nextSlide.css({
            left: "100%"
        }) : n.$nextSlide.css({
            left: "-100%"
        });
        n.$nextSlide.show();
        i.animate({
            left: -r * f + "px"
        }, function() {
            u(n, i)
        })
    }, t.SlideHorizontallyTransition = u, f.prototype = new n, f.constructor = f, f.prototype.onAnimationComplete = function(n, t) {
        n.$currentSlide.hide();
        n.$nextSlide.css({
            top: "",
            bottom: "",
            left: "",
            right: "",
            position: "",
            width: ""
        });
        t.css("top", "");
        t.css("margin-top", "");
        n.callback()
    }, f.prototype.perform = function(n, t) {
        var r = this.factor(n),
            u = this.onAnimationComplete,
            f = n.$currentSlide.height(),
            i = n.$slides.parent();
        n.$nextSlide.css({
            left: "0",
            right: "0",
            position: "absolute",
            width: "100%"
        });
        t > 0 ? n.$nextSlide.css({
            top: "-100%",
            bottom: "100%"
        }) : n.$nextSlide.css({
            top: "100%",
            bottom: "-100%"
        });
        n.$nextSlide.show();
        i.animate({
            top: r * f
        }, function() {
            u(n, i)
        })
    }, t.SlideVerticallyTransition = f, t
}(jQuery);
XA.component.carousels.IndicatorViews = function(n) {
    function e(n) {
        var t, i = !1;
        for (f === null && (f = document.createElement("supportElement").style), t = 0; t < n.length; t++)
            if (f[n[t]] !== undefined) {
                i = !0;
                break
            }
        return i
    }

    function o() {
        return e(["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])
    }

    function t(t) {
        this.$indicator = n(t)
    }

    function i(i, r) {
        t.call(this, i);
        this.settings = n.extend(!0, {}, {
            opacity: .8
        }, r);
        this.$container = this.$indicator;
        this.$indicator = this.$indicator.find("div")
    }

    function r(i, r) {
        function u(n) {
            var t = "rotate(" + n + "deg)";
            return {
                "-webkit-transform": t,
                "-moz-transform": t,
                "-o-transform": t,
                "-ms-transform": t,
                transform: t
            }
        }

        function f(t, i) {
            var f = {
                    fontSize: "180px",
                    animateOptions: {
                        step: function(n) {
                            t.css(u(n))
                        },
                        easing: "linear"
                    }
                },
                r = n.extend(!0, {}, f, i);
            t.animate({
                "font-size": r.fontSize
            }, r.animateOptions)
        }

        function e(n, t, i) {
            t.addClass("half");
            n.addClass("half");
            f(t, {
                fontSize: "360px",
                animateOptions: {
                    duration: i
                }
            })
        }

        function o(n, t, i, r) {
            f(t, {
                animateOptions: {
                    duration: i,
                    complete: function() {
                        e(n, t, r)
                    }
                }
            })
        }
        t.call(this, i);
        this.settings = n.extend(!0, {}, {
            opacity: .5
        }, r);
        this.$mask = this.$indicator.find("span.mask").first();
        this.$rotator = this.$indicator.find("span.rotator").first();
        this.resetCss = function() {
            this.$rotator.removeClass("half");
            this.$rotator.css(u(0));
            this.$rotator.css("font-size", "0px");
            this.$mask.removeClass("half")
        };
        this.playPhaseOne = function() {
            var n = this.timeout / 2 - this.timeElapsed;
            o(this.$mask, this.$rotator, n, this.timeout / 2)
        };
        this.playPhaseTwo = function() {
            var n = this.timeout - this.timeElapsed;
            e(this.$mask, this.$rotator, n)
        }
    }
    var u = {},
        f = null;
    return u.Tools = {}, u.Tools.isCssSupported = e, u.Tools.isTransformSupported = o, t.prototype.init = function(n) {
        this.timeElapsed = 0;
        this.timeout = n
    }, t.prototype.reset = function() {
        this.timeElapsed = 0
    }, t.prototype.play = function() {}, t.prototype.pause = function() {}, t.prototype.update = function(n) {
        this.timeElapsed = n
    }, u.View = t, i.prototype = new t, i.constructor = i, i.prototype.init = function(n) {
        t.prototype.init.call(this, n);
        var i = this.settings.opacity;
        this.$container.css("opacity", i);
        this.$indicator.css("opacity", i)
    }, i.prototype.reset = function() {
        t.prototype.reset.call(this);
        this.$indicator.stop(!0);
        this.$indicator.css("width", "0px")
    }, i.prototype.pause = function() {
        this.$indicator.stop(!0)
    }, i.prototype.play = function() {
        this.$indicator.animate({
            width: "100%"
        }, this.timeout - this.timeElapsed, "linear")
    }, u.ProgressBarView = i, r.prototype = new t, r.constructor = r, r.prototype.init = function(n) {
        t.prototype.init.call(this, n);
        o() && (this.$indicator.show(), this.$mask.css("opacity", this.settings.opacity))
    }, r.prototype.reset = function() {
        t.prototype.reset.call(this);
        this.$rotator.stop(!0);
        this.resetCss()
    }, r.prototype.pause = function() {
        this.$rotator.stop(!0)
    }, r.prototype.play = function() {
        var n = this.playPhaseOne;
        this.timeElapsed >= this.timeout / 2 && (n = this.playPhaseTwo);
        n.call(this)
    }, u.RotatorView = r, u
}(jQuery);
XA.component.parallax = function(n, t) {
    function r() {
        return n(window).width() < 768
    }

    function u(i) {
        function o() {
            if (e) return !1;
            var t = n(window).scrollTop();
            f <= t + s && f + h >= t && u.css("background-position", "50% " + Math.round((f - t) * 3 / 8) + "px")
        }
        var u = i.children(".component-content"),
            s = n(window).height(),
            f = u[0].offsetTop,
            h = u[0].offsetHeight,
            e = r();
        o();
        n(document).on("scroll", t.throttle(o, 10));
        n(window).on("resize", t.throttle(function() {
            e = r();
            e ? u.css("background-position", "50% 0") : o()
        }, 150))
    }
    var i = {};
    return i.initInstance = function(n) {
        u(n)
    }, i.init = function() {
        n(".parallax-background:not(.initialized)").each(function() {
            i.initInstance(n(this));
            n(this).addClass("initialized")
        })
    }, i
}(jQuery, _);
XA.register("parallax-background", XA.component.parallax);
XA.component.disqus = function(n, t) {
    function r(n) {
        var i = t.createElement("script");
        i.type = "text/javascript";
        i.async = !0;
        i.src = "//" + n.disqus_shortname + ".disqus.com/embed.js";
        (t.getElementsByTagName("head")[0] || t.getElementsByTagName("body")[0]).appendChild(i)
    }
    var i = {};
    return i.initInstance = function(n, t) {
        window.disqus_config = function() {
            this.page.url = t.disqus_url;
            this.page.identifier = t.disqus_identifier;
            this.page.title = t.disqus_title;
            this.page.category_id = t.disqus_category_id
        };
        n.find("#disqus_thread").length > 0 && r(t)
    }, i.init = function() {
        var t = n(".disqus:not(.initialized)");
        t.each(function() {
            var t = n(this).data("properties");
            i.initInstance(n(this), t);
            n(this).addClass("initialized")
        })
    }, i
}(jQuery, document);
XA.register("disqus", XA.component.disqus);
XA.component.facebook = function(n, t) {
    var i = {};
    return i.initInstance = function() {
        (function(n, t, i) {
            var r, u = n.getElementsByTagName(t)[0];
            n.getElementById(i) || (r = n.createElement(t), r.id = i, r.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7", u.insertBefore(r, u.firstChild))
        })(t, "script", "facebook-jssdk")
    }, i.init = function() {
        var t = n(".fb-comments:not(.initialized)");
        t.each(function() {
            i.initInstance();
            n(this).addClass("initialized")
        })
    }, i
}(jQuery, document);
XA.register("facebook", XA.component.facebook);
XA.component.flash = function(n) {
    function i(n) {
        var t = n.attr("height"),
            i = n.attr("width"),
            r = n.width(),
            u = t * r / i;
        n.height(u)
    }

    function r(n, t) {
        var i = n.find(".component-content > div");
        i.flash(t)
    }

    function u(t) {
        n(document).ready(function() {
            var r = t.find("embed");
            r.css("width", "100%");
            i(r);
            n(window).resize(function() {
                i(r)
            })
        })
    }
    var t = {};
    return t.initInstance = function(n, t) {
        r(n, t);
        u(n)
    }, t.init = function() {
        var i = n(".flash:not(.initialized)");
        i.length > 0 && i.each(function() {
            var i = n(this).data("properties");
            t.initInstance(n(this), i);
            n(this).addClass("initialized")
        })
    }, t
}(jQuery, document);
XA.register("flash", XA.component.flash);
XA.component.flip = function(n) {
    function r() {
        return "ontouchstart" in window
    }

    function u() {
        var i = n(".flip.initialized");
        i.each(function() {
            t.equalSideHeight(n(this))
        })
    }
    var i = !1,
        t = {
            equalSideHeight: function(n) {
                var t = n.find(".Side0"),
                    i = n.find(".Side1"),
                    r = this.calcSlideSizeInToggle(t),
                    u = this.calcSlideSizeInToggle(i),
                    f = Math.max(r, u);
                n.find(".flipsides").css({
                    "min-height": f + "px"
                });
                t.add(i).css({
                    bottom: 0
                })
            },
            calcSlideSizeInToggle: function(t) {
                var r = t.find(">div"),
                    i = 0;
                return r.each(function(t, r) {
                    i += n(r).outerHeight(!0)
                }), i += parseInt(t.css("padding-top")), i += parseInt(t.css("padding-bottom"))
            },
            equalSideHeightInToggle: function(n) {
                var t = n.find(".Side0"),
                    i = n.find(".Side1"),
                    r = this.calcSlideSizeInToggle(t),
                    u = this.calcSlideSizeInToggle(i),
                    f = Math.max(r, u);
                n.find(".flipsides").css({
                    "min-height": f + "px"
                });
                t.add(i).css({
                    bottom: 0
                })
            }
        };
    return t.initInstance = function(n) {
        if (n.find('[class*="Side0"]').attr("tabindex", "0"), n.hasClass("flip-hover") && !r()) n.hover(function() {
            n.addClass("active")
        }, function() {
            n.removeClass("active")
        });
        else n.on("click", function() {
            n.toggleClass("active")
        })
    }, t.initFlips = function() {
        var i = n(".flip:not(.initialized)");
        i.each(function() {
            var i = n(this).find(".flipsides");
            i.find(".Side0").attr("tabindex", "0");
            t.initInstance(n(this));
            n(this).addClass("initialized");
            t.equalSideHeight(n(this))
        })
    }, t.init = function() {
        n(window).on("resize", function() {
            u()
        });
        i ? t.initFlips() : n(document).ready(function() {
            t.initFlips();
            i = !0
        })
    }, t
}(jQuery, document);
XA.register("flip", XA.component.flip);
XA.component.calendar = function(n) {
    function r(n, t) {
        this.data = t.data;
        this.selector = n;
        this.options = t;
        this.events = [];
        this.checkSource()
    }

    function t(t, i, r) {
        var f = this,
            e = "",
            o = "",
            s = "",
            u;
        i.dataType === "gcalendar" ? (googleCalendarApiKey = i.calendarApiKey, r = i.calendarId) : googleCalendarApiKey = null;
        i.showPrevNext ? e = "prev, next" : "";
        i.showMonthCaptions ? o = "title" : "";
        for (u in i.calendarTypes) i.calendarTypes[u] === "day" ? i.calendarTypes[u] = "basicDay" : i.calendarTypes[u] === "week" && (i.calendarTypes[u] = "basicWeek");
        i.calendarTypes.length > 1 && (s = i.calendarTypes.join());
        n(t).fullCalendar({
            monthNames: i.localization.monthNames,
            monthNamesShort: i.localization.monthNamesShort,
            dayNames: i.localization.dayNames,
            dayNamesShort: i.localization.dayNamesShort,
            nextDayThreshold: "00:00",
            buttonText: {
                agendaDay: "agenda day",
                agendaWeek: "agenda week"
            },
            header: {
                left: e,
                center: o,
                right: s
            },
            googleCalendarApiKey: googleCalendarApiKey,
            events: r,
            renderEvent: !1,
            eventRender: function(t, r) {
                i.compactView && i.dataType === "json" ? n(r).css("display", "none") : i.dataType === "json" && f.attachTooltip(t, r, !1);
                r.addClass(t.eventClass)
            },
            eventAfterAllRender: function() {
                i.compactView && i.dataType === "json" && f.renderCompactCalendarEvents(t, r)
            }
        })
    }

    function u(t) {
        n(t).fullCalendar("render")
    }
    r.prototype.checkSource = function() {
        var n = this;
        switch (n.options.dataType) {
            case "json":
                n.getJson();
                new t(n.selector, n.options, n.events);
                break;
            case "gcalendar":
                new t(n.selector, n.options, n.events)
        }
    };
    r.prototype.getJson = function() {
        var r = this,
            t, i, f = !1,
            u = [];
        n.each(r.data, function() {
            t = new Date(this.eventStart);
            i = new Date(this.eventEnd);
            t === i && (f = !0);
            u = {
                title: this.eventName,
                start: t,
                end: i,
                eventDescription: this.eventDescription,
                eventLink: this.eventLink,
                eventClass: this.eventClass
            };
            r.events.push(u)
        })
    };
    t.prototype.attachTooltip = function(t, i, r) {
        var u, f;
        n(i).on("mouseenter", function() {
            f = "";
            n(".calendar-tooltip").fadeOut();
            n(".calendar-tooltip").remove();
            r ? (f = "", n.each(t, function() {
                f += "<div class='compact-event'><span class='title'>" + this.title + "<\/span><span class='description'>" + this.eventDescription + "<\/span><span class='link'><a href='" + this.eventLink + "'>Link<\/a><\/span><\/div>"
            })) : f = "<span class='description'>" + t.eventDescription + "<\/span><span class='link'>" + t.eventLink + "<\/span>";
            u = n("<div style='border-radius:5px;border:1px solid #000;position:absolute;z-index:999; paading:5px;background:#FFF' class='calendar-tooltip'><div class='arrow'><\/div><div class='events'>" + f + "<\/div><\/div>");
            u.css({
                left: n(this).offset().left
            });
            u.css({
                top: n(this).offset().top - n(this).height()
            });
            n("body").append(u);
            var i;
            n(this).unbind("mouseleave");
            n(this).on("mouseleave", function() {
                i = setTimeout(function() {
                    u.fadeOut(function() {
                        n(this).remove()
                    })
                }, 300);
                u.unbind("mouseenter");
                u.on("mouseenter", function() {
                    clearTimeout(i)
                })
            });
            u.unbind("mouseleave");
            u.on("mouseleave", function() {
                n(this).fadeOut(function() {
                    n(this).remove()
                })
            })
        })
    };
    t.prototype.renderCompactCalendarEvents = function(t, i) {
        var d = this,
            c, u, y, f, e, o, p, w, b, l, a, v, k, s, r, h = [];
        n(t).find(".fc-day").each(function() {
            c = this;
            u = new Date(n(this).data("date"));
            f = u.getDate();
            e = u.getMonth();
            o = u.getFullYear();
            h = [];
            n.each(i, function() {
                y = this;
                s = new Date(this.start);
                p = s.getDate();
                w = s.getMonth();
                b = s.getFullYear();
                this.end && (r = new Date(this.end), l = r.getDate(), a = r.getMonth(), v = r.getFullYear(), k = r.getHours());
                o >= b && o <= v && e >= w && e <= a && f >= p && f <= l && (o == v && e == a && f == l && k < 9 || (n(c).addClass("selected-day"), h.push(y)))
            });
            h.length && d.attachTooltip(h, c, !0)
        })
    };
    var i = {};
    return i.initInstance = function(t, i) {
        var f = "#" + t.find(".event-calendar-inner").attr("id");
        i.compactView && i.dataType === "json" && n(this).addClass("compact-mode");
        new r(f, i);
        n(window).resize(function() {
            u(f)
        })
    }, i.init = function() {
        n(".event-calendar:not(.initialized)").each(function() {
            var t = n(this).data("properties");
            i.initInstance(n(this), t);
            n(this).addClass("initialized")
        })
    }, i
}(jQuery, document);
XA.register("calendar", XA.component.calendar);
XA.component.galleria = function(n) {
    var t = {};
    return t.initInstance = function(t, i) {
        var u = t.find(".gallery-inner").attr("id"),
            r = n('script[src="' + i.theme + '"]');
        r && r.remove();
        n(document).ready(function() {
            Galleria.loadTheme(i.theme);
            Galleria.run("#" + u, i);
            Galleria.ready(function() {
                this.bind("image", function(n) {
                    n.imageTarget.alt = n.galleriaData.title
                })
            })
        })
    }, t.init = function() {
        var i = n(".gallery:not(.initialized)");
        i.each(function() {
            var i = n(this).data("properties");
            t.initInstance(n(this), i);
            n(this).addClass("initialized")
        })
    }, t
}(jQuery, document);
XA.register("galleria", XA.component.galleria);
XA.component.languageSelector = function(n) {
    function i(n) {
        var t = n.data("country-code");
        return "flags-" + t
    }

    function r(t) {
        var e = n(t),
            r = e.find(".language-selector-select-item"),
            u = e.find(".language-selector-item-container"),
            o = u.find(".language-selector-item"),
            f = i(r);
        r.find(">a").addClass(f);
        u.find(".language-selector-item").each(function() {
            f = i(n(this));
            n(this).find(">a").addClass(f)
        });
        r.on("click", function() {
            u.slideToggle()
        });
        o.on("click", function() {
            var t = n(this).find("a").attr("href");
            window.location.href = t
        })
    }
    var t = {};
    return t.initInstance = function(n) {
        r(n)
    }, t.init = function() {
        var i = n(".language-selector:not(.initialized)");
        i.each(function() {
            t.initInstance(this);
            n(this).addClass("initialized")
        })
    }, t
}(jQuery, document);
XA.register("language-selector", XA.component.languageSelector);
XA.component.navigation = function(n) {
    function o(i) {
        i.on("mouseover", ".rel-level1 > a, .rel-level1 >.navigation-title>a, .rel-level2 >.navigation-title>a", function() {
            n(this).closest("li").siblings().removeClass("show");
            n(this).closest("li.rel-level1").siblings().removeClass("show");
            n(this).closest("li.rel-level1").siblings().find(".show").removeClass("show");
            var i = n(this).closest("li").find(">ul");
            t.show(i)
        });
        i.on("mouseleave", ".rel-level1 > a, .rel-level1 >.navigation-title", t.queueHide);
        i.on("mouseover", ".rel-level1 > ul", t.debounce);
        i.on("mouseleave", ".rel-level1 > ul", t.queueHide);
        i.on("focus", ".rel-level1 > a, .rel-level1 >.navigation-title, .rel-level1 >.navigation-title", t.focus);
        i.on("blur", ".rel-level2 > a", t.blur);
        i.on("mouseleave", function() {
            n(this).find(".show").removeClass("show")
        });
        i.find(".rel-level1").each(function() {
            n(this).find("ul").length && n(this).addClass("submenu")
        });
        i.find(".rel-level2").each(function() {
            n(this).parents("#header") > 0 && n(this).find("ul").length && (n(this).addClass("submenu"), n(this).parents(".rel-level1").addClass("wide-nav"));
            n(this).find("> img").length && n(this).addClass("submenu navigation-image")
        });
        i.on("click", ".sxaToogleNavBtn", function() {
            var n = jQuery(this);
            n.find(".sxaWrappedList").toggleClass("hidden")
        })
    }

    function f(t) {
        function i(t) {
            t.find(".rel-level1").each(function() {
                n(this).find("ul").length || n(this).addClass("no-child")
            })
        }

        function r(t) {
            t.find(".navigation-title").on("click", function(t) {
                var i = n(this).closest("li"),
                    r = i.parents(".navigation");
                r.hasClass("navigation-mobile") && (n(t.target).is("a") || (i.hasClass("active") ? i.find(">ul").slideToggle(function() {
                    i.removeClass("active")
                }) : i.find(">ul").slideToggle(function() {
                    i.addClass("active")
                })))
            });
            t.find(".rel-level1").on("focus", function() {
                n(this).siblings("ul").slideDown();
                n(this).closest("li").siblings().find("ul").slideUp()
            })
        }
        i(t);
        r(t)
    }

    function s(t) {
        n(t).on("click", function() {
            n(this).parents(".navigation").toggleClass("active");
            n(this).toggleClass("active")
        })
    }
    var e = 200,
        i = 0,
        r, t = {
            show: function(n) {
                this.debounce();
                r = n;
                r.closest("li").addClass("show")
            },
            debounce: function() {
                i && (clearTimeout(i), i = null)
            },
            hide: function() {
                r && r.closest("li").removeClass("show")
            },
            queueHide: function() {
                i = setTimeout(function() {
                    t.hide()
                }, e)
            },
            focus: function() {
                n(this).closest("li").siblings().removeClass("show");
                n(this).closest("li").addClass("show")
            },
            blur: function() {
                n(this).closest("li").is(".last") && n(this).parents(".rel-level1").removeClass("show")
            }
        },
        u = {};
    return u.initInstance = function(n) {
        n.hasClass("navigation-main") ? (o(n), f(n)) : n.hasClass("navigation-mobile") && f(n)
    }, u.init = function() {
        var i = n(".navigation:not(.initialized)"),
            t;
        i.each(function() {
            u.initInstance(n(this));
            n(this).addClass("initialized")
        });
        t = n(".mobile-nav:not(.initialized)");
        t.each(function() {
            s(this);
            n(this).addClass("initialized")
        })
    }, u
}(jQuery, document);
XA.register("navigation", XA.component.navigation);
XA.component.overlay = function(n) {
    function o() {
        if (s.indexOf("sc_mode=preview") > -1) return !0;
        var t = n("#hdPageMode");
        return t.length > 0 && t.attr("value") == "preview"
    }

    function y() {
        if (s.indexOf("sc_mode=edit") > -1) return !0;
        var t = n("#hdPageMode");
        return t.length > 0 && t.attr("value") == "edit"
    }

    function p() {
        return n("#wrapper").hasClass("overlay-page")
    }

    function w() {
        return n(".overlay-source").length
    }

    function b(n) {
        var t = n.split("?")[1],
            u = [],
            i, r;
        if (t != undefined)
            for (t = t.split("&"), r = 0; r < t.length; r++) i = t[r].split("="), u.push(i[1]), u[i[0]] = i[1];
        return u
    }

    function k(n) {
        var t = {};
        return n.width !== null && (t.width = n.width), n.height !== null && (t.height = n.height), t
    }

    function d(n) {
        return n.indexOf(a) > -1 ? !0 : !1
    }

    function l(t) {
        var i = t.split("?")[0].split(".").pop();
        return n.inArray(i, ["gif", "png", "jpg", "jpeg"]) > -1 ? !0 : !1
    }

    function g(i, u) {
        var f = u.find(".overlay-inner"),
            e = u.find(".component-content"),
            c = b(i),
            a = d(i),
            s = k(c),
            h;
        e.addClass("overlayFullWidth");
        f.removeAttr("style");
        a ? l(i) ? (f.empty().append(n("<img>", {
            src: i
        })), f.css(s), e.removeClass("overlayFullWidth"), r(u)) : i.indexOf("overlaytype=iframe") > -1 ? (f.empty().append(n("<iframe>", {
            src: i,
            style: "width: 100%; height: 100%"
        })), f.css(s), r(u)) : (o() && (h = "cf_overlay=1", i = i.replace("sitecore/shell/"), i += (i.indexOf("?") == -1 ? "?" : "&") + h), n.get(i, function(i) {
            var o = n(i).before().first();
            t.resizeOverlay(f, e, {
                width: o.attr("data-width"),
                height: o.data("height"),
                percent: o.data("percent")
            });
            f.empty().append(i);
            XA.init();
            r(u)
        })) : (l(i) ? f.empty().append(n("<img>", {
            src: i
        })) : f.empty().append(n("<iframe >", {
            src: i,
            style: "width: 100%; height: 100%"
        })), f.css(s), r(u))
    }

    function nt(n) {
        n.css({
            opacity: 1
        }).show()
    }

    function r(t) {
        var u, s, r;
        return t.show().animate({
            opacity: 1
        }), n("#wrapper").addClass("aria-hidden"), e = document.activeElement, u = t.find(".overlay-close"), setTimeout(function() {
            u.focus()
        }, 0), s = t.find(".overlay-inner"), s.blur(function(n) {
            n.preventDefault();
            n.stopPropagation();
            setTimeout(function() {
                u.focus()
            }, 0)
        }), r = s.find(v), r = Array.prototype.slice.call(r), i = r[0], f = r[r.length - 1], i.focus(), (o() || y()) && t.find("> .component-content").css({
            top: 200,
            transform: "translate(-50%, 0)"
        }), t
    }

    function tt(t) {
        n("#wrapper").removeClass("aria-hidden");
        var i = t.find(".overlay-inner");
        return t.animate({
            opacity: 0
        }, function() {
            if (t.hide(), i.empty(), mejs)
                for (var r in mejs.players) n("#" + mejs.players[r].id).parents(".overlay").length == 1 && (n("#" + mejs.players[r].id + " video").attr("src", ""), mejs.players[r].remove(), mejs.players.splice(r, 1))
        }), t
    }

    function it() {
        n("body").append("<div class='overlay-wrapper'><div class='overlay component'><div class='component-content' role='dialog'><div class='overlay-inner'><\/div><div class='overlay-close' role='button' aria-label='Close dialog'><\/div><\/div><\/div><\/div>")
    }
    var t = {},
        s = window.location.href,
        a = location.host,
        h, u = !1,
        c = 100,
        v = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]',
        i, f, e;
    return t.resizeOverlay = function(t, i, r) {
        var f = "px",
            u = {
                width: "",
                height: ""
            },
            e = n(window).height();
        r.percent ? (f = "%", t.addClass("overlay-percent")) : t.removeClass("overlay-percent");
        r.width && (u.width = r.width + f);
        r.height && (u.height = r.height + f);
        u["max-height"] = e - c - .1 * e + "px";
        i.css(u)
    }, t.initInstance = function(n, t, i) {
        n.on("click", function(n) {
            var f, r, u;
            for (n.preventDefault(), n.stopPropagation(), nt(t, i), f = this.href, g(f, t), r = this.href.split("/"), u = 0; u <= r.length; u++)
                if (h = r.pop(), h.length != 0) break
        })
    }, t.init = function() {
        var r, a, v, y, h, l, s, b;
        if (!u && w() && it(), p()) {
            l = n(".overlay-page");
            r = l.children(".component-content");
            s = n("#spnOverlay");
            b = r.children(".overlay-inner");
            t.resizeOverlay(b, r, {
                width: r.data("width"),
                height: r.data("height"),
                percent: r.data("percent")
            });
            r.on("click", function(n) {
                n.stopPropagation()
            });
            l.on("click", function() {
                o() && (location.href = location.href.replace("sc_mode=preview", "sc_mode=edit"))
            })
        }
        if (s = n(".overlay-wrapper > .overlay"), r = s.find(".component-content"), a = n(".overlay-source a:not(.initialized), a.overlay-source:not(.initialized)"), v = n(".overlay-inner"), y = s.find(".overlay-close"), h = function() {
                tt(s);
                v.off("blur");
                setTimeout(function() {
                    e != null && e.focus()
                }, 0)
            }, !u) {
            r.on("click", function(n) {
                n.stopPropagation()
            });
            s.on("click", function() {
                h()
            });
            y.on("click", function(n) {
                n.preventDefault();
                h()
            });
            n("body").keydown(function(n) {
                n.keyCode === 9 && (n.shiftKey ? document.activeElement === i && (n.preventDefault(), f.focus()) : document.activeElement === f && (n.preventDefault(), i.focus()));
                n.keyCode === 27 && (n.stopPropagation(), h())
            });
            n(window).on("resize", function() {
                var t = n(window).height();
                t = t - c - .1 * t;
                r.css("max-height", t + "px")
            });
            u = !0
        }
        a.each(function() {
            t.initInstance(n(this), s, r);
            n(this).addClass("initialized")
        })
    }, t
}(jQuery);
XA.register("overlay", XA.component.overlay);
[].forEach.call(document.querySelectorAll(".search-results.overlay-source"), function(n) {
    XA.dom.observeDOM(n, function() {
        XA.component.overlay.init()
    })
});
XA.component.snippet = function(n) {
    var t = {},
        i;
    return t.initInstance = function() {}, t.init = function() {
        var r = n(".snippet:not(.initialized)");
        r.each(function() {
            var r = n(this).find(".snippet-inner");
            i = n(this);
            t.initInstance(i, r);
            n(this).addClass("initialized")
        })
    }, t
}(jQuery);
XA.register("snippet", XA.component.snippet);
XA.component.social = function(n, t) {
    var i = {},
        r;
    return i.shareProperties, i.initFacebook = function() {
        (function(n, t, i) {
            var r, u = n.getElementsByTagName(t)[0];
            n.getElementById(i) || (r = n.createElement(t), r.id = i, r.src = "//connect.facebook.net/en_US/all.js#xfbml=1", u.parentNode.insertBefore(r, u))
        })(t, "script", "facebook-jssdk")
    }, r = function(i) {
        var u = n(".sharethis"),
            r;
        if (window.stLight === undefined) {
            r = t.createElement("script");
            r.type = "text/javascript";
            r.src = "//w.sharethis.com/button/buttons.js";
            n(window).on("load", function() {
                n(i).each(function() {
                    try {
                        window.stLight.options(this)
                    } catch (n) {}
                })
            });
            n(u[0]).append(r)
        }
    }, i.initInstance = function(n, t) {
        i.shareProperties.push(t)
    }, i.init = function() {
        var t = n(".sharethis:not(.initialized)");
        i.shareProperties = [];
        t.each(function() {
            var t = n(this).data("properties");
            i.initInstance(n(this), t);
            n(this).addClass("initialized")
        });
        r(i.shareProperties)
    }, i
}(jQuery, document);
XA.register("social", XA.component.social);
XA.component.tabs = function(n) {
    function r(t) {
        function f(t) {
            var i = 0,
                r = 0;
            t.length && (t.parent().find(".prev").remove(), t.parent().find(".next").remove(), t.unwrap(), t.css("width", "auto"), t.css("height", "auto"), t.css("left", 0));
            t.find("li").each(function() {
                i += n(this).outerWidth(!0)
            });
            t.find("li").each(function() {
                r = Math.max(r, n(this).height())
            });
            t.wrap("<div class='wrapper'>");
            n("<div class='next tab-slider'>><\/div>").insertAfter(t);
            n("<div class='prev tab-slider'><<\/div>").insertBefore(t);
            t.parent().css("height", parseInt(r, 10));
            t.parent().find(".tab-slider").css("height", parseInt(r, 10) - 2);
            i += 10;
            i > t.parent().width() ? (t.parent().find(".prev").hide(), t.width(i)) : (t.parent().find(".prev").hide(), t.parent().find(".next").hide())
        }

        function e(n, t) {
            n.find(".prev").click(function() {
                var n = parseInt(t.css("left"), 10);
                n += r;
                n > 0 ? (n = 0, t.stop().animate({
                    left: n
                }), t.parent().find(".prev").hide(), t.parent().find(".next").show()) : (t.stop().animate({
                    left: n
                }), t.parent().find(".prev").show(), t.parent().find(".next").show())
            });
            n.find(".next").click(function() {
                var n = parseInt(t.css("left"), 10),
                    i = t.width(),
                    u = t.parent().width();
                n -= r;
                i + n < u ? (n = i - u + 20, t.stop().animate({
                    left: -n
                }), t.parent().find(".prev").show(), t.parent().find(".next").hide()) : (t.stop().animate({
                    left: n
                }), t.parent().find(".prev").show(), t.parent().find(".next").show())
            })
        }

        function o(t, r) {
            t.find("li").click(function(t) {
                var f = n(this).index(),
                    u = n(this).closest(".component.tabs");
                if (n(this).addClass("active"), n(this).siblings().removeClass("active"), r.find(".tab").removeClass("active"), r.find(".tab:eq(" + f + ")").addClass("active"), i(u)) try {
                    XA.component.flip.equalSideHeight(u)
                } catch (e) {
                    console.warn("Error during calculation height of Flip list in toggle")
                }
                t.preventDefault()
            })
        }

        function u(t) {
            t.each(function() {
                var t = n(this).find(".tabs-heading"),
                    i = n(this).find(".tabs-container");
                t.find("li:first-child").addClass("active");
                i.find(".tab:eq(0)").addClass("active");
                o(t, i);
                f(t);
                e(n(this), t)
            })
        }
        var r = 150;
        u(t);
        n(window).resize(function() {
            u(t)
        })
    }

    function u(t, i) {
        var u = t.closest(".component.tabs").attr("id"),
            r = XA.queryString.getQueryParam(u || "tab");
        if (r != null && !isNaN(parseInt(r)) && isFinite(r) && (r = parseInt(r), t.length > r)) {
            n(t[r]).addClass("active");
            n(i[r]).addClass("active");
            return
        }
        t.first().addClass("active");
        t.first().attr("tabindex", "0");
        i.first().addClass("active")
    }
    var t = {},
        i = function(n) {
            return !!n.find(".component.flip").length
        };
    return t.initInstance = function(t) {
        var f = t.find(".tabs-inner");
        if (t.hasClass("tabs-scrollable") ? r(t) : f.each(function() {
                var r = n(this).find(".tabs-heading > li"),
                    f = n(this).find("> .tabs-container > .tab");
                u(r, f);
                r.click(function(r) {
                    var u = n(this),
                        e = u.index(),
                        f = u.parent().parent();
                    if (u.siblings().removeClass("active"), f.find("> .tabs-container > .tab").removeClass("active"), u.addClass("active"), n(f.children(".tabs-container").children(".tab").eq(e)).addClass("active"), i(t)) try {
                        XA.component.flip.equalSideHeight(t)
                    } catch (o) {
                        console.warn("Error during calculation height of Flip list in toggle")
                    }
                    r.preventDefault()
                }).keyup(function(t) {
                    var i = n(this);
                    switch (t.keyCode) {
                        case 38:
                            i.prev("li").click();
                            break;
                        case 40:
                            i.next("li").click()
                    }
                })
            }), i(t)) try {
            XA.component.flip.equalSideHeight(t)
        } catch (e) {
            console.warn("Error during calculation height of Flip list in toggle")
        }
    }, t.init = function() {
        var i = n(".tabs:not(.initialized)");
        i.each(function() {
            var i = n(this);
            t.initInstance(i);
            n(this).addClass("initialized")
        })
    }, t
}(jQuery);
XA.register("tabs", XA.component.tabs);
XA.component.toggle = function(n) {
    var i = {},
        t, r, f = function(t) {
            return n(t).find(".component.flip")
        },
        u = function(t) {
            var r = f(t),
                i = n(t).find(".event-calendar");
            if (n(t).find("details").attr("open", "open"), i.length && i.trigger("resize"), r.lengt) try {
                XA.component.flip.equalSideHeightInToggle(t)
            } catch (u) {
                console.warn("Error during calculation height of Flip list in toggle")
            }
        },
        e = function(t) {
            n(t).find("details").removeAttr("open")
        },
        o = function(i) {
            n(i).find("details summary~.component>.component-content").css({
                "animation-name": t.easing,
                "animation-duration": (t.speed || 500) + "ms"
            })
        },
        s = function() {
            return t.expandOnHover
        },
        h = function() {
            return t.expandedByDefault
        },
        c = function(t) {
            var i = n(t).find("summary");
            if (s()) i.on("mouseenter", function() {
                u(t)
            });
            h() && u(t);
            i.on("click", function(i) {
                i.preventDefault();
                var r = n(this).closest("details");
                r.attr("open") ? e(t) : u(t)
            })
        },
        l = function(n) {
            c(n);
            o(n)
        };
    return i.initInstance = function(n) {
        l(n)
    }, i.init = function() {
        n(".toggle:not(.initialized)").each(function() {
            r = n(this);
            t = r.data("properties");
            i.initInstance(this, t);
            r.addClass("initialized")
        })
    }, i
}(jQuery);
XA.register("component-toggle", XA.component.toggle);
XA.component.video = function(n, t) {
    function r(n) {
        var t = n.width();
        n.removeClass("video-small hide-controls");
        t < 481 && t >= 321 ? n.addClass("video-small") : t < 321 && n.addClass("hide-controls")
    }

    function u(t, i) {
        var r = t.find("video"),
            u;
        if (r.length) {
            u = function(t) {
                t.movieName = "Movie";
                n(t).on("ended", function() {
                    i.fromPlaylist && n(i.playlist).trigger("change-video")
                });
                n(t).closest(".component-content").find(".video-init").hide()
            };
            n.extend(i, {
                plugins: ["youtube", "flash", "silverlight"],
                silverlightName: "silverlightmediaelement.xap",
                classPrefix: "mejs-",
                success: u,
                stretching: "auto",
                pluginPath: "../other/",
                youtube: {
                    imageQuality: "hqdefault"
                }
            });
            r.each(function(t) {
                var u = n(r[t]),
                    e = this,
                    f;
                if (u.attr("poster")) {
                    f = u.parent().find(".video-init");
                    u.add(f).on("click", function() {
                        i.success = function(n) {
                            return function() {
                                try {
                                    arguments[0].load();
                                    arguments[0].play()
                                } catch (t) {
                                    console.warn("Error while loading video")
                                }
                                return n.apply(this, arguments)
                            }
                        }(i.success);
                        f.hide();
                        new MediaElementPlayer(e, i)
                    })
                } else new MediaElementPlayer(r[t], i)
            });
            return
        }
    }
    var i = {};
    return i.initVideoFromPlaylist = function(t, i) {
        var r = n(t).data("properties");
        return n.extend(r, {
            fromPlaylist: !0,
            playlist: i
        }), u(t, r)
    }, i.initInstance = function(t, i) {
        var f = n(t);
        u(f, i);
        r(f);
        n(window).resize(function() {
            r(f)
        })
    }, i.init = function() {
        XA.component.hasOwnProperty("playlist") && XA.component.playlist.init();
        var r = n(".video.component:not(.initialized)");
        r.each(function() {
            var t = n(this).data("properties");
            i.initInstance(this, t);
            n(this).addClass("initialized")
        });
        n(t).on("mozfullscreenchange", function() {
            setTimeout(function() {
                n(window).resize()
            }, 200)
        })
    }, i
}(jQuery, document);
XA.register("video", XA.component.video);
XA.component.playlist = function(n) {
    function t(n, t) {
        this.properties = t;
        this.playlist = n;
        this.activeVideo = 0;
        this.playlistItems = 0
    }
    var i = {};
    return t.prototype.createNewSources = function(t, i) {
        var r, f = function(t) {
                var i = n("<source>"),
                    r;
                return r = t.match(/\.(mp4)$/) ? "video/mp4" : t.match(/\.(webm)$/) ? "video/webm" : t.match(/\.(ogv)$/) ? "video/ogg" : "video/youtube", i.attr({
                    type: r,
                    src: t
                }), i
            },
            u;
        if (t instanceof Array)
            for (u = 0; u < t.length; u++) r = f(t[u]), i.find("video").append(r);
        else r = f(t), i.find("video").append(r)
    }, t.prototype.replaceSource = function(t, i) {
        var u = this,
            r, f, e = u.properties.sources[t].src,
            o, s, h = 0;
        n(u.properties.playlistId).each(function() {
            var t, c;
            r = n(this);
            s = u.properties.playlistId;
            r.is(s) && e.length && (r.addClass("show"), o = r.find("source"), o.remove(), u.createNewSources(e, r), r.find("video").attr({
                src: ""
            }).show(), t = !1, i ? u.properties.autoPlaySelected && (t = !0) : u.properties.autoPlay && (t = !0), t && r.find("video").attr({
                autoplay: ""
            }), f = r.find("video").clone(), h = r.height(), r.css({
                height: h
            }), c = r.find(".mejs-container").attr("id"), c && (n("#" + c).remove(), delete mejs.players[c], r.find(".component-content").append(f)), XA.component.video.initVideoFromPlaylist(r, u.playlist), r.css({
                height: "auto"
            }))
        })
    }, t.prototype.loadPlaylistVideo = function() {
        var t = this,
            u = n(t.playlist).find(".playlist-item"),
            i, r;
        t.playlistItems = u.length;
        r = function(n) {
            t.replaceSource(t.activeVideo, n);
            i = u.eq(t.activeVideo);
            i.addClass("active");
            i.siblings().removeClass("active")
        };
        r();
        n(t.playlist).on("change-video", function(n, i) {
            var u = !1;
            i ? i.hasOwnProperty("back") ? (t.activeVideo--, t.activeVideo < 0 ? t.activeVideo = 0 : u = !0) : (t.activeVideo++, t.activeVideo === t.playlistItems ? t.properties.repeatAfterAll ? (t.activeVideo = 0, u = !0) : t.activeVideo = t.playlistItems - 1 : u = !0) : t.properties.playNext && t.activeVideo + 1 <= t.playlistItems && (t.activeVideo++, t.activeVideo === t.playlistItems ? (t.activeVideo = 0, t.properties.repeatAfterAll && (u = !0)) : (t.actiVideo--, u = !0));
            u && r(!0)
        })
    }, t.prototype.attachEvents = function() {
        var t = this,
            r = n(t.playlist).find(".playlist-section"),
            u = n(t.playlist).find(".playlist-nav a"),
            i;
        r.on("click", function(r) {
            if (r.preventDefault(), !t.locked) {
                t.locked = !0;
                i = n(this).parents(".playlist-item");
                var u = i.index();
                u !== t.activeVideo && (i.addClass("active"), i.siblings().removeClass("active"), t.replaceSource(u, !0), t.activeVideo = u);
                setTimeout(function() {
                    t.locked = !1
                }, 1e3)
            }
        });
        u.on("click", function(i) {
            i.preventDefault();
            var r = {};
            n(this).parent().hasClass("playlist-prev") && (r.back = !0);
            n(t.playlist).trigger("change-video", r)
        })
    }, i.initInstance = function(i, r) {
        var u;
        n(r.playlistId).addClass("initialized");
        r.sources.length && (u = new t(i, r), u.loadPlaylistVideo(), u.attachEvents())
    }, i.init = function() {
        var r = n(".playlist.component:not(.initialized)"),
            t;
        r.each(function() {
            t = n(this).data("properties");
            i.initInstance(this, t);
            n(this).addClass("initialized")
        })
    }, i
}(jQuery, document);
XA.register("playlist", XA.component.playlist),
    function() {}.call(this),
    function() {
        if (!document.querySelector("body").getAttribute("class") || !(document.querySelector("body").getAttribute("class").indexOf("on-page-editor") > -1)) {
            var t, u, i, f, o, s, h, c, l, n, r, e;
            n = {
                element: function() {
                    var i, n, r, t, u;
                    return n = document.createElement("details"), "open" in n ? (n.innerHTML = "<summary>a<\/summary>b", n.setAttribute("style", "position: absolute; left: -9999px"), t = null != (u = document.body) ? u : document.documentElement, t.appendChild(n), i = n.offsetHeight, n.open = !0, r = n.offsetHeight, t.removeChild(n), i !== r) : !1
                }(),
                toggleEvent: function() {
                    var n;
                    return n = document.createElement("details"), "ontoggle" in n
                }()
            };
            n.element && n.toggleEvent || (h = function() {
                return document.head.insertAdjacentHTML("afterbegin", '<style>@charset"UTF-8";details:not([open])>*:not(summary){display:none;}details>summary{display:block;}details>summary::before{content:"►";padding-right:0.3rem;font-size:0.6rem;cursor:default;}details[open]>summary::before{content:"▼";}<\/style>')
            }, s = function() {
                var n, i, r, u, t;
                return n = document.createElement("details").constructor.prototype, u = n.setAttribute, r = n.removeAttribute, t = null != (i = Object.getOwnPropertyDescriptor(n, "open")) ? i.set : void 0, Object.defineProperties(n, {
                    open: {
                        set: function(n) {
                            return "DETAILS" === this.tagName ? (n ? this.setAttribute("open", "") : this.removeAttribute("open"), n) : null != t ? t.call(this, n) : void 0
                        }
                    },
                    setAttribute: {
                        value: function(n, t) {
                            return e(this, function(i) {
                                return function() {
                                    return u.call(i, n, t)
                                }
                            }(this))
                        }
                    },
                    removeAttribute: {
                        value: function(n) {
                            return e(this, function(t) {
                                return function() {
                                    return r.call(t, n)
                                }
                            }(this))
                        }
                    }
                })
            }, c = function() {
                return f(function(n) {
                    var t;
                    return t = n.querySelector("summary"), n.hasAttribute("open") ? (n.removeAttribute("open"), t.setAttribute("aria-expanded", !1)) : (n.setAttribute("open", ""), t.setAttribute("aria-expanded", !0))
                })
            }, o = function() {
                var n, u, f, r, i;
                for (r = document.querySelectorAll("summary"), n = 0, u = r.length; u > n; n++) i = r[n], t(i);
                return "undefined" != typeof MutationObserver && null !== MutationObserver ? (f = new MutationObserver(function(n) {
                    var f, r, o, e, u;
                    for (e = [], r = 0, o = n.length; o > r; r++) f = n[r].addedNodes, e.push(function() {
                        var n, e, r;
                        for (r = [], n = 0, e = f.length; e > n; n++) u = f[n], "DETAILS" === u.tagName && (i = u.querySelector("summary")) ? r.push(t(i, u)) : r.push(void 0);
                        return r
                    }());
                    return e
                }), f.observe(document.documentElement, {
                    subtree: !0,
                    childList: !0
                })) : document.addEventListener("DOMNodeInserted", function(n) {
                    if ("SUMMARY" === n.target.tagName) return t(n.target)
                })
            }, t = function(n, t) {
                return null == t && (t = i(n, "DETAILS")), n.setAttribute("aria-expanded", t.hasAttribute("open")), n.hasAttribute("tabindex") || n.setAttribute("tabindex", "0"), n.hasAttribute("role") ? void 0 : n.setAttribute("role", "button")
            }, l = function() {
                var n;
                return "undefined" != typeof MutationObserver && null !== MutationObserver ? (n = new MutationObserver(function(n) {
                    var e, t, o, u, i, f;
                    for (i = [], t = 0, o = n.length; o > t; t++) u = n[t], f = u.target, e = u.attributeName, "DETAILS" === f.tagName && "open" === e ? i.push(r(f)) : i.push(void 0);
                    return i
                }), n.observe(document.documentElement, {
                    attributes: !0,
                    subtree: !0
                })) : f(function(n) {
                    var t;
                    return t = n.getAttribute("open"), setTimeout(function() {
                        if (n.getAttribute("open") !== t) return r(n)
                    }, 1)
                })
            }, u = function(n) {
                return !(n.defaultPrevented || n.altKey || n.ctrlKey || n.metaKey || n.shiftKey || n.target.isContentEditable)
            }, f = function(n) {
                return addEventListener("click", function(t) {
                    var r, f;
                    if (u(t) && t.which <= 1 && (r = i(t.target, "SUMMARY")) && "DETAILS" === (null != (f = r.parentElement) ? f.tagName : void 0)) return n(r.parentElement)
                }, !1), addEventListener("keydown", function(t) {
                    var r, f, e;
                    if (u(t) && (13 === (f = t.keyCode) || 32 === f) && (r = i(t.target, "SUMMARY")) && "DETAILS" === (null != (e = r.parentElement) ? e.tagName : void 0)) return (n(r.parentElement), t.preventDefault())
                }, !1)
            }, i = function() {
                return "function" == typeof Element.prototype.closest ? function(n, t) {
                    return n.closest(t)
                } : function(n, t) {
                    for (; n;) {
                        if (n.tagName === t) return n;
                        n = n.parentElement
                    }
                }
            }(), r = function(n) {
                var t;
                return t = document.createEvent("Events"), t.initEvent("toggle", !0, !1), n.dispatchEvent(t)
            }, e = function(n, t) {
                var i, u;
                return i = n.getAttribute("open"), u = t(), n.getAttribute("open") !== i && r(n), u
            }, n.element || (h(), s(), c(), o()), n.element && !n.toggleEvent && l())
        }
    }.call(this),
    function() {}.call(this);
XA.component.equalHeight = function(n) {
    var i = {
            parentSelector: ".equalized-content",
            selector: ".equal:not(.flip.component),.flip .Side0,.flip .Side1"
        },
        t = {};
    return t.fixHeight = function() {
        n(i.parentSelector).each(function() {
            var r = n(this).find(i.selector),
                t = 0;
            r.each(function() {
                var i = n(this);
                i.css("min-height", "inherit");
                i.find(">.component-content").css("min-height", "inherit");
                i.outerHeight(!0) > t && (t = i.outerHeight(!0))
            });
            t > 0 && r.each(function() {
                var i = n(this);
                (i.hasClass("Side0") || i.hasClass("Side1")) && i.parent().attr("class", "flip").css({
                    "min-height": t
                });
                i.css({
                    "min-height": t
                });
                i.find(">.component-content").css({
                    "min-height": t
                })
            })
        })
    }, t.init = function() {
        n(document).ready(function() {
            t.fixHeight()
        });
        n(window).on("resize", function() {
            setTimeout(t.fixHeight, 0)
        })
    }, t
}(jQuery, document);
XA.register("equalHeight", XA.component.equalHeight);
XA.component.searchEqualHeight = function(n) {
    var t = {
            parentSelector: ".search-results.components",
            selector: "li"
        },
        i = {};
    return i.init = function() {}, i
}(jQuery, document);
XA.register("searchEqualHeight", XA.component.searchEqualHeight)