(function(mm7) {
    mm7["object"] = function(data) {
        return {
            "data": data,
            doEach: function(prm, handle) {
                if (this.canLoop(prm.data)) {
                    var i = 0;
                    handle(prm);
                    var nCount = mm7.count(prm.data);
                    for (var k in prm.data) {
                        var p = {
                            "data": prm.data[k],
                            "type": mm7.type(prm.data[k]),
                            "key": k,
                            "level": prm.level + 1,
                            "index": i,
                            "neighbor_count":nCount
                        };
                        this.doEach(p, handle);
                        i++;
                    }
                } else {
                    handle(prm);
                }
            },
            each: function(handle) {
                var prm = {
                    "data": this.data,
                    "type": mm7.type(data),
                    "key": "",
                    "level": 0,
                    "index": -1,
                    "neighbor_count":0
                };
                this.doEach(prm, handle);
            },
            canLoop: function(data) {
                var t = mm7.type(data);
                if ((t === "object") || (t === "array"))
                    return true;
                else
                    return false;
            },
            doClone: function(obj) {                
                
                // Handle the 3 simple types, and null or undefined
                if (obj === null || typeof obj !== "object")
                    return obj;

                // Handle Date
                if (obj instanceof Date) {
                    var copy = new Date();
                    copy.setTime(obj.getTime());
                    return copy;
                }

                // Handle Array
                if (obj instanceof Array) {
                    var copy = [];
                    var len = obj.length;
                    for (var i = 0; i < len; ++i) {
                        copy[i] = this.clone(obj[i]);
                    }
                    return copy;
                }

                // Handle Object
                if (obj instanceof Object) {
                    var copy = {};
                    for (var attr in obj) {
                        if (obj.hasOwnProperty(attr))
                            copy[attr] = this.clone(obj[attr]);
                    }
                    return copy;
                }
                this.error("Unable to copy obj! Its type isn't supported.");
            },
            clone:function() {
                this.doClone(this.data);
            }            
        };
    };

})(mm7);