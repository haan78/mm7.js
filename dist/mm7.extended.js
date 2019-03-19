/* BUILD Sal 19.03.2019@11-16-26,02 */  
var mm7 = {
    lastError: "",
    logError: true,
    defaults:{},
    error: function(message, handler) {
        this.lastError = message;        
        if (typeof handler === "function")
            handler(this.lastError);
        if (this.logError) {
            console.log(this.lastError);
        } else {
            var er =new Error(this.lastError);
            er.name = "mm7Error";
            throw er;
        }            
    },
    missing: function(modules, doError) { //dependency
        for (var i = 0; i < modules.length; i++) {
            if ((typeof this[modules[i]] === "undefined") || (this[modules[i]] === null)) {
                if (doError)
                    this.error("mm7." + modules[i] + " module is required");
                return i;
            }
        }
        return -1;
    },
    extend:function(obj1,obj2) {
        var o = {};
        for ( var k in obj1 ) {
            if ( (typeof obj2 !=="undefined") && (typeof obj2[k] !== "undefined") ) {
                o[k] = obj2[k];
            } else {
                o[k] = obj1[k];
            }
        }
        return o;
    },
    type: function(data) {
        if (data === null)
            return "null";
        else
        if (data instanceof Date) {
            return "date";
        } else
        if (data instanceof Array) {
            return "array";
        } else
        if ( (typeof HTMLElement === "object") && (data instanceof HTMLElement ) ) {
            return "element";
        } else
        if ( (typeof Node === "object") && (data instanceof Node ) ) {
            return "node";
        } else
        if ( typeof data === "function" ) {
            return "function";
        }
        if (data instanceof Object) {
                return "object";
        } else
            return typeof data;
    },
    count:function(obj) {
        if ( this.type(obj)==="array" ) return obj.length;
        else if (this.type(obj)==="object") {
            if ( typeof obj.keys !== "undefined" ) return obj.keys.length;
            else {
                var c =0;
                for (var k in obj) c++;
                return c;
            }
        } else {
            return -1;
        }
    }
};

/*
 * 
 * Array to Map transform a object array to tree form.
 * Here is example.
 * 
 var data1 = [
 {id: 1, name: 'Ali', lastname: 'A', birthdate: '31.19.1978', parent_id: null},
 {id: 2, name: 'Veli', lastname: 'B', birthdate: '31.19.1978', parent_id: 1},
 {id: 3, name: 'Deli', lastname: 'C', birthdate: '31.19.1978', parent_id: 1},
 {id: 4, name: 'Recep', lastname: 'D', birthdate: '31.19.1978', parent_id: 2},
 {id: 5, name: 'Ramazan', lastname: 'E', birthdate: '31.19.1978', parent_id: 2},
 {id: 6, name: 'Murtaza', lastname: 'F', birthdate: '31.19.1978', parent_id: 4},
 {id: 7, name: 'Barbar', lastname: 'G', birthdate: '31.19.1978', parent_id: null},
 {id: 8, name: 'Taha', lastname: 'H', alt: [1, 2, 3, 4], birthdate: '31.19.1978', parent_id: 7},
 {id: 9, name: 'dsfsdf', lastname: 'I', birthdate: '31.19.1978', parent_id: 8},
 {id: 11, name: 'sdfdsfdsf', lastname: 'J', birthdate: '31.19.1978', parent_id: 8},
 {id: 12, name: 'sdfdsfsdfds', lastname: 'K', birthdate: '31.19.1978', parent_id: 1},
 {id: 13, name: 'Paha', lastname: 'L', birthdate: '31.19.1978', parent_id: null}
 ];
 
 var data2 = mm7.array.toMap.transform(data1,"id","parent_id");
 data2 will be as below. So it is easy too use with commonn Jquery tree plugins.
 [
 {id: 1, name: 'Ali', lastname: 'A', birthdate: '31.19.1978', parent_id: null, subArray: [
 {id: 2, name: 'Veli', lastname: 'B', birthdate: '31.19.1978', parent_id: 1, subArray: [
 {id: 4, name: 'Recep', lastname: 'D', birthdate: '31.19.1978', parent_id: 2, subArray: [
 {id: 6, name: 'Murtaza', lastname: 'F', birthdate: '31.19.1978', parent_id: 4, subArray: []}
 ]},
 {id: 5, name: 'Ramazan', lastname: 'E', birthdate: '31.19.1978', parent_id: 2, subArray: []}
 ]},
 {id: 3, name: 'Deli', lastname: 'C', birthdate: '31.19.1978', parent_id: 1, subArray: []},
 {id: 12, name: 'sdfdsfsdfds', lastname: 'K', birthdate: '31.19.1978', parent_id: 1, subArray: []}
 ]},
 {id: 7, name: 'Barbar', lastname: 'G', birthdate: '31.19.1978', parent_id: null, subArray: [
 {id: 8, name: 'Taha', lastname: 'H', alt: [1, 2, 3, 4], birthdate: '31.19.1978', parent_id: 7, subArray: [
 {id: 9, name: 'dsfsdf', lastname: 'I', birthdate: '31.19.1978', parent_id: 8, subArray: []},
 {id: 11, name: 'sdfdsfdsf', lastname: 'J', birthdate: '31.19.1978', parent_id: 8, subArray: []}
 ]}
 ]},
 {id: 13, name: 'Paha', lastname: 'L', birthdate: '31.19.1978', parent_id: null, subArray: []}
 ];
 */


