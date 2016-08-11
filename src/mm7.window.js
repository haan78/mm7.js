
/*
 * Default settings
 * {        
        fullscreen:false,
        menubar:false,
        status:false,
        titlebar:false,
        toolbar:false,
        top:-1, // -1 means center of document
        left:-1, //-1 means center of document
        width:400,
        height:400,            
        onClosing:null, //parameter type function (event) {...}
        onClosed:null, //parameter type function (event) {...}
        onLoad:null, //parameter type function (event) {...}
        onCallback:null // Callback function will inject to child. From child document callback function can call like this ( window.colback(...); )
    }
 */

(function (mm7) {
    mm7["window"] = {
        "defaults": {        
            fullscreen:false,
            menubar:false,
            status:false,
            titlebar:false,
            toolbar:false,
            top:-1,
            left:-1,
            width:400,
            height:400,            
            onClosing:null,
            onClosed:null,
            onLoad:null,
            onCallback:null
        },
        
        "open":function(name,url,options) {
            function winSettings(obj) {
                var str = "";
                if ( obj.fullscreen ) str+=",fullscreen=1"; else str+=",fullscreen=0";
                if ( obj.menubar ) str+=",menubar=1"; else str+=",menubar=0";
                if ( obj.status ) str+=",status=1"; else str+=",status=0";
                if ( obj.titlebar ) str+=",titlebar=1"; else str+=",titlebar=0";
                if ( obj.toolbar ) str+=",toolbar=1"; else str+=",toolbar=0";
        
                str+=",width="+obj.width;
                str+=",height="+obj.height;
        
                if ( obj.left === -1 ) {
                    var v = Math.floor( ($( document ).width() - obj.width) / 2 );
                    str+=",left="+v;
                } else {
                    str+=",left="+obj.left;
                }
        
                if ( obj.top === -1 ) {
                    var v = Math.floor( ($( document ).height() - obj.height) / 2 );
                    str+=",top="+v;
                } else {
                    str+=",top="+obj.top;
                }        
                return str.length > 0 ? str.substr(1) : "" ;
            }
            
            function create(name,url,obj) {
                var settings = winSettings(obj);
                var win = window.open(url,name,settings);
                if ( typeof obj.onCallback === "function" ) {
                    win.window["callback"] = obj.onCallback;
                }
        
                win.window.addEventListener("load",function(evt){                
                    if ( typeof obj.onClosing === "function" ) {
                        win.window.addEventListener("beforeunload",obj.onClosing,false);                    
                    }
                    
                    if ( typeof obj.onClosed === "function" ) {
                        win.window.addEventListener("unload",obj.onClosed,false);                    
                    }
                    
                    if ( typeof obj.onLoad === "function" ) {
                        obj.onLoad(evt);
                    }                    
                });
                
                return win;
            }
            mm7.window.list[name] = create(name,url,options);
        },
        "close":function(name) {
            if ( this.list[name] ) {
                this.list[name].window.close();
                delete this.list[name];
            }
        },
        "list":{}
    };
})(mm7);


