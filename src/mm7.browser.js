(function(mm7) {
    mm7["browser"] = {
        isOpera : function() {
            // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
            return isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        },
        isFirefox: function() {
            return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
        },
        isSafari: function() {
            // At least Safari 3+: "[object HTMLElementConstructor]"
            return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        },
        isChrome: function() {
            return !!window.chrome && !this.isOpera();
        },
        isIE : function() {
            return false || !!document.documentMode; // At least IE6
        }    
    };
})(mm7);