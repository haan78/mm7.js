/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (mm7) {
    mm7["cookie"] = {
        set:function(name,value,millisecond) {
            var expires = "";
            if (millisecond) {
                var date = new Date();
                date.setTime(date.getTime() + (millisecond));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + value + expires + ";";
        },
        
        get:function(name,dontdecode) {
            match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            if (match) return dontdecode ? match[1] : decodeURIComponent(match[1].replace(/\+/g, '%20')); else return null;
        },
        remove:function(name){
            document.cookie = name+'=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    };
})(mm7);

