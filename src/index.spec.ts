import { addGitTag } from "./index";

jest.mock("child_process", () => ({ spawnSync: jest.fn() }));
jest.mock("wait-on", () => ({ default: jest.fn(), __esModule: true }));

import { spawnSync } from "child_process";
import waitOn from "wait-on";
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
    expect(waitOn).toBeCalled();
  });

  it("should return git tag command error", async () => {
    (spawnSync as jest.Mock).mockReturnValue({ error: new Error("coverage") });
    expect(addGitTag).rejects.toThrowError("coverage");
  });

  it("should return git tag command stderr", async () => {
    (spawnSync as jest.Mock).mockReturnValue({ stderr: new Error("coverage") });
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

  it("should return git tag push command stderr", async () => {
    (spawnSync as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({})
      .mockReturnValueOnce({
        stderr: new Error("coverage"),
      });
    expect(addGitTag).rejects.toThrowError("coverage");
  });

  it("should not find file tag-description and create", async () => {
    unlinkSync(path.resolve(__dirname, "../.tag-description"));
    (spawnSync as jest.Mock).mockReturnValue({});
    await addGitTag();
    expect(spawnSync).toBeCalled();
    expect(waitOn).toBeCalled();
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
    expect(waitOn).toBeCalled();
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
