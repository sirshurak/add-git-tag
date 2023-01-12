import { JiraApi } from "../api/jira";
import { JiraRelease } from "./jira";

jest.mock("../config", () => ({
  Config: jest.requireActual("../config").Config,
  saveConfig: jest.fn(),
}));

import { Config, saveConfig } from "../config";

describe.only("JiraRelease Class", () => {
  it("should class checkProjectKeyAndName", async () => {
    const config = new Config();
    const jiraApi = new JiraApi("", "", "");
    const mockSearchProject = jest.spyOn(jiraApi, "searchProject");
    const jiraRelease = new JiraRelease(jiraApi, config);
    mockSearchProject.mockResolvedValue({ values: [{ id: "id", key: "key" }] });
    await jiraRelease.checkProjectKeyAndName();
    expect(mockSearchProject).toBeCalled();
    expect(saveConfig).toBeCalled();
  });

  it("should class getVersionOrCreate get", async () => {
    const config = new Config();
    const jiraApi = new JiraApi("", "", "");
    const mockSearchProject = jest.spyOn(jiraApi, "searchProject");
    mockSearchProject.mockResolvedValue({ values: [{ id: "id", key: "key" }] });
    const mockSearchVersion = jest.spyOn(jiraApi, "searchVersion");
    const jiraRelease = new JiraRelease(jiraApi, config);
    mockSearchVersion.mockResolvedValue({ values: [{ id: "id", key: "key" }] });
    await jiraRelease.getVersionOrCreate("", "");
    expect(mockSearchProject).toBeCalled();
    expect(mockSearchVersion).toBeCalled();
    expect(saveConfig).toBeCalled();
  });

  it("should class getVersionOrCreate create", async () => {
    const config = new Config();
    const jiraApi = new JiraApi("", "", "");
    const mockSearchProject = jest.spyOn(jiraApi, "searchProject");
    mockSearchProject.mockResolvedValue({ values: [{ id: "id", key: "key" }] });
    const mockSearchVersion = jest.spyOn(jiraApi, "searchVersion");
    const mockCreateVersion = jest.spyOn(jiraApi, "createVersion");
    mockCreateVersion.mockResolvedValue({});
    const jiraRelease = new JiraRelease(jiraApi, config);
    mockSearchVersion.mockResolvedValue({ values: [] });
    await jiraRelease.getVersionOrCreate("name", "description");
    expect(mockSearchProject).toBeCalled();
    expect(mockSearchVersion).toBeCalled();
    expect(saveConfig).toBeCalled();
    expect(mockCreateVersion).toBeCalledWith({
      archived: false,
      name: "name",
      description: "description",
      projectId: config.jira.projectId,
      released: false,
    });
  });

  it("should class updateIssuesToVersion", async () => {
    const config = new Config();
    const jiraApi = new JiraApi("", "", "");
    const mockGetIssue = jest.spyOn(jiraApi, "getIssue");
    const mockUpdateIssue = jest.spyOn(jiraApi, "updateIssue");
    mockUpdateIssue.mockResolvedValue({});
    const jiraRelease = new JiraRelease(jiraApi, config);
    mockGetIssue.mockResolvedValueOnce({
      fields: { fixVersions: [{ name: "version-1.1.1" }] },
    });
    mockGetIssue.mockResolvedValueOnce({ fields: { fixVersions: [] } });
    await jiraRelease.updateIssuesToVersion({ name: "version-1.1.1" }, [
      "AQ-123",
      "AQ-321",
    ]);
    expect(mockGetIssue).toBeCalled();
    expect(mockUpdateIssue).toBeCalledWith("AQ-321", {
      fields: { fixVersions: [{ name: "version-1.1.1" }] },
    });
  });

  it("should identifyIssues", () => {
    const config = new Config();
    const jiraApi = new JiraApi("", "", "");
    config.jira.projectKey = "AQ";
    const jiraRelease = new JiraRelease(jiraApi, config);
    expect(
      jiraRelease.identifyIssues(
        "**Alterações** * [+] AQ-228 - Adição de funcionalidade para a tarefa (AQ-233) * [*] AQ-277 - Alteração ou correção de alguma funcionalidade * [-] AQ-153 - Remoção de alguma funcionalidade * [*] Correção de algo menor que não existe tarefa"
      )
    ).toStrictEqual(["AQ-228", "AQ-277", "AQ-153"]);
  });

  it("should call do", async () => {
    const config = new Config();
    const jiraApi = new JiraApi("", "", "");
    const jiraRelease = new JiraRelease(jiraApi, config);
    const mockGetVersionOrCreate = jest.spyOn(
      jiraRelease,
      "getVersionOrCreate"
    );
    mockGetVersionOrCreate.mockResolvedValue({});
    const mockIdentifyIssues = jest.spyOn(jiraRelease, "identifyIssues");
    mockIdentifyIssues.mockReturnValue([]);
    const mockUpdateIssuesToVersion = jest.spyOn(
      jiraRelease,
      "updateIssuesToVersion"
    );
    mockUpdateIssuesToVersion.mockResolvedValue([]);
    await expect(jiraRelease.do("", "")).resolves.toBe(true);
    expect(mockGetVersionOrCreate).toBeCalled();
    expect(mockIdentifyIssues).toBeCalled();
    expect(mockUpdateIssuesToVersion).toBeCalled();
  });
});
