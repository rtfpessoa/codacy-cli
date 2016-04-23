var extend = require('extend');
var http = require('http-sync');

function CodacyAPIV2(_apiToken) {
  this.apiToken = _apiToken;
}

/*
 * Codacy API V2
 */

CodacyAPIV2.prototype.getByNameCommit = function(username, projectName, commitUUID) {
  return httpGet('/' + username + '/' + projectName + '/commit/' + commitUUID, this.apiToken);
};

CodacyAPIV2.prototype.getByNameCommitDelta = function(username, projectName, commitUUID) {
  return httpGet('/' + username + '/' + projectName + '/commit/' + commitUUID + '/delta', this.apiToken);
};

function makeRequest(options) {
  var response;

  var timeoutMilliseconds = 10000;

  var requestOptions = {
    protocol: 'https',
    host: 'api.codacy.com',
    port: 443
  };

  try {
    var request = http.request(extend(requestOptions, options));

    request.setTimeout(timeoutMilliseconds, function() {
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
    process.exit(3);
  }

  return result;
}

function httpGet(urlParams, apiToken) {
  var finalParams;
  if (urlParams.indexOf("?") !== -1) {
    finalParams = urlParams + '&api_token=' + apiToken;
  } else {
    finalParams = urlParams + '?api_token=' + apiToken;
  }

  return makeRequest({
    method: 'GET',
    path: '/2.0' + finalParams
  });
}

function httpPost(urlParams, apiToken) {
  var finalParams;
  if (urlParams.indexOf("?") !== -1) {
    finalParams = urlParams + '&api_token=' + apiToken;
  } else {
    finalParams = urlParams + '?api_token=' + apiToken;
  }

  return makeRequest({
    method: 'POST',
    body: 'api_token=' + apiToken,
    path: '/2.0' + finalParams
  });
}

module.exports.CodacyAPIV2 = CodacyAPIV2;
