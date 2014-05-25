module.exports = (function () {
    "use strict";

    var tables = require("json-table");
    var util = require("util");

    var format;

    function Formatter(_format) {
        format = _format;
    }

    Formatter.prototype.print = function (data) {
        if (format === "json") {
            printJson(data);
        } else if (format === "table") {
            printTable(data);
        } else {
            console.log(data);
        }
    };

    function printJson(json) {
        console.log(util.inspect(json));
    }

    function printTable(json) {
        var table = new tables(json, function () {
        });
        console.log(table.table.toString());
    }

    var instance;

    function getInstance(isJson) {
        if (instance === undefined) {
            instance = new Formatter(isJson);
            instance.constructor = null;
        }
        return instance;
    }

    return getInstance;

})();
