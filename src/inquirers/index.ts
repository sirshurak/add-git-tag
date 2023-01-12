import { Config, JiraConfig } from "../config";
import askJiraApiUrl from "./ask-jira-apiUrl";
import askJiraEmail from "./ask-jira-email";
import askJiraProjectName from "./ask-jira-projectName";
import askJiraToken from "./ask-jira-token";

const jira = [askJiraApiUrl, askJiraEmail, askJiraToken, askJiraProjectName];

export default async function inquirersAsk(config: Config) {
  if (!config.jira) config.jira = new JiraConfig();
  await Promise.all(jira.map(async (ask) => await ask(config)));
  return config;
}
