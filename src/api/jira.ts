import { Api } from ".";

export class JiraApi extends Api {
  constructor(username: string, password: string, baseUrl: string) {
    super({
      url: baseUrl,
      auth: {
        username,
        password,
      },
    });
  }

  async searchProject(query: string) {
    const { data } = await this.api.get("/rest/api/3/project/search", {
      params: { query },
    });
    return data;
  }

  async searchVersion(query: string, projectIdOrKey: number | string) {
    const { data } = await this.api.get(
      `/rest/api/3/project/${projectIdOrKey}/version`,
      {
        params: { query },
      }
    );
    return data;
  }

  async getIssue(issueIdOrKey: number | string) {
    const { data } = await this.api.get(`/rest/api/3/issue/${issueIdOrKey}`);
    return data;
  }

  async updateIssue(issueIdOrKey: number | string, issue: any) {
    const { data } = await this.api.put(
      `/rest/api/3/issue/${issueIdOrKey}`,
      issue
    );
    return data;
  }

  async createVersion(version: any) {
    const { data } = await this.api.post(`/rest/api/3/version`, version);
    return data;
  }
}
