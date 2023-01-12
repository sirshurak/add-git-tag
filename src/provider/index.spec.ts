import { Api } from "../api";
import { Config } from "../config";
import { Release } from "../release";
import { Provider } from "./index";

class TestRelease extends Release<Api> {
  do = jest.fn();
}

describe("Provider Class", () => {
  it("should call do from release", () => {
    const config = new Config();
    const release = new TestRelease(new Api({}), config);
    new Provider(config, release).doRelease("", "");
    expect(release.do).toBeCalled();
  });
});
