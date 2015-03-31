### Codacy Command Line Interface (CLI)
# Automated Code Linting and Monitoring

\[ [Use it online](https://www.codacy.com) • [Features](https://www.codacy.com/features) •
[Pricing](https://www.codacy.com/pricing) • [About us](https://www.codacy.com/about) •
[GitHub](https://www.github.com/codacy) • [Blog](http://blog.codacy.com) •
[Twitter](https://twitter.com/codacy/) \]

Codacy is a hosted automated code review service.

Codacy automatically applies some patterns to your project and grades it so you can take a first glance of its health. We'll also provide you with all the detailed information required to improve it, effectively helping you tackle your technical debt.

#### Quick Install
Run
* [sudo] npm install -g codacy-cli

#### Generate Token

Go to your [account](https://www.codacy.com/account#ApiTokens) and click generate.
Then you can load your token with one of the following methods:
* Default configuration file `.codacy`

* Custom configuration file with `-c` or `--config`

* Introduce it interactively in the CLI when requested

###### Configuration File Example

      {
        "apiToken":"**************"
      }

#### Usage

    Usage:
        codacy [options]
    
    Options:
        -h, --help                                              output usage information
        -V, --version                                           output the version number
        -c, --config [file]                                     load the specified configuration file
        -o, --output [format]                                   select the output format:
                                                                    * raw (default)
                                                                    * json
                                                                    * table
        -l, --projects                                          list projects
        -p, --project [projectId | <projectOwner,projectName>]  view project issues
        -C, --commit [sha]                                      view commit overview (dependsOn: --project)
        -D, --delta                                             view commit delta (dependsOn: --commit)
        -a, --analyse [file]                                    analyse the specified file or directory
    
    For support, email team@codacy.com

#### Reporting a bug

To report a bug you can create a
[GitHub Issue](https://github.com/codacy/codacy-cli/issues/new) and describe
your problem or suggestion.

Before reporting a bug check if there are no open or closed
tickets that cover your issue.

#### License

Codacy Command Line Interface(CLI) is distributed under the MIT License.

#### Thank you!

We really appreciate all kind of feedback. Thanks for using Codacy!
