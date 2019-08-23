import { assert } from "chai";
import "mocha";
import * as configcatClient from "../src/client";
import { IConfigCatClient } from "configcat-common/lib/ConfigCatClient";

describe("ConfigCatClient tests", () => {

    it("createClient() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClient("APIKEY");

        assert.isDefined(client);
    });

    it("createClientWithAutoPoll() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithAutoPoll("APIKEY", { "pollIntervalSeconds": 15 });

        assert.isDefined(client);
    });

    it("createClientWithLazyLoad() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithLazyLoad("APIKEY", { "cacheTimeToLiveSeconds": 15 });

        assert.isDefined(client);
    });

    it("createClientWithManualPoll() should createInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithManualPoll("APIKEY");

        assert.isDefined(client);
    });
});