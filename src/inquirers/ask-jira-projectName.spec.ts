jest.mock("inquirer", () => ({
  QuestionCollection: jest.requireActual("inquirer").QuestionCollection,
  prompt: jest.fn(),
}));

import inquirer from "inquirer";
import askJiraProjectName from "./ask-jira-projectName";
import { Config } from "../config";

describe("ask-jira-projectName inquirer", () => {
  it("should inquirer", async () => {
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({
      projectName: "projectName",
    });
    await expect(askJiraProjectName(new Config())).resolves.toMatchObject({
      jira: { projectName: "projectName" },
    });
  });
});
