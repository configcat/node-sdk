import { assert } from "chai";
import "mocha";
import * as configcatClient from "../src/client";
import * as mockttp from "mockttp";
import { FakeLogger } from "./helpers/fakes";
import { LogLevel } from "../src/client";

describe("HTTP tests", () => {
  let server: mockttp.Mockttp;
  let sdkKey: string = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

  beforeEach(async () => {
    server = mockttp.getLocal({
      https: {
        keyPath: './test/cert/testCA.key',
        certPath: './test/cert/testCA.pem'
      }
    });
    await server.start();
  });
  afterEach(() => server.stop());

  it("HTTP timeout", async () => {
    server.forAnyRequest().thenTimeout();

    const logger = new FakeLogger();

    const client = configcatClient.createClientWithManualPoll(sdkKey, {
      requestTimeoutMs: 1000,
      baseUrl: server.url,
      logger
    });
    const startTime = new Date().getTime();
    await client.forceRefreshAsync();
    const duration = new Date().getTime() - startTime;
    assert.isTrue(duration > 1000 && duration < 2000);

    const defaultValue = "NOT_CAT";
    assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

    assert.isDefined(logger.messages.find(([level, msg]) => level == LogLevel.Error && msg.startsWith("Request timed out.")));
  });

  it("404 Not found", async () => {
    server.forAnyRequest().thenReply(404, "Not Found");

    const logger = new FakeLogger();

    const client = configcatClient.createClientWithManualPoll(sdkKey, {
      requestTimeoutMs: 1000,
      baseUrl: server.url,
      logger
    });

    await client.forceRefreshAsync();

    const defaultValue = "NOT_CAT";
    assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

    assert.isDefined(logger.messages.find(([level, msg]) => level == LogLevel.Error && msg.startsWith("Double-check your SDK Key")));
  });

  it("Unexpected status code", async () => {
    server.forAnyRequest().thenReply(502, "Bad Gateway");

    const logger = new FakeLogger();

    const client = configcatClient.createClientWithManualPoll(sdkKey, {
      requestTimeoutMs: 1000,
      baseUrl: server.url,
      logger
    });

    await client.forceRefreshAsync();

    const defaultValue = "NOT_CAT";
    assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

    assert.isDefined(logger.messages.find(([level, msg]) => level == LogLevel.Error && msg.startsWith("Unexpected HTTP response was received:")));
  });

  it("Unexpected error", async () => {
    server.forAnyRequest().thenCloseConnection();

    const logger = new FakeLogger();

    const client = configcatClient.createClientWithManualPoll(sdkKey, {
      requestTimeoutMs: 1000,
      baseUrl: server.url,
      logger
    });

    await client.forceRefreshAsync();

    const defaultValue = "NOT_CAT";
    assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

    assert.isDefined(logger.messages.find(([level, msg]) => level == LogLevel.Error && msg.startsWith("Request failed due to a network or protocol error.")));
  });

  it("HTTP proxy", async () => {
    let proxyCalled = false;
    server.forAnyRequest().forHost("cdn-global.configcat.com").thenPassThrough({
      beforeRequest: (_: any) => {
        proxyCalled = true;
      }
    });

    const client = configcatClient.createClientWithManualPoll(sdkKey, {
      proxy: server.url
    });
    await client.forceRefreshAsync();
    assert.isTrue(proxyCalled);

    const defaultValue = "NOT_CAT";
    assert.strictEqual("Cat", await client.getValueAsync("stringDefaultCat", defaultValue));
  });
});
