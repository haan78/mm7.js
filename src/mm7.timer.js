//Dependence
// There is mm7 

/*
 * Methods of Timer
 * var t = mm7.timer.create(func,interval); returns a timer object
 * t.start()  start execution, t.stop() stop execution
 * 
 * Exemple
var t = mm7.timer.create(
        function() {
            if (document.getElementsByTagName("title")[0].innerHTML.length < 10 ) {
                document.getElementsByTagName("title")[0].innerHTML += "*";                                
            } else {
                document.getElementsByTagName("title")[0].innerHTML = "";
            }

        }, 500);

t.start();
 */
(function(mm7){
    mm7["timer"] = {
    list:new Array(),
    create:function(code,interval) { //static public
        var index  = this.list.length;
        this.list[index] = {
            "code":code,
            "index":index,
            "interval":interval,
            "pid":-1,
            "isAlive":false,
            "execute":function(){ //private
                if ( typeof this.code === "function" ) this.code();
                else if (typeof this.code === "string" ) eval(this.code);
                this.pid = setTimeout("mm7.timer.list["+this.index+"].execute()",this.interval);
            },
            "start": function() { //public
                if (!this.isAlive) {
                    this.isAlive = true;
                    this.execute();                    
                }                
            },
            "stop": function() { //public
                if (this.isAlive) {
                    clearTimeout(this.pid);
                    this.pid = -1;
                    this.isAlive = false;
                }
            }
        };
        return this.list[index];        
    },
    
    startAll:function() { //public
        for (var i=0; i<this.list.length; i++) {
            if (!this.list[i].isAlive) this.list[i].start();
        }
    },
    
    stopAll:function() { //public
        for (var i=0; i<this.list.length; i++) {
            if (this.list[i].isAlive) this.list[i].stop();
        }
    },
    
    killAll:function() {
        this.stopAll();
        this.list = new Array();
    }
};
})(mm7);

//var Timer = 


