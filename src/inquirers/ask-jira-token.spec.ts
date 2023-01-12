jest.mock("inquirer", () => ({
  QuestionCollection: jest.requireActual("inquirer").QuestionCollection,
  prompt: jest.fn(),
}));

import inquirer from "inquirer";
import askJiraToken from "./ask-jira-token";
import { Config } from "../config";

describe("ask-jira-token inquirer", () => {
  it("should inquirer", async () => {
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({
      token: "token",
    });
    await expect(askJiraToken(new Config())).resolves.toMatchObject({
      jira: { token: "token" },
    });
  });
});
