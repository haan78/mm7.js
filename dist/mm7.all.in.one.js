/* BUILD Per 11.08.2016@ 9-18-59,00  
MM7 Java Script Part */ 
var mm7 = {
    lastError: "",
    logError: true,
    error: function(message, handler) {
        this.lastError = message;
        if (this.logError)
            console.log(this.lastError);
        if (typeof handler === "function")
            handler(this.lastError);
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
            if ( typeof obj2[k] !== "undefined" ) {
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
            typeof data;
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
// "loader" is a Java Scirpt object. Which allows to load CSS and JS libary dynamiclly.
//
// There is no dependence
//
// Methods
// mm7.loader.js(fileName) Adds a JavaSicript libary
// mm7.loader.css(fileName) Adds a CSS file link
// mm7.loader.fnc(fnc) adds a function wich is call after all CSS and JS file load.
// mm7.loader.init() Load all CSS and JS file into document. It also call functions which are added by mm7.loader.fnc method
// mm7.loader.init() must be called after all js, css and function deffinations.
// mm7.loader.register() is register a call of mm7.loader.init() method into window.onLoad event.
// mm7.loader.init() is not necessary when mm7.loader.register() called
// Strongly recomanded mm7.loader.init() method shuld be call end of html document.

(function(mm7) {

    if (mm7["loader"])
        return;

    mm7["loader"] = {
        registered:false,
        cssList: new Array(),
        jsList: new Array(),
        jsIterator: 0, //private


        fncList: new Array(), // private
        fnc: function(fnc) {
            if (typeof fnc === "function") {
                this.fncList.push(fnc);
            }
        },
        findJs: function(file) { //private
            for (var i = 0; i < document.getElementsByTagName("script").length; i++) {
                if (document.getElementsByTagName("script")[i].src === file)
                    return i;
            }
            return -1;
        },
        findCss: function(file) { //private
            for (var i = 0; i < document.getElementsByTagName("link").length; i++) {
                if (document.getElementsByTagName("link")[i].href === file)
                    return i;
            }
            return -1;
        },
        css: function(file) { //public
            this.cssList.push(file);
        },
        js: function(file) { //public
            this.jsList.push(file);
        },
        putCss: function(file) { //private
            if (this.findCss(file) > -1)
                return;
            var link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", file);
            document.getElementsByTagName("head")[0].appendChild(link);
        },
        putJs: function(file) { //private
            if (this.findJs(file) > -1)
                return;
            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", file);
            script.onerror = function() {
                mm7.error("Dynamic script loading error ("+this.src+")");
                if (mm7.loader.isComplete()) {
                    mm7.loader.doComplete();
                } else {
                    mm7.loader.loadNextJs();
                }
            };
            script.onload = function() {
                if (mm7.loader.isComplete()) {
                    mm7.loader.doComplete();
                } else {
                    mm7.loader.loadNextJs();
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        doComplete: function() { //private

            for (var i = 0; i < mm7.loader.fncList.length; i++) {
                mm7.loader.fncList[i](i);
            }
        },
        isComplete: function() { //public
            if (mm7.loader.jsIterator < mm7.loader.jsList.length)
                return false;
            else
                return true;
        },
        loadNextJs: function() { //private
            this.jsIterator++;
            this.putJs(this.jsList[this.jsIterator - 1]);
        },
        init: function() { //public
            for (var i = 0; i < this.cssList.length; i++) {
                this.putCss(this.cssList[i]);
            }
            if (this.jsList.length > 0) this.loadNextJs(); else this.doComplete();
        },
        register:function() {
            if (this.registered) return;
            this.registered = true;
            window.addEventListener("load",function(evt){ mm7.loader.init(); });
        }
    };
    
    //shortcuts
    mm7["js"] = function(file) {
        mm7.loader.js(file);
    };
    mm7["css"] = function(file) {
        mm7.loader.css(file);
    };
    mm7["fnc"] = function(f) {
        mm7.loader.fnc(f);
    };
    mm7["init"] = function() {
        mm7.loader.init();
    }; 
    //Optinal
    mm7.loader.register();
})(mm7);
(function(mm7) {
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
        getParam: function() {
            var vars = {};
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                vars[key] = value.replace(/#/g, '');
            });
            return vars;
        },
        extract:function(url){
            var str = new String(url);
            var vars = {};
            str.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                vars[key] = value.replace(/#/g, '');
            });
            return vars;
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
                        v = "\"\"";
                else
                    v = '"' + obj[k] + '"';
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
})(mm7);(function(mm7) {
    
    if (mm7.missing(["url","json"],true)>-1) return;
    
    mm7["http"] = {
        responseType: "json",
        onBefor: null,
        onAfter: null,
        onError: null,
        request: function(url, obj, callBack) {
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
                requestStr = encodeURI(mm7.url.toQuery(obj));
            }

            if (this.responseType === "json") {
                HTTP.onreadystatechange = function() {

                    if (this.readyState === 4) {
                        var response = mm7.json.toObject(this.responseText);
                        if (response !== null) {
                            if ((typeof callBack === "function") && (response !== null))
                                callBack(response);
                        } else {
                            mm7.error("Response is null",mm7.http.onError);
                        }
                    }
                };
            } else {
                HTTP.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        if (typeof callBack === "function")
                            callBack(this.responseText);
                    }
                };
            }

            try {
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



(function(mm7) {
    
    if (mm7.missing(["document"],true)>-1) return;
    
    mm7["form"] = function(formElement) {
        return {
            form: mm7.node(formElement),
            setSelect: function(select, value) {
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
            isRealFormElement : function(elm) {
            	if ( (elm.type) && ( elm.type.toLowerCase() !== "fieldset" ) && (elm.name!=="") ) {
            		return true;
            	} else {
            		return false;
            	}
            },
            get: function(defaults) {
                var values = {};
                if ((defaults !== null) && (typeof defaults === "object"))
                    values = defaults;

                for (var i = 0; i < this.form.elements.length; i++) {
                    var elm = this.form.elements[i];
                    if ( this.isRealFormElement(elm) ) {
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
            clear:function() {
                this.form.reset();
                for (var i = 0; i < this.form.elements.length; i++) {
                	var elm = this.form.elements[i];
                	if ( this.isRealFormElement(elm) ) {                		
                        var type = elm.type.toLowerCase();
                        var name = elm.name;
                        if (name !== "") {
                            if ( type === "hidden") {
                                elm.value = "";
                            }
                        }
                	}                    
                }
            },
            set: function(values,clear) {
                for (var i = 0; i < this.form.elements.length; i++) {
                    var elm = this.form.elements[i];
                    if ( this.isRealFormElement(elm) ) {
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
                                } else if ( typeof elm.value !== "undefined" ) {
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
                            "neighbor_count":nCount
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
                    "neighbor_count":0
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

(function(mm7){
    mm7["date"] = {
    //daysOfWeek:["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],
    daysOfWeek:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    //monthsOfYear:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Tenmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
    monthsOfYear:["January","February","March","April","May","June","July","August","September","October","November","December"],
    getDefaultElements: function() {
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
    getElementsFromDate: function(d) {
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
    isNumberCode: function(code) {
        if ((code > 47) && (code < 58))
            return true;
        else
            return false;
    },
    isParamCode: function(code) {
        if (
                ((code > 47) && (code < 58)) || //0-9
                ((code > 64) && (code < 91)) || // A-Z
                ((code > 96) && (code < 123)) //a-z
                )
            return true;
        else
            return false;
    },
    getNumberValue: function(value) {
        var num = parseInt(value);
        if (isNaN(num))
            num = -1;
        else
            return num;
    },
    getNumberPart: function(str) {
        var s = "";
        for (var i = 0; i < str.length; i++) {
            if (this.isNumberCode(str.charCodeAt(i)))
                s += str.charAt(i);
            else
                return s;
        }
        return s;
    },
    getParamMap: function(format) {
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
    daysInMonth:function(date) {
        return new Date(date.getYear(),date.getMonth()+1,0).getDate();
    },
    toDate: function(str, format) {           
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
    fillZero: function(num) {
        if (num < 10)
            return "0" + num;
        else
            return "" + num;
    },
    toString: function(date, format) {
        var elements = this.getElementsFromDate(date);
        var map = this.getParamMap(format);
        var str = format;
        for (var i = 0; i < map.length; i++) {
            if (map[i].param === "D") {
                str = str.replace("%D", elements.dayName);
            } else
            if (map[i].param === "Mo") {
                str = str.replace("%Mo",elements.monthName);
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
    convert:function(sDate,format1,format2) {
        return mm7.date.toString(mm7.date.toDate(sDate,format1),format2);
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
})(mm7);
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


})(mm7);(function(mm7) {
    mm7["browser"] = {
        isOpera : function() {
            // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
            return isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        },
        isFirefox: function() {
            return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
        },
        isSafari: function() {
            // At least Safari 3+: "[object HTMLElementConstructor]"
            return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        },
        isChrome: function() {
            return !!window.chrome && !isOpera;
        },
        isIE : function() {
            return false || !!document.documentMode; // At least IE6
        }    
    };
})(mm7);(function(mm7) {
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


(function (mm7) {
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
        onCallback:null // Callback function will inject to child. From child document callback function can be called like this ( window.colback(...); )
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


