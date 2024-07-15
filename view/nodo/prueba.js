var gaconnector = {
    MAX_COOKIE_SIZE: 1024,
    domainError: null,
    debug: !1,
    track: function(e, t) {
        if (t)
            this.domainError = t;
        else
            for (valueName in e) {
                if ("lc_" === valueName.substring(0, 3))
                    if (fc_valueName = valueName.replace("lc_", "fc_"),
                    "" === this.getValue(fc_valueName))
                        e[fc_valueName] = e[valueName],
                        this.setValue(fc_valueName, e[valueName]);
                    else if ("(direct)" == e.lc_source)
                        continue;
                this.setValue(valueName, e[valueName])
            }
        null === e && (e = {});
        var o = this.getValue("all_traffic_sources");
        for ("" != o && (o += ", "),
        e.lc_source && e.lc_medium && (o += e.lc_source + "/" + e.lc_medium); o.length > this.MAX_COOKIE_SIZE; )
            o = o.replace(/^[^,]*,{1,} /, "");
        this.setValue("all_traffic_sources", o),
        e.all_traffic_sources = o,
        e.GA_Measurement_ID = this.getValue("GA_Measurement_ID"),
        e.GA_Client_ID = this.getValue("GA_Client_ID"),
        e.GA_Session_ID = this.getValue("GA_Session_ID"),
        this.values = e,
        this.callback(this.getValues()),
        this.valuesReceived = !0
    },
    log: function() {
        this.debug && console.debug.apply(console, arguments)
    },
    getTopDomain: function(e) {
        if ("localhost" === window.location.hostname)
            return "localhost";
        for (var t, o = e.split("/")[2], n = [/[-\w]+(?:\.(?:com|org|net|int|edu|gov|io|ai|gg|info|xyz|site|biz|aero|mil|name|coop|jobs|travel|online|live|shop|store|xn--[-\w]+|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|bq|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)){1,2}$/i, /[-\w]+\.(?:[-\w]+\.xn--[-\w]+|[-\w]{2,}|[-\w]+\.[-\w]{2})$/i], r = 0; r < n.length; r++) {
            if (topDomainSearchResult = n[r].exec(o),
            "object" == typeof topDomainSearchResult && topDomainSearchResult instanceof Array && 0 !== topDomainSearchResult.length) {
                t = topDomainSearchResult[0];
                break
            }
        }
        if (!t)
            try {
                t = new URL(e).hostname
            } catch (t) {
                return e
            }
        return t.split(".").filter((e=>e.length)).length > 2 ? t.replace("www.", "") : t
    },
    getSetting: function(e) {
        var t = "object" == typeof gaconnectorSettings ? gaconnectorSettings : {};
        return t.hasOwnProperty(e) ? t[e] : null
    },
    getValue: function(e, t) {
        if (t || (e = "gaconnector_" + e),
        this.useLocalStorage)
            return localStorage.getItem(e) || "";
        e += "=";
        for (var o = document.cookie.split(";"), n = 0; n < o.length; n++) {
            for (var r = o[n]; " " == r.charAt(0); )
                r = r.substring(1);
            if (0 == r.indexOf(e))
                return r.substring(e.length, r.length)
        }
        return ""
    },
    setValue: function(e, t, o) {
        if (e = "gaconnector_" + e,
        this.useLocalStorage)
            localStorage.setItem(e, t);
        else {
            o = o || 157248e5;
            var n = new Date;
            n.setTime(n.getTime() + o);
            var r = "expires=" + n.toGMTString();
            t = (t = (t = t.replace(/\|{2,}/g, "|").replace(/^\|/, "")).replace(";", "")).substr(0, 255),
            document.cookie = e + "=" + t + "; " + r + ";domain=" + this.cookieDomain + ";path=/"
        }
    },
    timeCounter: Date.now(),
    trackTimeOnWebsite: function() {
        setInterval(this.updateTimeCookie, 1e3)
    },
    updateTimeCookie: function() {
        var e = Date.now() - gaconnector.timeCounter;
        gaconnector.timeCounter = Date.now();
        var t = "time_passed"
          , o = gaconnector.getValue(t);
        "" == o && (o = "0");
        var n = e + parseInt(o);
        gaconnector.setValue(t, n.toString())
    },
    addPageVisit: function() {
        for (var e = "pages_visited_list", t = this.getValue(e), o = t.split("|"), n = window.location.pathname, r = !1, a = 0; a < o.length; a++)
            o[a] == n && (r = !0);
        for (r || o.push(n),
        t = o.join("|"); t.length > this.MAX_COOKIE_SIZE; )
            t = t.replace(/^[^|]+\|/, "");
        this.setValue(e, t)
    },
    incrementVisits: function() {
        var e, t = "page_visits", o = this.getValue(t);
        e = "" == o ? 1 : parseInt(o) + 1,
        this.setValue(t, e.toString())
    },
    getGaProperty: function(e) {
        var t = gaconnector.getGAMeasurementID();
        if (!t)
            return Promise.resolve(null);
        var o = new Promise((function(o, n) {
            !function() {
                window.dataLayer.push(arguments)
            }("get", t, e, (function(e) {
                o(e)
            }
            ))
        }
        ))
          , n = new Promise((function(e, t) {
            setTimeout((function() {
                t(new Error("Timeout after 200ms"))
            }
            ), 200)
        }
        ));
        return Promise.race([o, n])
    },
    getGAMeasurementIDFromCookies: function() {
        var e = document.cookie.split("; ").find((function(e) {
            return e.startsWith("_ga_")
        }
        ));
        if (e) {
            var t = e.split("=")[0];
            if (/^_ga_[A-Z0-9]+$/.test(t))
                return "G-" + t.replace("_ga_", "")
        }
        return null
    },
    getGAMeasurementID: function() {
        if (window.dataLayer) {
            var e = window.dataLayer.find((function(e) {
                return "config" === e[0] && e[1].startsWith("G-")
            }
            ));
            if (e)
                return this.log("Got measurement ID from dataLayer", e[1]),
                e[1]
        }
        if (window.google_tag_data && google_tag_data.tidr && google_tag_data.tidr.container) {
            var t = Object.keys(google_tag_data.tidr.container);
            if (t.length > 0) {
                var o = t.find((function(e) {
                    return e.startsWith("G-")
                }
                ));
                if (o)
                    return this.log("Got measurement ID from google_tag_data", o),
                    o
            }
        }
        var n = this.getGAMeasurementIDFromCookies();
        return n ? (this.log("Got measurement ID from cookies", n),
        n) : (this.log("Could not get measurement ID"),
        null)
    },
    cloneGAMeasurementID: function() {
        var e = gaconnector.getGAMeasurementID();
        e ? gaconnector.setValue("GA_Measurement_ID", e) : setTimeout(gaconnector.cloneGAMeasurementID, 1e3)
    },
    getGAClientIDFromCookies: function() {
        var e = document.cookie.split("; ").find((function(e) {
            return "_ga" === e.split("=")[0]
        }
        ));
        if (e) {
            var t = e.split("=")[1].split(".");
            return t[2] + "." + t[3]
        }
        return null
    },
    getGAClientID: function() {
        return gaconnector.getGAMeasurementID() ? new Promise((function(e, t) {
            if (!window.dataLayer) {
                var o = gaconnector.getGAClientIDFromCookies();
                return gaconnector.log("Got client ID from cookies (fallback)", o),
                e(o)
            }
            gaconnector.getGaProperty("client_id").then((function(t) {
                gaconnector.log("Got client ID from dataLayer", t),
                e(t)
            }
            )).catch((function() {
                var t = gaconnector.getGAClientIDFromCookies();
                gaconnector.log("Got client ID from cookies (error fallback)", t),
                e(t)
            }
            ))
        }
        )) : Promise.resolve(null)
    },
    cloneGAClientID: function() {
        gaconnector.getGAClientID().then((function(e) {
            e ? gaconnector.setValue("GA_Client_ID", e) : setTimeout(gaconnector.cloneGAClientID, 200)
        }
        )).catch(console.error)
    },
    getGASessionIDFromCookies: function() {
        var e = gaconnector.getGAMeasurementID()
          , t = document.cookie.split("; ").find((function(t) {
            return t.startsWith("_ga_" + e.replace("G-", ""))
        }
        ));
        if (t) {
            var o = t.split("=");
            if (2 === o.length) {
                var n = o[1].split(".");
                if (n.length > 2) {
                    var r = n[2];
                    if (parseInt(r) === new Date(1e3 * r).getTime() / 1e3)
                        return r
                }
            }
        }
        return null
    },
    getGASessionID: function() {
        return gaconnector.getGAMeasurementID() ? new Promise((function(e, t) {
            if (!window.dataLayer) {
                var o = gaconnector.getGASessionIDFromCookies();
                return gaconnector.log("Got session ID from cookies (fallback)", o),
                e(o)
            }
            gaconnector.getGaProperty("session_id").then((function(t) {
                gaconnector.log("Got session ID from dataLayer", t),
                e(t)
            }
            )).catch((function() {
                var t = gaconnector.getGASessionIDFromCookies();
                gaconnector.log("Got session ID from cookies (error fallback)", t),
                e(null)
            }
            ))
        }
        )) : Promise.resolve(null)
    },
    cloneGASessionID: function() {
        gaconnector.getGASessionID().then((function(e) {
            e ? gaconnector.setValue("GA_Session_ID", e) : setTimeout(gaconnector.cloneGASessionID, 200)
        }
        )).catch(console.error)
    },
    callback: function(e) {},
    valuesReceived: !1,
    setCallback: function(e) {
        this.valuesReceived || this.internal ? e(this.getValues()) : this.callback = e
    },
    isInternalReferrer: function(e, t) {
        return "" !== t && void 0 !== t && this.getTopDomain(t) === this.getTopDomain(e)
    },
    internal: !1,
    addRemoteScript: function() {
        if (this.isInternalReferrer(window.location.href, document.referrer)) {
            this.log("Internal referrer, not loading remote script"),
            internal = !0;
            var e = this.getValues();
            this.callback(e)
        } else {
            this.log("External referrer, loading remote script"),
            internal = !1;
            var t = document.createElement("script");
            t.setAttribute("data-cfasync", "false");
            var o = document.location.search;
            o += (o ? "&" : "?") + "page_url=" + encodeURIComponent(window.location.href);
            var n = "https://tracker.gaconnector.com/gaconnector-server.js" + (o += "&referer=" + encodeURIComponent(document.referrer));
            t.src = n,
            document.getElementsByTagName("head")[0].appendChild(t)
        }
    },
    getValuesFromLocalStorage: function() {
        for (var e = Object.keys(localStorage), t = [], o = 0; o < e.length; o++)
            "gaconnector_" === e[o].substr(0, 12) && t.push(e[o]);
        var n = {};
        for (o = 0; o < t.length; o++)
            n[t[o].replace("gaconnector_", "")] = localStorage.getItem(t[o]);
        return n
    },
    getValuesFromCookies: function() {
        for (var e = {}, t = document.cookie.split("; "), o = 0; o < t.length; o++) {
            var n = t[o].split("=")[0]
              , r = t[o].split("=").slice(1).join("=");
            if (n.length > 12)
                if ("gaconnector_" == n.substring(0, 12))
                    e[n.replace("gaconnector_", "")] = r
        }
        return e
    },
    deleteCookie: function(e) {
        document.cookie = "gaconnector_" + e + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    },
    deleteLocalStorageItem: function(e) {
        localStorage.removeItem("gaconnector_" + e)
    },
    getValues: function() {
        return this.domainError ? {
            lc_source: this.domainError,
            lc_medium: "Contact gaconnector.com/support",
            lc_landing: window.location.href
        } : this.useLocalStorage ? this.getValuesFromLocalStorage() : this.getValuesFromCookies()
    },
    getCookieValues: function() {
        return this.getValues()
    },
    setupDebugging: function() {
        if (!0 === this.getSetting("debug"))
            return this.debug = !0,
            void this.log("GA Connector debugging enabled");
        try {
            var e = document.querySelector('script[src*="gaconnector.js"]');
            if (e || (e = document.querySelector('script[src*="https://tracker.gaconnector.com/js"]')),
            e)
                "true" === new URL(e.src).searchParams.get("debug") && (this.debug = !0,
                this.log("GA Connector debugging enabled"))
        } catch (e) {
            console.error(e)
        }
    },
    setupStorage: function() {
        this.useLocalStorage = !!window.localStorage && !!window.localStorage.setItem && "localStorage" === this.getSetting("storageEngine");
        var e = this.getValuesFromCookies()
          , t = this.getValuesFromLocalStorage();
        if (this.useLocalStorage)
            for (var o in e)
                e[o] && !t[o] && this.setValue(o, e[o]),
                this.deleteCookie(o);
        else
            for (var o in t)
                t[o] && !e[o] && this.setValue(o, t[o]),
                this.deleteLocalStorageItem(o)
    },
    start: function() {
        this.setupDebugging(),
        this.setupStorage(),
        this.internal = this.isInternalReferrer(window.location.href, document.referrer),
        "function" == typeof this.getSetting("getTopDomain") && (this.log("Overriding getTopDomain function"),
        this.getTopDomain = this.getSetting("getTopDomain")),
        this.cookieDomain = this.getTopDomain(window.location.href),
        this.cloneGAMeasurementID(),
        this.cloneGAClientID(),
        this.cloneGASessionID(),
        this.trackTimeOnWebsite(),
        this.addPageVisit(),
        this.incrementVisits(),
        window.gaconnectorSettings && !1 === window.gaconnectorSettings.loadSjs || this.addRemoteScript()
    }
};
gaconnector.start();
