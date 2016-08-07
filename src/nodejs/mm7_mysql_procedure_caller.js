/* global OkPacket, RowDataPacket */

var mysql = require('mysql'); //dependency

var caller = function (connectionSettings) {
    this._params = [];
    this._connectionSettings = {};
    this._lastSQL = "";

    this.procedure = function (name, clear) {
        this._name = name;
        if (clear) {
            this._paramIndex = 0;
            this._params = [];
        }
        return this;
    };

    this.prc = function (name, clear) { //alias of this.procedure
        return this.procedure(name, clear);
    };

    this["in"] = function (value, emptyIsNull) {
        if (typeof value === "undefined") {
            return this._parameter(null);
        } else if ((value === "") && (emptyIsNull)) {
            return this._parameter(null);
        } else {
            return this._parameter(value);
        }
    };

    this.out = function (name, value,emptyIsNull) {
        var rx = /[a-zA-Z_]([a-zA-Z0-9_]+)/;
        if (( typeof name !== "string" ) || (!rx.test(name)) ) {
            throw "Output parameter must have a valid variable name";
        }
        
        if (typeof value === "undefined") {
            return this._parameter(null,name);
        } else if ((value === "") && (emptyIsNull)) {
            return this._parameter(null,name);
        } else {
            return this._parameter(value,name);
        }        
    };

    this._parameter = function (value, name) {
        var p = new Object();
        p["value"] = value;
        if (typeof name === "undefined") {
            //IN paramtere
            p["name"] = "p" + this.prmCount();
            p["isOut"] = false;
        } else {
            //OUT paramtere
            p["name"] = name;
            p["isOut"] = true;
        }
        this._params.push(p);
        return this;
    };

    this.prmCount = function () {
        return this._params.length;
    };

    this.asVal = function (v) {
        var t = typeof v;
        if ((v === null) || (typeof v === "undefined")) {
            return "null";
        } else if (t === "string") {
            return "'" + String(v).replace(/\'/g, "`") + "'";
        } else if (t === "number") {
            return String(v);
        } else if (t === "boolean") {
            return v ? "TRUE" : "FALSE";
        } else {
            throw "Unsupported data type";
        }
    };

    this.generateSql = function () {
        var sets = "";
        var gets = "";
        var prms = "";

        for (var i = 0; i < this._params.length; i++) {
            var p = this._params[i];

            if (prms.length > 0) {
                prms += ",";
            }

            if (p.isOut) {
                if (sets.length > 0) {
                    sets += ",";
                    gets += ",";
                }
                sets += "@" + p.name + "=" + this.asVal(p.value);
                gets += "@" + p.name + " as " + p.name;
                prms += "@" + p.name;
            } else {
                prms += this.asVal(p.value);
            }
        }

        if (sets.length > 0) {
            this._lastSQL = "SET " + sets + "; CALL " + this._name + "(" + prms + "); SELECT " + gets + ";";
        } else {
            this._lastSQL = "CALL " + this._name + "(" + prms + ")";
        }
        return this._lastSQL;
    };

    this.execute = function (callback) {
        var db = mysql.createConnection(this._connectionSettings);
        var sql = this.generateSql();
        db.connect(function (err) {
            if (!err) {
                db.query(sql, function (err, rows) {
                    if (!err) {
                        if (rows.length === 4) {
                            var rowlist = rows[1];
                            var outs = rows[3][0];
                            callback(false, rowlist, outs);
                        } else if (rows.length === 2) {
                            var rowlist = rows[0];
                            callback(false, rowlist, false);
                        } else {
                            throw "Unknown result type";
                        }
                    } else {
                        callback(err, false, false);
                    }
                });
            } else {
                callback(false, false, err);
            }
            db.end();
        });
        return this;
    };

    this.exec = function (cb) { //alias of execute
        return this.execute(cb);
    };

    this._init = function (connectionSettings) {
        this._connectionSettings = connectionSettings;
        this._connectionSettings["multipleStatements"] = true;
    };
    this._init(connectionSettings);
};

exports.caller = caller;