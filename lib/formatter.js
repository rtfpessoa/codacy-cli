var tables = require("json-table");
var util = require("util");

function Formatter(_format) {
  this.format = _format;
}

Formatter.prototype.print = function (data) {
  switch (this.format) {
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

Formatter.prototype.printCommitDelta = function (data) {
  switch (this.format) {
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

module.exports.Formatter = Formatter;
