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

