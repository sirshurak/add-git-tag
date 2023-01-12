import { Provider } from ".";
import { JiraApi } from "../api/jira";
import { Config } from "../config";
import { JiraRelease } from "../release/jira";

export class JiraProvider extends Provider<JiraApi, JiraRelease> {
  constructor(protected config: Config) {
    super(
      config,
      new JiraRelease(
        new JiraApi(config.jira.email, config.jira.token, config.jira.apiUrl),
        config
      )
    );
  }
}
