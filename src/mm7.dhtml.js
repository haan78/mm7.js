
(function (mm7) {
    if (mm7.missing(["http","document","array"],true)>-1) return;
    
    
    var session = function(holder) {
        this.list = [];
        this._holder = holder;
        
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
        
        this.loadJs = function(i,callback) {
            var self = this;
            if  (findJs( this.list[i] ) >-1) {
                if ( i === this.list.length-1  ) {
                    if ( typeof callback === "function" ) callback(true,this.list[i],i);
                } else {
                    this.loadJs(i+1,callback);
                }
            }
            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            var src = mm7.url.add(this.list[i],"scriptId="+randomId());
            script.setAttribute("src", src  );
            script.onerror = function() {
                mm7.error("Dynamic script loading error ("+this.src+")");
                if ( typeof callback === "function" ) callback(false,this.src,i);
            };
            script.onload = function() {
                if ( i === self.list.length-1  ) {
                    if ( typeof callback === "function" ) callback(true,self.list[i],i);
                } else {
                    self.loadJs(i+1,callback);
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        };
        
        this.load = function(url,callback) {
            var self = this;
            
            mm7.http.request(url,null,function(response){
                self._holder.innerHTML = response;
                if (self.list.length > 0) self.loadJs(0,callback);
                self.clear();
            },{ responseDataType:"text" });            
            
        };
        
    };
    
    mm7["dhtml"] = {
        
        element:function(elm){
            var holder = mm7.node(elm);
            return new session(holder);
        }
    };
})(mm7);

