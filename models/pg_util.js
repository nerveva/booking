exports.handleErr = function(err, done, client) {
    if (err) {
        done(client);
        console.log(err);
        return true;
    }
    return false;
};

exports.genInsertStat = function(table, kvs) {
    var cols = "(";
    var values = "(";
    for(var i in kvs) {
        cols += i + ","; 
        if (typeof i == "number" || typeof i == "boolean") {
            values += kvs[i] + ","; 
        }
        else{
            values += "'" + kvs[i] + "',";
        }
    }
    return "insert into " + table + " " + cols.substr(0, cols.length - 1) + ")"
        + " values " + values.substr(0, values.length - 1) + ")";

};

var getCols = function(Cols) {
    var cols = "(";
    for(var i  = 0; i < Cols.length; ++i) {
        cols += "'" + Cols[i] + "',";
    }
    return cols.substr(0, cols.length-1) + ")";
};

exports.genSelectStat = function(table, cols, cons) {
    var tcols = "*";
    if (cols && cols.length > 0) {
        tcols = getCols(cols);
    }
    var conStr = "";
    for(var k in cons) {
        conStr += k + "='" + cons[k] + "' and ";
    }
    if (conStr.length > 0) {
        conStr = " where " + conStr.substr(0, conStr.length - 5);
    }
    return "select " + tcols + " from " + table + conStr;
};

exports.genUpdateStat = function(table, newKvs, cons) {
    var conStr = "";
    for(var k in cons) {
        conStr += k + "='" + cons[k] + "' and ";
    }
    if (conStr.length > 0) {
        conStr = " where " + conStr.substr(0, conStr.length - 5);
    }

    var setStr = "";
    for (var i in newKvs) {
        if (typeof i == "number" || typeof i == "boolean") {
            setStr += i + "=" + newkvs[i] + ",";
        }
        else {
            setStr += i + "='" + newkvs[i] + "',";
        }
    }

    return "update " + table + " set " + serStr + conStr;
};
