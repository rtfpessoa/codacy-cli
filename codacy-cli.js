#!/usr/bin/env node

var program = require('commander');

program
    .version('0.1.0')
    .option('-c, --config [file]', 'Add the specified config file')
    .option('-o, --output [format]', 'Configure output format. Choices are "json", "table" and "raw". Defaults to "raw".')
    .option('-p, --project [id]', 'View project issues')
    .option('-a, --analyse [file]', 'Analyse the specified file or path');

program.on('--help', function () {
    console.log('For support, email team@codacy.com');
});

program.parse(process.argv);

main();

function main() {
    var configFilePath = program.config;

    var config = require('./config.js');
    var options = config.readConfig(configFilePath);

    var api = require('./api.js')(options.clientId, options.secretId);

    var result;

    if (program.project && program.project.length > 0) {
        result = api.getProject(program.project);
    } else if (program.analyse){
        var analysis = require('./analysis.js')(api);
        result = analysis.analyseFile(program.analyse);
    } else {
        result = api.getProjects();
    }
    if(result) {
        var formatter = require('./formatter.js')(program.output);
        formatter.print(result);
    } else {
        program.help();
    }
    process.exit(0);
}
