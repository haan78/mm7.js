(function (mm7) {
    if (mm7.missing(["url", "json"], true) > -1)
        return;
    
    function ajaxCreateHTTPRequest(ajax) {
        //Building HTTP Request
        var HTTP = null;
        if (window.XMLHttpRequest) { //w3
            HTTP = new XMLHttpRequest();
        } else
        if (window.ActiveXObject) { //ie
            try {
                HTTP = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    HTTP = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (ex) {
                    ajax.settings.error(ex);
                    return null;
                } //catch sub
            } //catch first
        } else {
            var ex = new Error("HTTPRequest is not supported by engine");
            ex.name = "mm7 ajax error";
            ajax.settings.error(ex);
            return null;
        }

        HTTP.onreadystatechange = function () {
            if (this.readyState === 4) {
                var response;
                if (ajax.settings.jsonResponse === true) {
                    response = mm7.json.toObject(this.responseText);
                } else {
                    response = this.responseText;
                }                
                ajax.settings.after();
                ajax.settings.success(response);
            }
        };
        return HTTP;
    }

    mm7.defaults["ajax"] = {
        jsonResponse:true,
        jsonRequest:true,
        method: "POST", // [POST,GET,PUT,DELETE]
        charset: "UTF-8",
        data: null,
        url: "",
        before: function () {},
        after: function () {},
        success: function () {},
        error: function (ex) {
            mm7.error(ex.name + " /" + ex.message);
        }
    };



    mm7["ajax"] = function (settings) {
        return {
            settings: mm7.extend(mm7.defaults.ajax, settings),
            set: function (key, value) {
                this.settings[key] = value;
                return this;
            },
            data: function (data) {
                return this.set("data", data);
            },
            method:function(name) {
                return this.set("method", name);
            },
            url: function (url) {
                return this.set("url", url);
            },
            then: function (success,error) {
                this.set("success", success);
                if (typeof error === "function") {
                    this.set("error", error);
                }
                return this;
            },
            request: function (url) {
                if (url) {
                    this.set("url", url);
                }
                var requestStr = "";
                if ((typeof this.settings.data !== "undefined") && (this.settings.data !== null) && (typeof this.settings.data === "object")) {
                    if (this.settings.jsonRequest === true) {
                        requestStr = mm7.json.toString(mm7.json.fixAll(this.settings.data));
                    } else {
                        requestStr = encodeURI(mm7.url.toQuery(this.settings.data));
                    }
                }

                var http = ajaxCreateHTTPRequest(this);
                if (http === null) {
                    return;
                }

                if (this.settings.method === "POST" || this.settings.method === "PUT") {
                    http.open(this.settings.method, url, true);
                    if (this.settings.jsonResponse === true) {
                        http.setRequestHeader("Content-type", "application/json;charset=" + this.settings.charset);
                    } else {
                        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=" + this.settings.charset);
                    }
                    //http.setRequestHeader("Content-length", requestStr.length);
                    this.settings.before();
                    http.send(requestStr);
                } else { //GET or DELETE
                    http.open(this.settings.method, mm7.url.add(url, requestStr), true);
                    this.settings.before();
                    http.send();
                }
                return this;
            }
        };
    };
})(mm7);