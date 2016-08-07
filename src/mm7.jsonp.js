(function (mm7) {

    if (mm7.missing(["url"], true) > -1)
        return;

    mm7["jsonp"] = {
        jsonpParamName: "jsonp",
        removeLastScript:false,
        lastScript: null,
        busy: false,
        callBack: function () {
        },
        request: function (url, obj, callBack) {
            if (this.busy === false) {
                this.busy = true;
                if (this.removeLastScript) {
                    document.getElementsByTagName("head")[0].removeChild(this.lastScript);
                    this.removeLastScript = false;
                }
                var vars = mm7.url.extract(url);
                if (!vars[this.jsonpParamName]) {
                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.onerror = function() {
                        mm7.error("Jsonp script loading error ("+this.src+")");
                        mm7.jsonp.busy = false;
                    };
                    s.onload = function () {
                        mm7.jsonp.busy = false;
                    };
                    if (mm7.count(vars) > 0) {
                        s.src = url + "&" + this.jsonpParamName + "=mm7.jsonp.callBack";
                    } else {
                        s.src = url + "?" + this.jsonpParamName + "=mm7.jsonp.callBack";
                    }
                    if ((mm7.type(obj) === "object") || (mm7.type(obj) === "array")) {
                        s.src +="&" + mm7.url.toQuery(obj);
                    }
                    this.callBack = function (response) {
                        callBack(response);
                    };
                    
                    document.getElementsByTagName("head")[0].appendChild(s);
                    this.removeLastScript = true;
                    this.lastScript = s;
                } else {
                    mm7.error("Jsonp param is already defined");
                }
            } else {
                mm7.error("Jsonp is busy");
            }
        }
    };
})(mm7);