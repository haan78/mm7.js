(function (mm7) {
    if (mm7.missing(["url", "json"], true) > -1)
        return;
    mm7["http"] = {
        defaults: {
            requestDataType: "json", // [json,query]
            responseDataType: "json", // [json,text]
            method: "POST", // [POST,GET]
            charset: "UTF-8"
        },
        createHTTPRequest: function () {
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
                        mm7.error(ex.name + " /" + ex.message, this.onError);
                        return false;
                    } //catch sub
                } //catch first
            } else {
                mm7.error("HTTPRequest is not supported by engine");
                return null;
            }
            return HTTP;
        },
        request: function (url, data, callback, settings) {
            var sett = mm7.extend(mm7.http.defaults, settings);
            var http = mm7.http.createHTTPRequest();
            if (http === null)
                return;

            var requestStr = "";
            if (( typeof data !=="undefined" ) && (data !== null) && (typeof data === "object")) {
                if (sett.requestDataType === "json") {
                    requestStr = mm7.json.toString(mm7.json.fixAll(data));
                } else {
                    requestStr = encodeURI(mm7.url.toQuery(data));
                }
            }

            http.onreadystatechange = function () {
                if (this.readyState === 4) {
                    var response;
                    if (sett.responseDataType === "json") {
                        response = mm7.json.toObject(this.responseText);
                    } else {
                        response = this.responseText;
                    }
                    if (typeof callback === "function")
                        callback(response);
                }
            };           

            if (sett.method === "POST") {
                http.open("POST", url, true);
                if ( sett.responseDataType === "json" ) {
                    http.setRequestHeader("Content-type", "application/json;charset=" + sett.charset);
                } else {
                    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=" + sett.charset);
                }
                //http.setRequestHeader("Content-length", requestStr.length);
                http.send(requestStr);
            } else {
                http.open("GET", mm7.url.add(url, requestStr), true);
                http.send();
            }
        }

    };
})(mm7);
