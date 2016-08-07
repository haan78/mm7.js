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
})(mm7);