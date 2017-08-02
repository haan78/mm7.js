
(function (mm7) {
    if (mm7.missing(["http","document","array"],true)>-1) return;
    
    
    var session = function(holder) {
        this.list = [];
        this._holder = holder;
        this.requestData = null;
        this.requestDataType = mm7.dhtml.defaults.requestDataType;
        this.cbInfo = null;
        
        var randomId = function(){
            return Math.floor(Math.random()*80000);
        };
        
        this.clear = function(){
            this.list = [];
        };
        
        var findJs = function(src) { //private
            for (var i = 0; i < document.getElementsByTagName("script").length; i++) {
                if (document.getElementsByTagName("script")[i].src.indexOf(src) > -1 )
                    return i;
            }
            return -1;
        };
        
        this.js = function(src) {
            if (mm7.array.indexOf(this.list,src)<0) {
                this.list.push(src);
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
            if  (findJs( self.list[i] ) < 0 ) {
                var script = document.createElement('script');
                script.setAttribute("type", "text/javascript");                
                script.setAttribute("src", mm7.url.add(self.list[i], mm7.dhtml.defaults.callIdTag+"="+randomId())  );
                script.setAttribute("data-list-length",self.list.length);
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
            } else {
                if ( i === self.list.length-1  ) {
                    if ( typeof callback === "function" ) callback(self.cbInfo)
                } else {                    
                    this.loadJs(i+1,callback);
                }
            }         
            
        };
        
        this.load = function(url,callback) {
            var self = this;
            this.cbInfo = {
                "type":"success",
                "nodeId":this._holder.id,
                "url":url,
                "jsList":this.list,
                "lastJsListIndex":-1,
                "message":""
            };
            
            
            mm7.http.request(url,this.requestData,function(response){
                self._holder.innerHTML = response;
                if (self.list.length > 0) {
                    self.loadJs(0,callback);
                } else {
                    if ( typeof callback ==="function" ) callback(cbInfo);
                }
                self.clear();
            },{ responseDataType:"text",requestDataType:this.requestDataType });
            
        };
        
    };
    
    mm7["dhtml"] = {
        
        defaults:{
            requestDataType:"json",
            callIdTag:"scriptId"
        },
        
        element:function(elm){
            var holder = mm7.node(elm);
            return new session(holder);
        }
    };
})(mm7);

