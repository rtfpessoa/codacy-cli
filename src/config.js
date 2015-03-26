module.exports = (function () {
  "use strict";

  var fs = require("fs");
  var prompt = require("sync-prompt").prompt;

  var defaultConfigFile = ".codacy";

  function Config() {
  }

  Config.prototype.readConfig = function (configFilePath) {
    var options = null;

    options = readConfigFromFile(defaultConfigFile);
    if (options) {
      return options;
    }

    options = readConfigFromFile(configFilePath);
    if (options) {
      return options;
    }

    options = readConfigFromInput();
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
      var fileContent = fs.readFileSync(path);

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
    if (!options || !options.apiToken) {
      return false;
    }

    return true;
  }

  function createConfig(apiToken) {
    var options = {};
    options.apiToken = apiToken;

    return options;
  }

  var instance;

  function getInstance() {
    if (instance === undefined) {
      instance = new Config();
      instance.constructor = null;
    }
    return instance;
  }

  return getInstance();

})();
