var FILE = require('fs'); //dependency

var renderEngine = function (template, data) {

    this.data = null;
    this.content = null;
    this.types = {};
    this.errors = [];
    this.logErrors = true;
    this.fileEncoding = "utf8";

    this.init = function (template, data) {
        this.setContent(template);
        this.setData(data);
    };

    this.setContent = function (con) {
        this.content = new String(con);
    };

    this.setData = function (data) {
        this.data = data;
    };

    this.setType = function (type, fnc) {
        this.types[type] = fnc;
    };

    this.removeType = function (type) {
        if (typeof this.types[type] !== "undefined") {
            delete this.types[type];
            return true;
        } else {
            return false;
        }
    };

    this.addError = function (param, err) {
        this.errors.push({"param": "param", "text": err});
        if (this.logErrors) {
            console.error("Param: " + param + " " + err);
        }
    };

    this.getParams = function (content) {
        var list = new Array();
        //var ex = new RegExp('[\$]([a-zA-Z0-9_\.\|\/]+)[\$]', 'g');        
        var ex = RegExp("[\$][a-zA-Z_]([a-zA-Z0-9_\.\|]+)[a-zA-Z0-9_][\$]|[\$]([a-zA-Z0-9_]+)[\$]|[\$][\/][a-zA-Z0-9_]([a-zA-Z0-9_\.\/]+)[a-zA-Z0-9_][\$]","g");
        var l = content.match(ex);
        if (l !== null) {
            for (var i = 0; i < l.length; i++) {
                var both = l[i].replace(/\$/g, "").split("|");
                if ((typeof both[1] === "undefined") || (both[1] === "") || (both[1] === null) || (both[1] === false)) {
                    list.push({"type": "", "key": both[0], "code": l[i]});
                } else {
                    list.push({"type": both[0], "key": both[1], "code": l[i]});
                }
            }
        }
        return list;
    };

    this.buid = function (content) {
        var res = content ? content : this.content;
        var params = this.getParams(res);
        var d = this.data;
        if ( params.length > 0 ) {
            for (var i = 0; i < params.length; i++) {
                var ex = RegExp(params[i].code.replace(/\$/g, "\\$"), "g");
                var key = params[i]["key"];
                
                if ( key.indexOf("/") === 0 ) { //include file defination                    
                    var filetext = _readFile(__dirname+key,this.fileEncoding);
                    if (!_lastFileError) {
                        filetext = this.buid(filetext);
                        res = res.replace(ex,filetext);
                    } else {
                        this.addError(params[i].code,_lastFileError);
                    }
                } else { // include variable defination.
                    var v = _value(d,key );
                    if (!_lastValueError) {                   
                        if (params[i].type === "") {
                            res = res.replace(ex, v);
                        } else if (typeof this.types[params[i].type] === "function") {
                            res = res.replace(ex, this.types[params[i].type](v, params[i]["key"]));
                        } else {
                            this.addError(params[i].code, "Unknown Variable Type");
                        }
                    } else {
                        this.addError(params[i].code, _lastValueError);
                    }
                }                
            }
        }
        return res.toString();
    };

    this.init(template, data);
    
    var _lastFileError;
    var _lastValueError;
    function _readFile(file,enc) {
        _lastFileError = false;
        if (FILE.existsSync(file)) {
            try {
                return FILE.readFileSync(file,enc);            
            } catch (e) {
                _lastFileError = e.toString();
                return false;
            }         
        } else {
            _lastFileError = "File not exist";
            return false;
        }       
    }

    function _value(data, key) {
        _lastValueError = false;
        var skey = new String(key);
        var v = data;
        var l = skey.split(".");
        for (var i = 0; i < l.length; i++) {
            if (v === null) {                
                if (i>l.length-2) {
                    //Last element of key string can be null;
                    break;
                } else {
                    _lastValueError = "Null value can not have property";
                    return false;
                }
            } else if (typeof v[l[i]] !== "undefined") {
                v = v[l[i]];
            } else if (l[i] === "_len") {
                if (Array.isArray(v)) {
                    v = v.length;
                } else if (typeof v === "object") {
                    v = Object.keys(v).length;
                } else if (typeof v === "string") {
                    v = v.length;
                } else {
                    _lastValueError = "Value is not a array nor object";
                    return false;
                }
            } else if (l[i] === "_keys") {
                if ( typeof v === "object" ) {
                    v = Object.keys(v);
                } else {
                    _lastValueError = "Value is not a object";
                    return false;
                }
            } else if (l[i] === "_type") {
                if (Array.isArray(v)) {
                    v = "array";
                } else {
                    v = typeof v;
                }
            } else {
                _lastValueError = "Value is undefined";
                return false;
            }
        }
        if ((v !== null) && (typeof v === "object")) {
            return JSON.stringify(v);
        } if (typeof v === "function") {
            return v.toString();
        } else {
            return v;
        }
    }
};

var create_express_engine = function(options) {
    var encoding = "utf8";
    var types = {};
    var logErrors = true;    
    if ( (typeof options ==="object") && (options!==null) ) {
        if (typeof options["encoding"] === "string") encoding = options["encoding"];
        if ( (typeof options["types"] === "object") && (options["types"] !== null ) ) types = options["types"];
        if (options["logErrors"]===false) logErrors = false;        
    }
    return function(filePath, options, callback) {
        FILE.readFile(filePath,encoding,function(err,filedata){
            if (!err) {
                if ((options !== null) && (typeof options === "object") && ( Object.keys(options).length > 0 )) {
                    var re = new renderEngine(filedata,options);
                    re.fileEncoding = encoding;
                    re.types = types;
                    re.logErrors = logErrors;
                    callback(null,re.buid());
                } else {                                
                    callback(null,filedata);
                }            
            } else {
                callback(null,"File can not read by mm7Render");
                console.error(err);
            }        
        });
    };
};
exports.create_express_engine = create_express_engine;