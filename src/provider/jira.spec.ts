import { Config } from "../config";
import { JiraRelease } from "../release/jira";
import { JiraProvider } from "./jira";

describe("JiraProvider Class", () => {
  it("should create class", () => {
    const jiraProvider = new JiraProvider(new Config());
    expect(jiraProvider["release"]).toBeInstanceOf(JiraRelease);
  });
});
