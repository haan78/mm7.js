(function(mm7) {
    
    mm7["paging"] = function(limit) {
        var p = {
            p_start:0,
            p_limit:0,
            p_total:0,
            total:function(value) {
                if (value) this.p_total = value; else return this.p_total;
            },
            limit:function(value) {
                if (value) this.p_limit = value; else return this.p_limit;
            },
            start:function(value) {
                if (value) this.p_start = value; else return this.p_start;
            },
            next:function() {
                this.p_start = this.p_start + this.p_limit;
                if (this.p_start > this.p_total - this.p_limit)
                    this.p_start = this.p_total - this.p_limit;
                return this.p_start;
            },
            previous:function() {
                this.p_start = this.p_start - this.p_limit;
                if (this.p_start < 0) this.p_start = 0;
                return this.p_start;
            },
            first: function() { //public
                this.p_start = 0;
                return this.p_start;
            },
            last: function(name) { //public            
                this.p_start = this.p_total - this.p_limit;
                return this.p_start;
            },
            page: function(num) { //public    
                if (num) {
                    this.p_start = parseInt((num - 1) * this.p_limit);
                    if (this.p_start > this.p_total - this.p_limit)
                        this.p_start = this.p_total - this.p_limit;
                    else if (this.p_start < 0) this.p_start = 0;
                    
                    return this.p_start;
                } else {
                    var pn = parseInt(this.p_start / this.p_limit);
                    if (this.p_start % this.p_limit > 0) pn++;
                    pn++;
                    return pn;
                }                
            },
            count:function() { //public
                var pc = parseInt(this.p_total / this.p_limit);
                if (this.p_total % this.p_limit > 0)
                pc++;
                return pc;
            }
        };
        p.p_limit = 10;
        if (limit) p.p_limit = limit;
        return p;
    };   

})(mm7);

