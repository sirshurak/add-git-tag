import axios, { CreateAxiosDefaults, AxiosInstance } from "axios";

export class Api {
  constructor(protected config: CreateAxiosDefaults) {
    this.api = axios.create(config);
  }
  protected api: AxiosInstance;
}