(function (mm7) {

    mm7["array"] = {};

    mm7["array"]["toMap"] = {
        data: null,
        subArrayTagName: "subArray",
        transform: function (objectArray, masterKey, detailKey, onReplace) {
            this.data = objectArray;
            return this.arrayToMap(this.data, masterKey, detailKey, onReplace);
        },
        subArray: function (a, f, v) {
            var arr = new Array();
            for (var i = 0; i < a.length; i++) {
                if (a[i][f] == v)
                    arr.push(a[i]);
            }
            return arr;
        },
        arrayToMap: function (d, mF, cF, r) {
            var arr = new Array();
            for (var i = 0; i < d.length; i++) {
                var item = d[i];
                if (this.subArray(d, mF, d[i][cF]).length === 0) {
                    item[this.subArrayTagName] = this.arrayToMap(this.subArray(this.data, cF, d[i][mF]), mF, cF);
                    if (typeof r === "fuction")
                        arr.push(r(item));
                    else
                        arr.push(item);
                }
            }
            return arr;
        }

    };

    mm7["array"]["shuffle"] = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };
    
    mm7["array"]["indexOf"] = function(array,item) {
        for(var i=0; i<array.length; i++) {
            if (array[i] === item) return i;
        }
        return -1;
    };


})(mm7);(function(mm7) {
    mm7["document"] = {
        create: function(html) {
            var div = document.createElement("div");
            if (typeof html === "string") {
                div.innerHTML = html;
            }
            return div.children;
        },
        //Returns true if it is a DOM element    
        isElement: function(o) {
            return (
                    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
                    );
        },
        //Returns true if it is a DOM node
        isNode: function(o) {
            return (
                    typeof Node === "object" ? o instanceof Node :
                    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
                    );
        },
        isDom:function(o) {
            if ( (this.isNode(o)===true) || (this.isElement(o)===true)   ) return true; else return false;
        },
        node: function(target) {
            if (this.isElement(target)) {
                return target;
            } else {
                if (typeof target === "string") {
                    var elm = document.getElementById(target);
                    if (elm !== null) {
                        return elm;
                    } else {
                        mm7.error("Node could not in document by id (" + target + ")");
                        return null;
                    }
                } else {
                    mm7.error("Node or id must be specified");
                    return null;
                }
            }
        }
    };
    
    //Short cut
    mm7["node"] = function(target) {
        return mm7.document.node(target);
    };
})(mm7);(function(mm7) {
    mm7["url"] = {
        getQueryParams: function() {
            var vars = {};
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                vars[key] = value.replace(/#/g, '');
            });
            return vars;
        },
        
        getParam:function(name) {
            var pl = this.getQueryParams();
            if ( pl.hasOwnProperty(name) ) {
                return pl[name];
            } else {
                return null;
            }
        },
        
        extract:function(url){
            var str = new String(url);
            var vars = {};
            str.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                vars[key] = value.replace(/#/g, '');
            });
            return vars;
        },
        add:function(url,part){
           if ( part==="" ) return;
           if ( url.indexOf("?") > -1 ) {
               return url+"&"+part;
           } else {
               return url+"?"+part;
           }
        },
        toQuery: function(obj, key) {
            if (obj === null)
                return "";
            var str = "";
            if (typeof obj === "object") {
                //object
                var isArray = typeof obj.length !== "undefined";
                for (var k in obj) {
                    if (str.length > 0)
                        str += "&";
                    if (!key) {
                        if (typeof obj[k] !== "object")
                            str += k;
                        str += this.toQuery(obj[k], k);
                    } else {
                        var left = key;
                        if (!isArray)
                            left += "[" + k + "]";
                        else
                            left += "[]";
                        str += left;
                        str += this.toQuery(obj[k], left);
                    }
                }
            } else {
                str = "=" + obj;
            }
            return str;
        }
    };
})(mm7);

(function(mm7) {
    mm7["json"] = {
    	fix:function (str,single) {
    		var s = new String(str);    		
    		s = single ? s.replace(/'/g, '\'') : s.replace(/"/g, '\'');    	
	    	return s.replace(/(?:\r\n|\r|\n|\t)/g, '');
    	},
        fixAll:function(Obj,single) {
            var o = Obj;
            
            if ( typeof o !== "object" ) return o;
            
            for ( var k in o ) {
                if ( typeof o[k] === "string"  ) o[k] = this.fix(o[k],single);
                else if ( typeof o[k] === "object" ) o[k] = this.fixAll(o[k],single);
            }
            return o;
        },
        toObject: function(json) {
            var response = null;
            try {
                eval("response=" + json + ";");
            } catch (ex) {
                this.lastError = ex.name + " /" + ex.message;
                return null;
            }
            return response;
        },
        toString: function(obj) {
            var s = new String("");
            var isArray = !isNaN(obj.length);
            if ((isArray) && (obj.length === 0))
                return "[]";
            var count = 0;
            for (var k in obj) {
                if (count > 0)
                    s += ",";
                var v = "";
                if (typeof (obj[k]) === "object")
                    if (obj[k] !== null)
                        v = this.toString(obj[k]);
                    else
                        v = "null";
                else
                    v = typeof obj[k] === "string" ? '"' + obj[k] + '"' : obj[k];
                if (isArray)
                    s += v;
                else
                    s += '"' + k + '":' + v;
                count++;
            }
            //alert(s);
            if (isArray)
                return "[" + s + "]";
            else
                return "{" + s + "}";
        }
    };
})(mm7);

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
})(mm7);(function (mm7) {
    if (mm7.missing(["url", "json"], true) > -1)
        return;
    mm7["http"] = {
        defaults: {
            requestDataType: "json", // [json,query]
            responseDataType: "json", // [json,text]
            method: "POST", // [POST,GET,PUT,DELETE]
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

            if (sett.method === "POST" || sett.method === "PUT") {
                http.open(sett.method, url, true);
                if ( sett.responseDataType === "json" ) {
                    http.setRequestHeader("Content-type", "application/json;charset=" + sett.charset);
                } else {
                    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=" + sett.charset);
                }
                //http.setRequestHeader("Content-length", requestStr.length);
                http.send(requestStr);
            } else { //GET or DELETE
                http.open(sett.method, mm7.url.add(url, requestStr), true);
                http.send();
            }
        }

    };
})(mm7);
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
            request: function (url,data,success,error) {
                if (url) {
                    this.set("url", url);
                }
                if (data) {
                    this.set("data", data);
                }
                if (success) {
                    this.set("success", success);
                }
                if (error) {
                    this.set("error", error);
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
                    http.open(this.settings.method, this.settings.url, true);
                    if (this.settings.jsonResponse === true) {
                        http.setRequestHeader("Content-type", "application/json;charset=" + this.settings.charset);
                    } else {
                        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=" + this.settings.charset);
                    }
                    //http.setRequestHeader("Content-length", requestStr.length);
                    this.settings.before();
                    http.send(requestStr);
                } else { //GET or DELETE
                    http.open(this.settings.method, mm7.url.add(this.settings.url, requestStr), true);
                    this.settings.before();
                    http.send();
                }
                return this;
            }
        };
    };
})(mm7);
(function (mm7) {

    if (mm7.missing(["document","array"], true) > -1)
        return;

    mm7["form"] = function (formElement) {
        return {
            form: mm7.node(formElement),
            setSelect: function (select, value) {
                if (value == null)
                    return;
                if (typeof value === "object") {
                    for (var i = 0; i < select.options.length; i++) {
                        select.options[i].selected = false;
                        for (var k in value)
                            if (value[k] == select.options[i].value)
                                select.options[i].selected = true;
                    }
                } else {
                    select.selectedIndex = -1;
                    for (var i = 0; i < select.options.length; i++) {
                        if (select.options[i].value == value)
                            select.selectedIndex = i;
                    }
                }
            },
            isRealFormElement: function (elm) {
                if ((elm.type) && (elm.type.toLowerCase() !== "fieldset") && (elm.name !== "")) {
                    return true;
                } else {
                    return false;
                }
            },
            get: function (defaults) {
                var values = {};
                if ((defaults !== null) && (typeof defaults === "object"))
                    values = defaults;

                for (var i = 0; i < this.form.elements.length; i++) {
                    var elm = this.form.elements[i];
                    if (this.isRealFormElement(elm)) {
                        var type = elm.type.toLowerCase();
                        var name = elm.name;
                        var value = elm.value;
                        if ((type === "checkbox") || (type === "radio")) {
                            if (elm.checked) {
                                values[name] = value;
                            } else {
                                //I am not sure;
                            }
                        } else if (type === "select-one") {
                            if (elm.selectedIndex > -1) {
                                values[name] = elm.options[elm.selectedIndex].value;
                            } else {
                                //I am not sure;
                            }
                        } else if (type === "select-multiple") {
                            var arr = [];
                            for (var j = 0; j < elm.options.length; j++) {
                                if (elm.options[j].selected)
                                    arr.push(elm.options[j].value);
                            }
                            if (arr.length > 0) {
                                values[name] = arr;
                            } else {
                                //I am not sure;
                            }
                        } else {
                            values[name] = value;
                        }
                    }
                }
                return values;
            },

            clear: function (exNames) {
                for (var i = 0; i < this.form.elements.length; i++) {
                    var elm = this.form.elements[i];
                    if (this.isRealFormElement(elm)) {
                        var type = elm.type.toLowerCase();
                        if ((mm7.type(exNames) !== "array") || (mm7.array.indexOf(exNames,elm.name) < 0)) {
                            if ((type === "checkbox") || (type === "radio")) {
                                if (elm.value == "") {
                                    elm.checked = true;
                                } else {
                                    elm.checked = false;
                                }
                            } else if (type === "select-one") {
                                this.setSelect(elm, "");
                            } else if (type === "select-multiple") {
                                this.setSelect(elm, "");
                            } else {
                                elm.value = "";
                            }
                        }
                    }
                }
            },

            set: function (values, clear) {
                for (var i = 0; i < this.form.elements.length; i++) {
                    var elm = this.form.elements[i];
                    if (this.isRealFormElement(elm)) {
                        var type = elm.type.toLowerCase();
                        var name = elm.name;
                        if (typeof values[name] !== "undefined") {
                            var value = values[name];
                            if ((type === "checkbox") || (type === "radio")) {
                                if (elm.value == value) {
                                    elm.checked = 1;
                                } else {
                                    elm.checked = 0;
                                }
                            } else if (type === "select-one") {
                                this.setSelect(elm, value);
                            } else if (type === "select-multiple") {
                                this.setSelect(elm, value);
                            } else {
                                elm.value = value;
                            }
                        } else {
                            if (clear) {
                                if (typeof elm.checked !== "undefined") {
                                    elm.checked = 0;
                                } else if (typeof elm.selectedIndex !== "undefined") {
                                    elm.selectedIndex = -1;
                                } else if (typeof elm.value !== "undefined") {
                                    elm.value = "";
                                }
                            }
                        }
                    }
                }
            }
        };
    };

})(mm7);


