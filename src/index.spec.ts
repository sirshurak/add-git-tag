import {
  addGitTag,
  defaultGitTagOptions,
  getReleaseName,
  getCurrentBranch,
  getBranchType,
  getConfig,
  release,
} from "./index";

jest.mock("child_process", () => ({ spawnSync: jest.fn() }));
jest.mock("./inquirers", () => ({
  default: jest.fn(),
  __esModule: true,
}));

import { spawnSync } from "child_process";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import configStatic from "./config";
import inquirersAsk from "./inquirers";

const localPackagePath = path.resolve(__dirname, "package.json");
const localConfigPath = path.resolve(__dirname, "config.json");

jest.mock("./provider/jira", () => ({
  JiraProvider: class {
    doRelease = jest.fn(() => true);
  },
}));

describe("addGitTag tests", () => {
  beforeAll(() => {
    if (existsSync(localPackagePath)) unlinkSync(localPackagePath);
    if (existsSync(localConfigPath)) unlinkSync(localConfigPath);
  });

  afterAll(() => {
    if (existsSync(localPackagePath)) unlinkSync(localPackagePath);
    if (existsSync(localConfigPath)) unlinkSync(localConfigPath);
  });

  it("should add a git tag", async () => {
    (spawnSync as jest.Mock).mockReturnValue({});
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    await addGitTag(defaultGitTagOptions);
    expect(spawnSync).toBeCalled();
  });

  it("should add a git tag with description", async () => {
    (spawnSync as jest.Mock).mockReturnValue({});
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    await addGitTag({ ...defaultGitTagOptions, description: "Test" });
    expect(spawnSync).toBeCalled();
  });

  it("should add a git tag without description", async () => {
    (spawnSync as jest.Mock).mockReturnValue({});
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    await addGitTag({ ...defaultGitTagOptions, description: false });
    expect(spawnSync).toBeCalled();
  });

  it("should add a git tag without prepend and append", async () => {
    (spawnSync as jest.Mock).mockReturnValue({});
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    await addGitTag({
      ...defaultGitTagOptions,
      prepend: undefined,
      append: undefined,
    });
    expect(spawnSync).toBeCalled();
  });

  it("should return waitForDescription command error", async () => {
    (spawnSync as jest.Mock).mockReturnValue({ error: new Error("coverage") });
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    expect(addGitTag(defaultGitTagOptions)).rejects.toThrowError("coverage");
  });

  it("should return git command error", async () => {
    (spawnSync as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValue({ error: new Error("coverage") });
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    expect(addGitTag(defaultGitTagOptions)).rejects.toThrowError("coverage");
  });

  it("should return git tag push command error", async () => {
    (spawnSync as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({})
      .mockReturnValueOnce({
        error: new Error("coverage"),
      });
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    expect(addGitTag(defaultGitTagOptions)).rejects.toThrowError("coverage");
  });

  it("should not find file tag-description and create", async () => {
    unlinkSync(path.resolve(__dirname, "../.tag-description"));
    (spawnSync as jest.Mock).mockReturnValue({});
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    await addGitTag(Object.assign(defaultGitTagOptions, { description: true }));
    expect(spawnSync).toBeCalled();
  });

  it("should find long description", async () => {
    writeFileSync(
      path.resolve(__dirname, "../.tag-description"),
      "test\n\ntest\ntest",
      "utf-8"
    );
    (spawnSync as jest.Mock).mockReturnValue({});
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    await addGitTag(Object.assign(defaultGitTagOptions, { description: true }));
    expect(spawnSync).toBeCalled();
  });

  it("should not find package.json", async () => {
    (spawnSync as jest.Mock).mockReturnValue({});
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    expect(
      addGitTag(Object.assign(defaultGitTagOptions, { packagePath: __dirname }))
    ).rejects.toThrowError("package.json not found");
  });

  it("should not find package.json version", async () => {
    writeFileSync(localPackagePath, "{}", "utf-8");
    (spawnSync as jest.Mock).mockReturnValue({});
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    expect(
      addGitTag(Object.assign(defaultGitTagOptions, { packagePath: __dirname }))
    ).rejects.toThrowError("package.json version not found");
  });

  it("should return release name", () => {
    expect(
      getReleaseName(configStatic, {
        packageJson: { name: "test" },
        version: "v1.1",
        description: "description",
        branchType: "hotfix",
      })
    ).toBe("test-v1.1-hotfix");
  });

  it("should return release name without branch type", () => {
    expect(
      getReleaseName(configStatic, {
        packageJson: { name: "test" },
        version: "v1.1",
        description: "description",
        branchType: "",
      })
    ).toBe("test-v1.1");
  });

  it("should return current branch", () => {
    (spawnSync as jest.Mock).mockReturnValue({ stdout: "test" });
    expect(getCurrentBranch()).toBe("test");
  });

  it("should return current branch error", () => {
    (spawnSync as jest.Mock).mockReturnValue({
      error: new Error("test error"),
    });
    expect(getCurrentBranch).toThrowError("test error");
  });

  it("should return branch type", () => {
    (spawnSync as jest.Mock).mockReturnValue({ stdout: "hotfix/test" });
    expect(getBranchType(configStatic)).toBe("hotfix");
  });

  it("should not return branch type", () => {
    (spawnSync as jest.Mock).mockReturnValue({ stdout: "test" });
    expect(getBranchType(configStatic)).toBe("");
  });

  it("should get config", async () => {
    writeFileSync(localConfigPath, JSON.stringify(configStatic), "utf-8");
    const config = await getConfig({ config: localConfigPath });
    expect(config.filePath).toBe(localConfigPath);
  });

  it("should get config, ask to complete and save file", async () => {
    writeFileSync(localConfigPath, JSON.stringify(configStatic), "utf-8");
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    const config = await getConfig({
      config: localConfigPath,
      release: "jira",
    });
    expect(config.filePath).toBe(localConfigPath);
    expect(inquirersAsk).toBeCalled();
    const config2 = await getConfig({ config: localConfigPath });
    expect(config2.jira).toMatchObject(config.jira);
  });

  it("should do release for Jira", async () => {
    writeFileSync(localConfigPath, JSON.stringify(configStatic), "utf-8");
    (inquirersAsk as jest.Mock).mockImplementation((config) => {
      config.jira.email = "email@email.com.br";
      config.jira.token = "token";
      config.jira.apiUrl = "apiUrl";
    });
    (spawnSync as jest.Mock).mockReturnValue({ stdout: "test" });
    await expect(
      release(
        {
          ...defaultGitTagOptions,
          config: localConfigPath,
          release: "jira",
        },
        { name: "test" },
        "v1.1.1",
        "simple description"
      )
    ).resolves.toBe(true);
  });
});
