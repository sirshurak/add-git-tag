# add-git-tag

A simple CLI and npm package to generate git tag with vscode and node projects.

## Usage

You will need to have [git](https://git-scm.com/downloads) + [vscode](https://code.visualstudio.com/Download) installed and CLI commands like `git` + `code` properly working.

### With CLI

```bash
$ npx add-git-tag
```

### With API

```js
const { addGitTag } = require("add-git-tag");

addGitTag({ packagePath: "/path/to/package" });
```

#### Options

| Value       | CLI                                | Type     | Required | Notes                                                                                                                                |
| ----------- | ---------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| append      | `-a, --append <append>`            | `String` | No       | Append text to tag version. Ex: --append -beta for 1.0.0-beta                                                                        |
| prepend     | `-p, --prepend <prepend>`          | `String` | No       | Prepend text to tag version. Ex: --append v for v1.0.0                                                                               |
| packagePath | `-f, --package-path <packagePath>` | `String` | No       | Path for the package.json file. Default: current directory                                                                           |
| description | `-d, --description <description>`  | `String` | No       | Description for the tag. Default: empty. To skip description file on CLI: `-nd, --no-description`                                    |
| descriptionFile | `-df, --description-file <descriptionFile>`  | `String` | No       | Description file for the tag, this will ignore description option. Default: empty. Ex: `--description-file path/to/description/file `                                 |
| release     | `-r, --release <releaser>`         | `jira`   | No       | Release a version for remote integration. Possible values (jira). Ex: `--release jira`                                               |
| config      | `-c, --config <configFile>`        | `jira`   | No       | Configuration file path to load, see [configuration file structure](#config-file-structure). Ex: `--config path/to/config/file.json` |

##### Config File structure

```yaml
{
  "releaseName": "String", # Default: "${packageJson.name}${separator}${version}${separator}${branchType}"
  "releaseNameSeparator": "String", # Default: "-"
  "branchTypeSeparator": "String", # Default: "/"
  "jira":
    {
      "email": "String",
      "token": "String",
      "apiUrl": "String",
      "projectName": "String",
      "projectId": 0,
      "projectKey": "String",
    },
}
```

## License

MIT. See the LICENSE file.
