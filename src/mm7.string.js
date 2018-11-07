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
            if ( !this.isFloat(n) ) return "";
            c = isNaN(c = Math.abs(c)) ? 2 : c;
            d = d === undefined ? "." : d;
            t = t === undefined ? "," : t; 
            var s = n < 0 ? "-" : "";
            var i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
            var j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }
    };
})(mm7);