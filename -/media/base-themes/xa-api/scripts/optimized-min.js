var XA = XA || function(n, t) {
    var i = {},
        f, e, r = {},
        u, o, s;
    return f = [], e = [], i.register = function(n, t, i) {
        r[n] = {
            name: n,
            api: t,
            init: i || t.init || function() {}
        }
    }, i.hasPageModes = function() {
        return !!(window.Sitecore && window.Sitecore.PageModes)
    }, i.registerOnPreInitHandler = function(n) {
        f.push(n)
    }, i.registerOnPostInitHandler = function(n) {
        e.push(n)
    }, u = !1, i.init = function() {
        u || (u = !0, XA.ready(function() {
            try {
                for (var n in r) r.hasOwnProperty(n) && ($xa.each(f, function(t, i) {
                    i.process(n, r[n])
                }), r[n].init(), $xa.each(e, function(t, i) {
                    i.process(n, r[n])
                }))
            } finally {
                u = !1
            }
        }))
    }, i.ready = function(i) {
        n(t).ready(i)
    }, i.component = {}, i.connector = {}, i.cookies = {
        createCookie: function(n, i, r) {
            var u, f;
            r ? (u = new Date, u.setTime(u.getTime() + r * 864e5), f = "; expires=" + u.toUTCString()) : f = "";
            t.cookie = n + "=" + i + f + "; path=/"
        },
        readCookie: function(n) {
            for (var i, u = n + "=", f = t.cookie.split(";"), r = 0; r < f.length; r++) {
                for (i = f[r]; i.charAt(0) == " ";) i = i.substring(1, i.length);
                if (i.indexOf(u) == 0) return i.substring(u.length, i.length)
            }
            return null
        },
        removeCookieWarning: function() {
            var n = $xa(".privacy-warning");
            n.remove()
        }
    }, i.queryString = {
        getQueryParam: function(n) {
            var u, i, t, r;
            for (n != null && (n = n.toLocaleLowerCase()), u = window.location.search.substring(1), i = u.split("&"), t = 0; t < i.length; t++)
                if (r = i[t].split("="), decodeURIComponent(r[0].toLocaleLowerCase()) === n) return decodeURIComponent(r[1]);
            return null
        }
    }, o = window.MutationObserver || window.WebKitMutationObserver, s = window.addEventListener, i.dom = {
        observeDOM: function(n, t) {
            if (o) {
                var i = new o(function(n) {
                    (n[0].addedNodes.length || n[0].removedNodes.length) && t()
                });
                i.observe(n, {
                    childList: !0,
                    subtree: !0
                })
            } else s && (n.addEventListener("DOMNodeInserted", t, !1), n.addEventListener("DOMNodeRemoved", t, !1))
        }
    }, i
}($, document);
XA.init()