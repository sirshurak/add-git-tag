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

addGitTag("/path/to/package");
```

## License

MIT. See the LICENSE file.
