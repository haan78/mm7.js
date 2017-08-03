
(function (mm7) {
    if (mm7.missing(["http","document","array"],true)>-1) return;
    
    
    var session = function(holder) {
        this.listJs = [];
        this.listCss = [];
        this._holder = holder;
        
        this.requestData = null;
        this.requestDataType = mm7.dhtml.defaults.requestDataType;
        this.cbInfo = null;
        
        var lastLoadIndex = "";
        
        var randomId = function(){
            return Math.floor(Math.random()*80000);
        };
        
        this.clear = function(){
            this.listJs = [];
            this.listCss = [];
        };
        
        var findJs = function(src) { //private
            for (var i = 0; i < document.getElementsByTagName("script").length; i++) {
                if (document.getElementsByTagName("script")[i].src.indexOf(src) > -1 )
                    return i;
            }
            return -1;
        };
        
        var findCss = function(src) { //private
            for (var i = 0; i < document.getElementsByTagName("link").length; i++) {
                if (document.getElementsByTagName("link")[i].href.indexOf(src)>-1 )
                    return i;
            }
            return -1;
        };
        
        this.js = function(src) {
            if (mm7.array.indexOf(this.listJs,src)<0) {
                this.listJs.push(src);
            }
            return this;
        };    
        
        this.css = function(src) {
            if (mm7.array.indexOf(this.listJs,src)<0) {
                this.listCss.push(src);
            }
            return this;
        };
        
        
        this.data = function(data) {
            this.requestData = data;            
            return this;
        };               
        
        this.loadJs = function(i,callback) {
            var self = this;
            self.cbInfo.lastJsListIndex = i;
            if  (findJs( self.listJs[i] ) < 0 ) {
                var script = document.createElement('script');
                script.setAttribute("type", "text/javascript");  
                var url = mm7.url.add(self.listJs[i], mm7.dhtml.defaults.callIdTag+"="+randomId());
                script.setAttribute("src", url  );
                //script.setAttribute("data-list-length",self.listJs.length);
                script.onerror = function() {
                    mm7.error("Dynamic script loading error ("+this.src+")");
                    self.cbInfo.type = "error";
                    if ( typeof callback === "function" ) callback(self.cbInfo);
                };
                script.onload = function() {
                    if ( i === self.cbInfo.jsList.length-1  ) {
                        if ( typeof callback === "function" ) callback(self.cbInfo);
                    } else {                                                                        
                        self.loadJs(i+1,callback);
                    }
                };
                document.getElementsByTagName("head")[0].appendChild(script);
                mm7.dhtml.list[ lastLoadIndex ].scripts.push(script);
            } else {
                if ( i === self.listJs.length-1  ) {
                    if ( typeof callback === "function" ) callback(self.cbInfo)
                } else {                    
                    this.loadJs(i+1,callback);
                }
            }         
            
        };
        
        this.load = function(url,callback) {
            var self = this;
            
            lastLoadIndex = "mdl"+randomId();
            while ( mm7.dhtml.list.hasOwnProperty(lastLoadIndex) ) {
                lastLoadIndex = "mdl"+randomId();
            }           
            
            mm7.dhtml.list[lastLoadIndex] = {
                scripts:[],
                links:[],
                element:this._holder
            };
            
            this.cbInfo = {
                "type":"success",
                "nodeId":this._holder.id,
                "url":url,
                "jsList":this.listJs,
                "cssList":this.listCss,
                "lastJsListIndex":-1,
                "loadIndex":lastLoadIndex,
                "message":""
            };
            
            //Loading css files
            for (var i=0; i<this.listCss.length; i++) {
                if ( findCss( this.listCss[i]  ) < 0 ) {
                    var link = document.createElement("link");
                    link.setAttribute("rel", "stylesheet");
                    link.setAttribute("type", "text/css");       
                    link.setAttribute("href", this.listCss[i]);
                    document.getElementsByTagName("head")[0].appendChild(link);
                    mm7.dhtml.list[ lastLoadIndex ].links.push(link);
                }            
            }
            
            mm7.http.request(url,this.requestData,function(response){
                self._holder.innerHTML = response;
                if (self.listJs.length > 0) {
                    self.loadJs(0,callback);
                } else {
                    if ( typeof callback ==="function" ) callback(cbInfo);
                }
                self.clear();
            },{ responseDataType:"text",requestDataType:this.requestDataType });
            
            return lastLoadIndex;
            
        };
        
    };
    
    mm7["dhtml"] = {
        
        defaults:{
            requestDataType:"json",
            callIdTag:"scriptId"
        },
        
        list:{},        
        
        remove:function(mdl){
            if (!this.list.hasOwnProperty(mdl)) return false;
            var m = this.list[mdl];
            var head = document.getElementsByTagName('head')[0]
            for ( var i=m.scripts.length-1; i> -1; i-- ) {
                head.removeChild(m.scripts[i]);
            }
            
            for ( var i=m.links.length-1; i> -1; i-- ) {
                head.removeChild(m.links[i]);
            }
            
            m.element.innerHTML = "";
            
            delete this.list[mdl];
            
            return true;
            
        },
        
        
        clear:function() {
            for (var k in this.list) {
                this.remove(k);
            }
        },
        
        element:function(elm){
            var holder = mm7.node(elm);
            return new session(holder);
        }
    };
})(mm7);

