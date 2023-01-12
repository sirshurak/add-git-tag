jest.mock("inquirer", () => ({
  QuestionCollection: jest.requireActual("inquirer").QuestionCollection,
  prompt: jest.fn(),
}));

import inquirer from "inquirer";
import askJiraEmail from "./ask-jira-email";
import { Config } from "../config";

describe("ask-jira-email inquirer", () => {
  it("should inquirer", async () => {
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValue({
      email: "email",
    });
    await expect(askJiraEmail(new Config())).resolves.toMatchObject({
      jira: { email: "email" },
    });
  });
});
