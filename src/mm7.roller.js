
(function (mm7) {

    if (mm7.missing(["document"], true) > -1)
        return;

    function _roller(holder, obj) {

        var limit = 5;
        var interval = 1000;
        var vector = "+";
        //var holder = null;
        var auto = true;

        var list = new Array();
        var run = false;
        var index = limit;

        function removeAndAdd() {
            if (vector === "+") {
                holder.removeChild(holder.children[0]);
                holder.appendChild(list[index]);
                index++;
                if (index > list.length - 1)
                    index = 0;
            } else if (vector === "-") {
                holder.removeChild(holder.children[ holder.children.length - 1 ]);
                holder.insertBefore(list[index], holder.children[0]);
                index--;
                if (index < 0)
                    index = list.length - 1;
            }
        }

        function acction() {
            removeAndAdd();
            if (run)
                setTimeout(acction, interval);
        }

        this.start = function () {
            if (list.length <= limit)
                return false;
            if (run)
                return false;
            run = true;
            setTimeout(acction, interval);
            return true;
        };

        this.stop = function () {
            run = false;
        };

        this.isRunning = function () {
            return run;
        };

        this.setInterval = function (value) {
            interval = value;
        };

        this.getInterval = function () {
            return interval;
        };

        this.setVector = function (value) {
            vector = value;
        };

        this.getVector = function () {
            return vector;
        };

        function init(obj) {
            if (typeof obj === "object") {
                if (typeof obj["auto"] !== "undefined")
                    auto = obj["auto"];
                if (typeof obj["limit"] !== "undefined") {
                    limit = obj["limit"];
                    index = limit;
                }
                if (typeof obj["interval"] !== "undefined")
                    interval = obj["interval"];
                if (typeof obj["vector"] !== "undefined")
                    vector = obj["vector"];
            }

            for (var i = 0; i < holder.children.length; i++) {
                list.push(holder.children[i]);
            }
            for (i = limit; i < list.length; i++) {
                holder.removeChild(list[i]);
            }
        }
        init(obj);
        if ((auto === true) && (holder !== null))
            this.start();
    }
    mm7["roller"] = function (holder, obj) {
        return new _roller(mm7.document.node(holder), obj);
    };
})(mm7);


