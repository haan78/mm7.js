/*
 * Methods:
 * mm7.date.toString(date,format) example mm7.date.toString(new Date(1978,10,31),"%d.%M.%Y");
 * mm7.date.toDate(str,format) example mm7.date.toDate("31.10.1978","%d.%M.%Y");
 * 
 * Suported Format:
 * %d day of month 1-31, %dd day of month wiht zero 01-31
 * %M month 1-12, %MM month 01-12
 * %Y Year 4 digists, %yy Year only 2 digits example 12/11/14 (%d/%M/%yy) = 2014-11-12
 * %H hour 0-24, %HH hour 00-24
 * %m minute 0-59, %mm minute 00-59
 * %s second 0-59, %ss second 00-59
 * %ms millisecond 0-999
 * %D Day of Week (Only for toString)
 */

(function(mm7){
    mm7["date"] = {
    //daysOfWeek:["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],
    daysOfWeek:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    //monthsOfYear:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Tenmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
    monthsOfYear:["January","February","March","April","May","June","July","August","September","October","November","December"],
    getDefaultElements: function() {
        var obj = new Object();
        obj["year"] = 0;
        obj["month"] = 0;
        obj["day"] = 0;
        obj["hour"] = 0;
        obj["minute"] = 0;
        obj["second"] = 0;
        obj["millisecond"] = 0;
        obj["dayOfWeek"] = 0;
        return obj;
    },
    getElementsFromDate: function(d) {
        var obj = new Object();
        obj["year"] = d.getFullYear();
        obj["month"] = d.getMonth() + 1;
        //obj["day"] = d.getUTCDate();
        obj["day"] = d.getDate();
        obj["hour"] = d.getHours();
        obj["minute"] = d.getMinutes();
        obj["second"] = d.getSeconds();
        obj["millisecond"] = d.getMilliseconds();
        obj["dayOfWeek"] = d.getDay();
        obj["dayName"] = this.daysOfWeek[d.getDay()];
        obj["monthName"] = this.monthsOfYear[d.getMonth()];
        return obj;
    },
    
    diff:function(d1,d2,interval) { //interval = (second,minute,day,week,mounth,year)
        var result = d2 - d1;
            switch (interval) {
                case "year":
                    var ynew = d2.getFullYear();
                    var mnew = d2.getMonth();
                    var dnew = d2.getDate();
                    var yold = d1.getFullYear();
                    var mold = d1.getMonth();
                    var dold = d1.getDate();
                    var diff = ynew - yold;
                    if (mold > mnew) diff--;
                    else {
                        if (mold == mnew) {
                            if (dold > dnew) diff--;
                        }
                    }
                    return diff;
                case "mounth":
                    var months;
                    months = (d2.getFullYear() - d1.getFullYear()) * 12;
                    months -= d1.getMonth() + 1;
                    months += d2.getMonth();
                    return months <= 0 ? 0 : months;
                    break;
                case "week":
                    return result / (1000 * 60 * 60 * 24 * 7);
                    break;
                case "day":
                    return result / (1000 * 60 * 60 * 24);
                    break;
                case "hour":
                    return result / (1000 * 60 * 60);
                    break;
                case "minute":
                    return result / (1000 * 60);
                    break;
                case "second":
                    return result / (1000);
                    break;
                default:
                    return result; //
                    break;;
            }
        
    },
    isNumberCode: function(code) {
        if ((code > 47) && (code < 58))
            return true;
        else
            return false;
    },
    isParamCode: function(code) {
        if (
                ((code > 47) && (code < 58)) || //0-9
                ((code > 64) && (code < 91)) || // A-Z
                ((code > 96) && (code < 123)) //a-z
                )
            return true;
        else
            return false;
    },
    getNumberValue: function(value) {
        var num = parseInt(value);
        if (isNaN(num))
            num = -1;
        else
            return num;
    },
    getNumberPart: function(str) {
        var s = "";
        for (var i = 0; i < str.length; i++) {
            if (this.isNumberCode(str.charCodeAt(i)))
                s += str.charAt(i);
            else
                return s;
        }
        return s;
    },
    getParamMap: function(format) {
        var map = new Array();
        var s = "";
        var last = 0;
        var flag = false;
        for (var i = 0; i < format.length; i++) {
            if (flag) {
                if (this.isParamCode(format.charCodeAt(i))) {
                    s += format.charAt(i);
                    if (i === format.length - 1) {
                        map.push({param: s, index: last});
                        s = "";
                        break;
                    }
                } else {
                    map.push({param: s, index: last});
                    s = "";
                    flag = false;
                }
            }

            if (format.charAt(i) === "%") {
                flag = true;
                last = i;
            }
        }
        return map;
    },
    daysInMonth:function(date) {
        return new Date(date.getYear(),date.getMonth()+1,0).getDate();
    },
    add:function(date,unit,num) {
        var d = new Date(date);
        if (unit==="day") {
            d.setDate( d.getDate() + num );
        } else if ( unit === "month" ) {
            d.setMonth( d.getMonth() + num );
        } else if ( unit === "year" ) {
            d.setYear( d.getYear() + num );
        } else if ( unit === "hour" ) {            
            d.setHours( d.getHours() + num );
        } else if ( unit === "minute" ) {            
            d.setMinutes( d.getMinutes() + num );
        } else if ( unit === "second" ) {
            d.setSeconds( d.getSeconds() + num );
        }
        return d;
    },
    toDate: function(str, format) {           
        var map = this.getParamMap(format);
        var elements = this.getDefaultElements();
        var j = 0;
        var p = 0;
        for (var i = 0; i < map.length; i++) {
            j = p + map[i].index;
            var v = "";
            if ((map[i].param === "d") || (map[i].param === "dd")) {
                v = this.getNumberPart(str.substr(j, 2));
                elements.day = this.getNumberValue(v);
            } else if ((map[i].param === "M") || (map[i].param === "MM")) {
                v = this.getNumberPart(str.substr(j, 2));
                elements.month = this.getNumberValue(v);
            } else if (map[i].param === "Y") {
                v = this.getNumberPart(str.substr(j, 4));
                elements.year = this.getNumberValue(v);
            } else if (map[i].param === "yy") {
                v = this.getNumberPart(str.substr(j, 2));
                elements.year = this.getNumberValue(v) + 2000;
            } else if ((map[i].param === "H") || (map[i].param === "HH")) {
                v = this.getNumberPart(str.substr(j, 2));
                elements.hour = this.getNumberValue(v);
            } else if ((map[i].param === "m") || (map[i].param === "mm")) {
                v = this.getNumberPart(str.substr(j, 2));
                elements.minute = this.getNumberValue(v);
            } else if ((map[i].param === "s") || (map[i].param === "ss")) {
                v = this.getNumberPart(str.substr(j, 2));
                elements.second = this.getNumberValue(v);
            } else if (map[i].param === "ms") {
                v = this.getNumberPart(str.substr(j, 3));
                elements.millisecond = this.getNumberValue(v);
            }            
            p = p + v.length - (map[i].param.length + 1);            
        }
        return new Date(elements["year"], elements["month"] - 1, elements["day"], elements["hour"], elements["minute"], elements["second"], elements["millisecond"]);
    },
    fillZero: function(num) {
        if (num < 10)
            return "0" + num;
        else
            return "" + num;
    },
    toString: function(date, format) {
        var elements = this.getElementsFromDate(date);
        var map = this.getParamMap(format);
        var str = format;
        for (var i = 0; i < map.length; i++) {
            if (map[i].param === "D") {
                str = str.replace("%D", elements.dayName);
            } else
            if (map[i].param === "Mo") {
                str = str.replace("%Mo",elements.monthName);
            } else
            if (map[i].param === "d")
                str = str.replace("%d", elements.day);
            else
            if (map[i].param === "dd")
                str = str.replace("%dd", this.fillZero(elements.day));
            else
            if (map[i].param === "M")
                str = str.replace("%M", elements.month);
            else
            if (map[i].param === "MM")
                str = str.replace("%MM", this.fillZero(elements.month));
            else
            if (map[i].param === "Y")
                str = str.replace("%Y", elements.year);
            else
            if (map[i].param === "yy")
                str = str.replace("%yy", elements.year % 100);
            else
            if (map[i].param === "H")
                str = str.replace("%H", elements.hour);
            else
            if (map[i].param === "HH")
                str = str.replace("%HH", this.fillZero(elements.hour));
            else
            if (map[i].param === "m")
                str = str.replace("%m", elements.minute);
            else
            if (map[i].param === "mm")
                str = str.replace("%mm", this.fillZero(elements.minute));
            else
            if (map[i].param === "s")
                str = str.replace("%s", elements.second);
            else
            if (map[i].param === "ss")
                str = str.replace("%ss", this.fillZero(elements.second));
            else
            if (map[i].param === "ms")
                str = str.replace("%ms", elements.millisecond);
        }
        return str;
    },
    convert:function(sDate,format1,format2) {
        return mm7.date.toString(mm7.date.toDate(sDate,format1),format2);
    }
};
})(mm7);