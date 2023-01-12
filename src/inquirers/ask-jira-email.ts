import inquirer, { QuestionCollection } from "inquirer";
import { Config } from "../config";

const question: QuestionCollection = {
  type: "input",
  message:
    "🚨  Jira <EMAIL> not configured, please  enter the <EMAIL> for your Jira: ",
  name: "email",
};

export default async function (config: Config) {
  if (!config.jira.email) {
    const { email } = await inquirer.prompt(question);
    config.jira.email = email;
  }
  return config;
}
