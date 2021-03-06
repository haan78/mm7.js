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

