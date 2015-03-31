var extend = require('extend');
var http = require('http-sync');

function CodacyAPI(_apiToken) {
  this.apiToken = _apiToken;
  this.performLogin(this.apiToken);
}

(function () {
  var timeoutMilliseconds = 10000;

  var requestOptions = {
    protocol: 'https',
    host: 'www.codacy.com',
    port: 443
  };

  requestOptions = {
    protocol: 'http',
    host: 'localhost',
    port: 9000
  };

  this.makeRequest = function (options) {
    try {
      var request = http.request(extend(requestOptions, options));

      request.setTimeout(timeoutMilliseconds, function () {
        console.error("Request timeout: " + requestOptions.path);
        process.exit(1);
      });

      var response = request.end();

      if (response.headers["Set-Cookie"]) {
        this.cookie = response.headers["Set-Cookie"];
      }

      return response.body;
    } catch (e) {
      console.error(e.message);
    }
  };

  this.performLogin = function (apiToken) {
    var response = this.makeRequest({
      method: 'POST',
      body: 'apiToken=' + apiToken,
      path: '/api/login'
    });

    if (!response) {
      process.exit(2);
    } else {
      return JSON.parse(response.toString());
    }
  };
}).call(CodacyAPI.prototype);

/*
 * Codacy API V1
 */

CodacyAPI.prototype.getProjects = function () {
  var response = this.makeRequest({
    method: 'GET',
    headers: {
      'Cookie': this.cookie
    },
    path: '/api/projects'
  });

  var result = JSON.parse(response.toString());
  if (result.error) {
    console.error(result.error);
    process.exit(3);
  }

  return JSON.parse(result.ok);
};

CodacyAPI.prototype.getProject = function (projectId) {
  var response = this.makeRequest({
    method: 'GET',
    headers: {
      'Cookie': this.cookie
    },
    path: '/api/project/' + projectId
  });

  var result = JSON.parse(response.toString());
  if (result.error) {
    console.error(result.error);
    process.exit(3);
  }

  return JSON.parse(result.ok);
};

CodacyAPI.prototype.analyseFile = function (filename, contents) {
  var response = this.makeRequest({
    method: 'POST',
    headers: {
      'Cookie': this.cookie
    },
    body: 'filename=' + encodeURIComponent(filename) + '&contents=' + encodeURIComponent(contents),
    path: '/api/analyse'
  });

  if (!response) {
    process.exit(2);
  } else {
    try {
      var result = JSON.parse(response.toString());
      if (result.error) {
        console.error(result.error);
        process.exit(3);
      }

      return JSON.parse(result.ok);
    } catch (e) {
      console.error(e.message);
      process.exit(4);
    }
  }
};

module.exports.CodacyAPI = CodacyAPI;
