import { assert } from "chai";
import "mocha";
import { AutoPollConfiguration } from "../src/ConfigCatClientConfiguration";
import { ConfigCatClientImpl, IConfigCatClient } from "../src/ConfigCatClientImpl";
import { User } from "../src/RolloutEvaluator";

describe("ConfigCatClientImpl", () => {

  let client: IConfigCatClient = new ConfigCatClientImpl("PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A", new AutoPollConfiguration());

  it("GetValue With 'stringDefaultCat' ShouldReturnCat", (done) => {

    const defaultValue: string = "NOT_CAT";

    client.getValue("stringDefaultCat", defaultValue, null, actual => {

      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);
      done();
    });
  });

  it("GetValue With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    client.getValue("NotExistsKey", defaultValue, null, actual => {

      assert.equal(actual, defaultValue);

      done();
    });
  });

  it("GetValue With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    client.getValue("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"), actual => {

      assert.equal(actual, "Falcon");

      done();
    });
  });
});