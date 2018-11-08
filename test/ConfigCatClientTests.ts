import { ConfigCatClientImpl, IConfigCatClient } from "../src/ConfigCatClientImpl";
import { assert, expect } from "chai";
import "mocha";
import { ManualPollConfiguration, AutoPollConfiguration, LazyLoadConfiguration } from "../src/ConfigCatClientConfiguration";
import { IConfigFetcher } from "../src/.";
import { ProjectConfig } from "../src/ProjectConfigService";

describe("Configuration", () => {

  it("Initialization With NULL 'logger' ShouldThrowError", () => {

    expect(() => {

      let config: ManualPollConfiguration = new ManualPollConfiguration();
      config.logger = null;

      let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new FakeConfigFetcher(), config);
    }).to.throw("Invalid 'logger' instance");
  });

  it("Initialization With NULL 'apiKey' ShouldThrowError", () => {

    expect(() => {

      let client: IConfigCatClient = new ConfigCatClientImpl(null, new FakeConfigFetcher(), new ManualPollConfiguration());
    }).to.throw("Invalid 'apiKey' value");
  });

  it("Initialization With NULL 'configuration' Should crea(e an ins,ance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new FakeConfigFetcher());

    assert.isDefined(client);
  });

  it("Initialization With 'LazyLoadConfiguration' Should create an instance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new FakeConfigFetcher(), new LazyLoadConfiguration());

    assert.isDefined(client);
  });

  it("Initialization With 'ManualPollConfiguration' Should create an instance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new FakeConfigFetcher(), new ManualPollConfiguration());

    assert.isDefined(client);
  });

  it("Initialization With 'LazyLoadConfiguration' Should create an instance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new FakeConfigFetcher(), new LazyLoadConfiguration());

    assert.isDefined(client);
  });

  it("Initialization With 'AutoPollConfiguration' Should create an instance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new FakeConfigFetcher(), new AutoPollConfiguration());

    assert.isDefined(client);
  });
});

export class FakeConfigFetcher implements IConfigFetcher {
  fetchLogic(lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {
    if (callback) {
      callback(new ProjectConfig(0, "", ""));
    }
  }
}