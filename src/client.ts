import * as configcatcommon from "configcat-common";
import { HttpConfigFetcher } from "./config-fetcher";
import { InMemoryCache } from "configcat-common/lib/Cache";
import { IConfigCatClient } from "configcat-common/lib/ConfigCatClient";

/** Create an instance of ConfigCatClient and setup Auto Polling mode with default options */
export function createClient(apiKey: string): IConfigCatClient {
    return this.createClientWithAutoPoll(apiKey);
}

/**
 * Create an instance of ConfigCatClient and setup Auto Polling mode with custom options
 * @param {string} apiKey - ConfigCat ApiKey to access your configuration.
 * @param options - Options for Auto Polling
 */
export function createClientWithAutoPoll(apiKey: string, options?: INodeAutoPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithAutoPoll(apiKey, { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache() }, options);
}

/**
 * Create an instance of ConfigCatClient and setup Manual Polling mode with custom options
 * @param {string} apiKey - ConfigCat ApiKey to access your configuration.
 * @param options - Options for Manual Polling
 */
export function createClientWithManualPoll(apiKey: string, options?: INodeManualPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithManualPoll(apiKey, { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache() }, options)
}

/**
 * Create an instance of ConfigCatClient and setup Lazy Loading mode with custom options
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