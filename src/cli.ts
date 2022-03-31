#!/usr/bin/env node

import { program } from "commander";
import { addGitTag } from "./index";

const dispatch = () => {
  return addGitTag();
};

const withErrors = (command: (...args) => Promise<void>) => {
  return async (...args: any[]) => {
    try {
      await command(...args);
    } catch (e) {
      console.error(e.stack);
      process.exitCode = 1;
    }
  };
};

program.name("add-git-tag").action(withErrors(dispatch));

program.parse(process.argv);
