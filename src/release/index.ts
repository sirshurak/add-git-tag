import { Api } from "../api";
import { Config } from "../config";

export abstract class Release<T extends Api> {
  constructor(protected api: T, protected config: Config) {}

  abstract do(name: string, description: string);
}
