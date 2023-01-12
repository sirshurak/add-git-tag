import path from "path";
import fs from "fs";
import lodashPick from "lodash.pick";

export class JiraConfig {
  email: string;
  token: string;
  apiUrl: string;
  projectName: string;
  projectId?: number;
  projectKey?: string;
}

export class ConfigJson {
  jira: JiraConfig = new JiraConfig();
  releaseName: string =
    "${packageJson.name}${separator}${version}${separator}${branchType}";
  releaseNameSeparator: string = "-";
  branchTypeSeparator: string = "/";
}

export class Config extends ConfigJson {
  constructor(public filePath?: string) {
    super();
    if (!filePath) this.filePath = path.join(__dirname, "../config.json");
    if (fs.existsSync(this.filePath))
      this.copyProps(JSON.parse(fs.readFileSync(this.filePath, "utf8")), this);
  }

  copyProps = (from, to) => {
    const newObj = new ConfigJson();
    Object.assign(to, lodashPick(from, Object.keys(newObj)));
    return to;
  };
}

export function loadConfig(filePath?: string): Config {
  return new Config(filePath);
}

export function saveConfig(config: Config) {
  const newObj = new ConfigJson();
  fs.writeFileSync(
    config.filePath,
    JSON.stringify(config.copyProps(config, newObj))
  );
}

const configStatic = loadConfig("");

export default configStatic;
