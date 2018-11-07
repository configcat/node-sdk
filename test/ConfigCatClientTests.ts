import { ConfigCatClientImpl, IConfigCatClient } from "../src/ConfigCatClientImpl";
import { assert, expect } from "chai";
import "mocha";
import { ManualPollConfiguration, AutoPollConfiguration, LazyLoadConfiguration } from "../src/ConfigCatClientConfiguration";

describe("Configuration", () => {

  it("Initialization With NULL 'logger' ShouldThrowError", () => {

    expect(() => {

      let config: ManualPollConfiguration = new ManualPollConfiguration();
      config.logger = null;

      let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", config);
    }).to.throw("Invalid 'logger' instance");
  });

  it("Initialization With NULL 'apiKey' ShouldThrowError", () => {

    expect(() => {

      let client: IConfigCatClient = new ConfigCatClientImpl(null, new ManualPollConfiguration());
    }).to.throw("Invalid 'apiKey' value");
  });

  it("Initialization With NULL 'configuration' Should create an instance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", null);

    assert.isDefined(client);
  });

  it("Initialization With 'LazyLoadConfiguration' Should create an instance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new LazyLoadConfiguration());

    assert.isDefined(client);
  });

  it("Initialization With 'ManualPollConfiguration' Should create an instance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new ManualPollConfiguration());

    assert.isDefined(client);
  });

  it("Initialization With 'LazyLoadConfiguration' Should create an instance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new LazyLoadConfiguration());

    assert.isDefined(client);
  });

  it("Initialization With 'AutoPollConfiguration' Should create an instance", () => {

    let client: IConfigCatClient = new ConfigCatClientImpl("APIKEY", new AutoPollConfiguration());

    assert.isDefined(client);
  });
});