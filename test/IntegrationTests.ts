import { assert } from "chai";
import "mocha";
import { AutoPollConfiguration, ManualPollConfiguration, LazyLoadConfiguration } from "../src/ConfigCatClientConfiguration";
import { ConfigCatClientImpl, IConfigCatClient } from "../src/ConfigCatClientImpl";
import { User } from "../src/RolloutEvaluator";

describe("Integration - ConfigCatClient", () => {

  let clientAutoPoll: IConfigCatClient = new ConfigCatClientImpl(
    "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A",
    new AutoPollConfiguration());

  let clientManualPoll: IConfigCatClient = new ConfigCatClientImpl(
    "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A",
    new ManualPollConfiguration());

  let clientLazyLoad: IConfigCatClient = new ConfigCatClientImpl(
    "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A",
    new LazyLoadConfiguration());

  it("GetValue - AutoPoll - With 'stringDefaultCat' ShouldReturnCat", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getValue("stringDefaultCat", defaultValue, null, actual => {

      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);

      done();
    });
  });

  it("GetValue - ManualPoll - With 'stringDefaultCat' ShouldReturnCat", (done) => {

    const defaultValue: string = "NOT_CAT";
    clientManualPoll.forceRefresh(() => {

      clientManualPoll.getValue("stringDefaultCat", defaultValue, null, actual => {

        assert.strictEqual(actual, "Cat");

        assert.notStrictEqual(actual, defaultValue);

        done();
      });
    });
  });

  it("GetValue - LazyLoad - With 'stringDefaultCat' ShouldReturnCat", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("stringDefaultCat", defaultValue, null, actual => {

      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);

      done();
    });
  });

  it("GetValue - AutoPoll - With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getValue("NotExistsKey", defaultValue, null, actual => {

      assert.equal(actual, defaultValue);

      done();
    });
  });

  it("GetValue - ManualPoll - With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("NotExistsKey", defaultValue, null, actual => {

        assert.equal(actual, defaultValue);

        done();
      });
    });
  });

  it("GetValue - LazyLoad - With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("NotExistsKey", defaultValue, null, actual => {

      assert.equal(actual, defaultValue);

      done();
    });
  });

  it("GetValue - AutoPoll - With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    clientAutoPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"), actual => {

      assert.equal(actual, "Dog");

      done();
    });
  });

  it("GetValue - ManualPoll - With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"), actual => {

        assert.equal(actual, "Dog");

        done();
      });
    });
  });

  it("GetValue - LazyLoad - With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    clientLazyLoad.getValue("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"), actual => {

      assert.equal(actual, "Dog");

      done();
    });
  });
});