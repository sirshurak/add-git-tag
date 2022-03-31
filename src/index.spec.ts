import { addGitTag } from "./index";

jest.mock("child_process", () => ({ spawnSync: jest.fn() }));

import { spawnSync } from "child_process";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import path from "path";

const localPackagePath = path.resolve(__dirname, "package.json");

describe("addGitTag tests", () => {
  beforeAll(() => {
    if (existsSync(localPackagePath)) unlinkSync(localPackagePath);
  });

  afterAll(() => {
    if (existsSync(localPackagePath)) unlinkSync(localPackagePath);
  });

  it("should add a git tag", async () => {
    (spawnSync as jest.Mock).mockReturnValue({});
    await addGitTag();
    expect(spawnSync).toBeCalled();
  });

  it("should return waitForDescription command error", async () => {
    (spawnSync as jest.Mock).mockReturnValue({ error: new Error("coverage") });
    expect(addGitTag).rejects.toThrowError("coverage");
  });

  it("should return git command error", async () => {
    (spawnSync as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValue({ error: new Error("coverage") });
    expect(addGitTag).rejects.toThrowError("coverage");
  });

  it("should return git tag push command error", async () => {
    (spawnSync as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({})
      .mockReturnValueOnce({
        error: new Error("coverage"),
      });
    expect(addGitTag).rejects.toThrowError("coverage");
  });

  it("should not find file tag-description and create", async () => {
    unlinkSync(path.resolve(__dirname, "../.tag-description"));
    (spawnSync as jest.Mock).mockReturnValue({});
    await addGitTag();
    expect(spawnSync).toBeCalled();
  });

  it("should find long description", async () => {
    writeFileSync(
      path.resolve(__dirname, "../.tag-description"),
      "test\n\ntest\ntest",
      "utf-8"
    );
    (spawnSync as jest.Mock).mockReturnValue({});
    await addGitTag();
    expect(spawnSync).toBeCalled();
  });

  it("should not find package.json", async () => {
    (spawnSync as jest.Mock).mockReturnValue({});
    expect(addGitTag(__dirname)).rejects.toThrowError("package.json not found");
  });

  it("should not find package.json version", async () => {
    writeFileSync(localPackagePath, "{}", "utf-8");
    (spawnSync as jest.Mock).mockReturnValue({});
    expect(addGitTag(__dirname)).rejects.toThrowError(
      "package.json version not found"
    );
  });
});
