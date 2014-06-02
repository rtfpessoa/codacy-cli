module.exports = (function() {
  "use strict";

  var extend = require('extend');
  var http = require('http-sync');

  var timeoutMilliseconds = 10000;
  var requestOptions = {
    protocol: 'https',
    host: 'www.codacy.com',
    port: 443
  };

  var apiToken;
  var cookie;
  var user;

  function CodacyAPI(_apiToken) {
    apiToken = _apiToken;

    user = performLogin();
  }

  function makeRequest(options) {
    try {
      var request = http.request(extend(requestOptions, options));

      request.setTimeout(timeoutMilliseconds, function() {
        console.error("Request timeout: " + requestOptions.path);
        process.exit(1);
      });

      var response = request.end();

      if (response.headers["Set-Cookie"]) {
        cookie = response.headers["Set-Cookie"];
      }

      return response.body;
    } catch (e) {
      console.error(e.message);
    }
  }

  function performLogin() {
    var response = makeRequest({
      method: 'POST',
      body: 'apiToken=' + apiToken,
      path: '/api/login'
    });
    if (!response) {
      process.exit(1);
    } else {
      return JSON.parse(response.toString());
    }


  }

  CodacyAPI.prototype.getProjects = function() {
    var response = makeRequest({
      method: 'GET',
      headers: {
        'Cookie': cookie
      },
      path: '/api/projects'
    });

    var result = JSON.parse(response.toString());
    if (result.error) {
      console.error(result.error);
      process.exit(1);
    }

    return JSON.parse(result.ok);
  };

  CodacyAPI.prototype.getProject = function(projectId) {
    var response = makeRequest({
      method: 'GET',
      headers: {
        'Cookie': cookie
      },
      path: '/api/project/' + projectId
    });

    var result = JSON.parse(response.toString());
    if (result.error) {
      console.error(result.error);
      process.exit(1);
    }

    return JSON.parse(result.ok);
  };

  CodacyAPI.prototype.analyseFile = function(filename, contents) {
    var response = makeRequest({
      method: 'POST',
      headers: {
        'Cookie': cookie
      },
      body: 'filename=' + encodeURIComponent(filename) + '&contents=' + encodeURIComponent(contents),
      path: '/api/analyse'
    });

    if (!response) {
      process.exit(1);
    } else {
      try {
        var result = JSON.parse(response.toString());
        if (result.error) {
          throw new Exception(result.error);
        }

        return JSON.parse(result.ok);
      } catch (_) {
        /* TODO: do some feedback
                console.error(e.message);
                process.exit(1);
              */
      }
    }
  };

  var instance;

  function getInstance(apiToken) {
    if (instance === undefined) {
      instance = new CodacyAPI(apiToken);
      instance.constructor = null;
    }
    return instance;
  }

  return getInstance;

})();