(function(mm7) {
    
    if (mm7.missing(["document"],true)>-1) return;
    
    mm7["element"] = function(elm) {
        
        return {
            elm: mm7.node(elm),
            empty: function() {
                while (this.elm.firstChild)
                    this.elm.removeChild(elm.firstChild);
            },
            indexOf: function(elm) {
                if ((!this.elm.parrentNode) || (this.elm.parrentNode === null))
                    return -1;
                for (var i = 0; i < this.elm.parrentNode.childNodes.length; i++) {
                    if (this.elm.parrentNode.childNodes[i] === elm)
                        return i;
                }
                return -1;
            },
            addClass: function(cls) {
                var s = this.elm.className + "";
                var arr = s.split(" ");
                for (var i = 0; i < arr.length; i++) {
                    if (cls === arr[i].trim())
                        return;
                }
                this.elm.className += " " + cls;
            },
            removeClass: function(cls) {
                var s = this.elm.className + "";
                var arr = s.split(" ");
                s = "";
                for (var i = 0; i < arr.length; i++) {
                    if (cls !== arr[i].trim())
                        s += " " + arr[i].trim();
                }
                this.elm.className = s;
            }
        };
    };
})(mm7);

(function(mm7) {
    mm7["object"] = function(data) {
        return {
            "data": data,
            doEach: function(prm, handle) {
                if (this.canLoop(prm.data)) {
                    var i = 0;
                    handle(prm);
                    var nCount = mm7.count(prm.data);
                    for (var k in prm.data) {
                        var p = {
                            "data": prm.data[k],
                            "type": mm7.type(prm.data[k]),
                            "key": k,
                            "level": prm.level + 1,
                            "index": i,
                            "member_count":nCount,
                            "isLast": i === nCount-1
                        };
                        this.doEach(p, handle);
                        i++;
                    }
                } else {
                    handle(prm);
                }
            },
            each: function(handle) {
                var prm = {
                    "data": this.data,
                    "type": mm7.type(data),
                    "key": "",
                    "level": 0,
                    "index": -1,
                    "member_count":1,
                    "isLast":true
                };
                this.doEach(prm, handle);
            },
            canLoop: function(data) {
                var t = mm7.type(data);
                if ((t === "object") || (t === "array"))
                    return true;
                else
                    return false;
            },
            doClone: function(obj) {                
                
                // Handle the 3 simple types, and null or undefined
                if (obj === null || typeof obj !== "object")
                    return obj;

                // Handle Date
                if (obj instanceof Date) {
                    var copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }

                // Handle Array
                if (obj instanceof Array) {
                    var copy = [];
                    var len = obj.length;
                    for (var i = 0; i < len; ++i) {
                        copy[i] = this.clone(obj[i]);
                    }
                    return copy;
                }

                // Handle Object
                if (obj instanceof Object) {
                    var copy = {};
                    for (var attr in obj) {
                        if (obj.hasOwnProperty(attr))
                            copy[attr] = this.clone(obj[attr]);
                    }
                    return copy;
                }
                this.error("Unable to copy obj! Its type isn't supported.");
            },
            clone:function() {
                this.doClone(this.data);
            }            
        };
    };

})(mm7);/*
 * Methods:
 * mm7.date.toString(date,format) example mm7.date.toString(new Date(1978,10,31),"%d.%M.%Y");
 * mm7.date.toDate(str,format) example mm7.date.toDate("31.10.1978","%d.%M.%Y");
 * 
 * Suported Format:
 * %d day of month 1-31, %dd day of month wiht zero 01-31
 * %M month 1-12, %MM month 01-12
 * %Y Year 4 digists, %yy Year only 2 digits example 12/11/14 (%d/%M/%yy) = 2014-11-12
 * %H hour 0-24, %HH hour 00-24
 * %m minute 0-59, %mm minute 00-59
 * %s second 0-59, %ss second 00-59
 * %ms millisecond 0-999
 * %D Day of Week (Only for toString)
 */

