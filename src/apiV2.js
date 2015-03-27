module.exports = (function () {
  "use strict";

  var extend = require('extend');
  var http = require('http-sync');

  var timeoutMilliseconds = 10000;

  var requestOptions = {
    protocol: 'https',
    host: 'www.codacy.com',
    port: 443
  };

  //requestOptions = {
  //  protocol: 'http',
  //  host: 'localhost',
  //  port: 9000
  //};

  var apiToken;

  function CodacyAPIV2(_apiToken) {
    apiToken = _apiToken;
  }

  function makeRequest(options) {
    var response;

    try {
      var request = http.request(extend(requestOptions, options));

      request.setTimeout(timeoutMilliseconds, function () {
        console.error("Request timeout: " + requestOptions.path);
        process.exit(1);
      });

      response = request.end().body
    } catch (e) {
      console.error(e.message);
      process.exit(2);
    }

    var result = JSON.parse(response);
    if (result.error) {
      console.error(result.error);
      process.exit(1);
    }

    return result;
  }

  function httpGet(urlParams) {
    var finalParams;
    if (urlParams.indexOf("?") !== -1) {
      finalParams = urlParams + '&api_token=' + apiToken;
    } else {
      finalParams = urlParams + '?api_token=' + apiToken;
    }

    return makeRequest({
      method: 'GET',
      path: '/api/2.0' + finalParams
    });
  }

  function httpPost(urlParams) {
    var finalParams;
    if (urlParams.indexOf("?") !== -1) {
      finalParams = urlParams + '&api_token=' + apiToken;
    } else {
      finalParams = urlParams + '?api_token=' + apiToken;
    }

    return makeRequest({
      method: 'POST',
      body: 'api_token=' + apiToken,
      path: '/api/2.0' + finalParams
    });
  }

  /*
   * Codacy API V2
   */

  CodacyAPIV2.prototype.getCommit = function (projectId, commitUUID) {
    return httpGet('/project/' + projectId + '/commit/' + commitUUID);
  };

  CodacyAPIV2.prototype.getByNameCommit = function (username, projectName, commitUUID) {
    return httpGet('/' + username + '/' + projectName + '/commit/' + commitUUID);
  };

  var instance;

  function getInstance(apiToken) {
    if (instance === undefined) {
      instance = new CodacyAPIV2(apiToken);
      instance.constructor = null;
    }
    return instance;
  }

  return getInstance;

})();
