(function(mm7) {
    
    if (mm7.missing(["url","json"],true)>-1) return;
    
    mm7["http"] = {
        responseType: "json",
        onError: null,
        request: function(url, obj, callBack,before,after) {
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
                        mm7.error(ex.name + " /" + ex.message,this.onError);
                        return false;
                    } //catch sub
                } //catch first
            } //if window.ActiveXObject

            var requestStr = "";
            if ((typeof obj === "object") && (obj !== null)) {
                if ( this.responseType === "json" ) {
                    requestStr = mm7.json.toString(obj);
                } else {
                    requestStr = encodeURI(mm7.url.toQuery(obj));
                }
            }

            if (this.responseType === "json") {
                HTTP.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        var response = mm7.json.toObject(this.responseText);
                        if (response !== null) {
                            if ((typeof callBack === "function") && (response !== null))
                                if ( typeof after === "function" ) {
                                    after();
                                }
                                callBack(response);
                        } else {
                            mm7.error("Response is null",mm7.http.onError);
                            if ( typeof after === "function" ) {
                                after();
                            }
                        }
                    }
                };
            } else {
                HTTP.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        if (typeof callBack === "function") {
                            if ( typeof after === "function" ) {
                                after();
                            }
                            callBack(this.responseText);
                        }
                    }
                };
            }

            try {
                if ( typeof before === "function" ) {
                    before();
                }
                if (requestStr !== "") {
                    HTTP.open("POST", url, true);
                    HTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
                    HTTP.setRequestHeader("Content-length", requestStr.length);
                    HTTP.send(requestStr);
                } else {
                    HTTP.open("GET", url, true);
                    HTTP.send();
                }

            } catch (ex) {
                mm7.error(ex.name + " /" + ex.message,this.onError);
                return false;
            }

            return true;
        }
    };

})(mm7);


