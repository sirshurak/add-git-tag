import inquirer, { QuestionCollection } from "inquirer";
import { Config } from "../config";

const question: QuestionCollection = {
  type: "input",
  message:
    "🚨  Jira API <URL> not configured, please  enter the <URL> for your Jira API: ",
  name: "apiUrl",
};

export default async function (config: Config) {
  if (!config.jira.apiUrl) {
    const { apiUrl } = await inquirer.prompt(question);
    config.jira.apiUrl = apiUrl;
  }
  return config;
}
