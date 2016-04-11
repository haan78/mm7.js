(function(mm7) {
    mm7["navigator"] = {
        inertval: 5000,
        highAccuracy: true,
        timeout: 20000,
        doOnceMore: true,
        onError: null,
        getLoaction: function(func) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(p) {
                    var lat = p.coords.latitude;
                    var lng = p.coords.longitude;
                    if (typeof func === "function")
                        func(lat, lng);
                    if (mm7.navigator.doOnceMore)
                        setTimeout(mm7.navigator.getLoaction(func), mm7.navigator.inertval);
                },
                        function(error) {
                            mm7.error(error.message, mm7.navigator.onError);
                            if (mm7.navigator.doOnceMore)
                                setTimeout(mm7.navigator.getLoaction(func), mm7.navigator.inertval);
                        },
                        {
                            timeout: this.timeout,
                            enableHighAccuracy: this.highAccuracy
                        });
            } else {
                mm7.error("Browser dose not support geo location", mm7.navigator.onError);
            }
        },
        start: function(func) {
            this.doOnceMore = true;
            this.getLoaction(func);
        },
        stop: function() {
            this.doOnceMore = false;
        }
    };
})(mm7);