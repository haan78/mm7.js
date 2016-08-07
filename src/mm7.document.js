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
})(mm7);