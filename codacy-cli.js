/*
 *
 * Codacy NodeJS CLI
 *
 * Exit codes:
 * 0   (Success)
 * 1   (Request timeout)
 * 2   (Missing response)
 * 3   (Response with error)
 * 4   (Could not parse response)
 * 20  (Could not read analysis file)
 * 404 (Not implemented)
 *
 */

/**
 * Args parsing
 */

require('pkginfo')(module, 'version');

var program = require('commander');
var appVersion = module.exports.version;

program.version(appVersion);
program.usage('[options]');

program
  .option('-c, --config [file]', 'load the specified configuration file')
  .option('-o, --output [format]', 'select the output format: ("json", "table" and ["raw"])')
  .option('-l, --projects', 'list projects')
  .option('-p, --project [projectId | <projectOwner,projectName>]', 'view project issues')
  .option('-C, --commit [sha]', 'view commit overview (dependsOn: --project)')
  .option('-D, --delta', 'view commit delta (dependsOn: --commit)')
  .option('-a, --analyse [file]', 'analyse the specified file or directory');

program.on('--help', function() {
  console.log('For support, email team@codacy.com');
});

program.parse(process.argv);

/**
 * Dependencies
 */

var options = require('./lib/config.js').Config.readConfig(program.config);

var api = new (require('./lib/api.js').CodacyAPI)(options.apiToken);
var apiv2 = new (require('./lib/apiv2.js').CodacyAPIV2)(options.apiToken);

var formatter = new (require('./lib/formatter.js').Formatter)(program.output);

var analysis = new (require('./lib/analysis.js').Analysis)(api);

function prepareResponse() {
  if (isTuple(program.project) && program.delta && isSet(program.commit)) {
    var params = program.project.split(",");
    commitDeltaByName(params[0], params[1], program.commit);

  } else if (isTuple(program.project) && isSet(program.commit)) {
    var params = program.project.split(",");
    commitByName(params[0], params[1], program.commit);

  } else if (isSet(program.project) && isSet(program.commit)) {
    console.log('Commit information only available by <sha>.');
    process.exit(404);

  } else if (isSet(program.project) && program.project.indexOf(",") !== -1) {
    console.log('Project information only available by <projectId>.');
    process.exit(404);

  } else if (isSet(program.project)) {
    project(program.project);

  } else if (program.analyse) {
    analyse(program.analyse)

  } else if (program.projects) {
    projects();

  } else {
    program.help();
  }
}

function projects() {
  var result = api.getProjects();
  formatter.print(result);
}

function project(projectId) {
  var result = api.getProject(projectId);
  formatter.print(result);
}

function commitByName(projectOwner, projectName, commitUUID) {
  var result = apiv2.getByNameCommit(projectOwner, projectName, commitUUID);
  formatter.print(result);
}

function commitDeltaByName(projectOwner, projectName, commitUUID) {
  var result = apiv2.getByNameCommitDelta(projectOwner, projectName, commitUUID);
  formatter.printCommitDelta(result);
}

function analyse(path) {
  var result = analysis.analyseFile(path);
  formatter.print(result);
}

function isTuple(param) {
  return param && param.indexOf(",") !== -1;
}

function isSet(param) {
  return param && param.length > 0;
}

/**
 * Main
 */

function main() {
  prepareResponse();
  process.exit(0);
}

main();
