module.exports = (function() {
  "use strict";

  var fs = require("fs");
  var api;

  function Analysis(_api) {
    api = _api;
  }

  Analysis.prototype.analyseFile = function(fileToAnalyse) {
    debugger;
    if (fs.existsSync(fileToAnalyse)) {
      // Do something
      if (fs.lstatSync(fileToAnalyse).isFile()) {
        return analyseFile(fileToAnalyse);
      } else {
        return analyseDirectory(fileToAnalyse);
      }
    } else {
      console.error("Could not read file to analyse");
    }
  };

  function analyseFile(path) {
    if (!fs.lstatSync(path).isFile()) {
      return [];
    }
    var file = readFile(path);
    return api.analyseFile(path, file);
  }

  function analyseDirectory(path) {
    if (!fs.lstatSync(path).isDirectory()) {
      return [];
    }
    var results = [];

    var files = fs.readdirSync(path);
    for (var i in files) {
      if (!files.hasOwnProperty(i)) continue;
      var name = path + "/" + files[i];
      var matches = [];
      if (fs.statSync(name).isDirectory()) {
        matches = analyseDirectory(name);
      } else {
        matches = analyseFile(name);
      }
      for (var j in matches) {
        if (!matches.hasOwnProperty(j)) continue;
        results.push(matches[j]);
      }
    }
    debugger;
    return results;
  }

  function readFile(path) {
    try {
      var fileData = fs.readFileSync(path);

      if (!fileData) {
        console.error("Could not read file to analyse");
        process.exit(1);
      }

      return fileData;
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }

  var instance;

  function getInstance(codacyApi) {
    if (instance === undefined) {
      instance = new Analysis(codacyApi);
      instance.constructor = null;
    }
    return instance;
  }

  return getInstance;

})();