(function (mm7) {
    mm7["date"] = {
        //daysOfWeek:["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],
        daysOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        //monthsOfYear:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Tenmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
        monthsOfYear: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        getDefaultElements: function () {
            var obj = new Object();
            obj["year"] = 0;
            obj["month"] = 0;
            obj["day"] = 0;
            obj["hour"] = 0;
            obj["minute"] = 0;
            obj["second"] = 0;
            obj["millisecond"] = 0;
            obj["dayOfWeek"] = 0;
            return obj;
        },
        getElementsFromDate: function (d) {
            var obj = new Object();
            obj["year"] = d.getFullYear();
            obj["month"] = d.getMonth() + 1;
            //obj["day"] = d.getUTCDate();
            obj["day"] = d.getDate();
            obj["hour"] = d.getHours();
            obj["minute"] = d.getMinutes();
            obj["second"] = d.getSeconds();
            obj["millisecond"] = d.getMilliseconds();
            obj["dayOfWeek"] = d.getDay();
            obj["dayName"] = this.daysOfWeek[d.getDay()];
            obj["monthName"] = this.monthsOfYear[d.getMonth()];
            return obj;
        },

        add: function (d, interval, num) {
            var dr = new Date(d.getTime());
            switch (interval) {
                case "year":
                    dr.setFullYear(d.getFullYear() + num);
                    break;
                case "mounth":
                    dr.setMonth(d.getMonth() + num);
                    break;
                case "week":
                    dr.setDate(d.getDate() + (num * 7));
                    break;
                case "day":
                    dr.setDate(d.getDate() + num);
                    break;
                case "hour":
                    dr.setHours(d.getHours() + num);
                    break;
                case "minute":
                    dr.setMinutes(d.getMinutes() + num);
                    break;
                case "second":
                    dr.setSeconds(d.getSeconds() + num);
                    break;
                case "millisecond":
                    dr.setMilliseconds(d.getMilliseconds() + num);
                    break;
                default:
                    dr.setMilliseconds(d.getMilliseconds() + num);
                    break;
            }
            return dr;
        },

        diff: function (d1, d2, interval) { //interval = (second,minute,day,week,mounth,year,millisecond)
            var result = d2 - d1;
            switch (interval) {
                case "year":
                    var ynew = d2.getFullYear();
                    var mnew = d2.getMonth();
                    var dnew = d2.getDate();
                    var yold = d1.getFullYear();
                    var mold = d1.getMonth();
                    var dold = d1.getDate();
                    var diff = ynew - yold;
                    if (mold > mnew)
                        diff--;
                    else {
                        if (mold == mnew) {
                            if (dold > dnew)
                                diff--;
                        }
                    }
                    return diff;
                case "mounth":
                    var months;
                    months = (d2.getFullYear() - d1.getFullYear()) * 12;
                    months -= d1.getMonth() + 1;
                    months += d2.getMonth();
                    return months <= 0 ? 0 : months;
                    break;
                case "week":
                    return result / (1000 * 60 * 60 * 24 * 7);
                    break;
                case "day":
                    return result / (1000 * 60 * 60 * 24);
                    break;
                case "hour":
                    return result / (1000 * 60 * 60);
                    break;
                case "minute":
                    return result / (1000 * 60);
                    break;
                case "second":
                    return result / (1000);
                    break;
                case "millisecond":
                    return result; // millisecond
                    break;
                default:
                    return result; // millisecond
                    break;
            }

        },
        isNumberCode: function (code) {
            if ((code > 47) && (code < 58))
                return true;
            else
                return false;
        },
        isParamCode: function (code) {
            if (
                    ((code > 47) && (code < 58)) || //0-9
                    ((code > 64) && (code < 91)) || // A-Z
                    ((code > 96) && (code < 123)) //a-z
                    )
                return true;
            else
                return false;
        },
        getNumberValue: function (value) {
            var num = parseInt(value);
            if (isNaN(num))
                num = -1;
            else
                return num;
        },
        getNumberPart: function (str) {
            var s = "";
            for (var i = 0; i < str.length; i++) {
                if (this.isNumberCode(str.charCodeAt(i)))
                    s += str.charAt(i);
                else
                    return s;
            }
            return s;
        },
        getParamMap: function (format) {
            var map = new Array();
            var s = "";
            var last = 0;
            var flag = false;
            for (var i = 0; i < format.length; i++) {
                if (flag) {
                    if (this.isParamCode(format.charCodeAt(i))) {
                        s += format.charAt(i);
                        if (i === format.length - 1) {
                            map.push({param: s, index: last});
                            s = "";
                            break;
                        }
                    } else {
                        map.push({param: s, index: last});
                        s = "";
                        flag = false;
                    }
                }

                if (format.charAt(i) === "%") {
                    flag = true;
                    last = i;
                }
            }
            return map;
        },
        daysInMonth: function (date) {
            return new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
        },
        toDate: function (str, format) {
            var map = this.getParamMap(format);
            var elements = this.getDefaultElements();
            var j = 0;
            var p = 0;
            for (var i = 0; i < map.length; i++) {
                j = p + map[i].index;
                var v = "";
                if ((map[i].param === "d") || (map[i].param === "dd")) {
                    v = this.getNumberPart(str.substr(j, 2));
                    elements.day = this.getNumberValue(v);
                } else if ((map[i].param === "M") || (map[i].param === "MM")) {
                    v = this.getNumberPart(str.substr(j, 2));
                    elements.month = this.getNumberValue(v);
                } else if (map[i].param === "Y") {
                    v = this.getNumberPart(str.substr(j, 4));
                    elements.year = this.getNumberValue(v);
                } else if (map[i].param === "yy") {
                    v = this.getNumberPart(str.substr(j, 2));
                    elements.year = this.getNumberValue(v) + 2000;
                } else if ((map[i].param === "H") || (map[i].param === "HH")) {
                    v = this.getNumberPart(str.substr(j, 2));
                    elements.hour = this.getNumberValue(v);
                } else if ((map[i].param === "m") || (map[i].param === "mm")) {
                    v = this.getNumberPart(str.substr(j, 2));
                    elements.minute = this.getNumberValue(v);
                } else if ((map[i].param === "s") || (map[i].param === "ss")) {
                    v = this.getNumberPart(str.substr(j, 2));
                    elements.second = this.getNumberValue(v);
                } else if (map[i].param === "ms") {
                    v = this.getNumberPart(str.substr(j, 3));
                    elements.millisecond = this.getNumberValue(v);
                }
                p = p + v.length - (map[i].param.length + 1);
            }
            return new Date(elements["year"], elements["month"] - 1, elements["day"], elements["hour"], elements["minute"], elements["second"], elements["millisecond"]);
        },
        fillZero: function (num) {
            if (num < 10)
                return "0" + num;
            else
                return "" + num;
        },
        toString: function (date, format) {
            var elements = this.getElementsFromDate(date);
            var map = this.getParamMap(format);
            var str = format;
            for (var i = 0; i < map.length; i++) {
                if (map[i].param === "D") {
                    str = str.replace("%D", elements.dayName);
                } else
                if (map[i].param === "Mo") {
                    str = str.replace("%Mo", elements.monthName);
                } else
                if (map[i].param === "d")
                    str = str.replace("%d", elements.day);
                else
                if (map[i].param === "dd")
                    str = str.replace("%dd", this.fillZero(elements.day));
                else
                if (map[i].param === "M")
                    str = str.replace("%M", elements.month);
                else
                if (map[i].param === "MM")
                    str = str.replace("%MM", this.fillZero(elements.month));
                else
                if (map[i].param === "Y")
                    str = str.replace("%Y", elements.year);
                else
                if (map[i].param === "yy")
                    str = str.replace("%yy", elements.year % 100);
                else
                if (map[i].param === "H")
                    str = str.replace("%H", elements.hour);
                else
                if (map[i].param === "HH")
                    str = str.replace("%HH", this.fillZero(elements.hour));
                else
                if (map[i].param === "m")
                    str = str.replace("%m", elements.minute);
                else
                if (map[i].param === "mm")
                    str = str.replace("%mm", this.fillZero(elements.minute));
                else
                if (map[i].param === "s")
                    str = str.replace("%s", elements.second);
                else
                if (map[i].param === "ss")
                    str = str.replace("%ss", this.fillZero(elements.second));
                else
                if (map[i].param === "ms")
                    str = str.replace("%ms", elements.millisecond);
            }
            return str;
        },
        convert: function (sDate, format1, format2) {
            return mm7.date.toString(mm7.date.toDate(sDate, format1), format2);
        }
    };
})(mm7);//Dependence
// There is mm7 

