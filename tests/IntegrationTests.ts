import { ConfigCatClientImpl, IConfigCatClient } from "../src/ConfigCatClientImpl";
import { assert, expect } from "chai";
import "mocha";
import { ManualPollConfiguration, AutoPollConfiguration } from "../src/ConfigCatClientConfiguration";

describe("ConfigCatClientImpl", () => {

  let client: IConfigCatClient = new ConfigCatClientImpl("PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A", new AutoPollConfiguration());

  it("GetValue With 'stringDefaultCat' ShouldReturnCat", () => {

    const defaultValue: string = "NOT_CAT";

    client.getValue("stringDefaultCat", defaultValue, null, actual => {

      assert.equal(actual, "Cat");
      assert.notEqual(actual, defaultValue);
    });
  });

  it("GetValue With 'NotExistsKey' ShouldReturnDefaultValue", () => {

    const defaultValue: string = "NOT_CAT";

    client.getValue("NotExistsKey", defaultValue, null, actual => {

      assert.equal(actual, defaultValue);
    });
  });
});