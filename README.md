### Codacy Command Line Interface (CLI)
# Automated Code Linting and Monitoring

\[ [Use it online](https://www.codacy.com) • [Features](https://www.codacy.com/features) •
[Pricing](https://www.codacy.com/pricing) • [About us](https://www.codacy.com/about) •
[GitHub](https://www.github.com/codacy) • [Blog](http://blog.codacy.com) •
[Twitter](https://twitter.com/codacy/) \]

Codacy is a hosted automated code review service.

Codacy automatically applies some patterns to your project and grades it so you can take a first glance of its health. We'll also provide you with all the detailed information required to improve it, effectively helping you tackle your technical debt.

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
      -h, --help             Output usage information
      -V, --version          Output the version number
      -c, --config [file]    Load the specified configuration file
      -o, --output [format]  Select the output format
        Formats:
        * raw (default)
        * json
        * table
      -p, --project [id]     View project issues
      -a, --analyse [path]   Analyse the specified file or directory

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
