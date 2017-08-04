
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
        this.moduleId = "";
        
        this.updateUrl = function(url) {
            if (mm7.dmodule.defaults.sendModuleId) {
                var str = mm7.dmodule.defaults.callIdTag +"="+this.moduleId;
                if ( mm7.dmodule.defaults.sendRandomId ) {
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
                if (typeof callback)
                    callback(this.moduleId);
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
                mm7.dmodule.modules[ this.moduleId ].parts.push({type: "css", element: link});                
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
                        onerror(self.moduleId,this.src);
                };
                script.onload = function () {
                    self.next(i + 1, callback);
                };
                document.getElementsByTagName("head")[0].appendChild(script);
                mm7.dmodule.modules[ self.moduleId ].parts.push({type: "css", element: script});
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
                mm7.dmodule.modules[self.moduleId].parts.push({ type:"html",element:self.list[i].element });
                self.next(i+1,callback);
            },obj);
        };
        
        this.loadJson = function(i,callback) {
            var self = this;
            var obj = mm7.extend(mm7.http.defaults,this.list[i].options);
            obj.responseDataType = "json";
            mm7.http.request(this.updateUrl(this.list[i].url), this.list[i].data, function (response) {                
                mm7.dmodule.modules[ self.moduleId ].data[ self.list[i].name ] = response;
                self.next(i+1,callback);
            },obj);
        };

        this.load = function (callback) {
            this.next(0,callback);
            return this.moduleId;
        };

    };

    mm7["dmodule"] = {

        defaults: {
            callIdTag: "dmodule",
            sendRandomId:true,
            sendModuleId:true
        },       

        modules: {},

        remove: function (mdl) {
            if (!this.modules.hasOwnProperty(mdl))
                return false;
            var m = this.modules[mdl];
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

            delete this.modules[mdl];

            return true;

        },

        clear: function () {
            for (var k in this.modules) {
                this.remove(k);
            }
        },
        
        data:function(mdl) {
            return modules[mdl].data;
        },
        
        exist:function(name) {
            return this.modules.hasOwnProperty(name);
        },
        
        module:function(name) {
            return modules[name];
        },

        "new": function (name) {
            var mid;
            if ( !name ) {
                mid = "mdl" + randomId();
                while (this.modules.hasOwnProperty(mid)) {
                    mid = "mdl" + randomId();
                }
            } else {
                mid = name;
                this.remove(mid);
            }           
            
            this.modules[mid] = {
                data: {},
                parts: []
            };

            var m = new create();
            m.moduleId = mid;
            return m;
        }
    };
})(mm7);

