import { assert } from "chai";
import "mocha";
import * as configcatClient from "../src/index";
import { IConfigCatClient } from "../src/ConfigCatClientImpl";
import { FakeConfigFetcher } from "./ConfigCatClientTests";
import { InMemoryCache } from "../src/Cache";

describe("ConfigCatClient index (main)", () => {

    it("createClient ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClient("APIKEY", { configFetcher: new FakeConfigFetcher(), cache: new InMemoryCache() });

        assert.isDefined(client);
    });

    it("createClientWithAutoPoll ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithAutoPoll("APIKEY", { configFetcher: new FakeConfigFetcher(), cache: new InMemoryCache() }, { "pollIntervalSeconds": 15 });

        assert.isDefined(client);
    });

    it("createClientWithLazyLoad ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithLazyLoad("APIKEY", { configFetcher: new FakeConfigFetcher(), cache: new InMemoryCache() }, { "cacheTimeToLiveSeconds": 15 });

        assert.isDefined(client);
    });

    it("createClientWithManualPoll ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithManualPoll("APIKEY", { configFetcher: new FakeConfigFetcher(), cache: new InMemoryCache() }, { "maxInitWaitTimeSeconds": 15 });

        assert.isDefined(client);
    });
});