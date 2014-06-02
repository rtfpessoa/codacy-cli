require('pkginfo')(module, 'version');

var program = require('commander');
var appVersion = module.exports.version;

program.version(appVersion);
program.usage('[options]');

program
  .option('-c, --config [file]', 'Load the specified configuration file')
  .option('-o, --output [format]', 'Select the output format. Choices are "json", "table" and "raw". Defaults to "raw".')
  .option('-p, --project [id]', 'View project issues')
  .option('-a, --analyse [file]', 'Analyse the specified file or directory');

program.on('--help', function() {
  console.log('For support, email team@codacy.com');
});

program.parse(process.argv);

function getConfig() {
  var configFilePath = program.config;
  var config = require('./config.js');

  return config.readConfig(configFilePath);
}

function prepareResponse(program) {
  var options = getConfig();
  var api = require('./api.js')(options.apiToken);

  var result;
  if (program.project && program.project.length > 0) {
    result = api.getProject(program.project);
  } else if (program.analyse) {
    var analysis = require('./analysis.js')(api);
    result = analysis.analyseFile(program.analyse);
  } else {
    result = api.getProjects();
  }

  return result;
}

function main(program) {
  var result = prepareResponse(program);

  if (result) {
    var formatter = require('./formatter.js')(program.output);
    formatter.print(result);
  } else {
    program.help();
  }

  process.exit(0);
}

main(program);
