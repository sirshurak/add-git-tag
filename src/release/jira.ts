import { Release } from ".";
import { JiraApi } from "../api/jira";
import { saveConfig } from "../config";

export class JiraRelease extends Release<JiraApi> {
  async checkProjectKeyAndName() {
    if (!this.config.jira.projectId || !this.config.jira.projectKey) {
      const data = await this.api.searchProject(this.config.jira.projectName);
      if (data?.values?.length) {
        this.config.jira.projectId = Number(data.values[0].id);
        this.config.jira.projectKey = data.values[0].key;
        saveConfig(this.config);
      }
    }
  }

  async getVersionOrCreate(name: string, description: string) {
    await this.checkProjectKeyAndName();
    const data = await this.api.searchVersion(name, this.config.jira.projectId);
    if (data?.values?.length) return data?.values[0];
    return this.api.createVersion({
      archived: false,
      name,
      description,
      projectId: this.config.jira.projectId,
      released: false,
    });
  }

  async updateIssuesToVersion(version: any, issues: string[]) {
    return Promise.all(
      issues.map(async (issueKey) => {
        const issue = await this.api.getIssue(issueKey);
        const fixVersions = issue.fields?.fixVersions ?? [];
        if (
          !fixVersions.find((fixVersion) => fixVersion.name === version.name)
        ) {
          fixVersions.push(version);
          return this.api.updateIssue(issueKey, { fields: { fixVersions } });
        }
      })
    );
  }

  async do(name: string, description: string) {
    const version = await this.getVersionOrCreate(name, description);
    const issues = this.identifyIssues(description);
    await this.updateIssuesToVersion(version, issues);
    return true;
  }

  identifyIssues(description: string): string[] {
    const regExp = new RegExp(
      `\\W?[^\\(](${this.config.jira.projectKey}-\\d*)[^\\)]\\W?`,
      "gm"
    );
    return description.match(regExp)?.map((e) => e.replace(regExp, "$1")) ?? [];
  }
}