/*
 * Methods of Timer
 * var t = mm7.timer.create(func,interval); returns a timer object
 * t.start()  start execution, t.stop() stop execution
 * 
 * Exemple
var t = mm7.timer.create(
        function() {
            if (document.getElementsByTagName("title")[0].innerHTML.length < 10 ) {
                document.getElementsByTagName("title")[0].innerHTML += "*";                                
            } else {
                document.getElementsByTagName("title")[0].innerHTML = "";
            }

        }, 500);

t.start();
 */
(function(mm7){
    mm7["timer"] = {
    list:new Array(),
    create:function(code,interval) { //static public
        var index  = this.list.length;
        this.list[index] = {
            "code":code,
            "index":index,
            "interval":interval,
            "pid":-1,
            "isAlive":false,
            "execute":function(){ //private
                if ( typeof this.code === "function" ) this.code();
                else if (typeof this.code === "string" ) eval(this.code);
                this.pid = setTimeout("mm7.timer.list["+this.index+"].execute()",this.interval);
            },
            "start": function() { //public
                if (!this.isAlive) {
                    this.isAlive = true;
                    this.execute();                    
                }                
            },
            "stop": function() { //public
                if (this.isAlive) {
                    clearTimeout(this.pid);
                    this.pid = -1;
                    this.isAlive = false;
                }
            }
        };
        return this.list[index];        
    },
    
    startAll:function() { //public
        for (var i=0; i<this.list.length; i++) {
            if (!this.list[i].isAlive) this.list[i].start();
        }
    },
    
    stopAll:function() { //public
        for (var i=0; i<this.list.length; i++) {
            if (this.list[i].isAlive) this.list[i].stop();
        }
    },
    
    killAll:function() {
        this.stopAll();
        this.list = new Array();
    }
};
})(mm7);

//var Timer = 



(function(mm7) {
    /**
     *
     *  Base64 encode / decode
     *  http://www.webtoolkit.info/
     *
     **/
    mm7["base64"] = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        // public method for encoding
        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = mm7.base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },
        // public method for decoding
        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = mm7.base64._utf8_decode(output);

            return output;

        },
        // private method for UTF-8 encoding
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },
        // private method for UTF-8 decoding
        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    };


})(mm7);

