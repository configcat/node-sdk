import { assert } from "chai";
import "mocha";
import * as configcatClient from "../src/client";
import { IConfigCatClient } from "configcat-common/lib/ConfigCatClient";

describe("ConfigCatClient tests", () => {

    it("createClient() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClient("SDKKEY");

        assert.isDefined(client);
    });

    it("createClientWithAutoPoll() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithAutoPoll("SDKKEY", { "pollIntervalSeconds": 15 });

        assert.isDefined(client);
    });

    it("createClientWithLazyLoad() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithLazyLoad("SDKKEY", { "cacheTimeToLiveSeconds": 15 });

        assert.isDefined(client);
    });

    it("createClientWithManualPoll() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithManualPoll("SDKKEY");

        assert.isDefined(client);
    });
});