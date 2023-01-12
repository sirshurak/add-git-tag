import inquirer, { QuestionCollection } from "inquirer";
import { Config } from "../config";

const question: QuestionCollection = {
  type: "input",
  message:
    "🚨  Jira <PROJECT NAME> not configured, please  enter the <PROJECT NAME> for your Jira: ",
  name: "projectName",
};

export default async function (config: Config) {
  if (!config.jira.projectName) {
    const { projectName } = await inquirer.prompt(question);
    config.jira.projectName = projectName;
  }
  return config;
}
