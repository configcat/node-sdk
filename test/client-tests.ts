import { assert } from "chai";
import "mocha";
import * as configcatClient from "../src/client";
import { FlagOverrides, IConfigCatClient, PollingMode } from "configcat-common";

describe("ConfigCatClient tests", () => {

    for (let pollingMode of [PollingMode.AutoPoll, PollingMode.LazyLoad, PollingMode.ManualPoll]) {
        it(`getClient() should createInstance with ${PollingMode[pollingMode]}`, () => {

            var client: IConfigCatClient = configcatClient.getClient("SDKKEY", pollingMode);
    
            assert.isDefined(client);

            client.dispose();
        });
    }

    it("createClient() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClient("SDKKEY");

        assert.isDefined(client);
    });

    it("createClientWithAutoPoll() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithAutoPoll("SDKKEY", { "pollIntervalSeconds": 15 });

        assert.isDefined(client);

        client.dispose();
    });

    it("createClientWithLazyLoad() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithLazyLoad("SDKKEY", { "cacheTimeToLiveSeconds": 15 });

        assert.isDefined(client);
    });

    it("createClientWithManualPoll() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithManualPoll("SDKKEY");

        assert.isDefined(client);
    });

    it("createFlagOverridesFromMap() should createOverrides", () => {

        const overrides: FlagOverrides = configcatClient.createFlagOverridesFromMap({ test: true }, configcatClient.OverrideBehaviour.LocalOnly);

        assert.isDefined(overrides);
    });
});