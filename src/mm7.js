var mm7 = {
    lastError: "",
    logError: true,
    error: function(message, handler) {
        this.lastError = message;
        if (this.logError)
            console.log(this.lastError);
        if (typeof handler === "function")
            handler(this.lastError);
    },
    missing: function(modules, doError) { //dependency
        for (var i = 0; i < modules.length; i++) {
            if ((typeof this[modules[i]] === "undefined") || (this[modules[i]] === null)) {
                if (doError)
                    this.error("mm7." + modules[i] + " module is required");
                return i;
            }
        }
        return -1;
    },
    type: function(data) {
        if (data === null)
            return "null";
        else
        if (data instanceof Date) {
            return "date";
        } else
        if (data instanceof Array) {
            return "array";
        } else
        if ( (typeof HTMLElement === "object") && (data instanceof HTMLElement ) ) {
            return "element";
        } else
        if ( (typeof Node === "object") && (data instanceof Node ) ) {
            return "node";
        } else
        if ( typeof data === "function" ) {
            return "function";
        }
        if (data instanceof Object) {
                return "object";
        } else
            typeof data;
    },
    count:function(obj) {
        if ( this.type(obj)==="array" ) return obj.length;
        else if (this.type(obj)==="object") {
            if ( typeof obj.keys !== "undefined" ) return obj.keys.length;
            else {
                var c =0;
                for (var k in obj) c++;
                return c;
            }
        } else {
            return -1;
        }
    }
};
