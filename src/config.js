module.exports = (function () {
    "use strict";

    var fs = require("fs");
    var prompt = require("prompt");

    function Config() {
        prompt.message = "";
        prompt.delimiter = ":";
        prompt.colors = false;
        prompt.start();
    }

    Config.prototype.readConfig = function (configFilePath) {
        if (!configFilePath) {
            return readConfigFromInput();
        }

        return readConfigFromFile(configFilePath);
    };

    function readConfigFromFile(path) {
        try {
            var data = fs.readFileSync(path);

            if (!data) {
                console.error("Config file is empty");
                process.exit(1);
            }

            return JSON.parse(data);
        }
        catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    }

    function readConfigFromInput() {
        prompt.get({
            properties: {
                clientId: {
                    description: "clientId",
                    required: true
                },
                secretId: {
                    description: "secretId",
                    required: true,
                    hidden: true
                }}
        }, function (err, result) {

            if (result.clientId && result.secretId) {
                console.log("Performing authentication with codacy...");
            } else {
                error("Failed to get user credentials");
                exit(1);
            }
        });
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
