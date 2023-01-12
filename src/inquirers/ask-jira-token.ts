import inquirer, { QuestionCollection } from "inquirer";
import { Config } from "../config";

const question: QuestionCollection = {
  type: "input",
  message:
    "🚨  Jira <TOKEN> not configured, please  enter the <TOKEN> for your Jira: ",
  name: "token",
};

export default async function (config: Config) {
  if (!config.jira.token) {
    const { token } = await inquirer.prompt(question);
    config.jira.token = token;
  }
  return config;
}
