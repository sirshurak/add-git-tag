jest.mock("axios", () => ({
  default: {
    create: jest.fn(),
  },
  __esModule: true,
}));

import axios from "axios";

import { Api } from "./index";

describe("Api Class", () => {
  it("should create axios instance", () => {
    new Api({});
    expect(axios.create).toBeCalledWith({});
  });
});