(function(mm7) {
    mm7["string"] = {
        toInt: function(stNum, def) {
            if (isNaN(stNum))
                return def;
            var num = parseInt(stNum);
            if (isNaN(num))
                return def;
            else
                return num;
        },
        toFloat: function(stFloat, def) {
            var sf = null;
            if (stFloat == null)
                return def;
            if ((isFloat(stFloat)) || (isInteger(stFloat)))
                sf = stFloat;
            else
                sf = stFloat.replace(",", ".");
            var f = parseFloat(sf);
            if (isNaN(f))
                return def;
            else
                return f;
        },
        isFloat: function(n) {
            return n === +n && n !== (n | 0);
        },
        isInteger: function(n) {
            return n === +n && n === (n | 0);
        },
        isEmail:function(str){
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(str).toLowerCase());
        },
        floatFormat:function(n,c,d,t){
            //if ( !this.isFloat(n) ) return "";
            c = isNaN(c = Math.abs(c)) ? 2 : c;
            d = (d === undefined ? "." : d);
            t = (t === undefined ? "," : t); 
            var s = (n < 0 ? "-" : "");
            var i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
            var j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }
    };
})(mm7);(function(mm7) {
    mm7["navigator"] = {
        inertval: 5000,
        highAccuracy: true,
        timeout: 20000,
        doOnceMore: true,
        onError: null,
        getLoaction: function(func) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(p) {
                    var lat = p.coords.latitude;
                    var lng = p.coords.longitude;
                    if (typeof func === "function")
                        func(lat, lng);
                    if (mm7.navigator.doOnceMore)
                        setTimeout(mm7.navigator.getLoaction(func), mm7.navigator.inertval);
                },
                        function(error) {
                            mm7.error(error.message, mm7.navigator.onError);
                            if (mm7.navigator.doOnceMore)
                                setTimeout(mm7.navigator.getLoaction(func), mm7.navigator.inertval);
                        },
                        {
                            timeout: this.timeout,
                            enableHighAccuracy: this.highAccuracy
                        });
            } else {
                mm7.error("Browser dose not support geo location", mm7.navigator.onError);
            }
        },
        start: function(func) {
            this.doOnceMore = true;
            this.getLoaction(func);
        },
        stop: function() {
            this.doOnceMore = false;
        }
    };
})(mm7);(function (mm7) {
    mm7["browser"] = {
        get: function (  ) {
            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return {name: 'IE', version: (tem[1] || '')};
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/)
                if (tem != null) {
                    return {name: 'Opera', version: tem[1]};
                }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
            }
            return {
                name: M[0],
                version: M[1]
            };
        },
        isOpera: function () {
            // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
            return isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        },
        isFirefox: function () {
            return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
        },
        isSafari: function () {
            // At least Safari 3+: "[object HTMLElementConstructor]"
            return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        },
        isChrome: function () {
            return !!window.chrome && !this.isOpera();
        },
        isIE: function () {
            return false || !!document.documentMode; // At least IE6
        }
    };
})(mm7);(function (mm7) {
    mm7["math"] = {
        detarminant: function (matris) {
            if (matris.length > 2) {

                var result = 0;

                for (var k = 0; k < matris[0].length; k++) {
                    var m = new Array();
                    for (var i = 1; i < matris.length; i++) {
                        m.push(new Array());
                        for (var j = 0; j < matris[i].length; j++) {
                            if (k !== j) {
                                m[ i - 1 ].push(matris[i][j]);
                            }
                        }
                    }
                    result += matris[0][k] * Math.pow(-1, k) * this.detarminant(m);
                }
                return result;
            } else {
                if (matris.length === 2) {
                    return matris[0][0] * matris[1][1] - matris[0][1] * matris[1][0];
                } else if (matris.length === 1) {
                    return matris[0][0];
                } else {
                    return 0;
                }
            }
        },
        primes: function (end, start) {
            var max = parseInt(end);
            var min = 2;
            var arr = [];
            if (start)
                min = parseInt(start);

            for (var i = min; i < max; i++) {
                var prn = true;
                for (var j = 2; j < i; j++) {
                    if (i % j === 0) {
                        prn = false;
                        break;
                    }
                }
                if (prn)
                    arr.push(i);
            }
            return arr;
        },
        isPrime: function(n)
        {
            if (n < 2) return false;

            var q = Math.floor(Math.sqrt(n));

            for (var i = 2; i <= q; i++)
            {
                if (n % i === 0) return false;
            }

            return true;
        },
        zeta: function (s, limit) {
            var l = 1000;
            if (limit)
                l = parseInt(limit);
            var res = 0;
            for (var i = 1; i < l + 1; i++) {
                res += 1 / Math.pow(i, s);
            }
            return res;
        },
        euler: function (s, limit) {
            var res = 1;
            var i = 2;
            var c = 0;

            while (c < limit) {
                var prn = true;
                for (var j = 2; j < i; j++) {
                    if (i % j === 0) {
                        prn = false;
                        break;
                    }
                }
                if (prn) {
                    res = res * (1 / (1 - Math.pow(i, -1 * s)));
                    c++;
                }
                i++;
            }
            return res;
        },
        factorial: function (n) {
            var r = 1;
            for (var i = 0; i < n; i++) {
                r = r * (i + 1);
            }
            return r;
        },
        fibonacci: function (n) {
            var r = n, a = 0, b = 1;
            for (var i = 1; i < n; i++) {
                r = a + b;
                a = b;
                b = r;
            }
            return r;
        },
        factorization: function (n) {
            var r = parseInt(n);
            var i = 2;
            var arr = [];
            while (i <= r) {
                if (r % i === 0) {
                    r = r / i;
                    arr.push(i);
                } else {
                    i++;
                }
            }
            return arr;
        },
        gcd: function (a, b) {
            if (a < 0)
                a = -a;
            if (b < 0)
                b = -b;
            if (b > a) {
                var temp = a;
                a = b;
                b = temp;
            }
            while (true) {
                if (b === 0)
                    return a;
                a %= b;
                if (a === 0)
                    return b;
                b %= a;
            }
        },
        lcm: function (a, b) {
            return Math.abs(a * b) / this.gcd(a, b);
        }
    };
})(mm7);
(function (mm7) {
    if (mm7.missing(["http", "document", "array"], true) > -1)
        return;

    var randomId = function () {
        return Math.floor(Math.random() * 80000);
    };

    var findJs = function (src) { //private
        for (var i = 0; i < document.getElementsByTagName("script").length; i++) {
            if (document.getElementsByTagName("script")[i].src.indexOf(src) > -1)
                return i;
        }
        return -1;
    };

    var findCss = function (src) { //private
        for (var i = 0; i < document.getElementsByTagName("link").length; i++) {
            if (document.getElementsByTagName("link")[i].href.indexOf(src) > -1)
                return i;
        }
        return -1;
    };

    var create = function () {
        this.list = [];        
        this.onerror = function () {};
        this.contentId = "";
        
        this.updateUrl = function(url) {
            if (mm7.content.defaults.sendModuleId) {
                var str = mm7.content.defaults.callIdTag +"="+this.contentId;
                if ( mm7.content.defaults.sendRandomId ) {
                    str +="_"+randomId();
                }
                return mm7.url.add(url,str);
            } else {
                return url;
            }
        };

        this.error = function (callback) {
            this.onerror = callback;
            return this;
        };

        this.js = function (src) {
            var obj = {type: "js", "src": src};
            if (mm7.array.indexOf(this.list, obj) < 0) {
                this.list.push(obj);
            }
            return this;
        };

        this.json = function (name, url, requestData, options) {
            var obj = {type:"json", "name": name, "url": url, "data": requestData, "options": options};
            if (mm7.array.indexOf(this.list, obj) < 0) {
                this.list.push(obj);
            }
            return this;
        };

        this.html = function (element, url, requestData, options) {
            var obj = {type:"html", "element": mm7.node(element), "url": url, "data": requestData, "options": options};
            if (mm7.array.indexOf(this.list, obj) < 0) {
                this.list.push(obj);
            }
            return this;
        };

        this.css = function (src) {
            var obj = {type: "css", "src": src};
            if (mm7.array.indexOf(this.list, obj) < 0) {
                this.list.push(obj);
            }
            return this;
        };

        this.next = function (i, callback) {
            if (i > this.list.length - 1) {
                if (typeof callback==="function")
                    callback(this.contentId);
            } else {
                var type = this.list[i].type;
                if (type === "js") {
                    this.loadJs(i, callback);
                } else if (type === "json") {
                    this.loadJson(i, callback);
                } else if (type === "html") {
                    this.loadHtml(i, callback);
                } else if (type === "css") {
                    this.loadCss(i, callback);
                }
            }
        };

        this.loadCss = function (i, callback) {
            
            if ( findCss( this.list[i].src )<0 ) {
                var link = document.createElement("link");
                link.setAttribute("rel", "stylesheet");
                link.setAttribute("type", "text/css");
                link.setAttribute("href", this.updateUrl(this.list[i].src));
                document.getElementsByTagName("head")[0].appendChild(link);
                mm7.content.contents[ this.contentId ].parts.push({type: "css", element: link});                
            }
            this.next(i + 1, callback);
        };

        this.loadJs = function (i, callback) {
            if (findJs(this.list[i].src) < 0) {
                var self = this;
                var script = document.createElement('script');
                script.setAttribute("type", "text/javascript");
                var url = this.updateUrl(this.list[i].src);
                script.setAttribute("src", url);
                script.onerror = function () {
                    mm7.error("Dynamic script loading error (" + this.src + ")");
                    if (typeof self.onerror === "function")
                        onerror(self.contentId,this.src);
                };
                script.onload = function () {
                    self.next(i + 1, callback);
                };
                document.getElementsByTagName("head")[0].appendChild(script);
                mm7.content.contents[ self.contentId ].parts.push({type: "css", element: script});
            } else {
                this.next(i + 1, callback);
            }
        };

        this.loadHtml = function (i, callback) {
            var self = this;
            var obj = mm7.extend(mm7.http.defaults,this.list[i].options);
            obj.responseDataType = "text";
            mm7.http.request(this.updateUrl(this.list[i].url), this.list[i].data, function (response) {                
                self.list[i].element.innerHTML = response;
                mm7.content.contents[self.contentId].parts.push({ type:"html",element:self.list[i].element });
                self.next(i+1,callback);
            },obj);
        };
        
        this.loadJson = function(i,callback) {
            var self = this;
            var obj = mm7.extend(mm7.http.defaults,this.list[i].options);
            obj.responseDataType = "json";
            mm7.http.request(this.updateUrl(this.list[i].url), this.list[i].data, function (response) {                
                mm7.content.contents[ self.contentId ].data[ self.list[i].name ] = response;
                self.next(i+1,callback);
            },obj);
        };

        this.load = function (callback) {
            this.next(0,callback);
            return this.contentId;
        };

    };

    mm7["content"] = {

        defaults: {
            callIdTag: "content",
            sendRandomId:true,
            sendModuleId:true
        },       

        contents: {},

        remove: function (mdl) {
            if (!this.contents.hasOwnProperty(mdl))
                return false;
            var m = this.contents[mdl];
            var head = document.getElementsByTagName('head')[0];
            for (var i = m.parts.length - 1; i > -1; i--) {
                if ( m.parts[i].type === "css" ) {
                    head.removeChild(m.parts[i].element);
                } else if ( m.parts[i].type === "js" ) {
                    head.removeChild(m.parts[i].element);
                } else if ( m.parts[i].type === "html" ) {
                    m.parts[i].element.innerHTML = "";
                }
            }

            delete this.contents[mdl];

            return true;

        },

        clear: function () {
            for (var k in this.contents) {
                this.remove(k);
            }
        },
        
        data:function(mdl) {
            return contents[mdl].data;
        },
        
        exist:function(name) {
            return this.contents.hasOwnProperty(name);
        },
        
        get:function(name) {
            return contents[name];
        },

        "new": function (name) {
            var mid;
            if ( !name ) {
                mid = "mdl" + randomId();
                while (this.contents.hasOwnProperty(mid)) {
                    mid = "mdl" + randomId();
                }
            } else {
                mid = name;
                this.remove(mid);
            }           
            
            this.contents[mid] = {
                data: {},
                parts: []
            };

            var m = new create();
            m.contentId = mid;
            return m;
        }
    };
})(mm7);

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (mm7) {
    mm7["cookie"] = {
        set:function(name,value,millisecond) {
            var expires = "";
            if (millisecond) {
                var date = new Date();
                date.setTime(date.getTime() + (millisecond));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + value + expires + ";";
        },
        
        get:function(name,dontdecode) {
            match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            if (match) return dontdecode ? match[1] : decodeURIComponent(match[1].replace(/\+/g, '%20')); else return null;
        },
        remove:function(name){
            document.cookie = name+'=; Max-Age=0;';
        }
    };
})(mm7);

