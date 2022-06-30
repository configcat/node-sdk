import { assert } from "chai";
import "mocha";
import { IConfigCatClient, OptionsBase } from "configcat-common";
import * as configcatClient from "../src/client";
import { User } from "configcat-common/lib/RolloutEvaluator";
import { LogLevel } from "configcat-common";
import { createConsoleLogger } from "../src/client";
import { SettingKeyValue } from "configcat-common/lib/ConfigCatClient";

describe("Integration tests", () => {

  let sdkKey: string = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

  let config: any = { logger: createConsoleLogger(LogLevel.Off) };

  let clientAutoPoll: IConfigCatClient = configcatClient.createClientWithAutoPoll(sdkKey, config);

  let clientManualPoll: IConfigCatClient = configcatClient.createClientWithManualPoll(sdkKey, config);

  let clientLazyLoad: IConfigCatClient = configcatClient.createClientWithLazyLoad(sdkKey, config);

  const clientOverride: IConfigCatClient = configcatClient.createClientWithAutoPoll(sdkKey, {
    flagOverrides: configcatClient.createFlagOverridesFromMap({ stringDefaultCat: "NOT_CAT" }, configcatClient.OverrideBehaviour.LocalOnly),
    logger: createConsoleLogger(LogLevel.Off)
  });

  it("Auto poll - getValue() with key: 'stringDefaultCat' should return 'Cat'", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getValue("stringDefaultCat", defaultValue, actual => {
      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);
      done();
    });
  });

  it("Auto poll - getValueAsync() with key: 'stringDefaultCat' should return 'Cat'", async () => {

    const defaultValue: string = "NOT_CAT";

    const actual: string = await clientAutoPoll.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, "Cat");
    assert.notStrictEqual(actual, defaultValue);

  });

  it("Manual poll - getValue() with key: 'stringDefaultCat' should return 'Cat'", (done) => {

    const defaultValue: string = "NOT_CAT";
    clientManualPoll.forceRefresh(() => {

      clientManualPoll.getValue("stringDefaultCat", defaultValue, actual => {
        assert.strictEqual(actual, "Cat");
        assert.notStrictEqual(actual, defaultValue);
        done();
      });
    });
  });

  it("Manual poll - getValueAsync() with key: 'stringDefaultCat' should return 'Cat'", async () => {

    const defaultValue: string = "NOT_CAT";
    await clientManualPoll.forceRefreshAsync();
    const actual: string = await clientManualPoll.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, "Cat");
    assert.notStrictEqual(actual, defaultValue);
  });

  it("Lazy load - getValue() with  key: 'stringDefaultCat' should return 'Cat'", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);
      done();
    });
  });

  it("Lazy load - getValueAsync() with  key: 'stringDefaultCat' should return 'Cat'", async () => {

    const defaultValue: string = "NOT_CAT";
    const actual: string = await clientLazyLoad.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, "Cat");
    assert.notStrictEqual(actual, defaultValue);
  });

  it("Auto poll - getValue() with key: 'NotExistsKey' should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getValue("NotExistsKey", defaultValue, actual => {
      assert.equal(actual, defaultValue);
      done();
    });
  });

  it("Auto poll - getValueAsync() with key: 'NotExistsKey' should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    const actual: string = await clientAutoPoll.getValueAsync("NotExistsKey", defaultValue);
    assert.equal(actual, defaultValue);
  });

  it("Manual poll - getValue() with  with key: 'NotExistsKey' should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("NotExistsKey", defaultValue, actual => {
        assert.equal(actual, defaultValue);
        done();
      });
    });
  });

  it("Manual poll - getValueAsync() with  with key: 'NotExistsKey' should return default value", async () => {

    const defaultValue: string = "NOT_CAT";

    await clientManualPoll.forceRefreshAsync();
    const actual: string = await clientManualPoll.getValueAsync("NotExistsKey", defaultValue);
    assert.equal(actual, defaultValue);
  });

  it("Lazy load - getValue() with  key: 'NotExistsKey' should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("NotExistsKey", defaultValue, actual => {
      assert.equal(actual, defaultValue);
      done();
    });
  });

  it("Lazy load - getValueAsync() with  key: 'NotExistsKey' should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    const actual: string = await clientManualPoll.getValueAsync("NotExistsKey", defaultValue);
    assert.equal(actual, defaultValue);
  });

  it("Auto poll - getValue() with key: 'RolloutEvaluate' should return default value", (done) => {

    clientAutoPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {

      assert.equal(actual, "Horse");

      done();
    },
      new User("nacho@gmail.com"));
  });

  it("Auto poll - getValueAsync() with key: 'RolloutEvaluate' should return default value", async () => {

    const actual: string = await clientAutoPoll.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
    assert.equal(actual, "Horse");
  });

  it("Manual poll - getValue() with key: 'RolloutEvaluate' should return default value", (done) => {

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {

        assert.equal(actual, "Horse");

        done();
      },
        new User("nacho@gmail.com"));
    });
  });

  it("Manual poll - getValueAsync() with key: 'RolloutEvaluate' should return default value", async () => {

    await clientManualPoll.forceRefreshAsync();
    const actual: string = await clientManualPoll.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
    assert.equal(actual, "Horse");
  });

  it("Lazy load - getValue() with key: 'RolloutEvaluate' should return default value", (done) => {

    clientLazyLoad.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {

      assert.equal(actual, "Horse");

      done();
    },
      new User("nacho@gmail.com"));
  });

  it("Lazy load - getValueAsync() with key: 'RolloutEvaluate' should return default value", async () => {

    const actual: string = await clientLazyLoad.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
    assert.equal(actual, "Horse");
  });

  it("Auto poll with wrong SDK Key - getValue() should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithAutoPoll(
      "WRONG_SDK_KEY",
      { requestTimeoutMs: 500, maxInitWaitTimeSeconds: 1 });

    client.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, defaultValue);

      done();
    });
  });

  it("Auto poll with wrong SDK Key - getValueAsync() should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithAutoPoll(
      "WRONG_SDK_KEY",
      { requestTimeoutMs: 500, maxInitWaitTimeSeconds: 1 });

    const actual: string = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, defaultValue);
  });

  it("Manual poll with wrong SDK Key - getValue() should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithManualPoll("WRONG_SDK_KEY", { requestTimeoutMs: 500 });

    client.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, defaultValue);

      client.forceRefresh(() => {
        client.getValue("stringDefaultCat", defaultValue, actual => {

          assert.strictEqual(actual, defaultValue);
          done();
        });
      });
    });
  });

  it("Manual poll with wrong SDK Key - getValueAsync() should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithManualPoll("WRONG_SDK_KEY", { requestTimeoutMs: 500 });

    const actual: string = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, defaultValue);
    await client.forceRefreshAsync();
    const actual2: string = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual2, defaultValue);
  });

  it("Lazy load with wrong SDK Key - getValue() should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithLazyLoad("WRONG_SDK_KEY", { requestTimeoutMs: 500 });

    client.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, defaultValue);
      done();
    });
  });

  it("Lazy load with wrong SDK Key - getValueAsync() should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithLazyLoad("WRONG_SDK_KEY", { requestTimeoutMs: 500 });

    const actual: string = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, defaultValue);
  });

  it("getAllKeys() should not crash with wrong SDK Key", (done) => {

    let client: IConfigCatClient = configcatClient.createClientWithManualPoll("WRONG_SDK_KEY", { requestTimeoutMs: 500 });

    client.getAllKeys(keys => {

      assert.equal(keys.length, 0);
      done();
    });
  });

  it("getAllKeysAsync() should not crash with wrong SDK Key", async () => {

    let client: IConfigCatClient = configcatClient.createClientWithManualPoll("WRONG_SDK_KEY", { requestTimeoutMs: 500 });

    const keys: string[] = await client.getAllKeysAsync();
    assert.equal(keys.length, 0);
  });

  it("getAllKeys() should return all keys", (done) => {

    clientAutoPoll.getAllKeys(keys => {

      assert.equal(keys.length, 16);
      const keysObject: any = {};
      keys.forEach(value => keysObject[value] = {});
      assert.containsAllKeys(keysObject, [
        "stringDefaultCat",
        "stringIsInDogDefaultCat",
        "stringIsNotInDogDefaultCat",
        "stringContainsDogDefaultCat",
        "stringNotContainsDogDefaultCat",
        "string25Cat25Dog25Falcon25Horse",
        "string75Cat0Dog25Falcon0Horse",
        "string25Cat25Dog25Falcon25HorseAdvancedRules",
        "boolDefaultTrue",
        "boolDefaultFalse",
        "bool30TrueAdvancedRules",
        "integer25One25Two25Three25FourAdvancedRules",
        "integerDefaultOne",
        "doubleDefaultPi",
        "double25Pi25E25Gr25Zero",
        "keySampleText"
      ]);
      done();
    });
  });

  it("getAllKeysAsync() should return all keys", async () => {

    const keys: string[] = await clientAutoPoll.getAllKeysAsync();

    assert.equal(keys.length, 16);
    const keysObject: any = {};
    keys.forEach(value => keysObject[value] = {});
    assert.containsAllKeys(keysObject, [
      "stringDefaultCat",
      "stringIsInDogDefaultCat",
      "stringIsNotInDogDefaultCat",
      "stringContainsDogDefaultCat",
      "stringNotContainsDogDefaultCat",
      "string25Cat25Dog25Falcon25Horse",
      "string75Cat0Dog25Falcon0Horse",
      "string25Cat25Dog25Falcon25HorseAdvancedRules",
      "boolDefaultTrue",
      "boolDefaultFalse",
      "bool30TrueAdvancedRules",
      "integer25One25Two25Three25FourAdvancedRules",
      "integerDefaultOne",
      "doubleDefaultPi",
      "double25Pi25E25Gr25Zero",
      "keySampleText"
    ]);
  });


  it("Auto poll - getVariationId() works", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getVariationId("stringDefaultCat", defaultValue, actual => {
      assert.strictEqual(actual, "7a0be518");

      clientAutoPoll.getVariationId("boolDefaultTrue", defaultValue, actual => {
        assert.strictEqual(actual, "09513143");
        done();
      });
    });
  });

  it("Auto poll - getVariationId() works", async () => {

    const defaultValue: string = "NOT_CAT";

    let actual: string = await clientAutoPoll.getVariationIdAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, "7a0be518");

    actual = await clientAutoPoll.getVariationIdAsync("boolDefaultTrue", defaultValue);
    assert.strictEqual(actual, "09513143");
  });

  it("Auto poll - getVariationIds() works", async () => {

    clientAutoPoll.getAllVariationIds(actual => {
      assert.equal(actual.length, 16);
      assert.strictEqual(actual[0], "7a0be518");
      assert.strictEqual(actual[1], "83372510");
      assert.strictEqual(actual[2], "2459598d");
      assert.strictEqual(actual[3], "ce564c3a");
      assert.strictEqual(actual[4], "44ab483a");
      assert.strictEqual(actual[5], "2588a3e6");
      assert.strictEqual(actual[6], "aa65b5ce");
      assert.strictEqual(actual[7], "8250ef5a");
      assert.strictEqual(actual[8], "09513143");
      assert.strictEqual(actual[9], "489a16d2");
      assert.strictEqual(actual[10], "607147d5");
      assert.strictEqual(actual[11], "ce3c4f5a");
      assert.strictEqual(actual[12], "faadbf54");
      assert.strictEqual(actual[13], "5af8acc7");
      assert.strictEqual(actual[14], "9503a1de");
      assert.strictEqual(actual[15], "69ef126c");
    });
  });

  it("Auto poll - getVariationIdsAsync() works", async () => {

    let actual: string[] = await clientAutoPoll.getAllVariationIdsAsync();
    assert.equal(actual.length, 16);
    assert.strictEqual(actual[0], "7a0be518");
    assert.strictEqual(actual[1], "83372510");
    assert.strictEqual(actual[2], "2459598d");
    assert.strictEqual(actual[3], "ce564c3a");
    assert.strictEqual(actual[4], "44ab483a");
    assert.strictEqual(actual[5], "2588a3e6");
    assert.strictEqual(actual[6], "aa65b5ce");
    assert.strictEqual(actual[7], "8250ef5a");
    assert.strictEqual(actual[8], "09513143");
    assert.strictEqual(actual[9], "489a16d2");
    assert.strictEqual(actual[10], "607147d5");
    assert.strictEqual(actual[11], "ce3c4f5a");
    assert.strictEqual(actual[12], "faadbf54");
    assert.strictEqual(actual[13], "5af8acc7");
    assert.strictEqual(actual[14], "9503a1de");
    assert.strictEqual(actual[15], "69ef126c");
  });

  it("getAllValues() should return all values", (done) => {
    clientAutoPoll.getAllValues((sks) => {

      const settingKeys: any = {};

      sks.forEach((i) => (settingKeys[i.settingKey] = i.settingValue));

      assert.equal(sks.length, 16);

      assert.equal(settingKeys.stringDefaultCat, "Cat");
      assert.equal(settingKeys.stringIsInDogDefaultCat, "Cat");
      assert.equal(settingKeys.stringIsNotInDogDefaultCat, "Cat");
      assert.equal(settingKeys.stringContainsDogDefaultCat, "Cat");
      assert.equal(settingKeys.stringNotContainsDogDefaultCat, "Cat");
      assert.equal(settingKeys.string25Cat25Dog25Falcon25Horse, "Chicken");
      assert.equal(settingKeys.string75Cat0Dog25Falcon0Horse, "Chicken");
      assert.equal(settingKeys.string25Cat25Dog25Falcon25HorseAdvancedRules, "Chicken");
      assert.equal(settingKeys.boolDefaultTrue, true);
      assert.equal(settingKeys.boolDefaultFalse, false);
      assert.equal(settingKeys.bool30TrueAdvancedRules, true);
      assert.equal(settingKeys.integer25One25Two25Three25FourAdvancedRules, -1);
      assert.equal(settingKeys.integerDefaultOne, 1);
      assert.equal(settingKeys.doubleDefaultPi, 3.1415);
      assert.equal(settingKeys.double25Pi25E25Gr25Zero, -1);
      assert.equal(settingKeys.keySampleText, "Cat");

      done();
    });
  });

  it("getAllValuesAsync() should return all values", async () => {
    let sks: SettingKeyValue[] = await clientAutoPoll.getAllValuesAsync();
    const settingKeys: any = {};
    sks.forEach((i) => (settingKeys[i.settingKey] = i.settingValue));
    assert.equal(sks.length, 16);
    assert.equal(settingKeys.stringDefaultCat, "Cat");
    assert.equal(settingKeys.stringIsInDogDefaultCat, "Cat");
    assert.equal(settingKeys.stringIsNotInDogDefaultCat, "Cat");
    assert.equal(settingKeys.stringContainsDogDefaultCat, "Cat");
    assert.equal(settingKeys.stringNotContainsDogDefaultCat, "Cat");
    assert.equal(settingKeys.string25Cat25Dog25Falcon25Horse, "Chicken");
    assert.equal(settingKeys.string75Cat0Dog25Falcon0Horse, "Chicken");
    assert.equal(settingKeys.string25Cat25Dog25Falcon25HorseAdvancedRules, "Chicken");
    assert.equal(settingKeys.boolDefaultTrue, true);
    assert.equal(settingKeys.boolDefaultFalse, false);
    assert.equal(settingKeys.bool30TrueAdvancedRules, true);
    assert.equal(settingKeys.integer25One25Two25Three25FourAdvancedRules, -1);
    assert.equal(settingKeys.integerDefaultOne, 1);
    assert.equal(settingKeys.doubleDefaultPi, 3.1415);
    assert.equal(settingKeys.double25Pi25E25Gr25Zero, -1);
    assert.equal(settingKeys.keySampleText, "Cat");
  });

  it("Override - local only", async () => {
    const defaultValue = "DEFAULT_CAT";

    let actual: string = await clientOverride.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, "NOT_CAT");
  });

  it("HTTP timeout", async () => {
    const mockttp = require('mockttp');
    const server = mockttp.getLocal({
      https: {
        keyPath: './test/cert/testCA.key',
        certPath: './test/cert/testCA.pem'
      }
    });
    server.forAnyRequest().thenTimeout();
    await server.start();

    const client = configcatClient.createClientWithManualPoll(sdkKey, {
      requestTimeoutMs: 1000,
      baseUrl: server.url
    });
    const startTime = new Date().getTime();
    await client.forceRefreshAsync();
    const duration = new Date().getTime() - startTime;
    assert.isTrue(duration > 1000 && duration < 2000);

    const defaultValue = "NOT_CAT"
    assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

    await server.stop();
  });

  it("HTTP proxy", async () => {
    const mockttp = require('mockttp');
    const server = mockttp.getLocal({
      https: {
        keyPath: './test/cert/testCA.key',
        certPath: './test/cert/testCA.pem'
      }
    });
    let proxyCalled = false;
    server.forAnyRequest().forHost("cdn-global.configcat.com").thenPassThrough({
      beforeRequest: (_: any) => {
        proxyCalled = true;
      }
    });
    await server.start();

    const client = configcatClient.createClientWithManualPoll(sdkKey, {
      proxy: server.url
    });
    await client.forceRefreshAsync();
    assert.isTrue(proxyCalled);

    const defaultValue = "NOT_CAT"
    assert.strictEqual("Cat", await client.getValueAsync("stringDefaultCat", defaultValue));

    await server.stop();
  });
});