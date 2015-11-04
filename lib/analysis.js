var fs = require("fs");

function Analysis(_api) {
  this.api = _api;
}

Analysis.prototype.analyseFile = function (fileToAnalyse) {
  if (fs.existsSync(fileToAnalyse)) {
    // Do something
    if (fs.lstatSync(fileToAnalyse).isFile()) {
      var file = analyseFile(fileToAnalyse);
      return this.api.analyseFile(fileToAnalyse, file);
    } else {
      return analyseDirectory(fileToAnalyse);
    }
  } else {
    console.error("Could not read file to analyse");
    exit(1);
  }
};

function analyseFile(path) {
  if (!fs.lstatSync(path).isFile()) {
    return [];
  }
  return readFile(path);
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

  return results;
}

function readFile(path) {
  try {
    var fileData = fs.readFileSync(path);

    if (!fileData) {
      console.error("Could not read file to analyse");
      process.exit(20);
    }

    return fileData;
  } catch (e) {
    console.error(e.message);
    process.exit(20);
  }
}

module.exports.Analysis = Analysis;
