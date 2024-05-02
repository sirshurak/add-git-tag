import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import lodashGet from "lodash.get";
import {
  parseStringTemplate,
  evaluateParsedString,
} from "string-template-parser";
import { Config, loadConfig, saveConfig } from "./config";
import { JiraProvider } from "./provider/jira";
import inquirersAsk from "./inquirers";

export interface GitTagOptions {
  append: string;
  prepend: string;
  packagePath: string;
  description: boolean | string;
  descriptionFile: string;
  release?: "jira";
  config?: string;
}

export const defaultGitTagOptions: GitTagOptions = {
  append: "",
  prepend: "",
  packagePath: process.cwd(),
  description: true,
  descriptionFile: "",
  release: null,
  config: null,
};

export const createTag = (version, description: string[]) => {
  const git = spawnSync("git", [
    "tag",
    "-a",
    version,
    ...description.map((d) => ["-m", d]).flat(),
  ]);
  if (git.error) {
    throw git.error;
  }
};

export const waitForDescription = async (description: boolean | string, descriptionFile: string) => {
  let tagDescription = "";
  if (descriptionFile) {
    const tagDescriptionPath = path.resolve(__dirname, descriptionFile);
    if (!fs.existsSync(tagDescriptionPath)) {
      throw new Error("Description file not found");
    }
    tagDescription = fs.readFileSync(tagDescriptionPath, "utf-8");
  } else if (description === true) {
    const tagDescriptionPath = path.resolve(__dirname, "../.tag-description");

    if (!fs.existsSync(tagDescriptionPath)) {
      fs.writeFileSync(tagDescriptionPath, "", "utf-8");
    }

    console.log(
      "Please, save the description for the tag and close the file to continue"
    );
    const code = spawnSync("code", [`"${tagDescriptionPath}"`, "-w"], {
      shell: true,
    });
    if (code.error) {
      throw code.error;
    }
    tagDescription = fs.readFileSync(tagDescriptionPath, "utf-8");
  } else {
    tagDescription = description as string;
  }

  if (!tagDescription) console.warn("No description provided.");
  return tagDescription.split("\n").map((line) => `${!line ? " " : line}`);
};

export const findPackage = (packagePath: string): any => {
  const appDirectory = fs.realpathSync(packagePath);
  const packageFilePath = path.resolve(`${appDirectory}`, "package.json");
  if (!fs.existsSync(packageFilePath)) {
    throw new Error("package.json not found");
  }
  const packageFile: string = fs.readFileSync(packageFilePath, "utf-8");
  const packageJson: any = JSON.parse(packageFile);
  return packageJson;
};

export const findPackageVersion = (packageJson: any): string | void => {
  if (!packageJson.version) {
    throw new Error("package.json version not found");
  }
  return packageJson.version;
};

export const createTagAndPush = (version, description: string[]) => {
  createTag(version, description);
  const git = spawnSync("git", ["push", "--tags"]);
  if (git.error) {
    throw git.error;
  }
};

export const getConfig = async (options: Partial<GitTagOptions>) => {
  let config = loadConfig(options.config);
  if (options.release) {
    await inquirersAsk(config);
    saveConfig(config);
  }
  return config;
};

export const getVersion = (options: Partial<GitTagOptions>, packageJson: any) =>
  `${options.prepend ?? ""}${findPackageVersion(packageJson)}${
    options.append ?? ""
  }`;

export const getDescription = async (options: Partial<GitTagOptions>) =>
  options.description || options.descriptionFile ? 
    await waitForDescription(options.description, options.descriptionFile) :
    [""];

export const getReleaseName = (
  config: Config,
  template: {
    packageJson: any;
    version: string;
    description: string;
    branchType: string;
  }
) => {
  const parsedString = parseStringTemplate(config.releaseName);
  const variables = {};
  parsedString.variables.forEach((variable) => {
    variables[variable.name] = lodashGet(
      { ...template, separator: config.releaseNameSeparator },
      variable.name
    );
  });
  let result = evaluateParsedString(parsedString, variables, {});
  if (result.endsWith(config.releaseNameSeparator))
    result = result.substring(
      0,
      result.length - config.releaseNameSeparator.length
    );
  return result;
};

export const getCurrentBranch = () => {
  const git = spawnSync("git", ["branch", "--show-current"], {
    encoding: "utf8",
  });
  if (git.error) {
    throw git.error;
  }
  return git.stdout;
};

export const getBranchType = (config: Config) => {
  const branchName = getCurrentBranch() ?? "";
  if (branchName.includes(config.branchTypeSeparator))
    return branchName.substring(
      0,
      branchName.indexOf(config.branchTypeSeparator)
    );
  return "";
};

export const release = async (
  options: Partial<GitTagOptions>,
  packageJson: any,
  version: string,
  description: string
) => {
  const config = await getConfig(options);
  const branchType = getBranchType(config);
  const releaseName = getReleaseName(config, {
    packageJson,
    version,
    description,
    branchType,
  });
  switch (options.release) {
    case "jira":
      console.log(`Creating/updating ${releaseName} on Jira...`);
      if (await new JiraProvider(config).doRelease(releaseName, description))
        console.log(`Release ${releaseName} created/updated at Jira.`);
      break;
  }
  return true;
};

export const addGitTag = async (options: Partial<GitTagOptions>) => {
  const packageJson = findPackage(options.packagePath);
  const description = await getDescription(options);
  const version = getVersion(options, packageJson);
  createTagAndPush(version, description);
  console.log(`Tag ${version} created and pushed to remote`);
  await release(options, packageJson, version, description.join("\n"));
};
