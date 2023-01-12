import { dispatch, withErrors } from "./cli";

jest.mock("./index", () => ({
  addGitTag: jest.fn(),
  defaultGitTagOptions: {},
}));

import { addGitTag, defaultGitTagOptions } from "./index";

describe("client tests", () => {
  it("should call dispatch", async () => {
    const obj = { option: true };
    await dispatch(obj);
    expect(addGitTag).toHaveBeenCalledWith(obj);
  });

  it("should fail call withErrors", async () => {
    const errorFunc = jest.fn(() => {
      throw new Error("test");
    });
    await withErrors(errorFunc)();
    expect(errorFunc).toBeCalled();
    expect(process.exitCode).toBe(1);
  });
});
