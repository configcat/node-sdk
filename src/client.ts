import * as configcatcommon from "configcat-common";
import { HttpConfigFetcher } from "./config-fetcher";
import { InMemoryCache } from "configcat-common/lib/Cache";
import { IConfigCatClient } from "configcat-common/lib/ConfigCatClient";
import { LogLevel } from "configcat-common/lib/index";

/** Create an instance of ConfigCatClient and setup Auto Polling mode with default options
 * @param {string} sdkKey - ConfigCat SdkKey to access your configuration.
 * @param options - Options for Auto Polling
 */
export function createClient(sdkKey: string, options?: INodeAutoPollOptions): IConfigCatClient {
    return this.createClientWithAutoPoll(sdkKey, options);
}

/**
 * Create an instance of ConfigCatClient and setup Auto Polling mode with custom options
 * @param {string} sdkKey - ConfigCat SdkKey to access your configuration.
 * @param options - Options for Auto Polling
 */
export function createClientWithAutoPoll(sdkKey: string, options?: INodeAutoPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithAutoPoll(
        sdkKey,
        { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache() },
        options);
}

/**
 * Create an instance of ConfigCatClient and setup Manual Polling mode with custom options
 * @param {string} sdkKey - ConfigCat SdkKey to access your configuration.
 * @param options - Options for Manual Polling
 */
export function createClientWithManualPoll(sdkKey: string, options?: INodeManualPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithManualPoll(
        sdkKey,
        { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache() },
        options);
}

/**
 * Create an instance of ConfigCatClient and setup Lazy Loading mode with custom options
 * @param {string} sdkKey - ConfigCat SdkKey to access your configuration.
 * @param options - Option for Lazy Loading
 */
export function createClientWithLazyLoad(sdkKey: string, options?: INodeLazyLoadingOptions): IConfigCatClient {
    return configcatcommon.createClientWithLazyLoad(
        sdkKey,
        { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache() },
        options);
}

/**
 * Create an instance of ConfigCatConsoleLogger
 * @param logLevel Specifies message's filtering to output for the CofigCatConsoleLogger.
 */
export function createConsoleLogger(logLevel: LogLevel): configcatcommon.IConfigCatLogger {
    return configcatcommon.createConsoleLogger(logLevel);
}

export interface INodeAutoPollOptions extends configcatcommon.IAutoPollOptions {
}

export interface INodeLazyLoadingOptions extends configcatcommon.ILazyLoadingOptions {
}

export interface INodeManualPollOptions extends configcatcommon.IManualPollOptions {
}

export const DataGovernance = {
    /** Select this if your feature flags are published to all global CDN nodes. */
    Global: configcatcommon.DataGovernance.Global,
    /** Select this if your feature flags are published to CDN nodes only in the EU. */
    EuOnly: configcatcommon.DataGovernance.EuOnly
};
