import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

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

export const waitForDescription = async () => {
  const tagDescriptionPath = path.resolve(__dirname, "../.tag-description");
  let tagDescription = "";

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

  if (!tagDescription) console.warn("No description provided.");
  return tagDescription.split("\n").map((line) => `${!line ? " " : line}`);
};

export const findPackageVersion = (packagePath: string): string | void => {
  const appDirectory = fs.realpathSync(packagePath);
  const packageFilePath = path.resolve(`${appDirectory}`, "package.json");
  if (!fs.existsSync(packageFilePath)) {
    throw new Error("package.json not found");
  }
  const packageFile: string = fs.readFileSync(packageFilePath, "utf-8");
  const packageJson: any = JSON.parse(packageFile);
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

export const addGitTag = async (packagePath: string = process.cwd()) => {
  const description = await waitForDescription();
  const version = findPackageVersion(packagePath);
  createTagAndPush(version, description);
  console.log(`Tag ${version} created and pushed to remote`);
};