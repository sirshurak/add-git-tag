jest.mock("./ask-jira-apiUrl", () => ({
  default: jest.fn(),
  __esModule: true,
}));
jest.mock("./ask-jira-email", () => ({
  default: jest.fn(),
  __esModule: true,
}));
jest.mock("./ask-jira-projectName", () => ({
  default: jest.fn(),
  __esModule: true,
}));
jest.mock("./ask-jira-token", () => ({
  default: jest.fn(),
  __esModule: true,
}));

import { Config } from "../config";
import askJiraApiUrl from "./ask-jira-apiUrl";
import askJiraEmail from "./ask-jira-email";
import askJiraProjectName from "./ask-jira-projectName";
import askJiraToken from "./ask-jira-token";

import inquirersAsk from "./index";

describe("inquirersAsk inquirers", () => {
  it("should call all inquirers", async () => {
    (askJiraApiUrl as jest.Mock).mockResolvedValue(true);
    (askJiraEmail as jest.Mock).mockResolvedValue(true);
    (askJiraProjectName as jest.Mock).mockResolvedValue(true);
    (askJiraToken as jest.Mock).mockResolvedValue(true);
    const config = new Config();
    delete config.jira;
    await inquirersAsk(config);
    expect(askJiraApiUrl).toBeCalled();
    expect(askJiraEmail).toBeCalled();
    expect(askJiraProjectName).toBeCalled();
    expect(askJiraToken).toBeCalled();
  });
});
