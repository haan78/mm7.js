(function (mm7) {
    mm7["browser"] = {
        get: function (  ) {
            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return {name: 'IE', version: (tem[1] || '')};
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/)
                if (tem != null) {
                    return {name: 'Opera', version: tem[1]};
                }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
            }
            return {
                name: M[0],
                version: M[1]
            };
        },
        isOpera: function () {
            // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
            return isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        },
        isFirefox: function () {
            return typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
        },
        isSafari: function () {
            // At least Safari 3+: "[object HTMLElementConstructor]"
            return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        },
        isChrome: function () {
            return !!window.chrome && !this.isOpera();
        },
        isIE: function () {
            return false || !!document.documentMode; // At least IE6
        }
    };
})(mm7);