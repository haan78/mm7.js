(function(mm7) {
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

