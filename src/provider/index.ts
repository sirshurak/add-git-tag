import { Api } from "../api";
import { Config } from "../config";
import { Release } from "../release";

export class Provider<S extends Api, T extends Release<S>> {
  constructor(protected config: Config, protected release: T) {}

  doRelease(name: string, description: string) {
    return this.release.do(name, description);
  }
}
