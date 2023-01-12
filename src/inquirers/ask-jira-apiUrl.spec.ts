jest.mock("inquirer", () => ({
  QuestionCollection: jest.requireActual("inquirer").QuestionCollection,
  prompt: jest.fn(),
}));

import inquirer from "inquirer";
import askJiraApiUrl from "./ask-jira-apiUrl";
import { Config } from "../config";

describe("ask-jira-apiUrl inquirer", () => {
  it("should inquirer", async () => {
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({
      apiUrl: "apiUrl",
    });
    await expect(askJiraApiUrl(new Config())).resolves.toMatchObject({
      jira: { apiUrl: "apiUrl" },
    });
  });
});
