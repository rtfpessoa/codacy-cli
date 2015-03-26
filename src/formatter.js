module.exports = (function () {
  "use strict";

  var tables = require("json-table");
  var util = require("util");

  var format;

  function Formatter(_format) {
    format = _format;
  }

  Formatter.prototype.print = function (data) {
    switch (format) {
      case "json":
        printJson(data);
        break;
      case "table":
        printTable(data);
        break;
      default:
        console.log(data);
    }
  };

  Formatter.prototype.printCommitOverview = function (data) {
    switch (format) {
      case "json":
        printJson(data);
        break;
      case "table":
        if (data.files && data.files.length) {
          var files = data.files;
          delete data.files;

          console.log("Commit");
          printTable(data);

          console.log("Files");
          printTable(files);
        } else {
          printTable(data);
        }
        break;
      default:
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
