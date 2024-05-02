#!/usr/bin/env node

import { program } from "commander";
import { addGitTag, defaultGitTagOptions } from "./index";

export const dispatch = (options) => {
  const entryOptions = Object.assign({}, defaultGitTagOptions, options);
  return addGitTag(entryOptions);
};

export const withErrors = (command: (...args) => Promise<void>) => {
  return async (...args: any[]) => {
    try {
      await command(...args);
    } catch (e) {
      console.error(e.stack);
      process.exitCode = 1;
    }
  };
};

program
  .name("add-git-tag")
  .option(
    "-a, --append <append>",
    "Append text to tag version. Ex: --append -beta for 1.0.0-beta"
  )
  .option(
    "-p, --prepend <prepend>",
    "Prepend text to tag version. Ex: --append v for v1.0.0"
  )
  .option(
    "-f, --package-path <packagePath>",
    "Path for the package.json file. Default: current directory"
  )
  .option("-nd, --no-description", "No description for the tag. Default: false")
  .option(
    "-d, --description <description>",
    "Description for the tag. Default: empty"
  )
  .option(
    "-df, --description-file <descriptionFile>",
    "Description file for the tag, this will ignore description option. Default: empty. Ex: --description-file path/to/description/file"
  )
  .option(
    "-r, --release <releaser>",
    "Release a version for remote integration. Possible values (jira). Ex: --release jira"
  )
  .option(
    "-c, --config <configFile>",
    "Configuration file path to load. Ex: --config path/to/config/file.json"
  )
  .action(withErrors(dispatch));

program.parse(process.argv);