(function(mm7) {
    
    mm7["paging"] = function(limit) {
        var p = {
            p_start:0,
            p_limit:0,
            p_total:0,
            total:function(value) {
                if (value) this.p_total = value; else return this.p_total;
            },
            limit:function(value) {
                if (value) this.p_limit = value; else return this.p_limit;
            },
            start:function(value) {
                if (value) this.p_start = value; else return this.p_start;
            },
            next:function() {
                this.p_start = this.p_start + this.p_limit;
                if (this.p_start > this.p_total - this.p_limit)
                    this.p_start = this.p_total - this.p_limit;
                return this.p_start;
            },
            previous:function() {
                this.p_start = this.p_start - this.p_limit;
                if (this.p_start < 0) this.p_start = 0;
                return this.p_start;
            },
            first: function() { //public
                this.p_start = 0;
                return this.p_start;
            },
            last: function(name) { //public            
                this.p_start = this.p_total - this.p_limit;
                return this.p_start;
            },
            page: function(num) { //public    
                if (num) {
                    this.p_start = parseInt((num - 1) * this.p_limit);
                    if (this.p_start > this.p_total - this.p_limit)
                        this.p_start = this.p_total - this.p_limit;
                    else if (this.p_start < 0) this.p_start = 0;
                    
                    return this.p_start;
                } else {
                    var pn = parseInt(this.p_start / this.p_limit);
                    if (this.p_start % this.p_limit > 0) pn++;
                    pn++;
                    return pn;
                }                
            },
            count:function() { //public
                var pc = parseInt(this.p_total / this.p_limit);
                if (this.p_total % this.p_limit > 0)
                pc++;
                return pc;
            }
        };
        p.p_limit = 10;
        if (limit) p.p_limit = limit;
        return p;
    };   

})(mm7);

