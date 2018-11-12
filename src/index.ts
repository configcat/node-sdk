import * as configcatcommon from "configcat-common";
import { HttpConfigFetcher } from "./ConfigFetcher";
import { InMemoryCache } from "configcat-common/lib/Cache";
import { IConfigCatClient } from "configcat-common/lib/ConfigCatClient";

const VERSION: string = require("../package.json").version;

/** Create an instance of ConfigCatClient and setup Auto Poll mode with default options */
export function createClient(apiKey: string): IConfigCatClient {
    return this.createClientWithAutoPoll(apiKey);
}

/**
 * Create an instance of ConfigCatClient and setup Auto Poll mode with custom options
 * @param {string} apiKey - ConfigCat ApiKey to access your configuration.
 * @param options - Options for Auto Polling
 */
export function createClientWithAutoPoll(apiKey: string, options?: INodeAutoPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithAutoPoll(apiKey, { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache() }, options);
}

/**
 * Create an instance of ConfigCatClient and setup Manual Poll mode with custom options
 * @param {string} apiKey - ConfigCat ApiKey to access your configuration.
 * @param options - Options for Manual Polling
 */
export function createClientWithManualPoll(apiKey: string, options?: INodeManualPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithManualPoll(apiKey, { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache() }, options)
}

/**
 * Create an instance of ConfigCatClient and setup Lazy Load mode with custom options
 * @param {string} apiKey - ConfigCat ApiKey to access your configuration.
 * @param options - Option for Lazy Loading
 */
export function createClientWithLazyLoad(apiKey: string, options?: INodeLazyLoadingOptions): IConfigCatClient {
    return configcatcommon.createClientWithLazyLoad(apiKey, { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache() }, options);
}

export interface INodeAutoPollOptions extends configcatcommon.IAutoPollOptions {
}

export interface INodeLazyLoadingOptions extends configcatcommon.ILazyLoadingOptions {
}

export interface INodeManualPollOptions extends configcatcommon.IManualPollOptions {
}