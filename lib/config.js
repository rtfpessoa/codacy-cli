var fs = require("fs");
var prompt = require("sync-prompt").prompt;

var defaultConfigFile = ".codacy";

function Config() {
}

Config.prototype.readConfig = function(configFilePath) {
  var options = readConfigFromFile(defaultConfigFile)
    || readConfigFromFile(configFilePath)
    || readConfigFromInput();

  if (options) {
    return options;
  }

  console.error("Could not load any configuration");
  exit(2);
};

function readConfigFromInput() {
  var apiToken = prompt('Insert your api token:');

  return createConfig(apiToken);
}

function readConfigFromFile(path) {
  if (fs.existsSync(path)) {
    var fileContent = fs.readFileSync(path, 'utf-8');

    try {
      var optionsJson = JSON.parse(fileContent);
      if (checkConfig(optionsJson)) {
        return optionsJson;
      }
    } catch (e) {
      console.error(e.message);
    }

    console.error("Could not load config file '%s'", path);
  }

  return null;
}

function checkConfig(options) {
  return options && options.apiToken;
}

function createConfig(apiToken) {
  var options = {};
  options.apiToken = apiToken;

  return options;
}

module.exports.Config = new Config();