(function(mm7) {
    if (mm7.missing(["document"],true)>-1) return;
    mm7["tab"] = function(list,selected) {
        var control = {
            "list":new Array(),
            "selected":-1,
            show:function(elm) {
                //Can be overide for jQuery or another tools..
                elm.style.display="block";
            },
            hide:function(elm) {
                //Can be overide for jQuery or another tools..
                elm.style.display="none";
            },
            onBeforeSet : null,
            onAfterSet : null,            
            "set":function(sel,selector) {
                if ( mm7.type(this.onBeforeSet)==="function" ) {
                    if ( ! this.onBeforeSet(sel,selector) ) return;
                }
                this.selected = sel;
                for (var i=0; i<this.list.length; i++) {
                    if ( (i===this.selected) || (this.list[i].id === this.selected ) ) {
                        this.show(this.list[i]);
                    } else {
                        this.hide(this.list[i]);                        
                    }                    
                }
                if ( mm7.type(this.onAfterSet)==="function" ) {
                    this.onAfterSet(sel,selector);
                }
                
                
            },
            "add":function(tab) {
                if ( tab.length ) {
                    for (var i=0; i < tab.length; i++) {
                        if ( mm7.document.isDom(tab[i]) ) this.list.push(tab[i]);                        
                    }
                } else {
                    if ( mm7.document.isDom(tab)  ) this.list.push(tab);
                }
            }
        };
        control.add(list);
        if (selected) control.selected = selected;
        control.set(selected);
        return control;
    };
})(mm7);
/*
 * Default settings
 * {        
        fullscreen:false,
        menubar:false,
        status:false,
        titlebar:false,
        toolbar:false,
        top:-1, // -1 means center of document
        left:-1, //-1 means center of document
        width:400,
        height:400,            
        onClosing:null, //parameter type function (event) {...}
        onClosed:null, //parameter type function (event) {...}
        onLoad:null, //parameter type function (event) {...}
        onCallback:null // Callback function will inject into child. From child document callback function can be called like this ( window.colback(...); )
    }
 */

(function (mm7) {
    mm7["window"] = {
        "defaults": {        
            fullscreen:false,
            menubar:false,
            status:false,
            titlebar:false,
            toolbar:false,
            top:-1,
            left:-1,
            width:400,
            height:400,            
            onClosing:null,
            onClosed:null,
            onLoad:null,
            onCallback:null
        },
        
        "open":function(name,url,options) {
            function winSettings(obj) {
                var str = "";
                if ( obj.fullscreen ) str+=",fullscreen=1"; else str+=",fullscreen=0";
                if ( obj.menubar ) str+=",menubar=1"; else str+=",menubar=0";
                if ( obj.status ) str+=",status=1"; else str+=",status=0";
                if ( obj.titlebar ) str+=",titlebar=1"; else str+=",titlebar=0";
                if ( obj.toolbar ) str+=",toolbar=1"; else str+=",toolbar=0";
        
                str+=",width="+obj.width;
                str+=",height="+obj.height;
        
                if ( obj.left === -1 ) {
                    var v = Math.floor( ($( document ).width() - obj.width) / 2 );
                    str+=",left="+v;
                } else {
                    str+=",left="+obj.left;
                }
        
                if ( obj.top === -1 ) {
                    var v = Math.floor( ($( document ).height() - obj.height) / 2 );
                    str+=",top="+v;
                } else {
                    str+=",top="+obj.top;
                }        
                return str.length > 0 ? str.substr(1) : "" ;
            }
            
            function create(name,url,obj) {
                var settings = winSettings(obj);
                var win = window.open(url,name,settings);
                if ( typeof obj.onCallback === "function" ) {
                    win.window["callback"] = obj.onCallback;
                }
        
                win.window.addEventListener("load",function(evt){                
                    if ( typeof obj.onClosing === "function" ) {
                        win.window.addEventListener("beforeunload",obj.onClosing,false);                    
                    }
                    
                    if ( typeof obj.onClosed === "function" ) {
                        win.window.addEventListener("unload",obj.onClosed,false);                    
                    }
                    
                    if ( typeof obj.onLoad === "function" ) {
                        obj.onLoad(evt);
                    }                    
                });
                
                return win;
            }
            mm7.window.list[name] = create(name,url,options);
        },
        "close":function(name) {
            if ( this.list[name] ) {
                this.list[name].window.close();
                delete this.list[name];
            }
        },
        "list":{}
    };
})(mm7);



(function (mm7) {

    if (mm7.missing(["document"], true) > -1)
        return;

    function _roller(holder, obj) {

        var limit = 5;
        var interval = 1000;
        var vector = "+";
        //var holder = null;
        var auto = true;

        var list = new Array();
        var run = false;
        var index = limit;

        function removeAndAdd() {
            if (vector === "+") {
                holder.removeChild(holder.children[0]);
                holder.appendChild(list[index]);
                index++;
                if (index > list.length - 1)
                    index = 0;
            } else if (vector === "-") {
                holder.removeChild(holder.children[ holder.children.length - 1 ]);
                holder.insertBefore(list[index], holder.children[0]);
                index--;
                if (index < 0)
                    index = list.length - 1;
            }
        }

        function acction() {
            removeAndAdd();
            if (run)
                setTimeout(acction, interval);
        }

        this.start = function () {
            if (list.length <= limit)
                return false;
            if (run)
                return false;
            run = true;
            setTimeout(acction, interval);
            return true;
        };

        this.stop = function () {
            run = false;
        };

        this.isRunning = function () {
            return run;
        };

        this.setInterval = function (value) {
            interval = value;
        };

        this.getInterval = function () {
            return interval;
        };

        this.setVector = function (value) {
            vector = value;
        };

        this.getVector = function () {
            return vector;
        };

        function init(obj) {
            if (typeof obj === "object") {
                if (typeof obj["auto"] !== "undefined")
                    auto = obj["auto"];
                if (typeof obj["limit"] !== "undefined") {
                    limit = obj["limit"];
                    index = limit;
                }
                if (typeof obj["interval"] !== "undefined")
                    interval = obj["interval"];
                if (typeof obj["vector"] !== "undefined")
                    vector = obj["vector"];
            }

            for (var i = 0; i < holder.children.length; i++) {
                list.push(holder.children[i]);
            }
            for (i = limit; i < list.length; i++) {
                holder.removeChild(list[i]);
            }
        }
        init(obj);
        if ((auto === true) && (holder !== null))
            this.start();
    }
    mm7["roller"] = function (holder, obj) {
        return new _roller(mm7.document.node(holder), obj);
    };
})(mm7);


