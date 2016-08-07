// "loader" is a Java Scirpt object. Which allows to load CSS and JS libary dynamiclly.
//
// There is no dependence
//
// Methods
// mm7.loader.js(fileName) Adds a JavaSicript libary
// mm7.loader.css(fileName) Adds a CSS file link
// mm7.loader.fnc(fnc) adds a function wich is call after all CSS and JS file load.
// mm7.loader.init() Load all CSS and JS file into document. It also call functions which are added by mm7.loader.fnc method
// mm7.loader.init() must be called after all js, css and function deffinations.
// mm7.loader.register() is register a call of mm7.loader.init() method into window.onLoad event.
// mm7.loader.init() is not necessary when mm7.loader.register() called
// Strongly recomanded mm7.loader.init() method shuld be call end of html document.

(function(mm7) {

    if (mm7["loader"])
        return;

    mm7["loader"] = {
        registered:false,
        cssList: new Array(),
        jsList: new Array(),
        jsIterator: 0, //private


        fncList: new Array(), // private
        fnc: function(fnc) {
            if (typeof fnc === "function") {
                this.fncList.push(fnc);
            }
        },
        findJs: function(file) { //private
            for (var i = 0; i < document.getElementsByTagName("script").length; i++) {
                if (document.getElementsByTagName("script")[i].src === file)
                    return i;
            }
            return -1;
        },
        findCss: function(file) { //private
            for (var i = 0; i < document.getElementsByTagName("link").length; i++) {
                if (document.getElementsByTagName("link")[i].href === file)
                    return i;
            }
            return -1;
        },
        css: function(file) { //public
            this.cssList.push(file);
        },
        js: function(file) { //public
            this.jsList.push(file);
        },
        putCss: function(file) { //private
            if (this.findCss(file) > -1)
                return;
            var link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", file);
            document.getElementsByTagName("head")[0].appendChild(link);
        },
        putJs: function(file) { //private
            if (this.findJs(file) > -1)
                return;
            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", file);
            script.onerror = function() {
                mm7.error("Dynamic script loading error ("+this.src+")");
                if (mm7.loader.isComplete()) {
                    mm7.loader.doComplete();
                } else {
                    mm7.loader.loadNextJs();
                }
            };
            script.onload = function() {
                if (mm7.loader.isComplete()) {
                    mm7.loader.doComplete();
                } else {
                    mm7.loader.loadNextJs();
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        doComplete: function() { //private

            for (var i = 0; i < mm7.loader.fncList.length; i++) {
                mm7.loader.fncList[i](i);
            }
        },
        isComplete: function() { //public
            if (mm7.loader.jsIterator < mm7.loader.jsList.length)
                return false;
            else
                return true;
        },
        loadNextJs: function() { //private
            this.jsIterator++;
            this.putJs(this.jsList[this.jsIterator - 1]);
        },
        init: function() { //public
            for (var i = 0; i < this.cssList.length; i++) {
                this.putCss(this.cssList[i]);
            }
            if (this.jsList.length > 0) this.loadNextJs(); else this.doComplete();
        },
        register:function() {
            if (this.registered) return;
            this.registered = true;
            window.addEventListener("load",function(evt){ mm7.loader.init(); });
        }
    };
    
    //shortcuts
    mm7["js"] = function(file) {
        mm7.loader.js(file);
    };
    mm7["css"] = function(file) {
        mm7.loader.css(file);
    };
    mm7["fnc"] = function(f) {
        mm7.loader.fnc(f);
    };
    mm7["init"] = function() {
        mm7.loader.init();
    }; 
    //Optinal
    mm7.loader.register();
})(mm7);
