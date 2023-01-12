jest.mock("axios", () => ({
  default: {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
    })),
  },
  __esModule: true,
}));

import axios from "axios";

import { JiraApi } from "./jira";

describe("JiraApi Class", () => {
  it("should create axios instance", () => {
    new JiraApi("username", "password", "url");
    expect(axios.create).toBeCalledWith({
      baseURL: "url",
      auth: {
        username: "username",
        password: "password",
      },
    });
  });

  it("should searchProject", async () => {
    const api = new JiraApi("username", "password", "url");
    (api["api"].get as jest.Mock).mockResolvedValue({ data: {} });
    await api.searchProject("name");
    expect(api["api"].get).toBeCalled();
  });

  it("should searchVersion", async () => {
    const api = new JiraApi("username", "password", "url");
    (api["api"].get as jest.Mock).mockResolvedValue({ data: {} });
    await api.searchVersion("name", "id");
    expect(api["api"].get).toBeCalled();
  });

  it("should getIssue", async () => {
    const api = new JiraApi("username", "password", "url");
    (api["api"].get as jest.Mock).mockResolvedValue({ data: {} });
    await api.getIssue("id");
    expect(api["api"].get).toBeCalled();
  });

  it("should updateIssue", async () => {
    const api = new JiraApi("username", "password", "url");
    (api["api"].put as jest.Mock).mockResolvedValue({ data: {} });
    await api.updateIssue("id", {});
    expect(api["api"].put).toBeCalled();
  });

  it("should createVersion", async () => {
    const api = new JiraApi("username", "password", "url");
    (api["api"].post as jest.Mock).mockResolvedValue({ data: {} });
    await api.createVersion({});
    expect(api["api"].post).toBeCalled();
  });
});
