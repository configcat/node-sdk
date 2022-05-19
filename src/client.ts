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
    return createClientWithAutoPoll(sdkKey, options);
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

export function createFlagOverridesFromMap(map: { [name: string]: any }, behaviour: number): configcatcommon.FlagOverrides {
    return new configcatcommon.FlagOverrides(new configcatcommon.MapOverrideDataSource(map), behaviour);
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

export const OverrideBehaviour = {
    /**
     * When evaluating values, the SDK will not use feature flags and settings from the ConfigCat CDN, but it will use
     * all feature flags and settings that are loaded from local-override sources.
     */
    LocalOnly: configcatcommon.OverrideBehaviour.LocalOnly,
    /**
     * When evaluating values, the SDK will use all feature flags and settings that are downloaded from the ConfigCat CDN,
     * plus all feature flags and settings that are loaded from local-override sources. If a feature flag or a setting is
     * defined both in the fetched and the local-override source then the local-override version will take precedence.
     */
    LocalOverRemote: configcatcommon.OverrideBehaviour.LocalOverRemote,
    /**
     * When evaluating values, the SDK will use all feature flags and settings that are downloaded from the ConfigCat CDN,
     * plus all feature flags and settings that are loaded from local-override sources. If a feature flag or a setting is
     * defined both in the fetched and the local-override source then the fetched version will take precedence.
     */
    RemoteOverLocal: configcatcommon.OverrideBehaviour.RemoteOverLocal,
};
