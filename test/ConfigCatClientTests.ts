import { ConfigCatClientImpl, IConfigCatClient } from "../src/ConfigCatClientImpl";
import { assert, expect } from "chai";
import "mocha";
import { ManualPollConfiguration, AutoPollConfiguration } from "../src/ConfigCatClientConfiguration";

describe("Configuration", () => {

  it("Initialization With NULL logger ShouldThrowError", () => {

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
});