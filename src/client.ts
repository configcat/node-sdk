import * as configcatcommon from "configcat-common";
import { FlagOverrides, IAutoPollOptions, IConfigCatClient, IConfigCatLogger, ILazyLoadingOptions, IManualPollOptions, InMemoryCache, LogLevel, MapOverrideDataSource, PollingMode } from "configcat-common";
import { HttpConfigFetcher } from "./config-fetcher";
import CONFIGCAT_SDK_VERSION from "./version";

/**
 * Returns an instance of ConfigCatClient for the specified SDK Key.
 * @remarks This method returns a single, shared instance per each distinct SDK Key.
 * That is, a new client object is created only when there is none available for the specified SDK Key.
 * Otherwise, the already created instance is returned (in which case the 'pollingMode', 'options' and 'configCatKernel' arguments are ignored).
 * So, please keep in mind that when you make multiple calls to this method using the same SDK Key, you may end up with multiple references to the same client object.
 * @param sdkKey SDK Key to access configuration
 * @param pollingMode The polling mode to use
 * @param options Options for the specified polling mode
 */
export function getClient<TMode extends PollingMode | undefined>(sdkKey: string, pollingMode?: TMode, options?: OptionsForPollingMode<TMode>): IConfigCatClient {
    return configcatcommon.getClient(sdkKey, pollingMode ?? PollingMode.AutoPoll, options,
        {
            configFetcher: new HttpConfigFetcher(),
            cache: new InMemoryCache(),
            sdkType: "ConfigCat-Node",
            sdkVersion: CONFIGCAT_SDK_VERSION
        });
}

/**
 * Disposes all existing ConfigCatClient instances.
 */
export function disposeAllClients(): void {
    configcatcommon.disposeAllClients();
}

/** Create an instance of ConfigCatClient and setup Auto Polling mode with default options
 * @param {string} sdkKey - ConfigCat SdkKey to access your configuration.
 * @param options - Options for Auto Polling
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with auto polling for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.AutoPoll, options, ...)' format.
 */
export function createClient(sdkKey: string, options?: INodeAutoPollOptions): IConfigCatClient {
    return createClientWithAutoPoll(sdkKey, options);
}

/**
 * Create an instance of ConfigCatClient and setup Auto Polling mode with custom options
 * @param {string} sdkKey - ConfigCat SdkKey to access your configuration.
 * @param options - Options for Auto Polling
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with auto polling for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.AutoPoll, options, ...)' format.
 */
export function createClientWithAutoPoll(sdkKey: string, options?: INodeAutoPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithAutoPoll(
        sdkKey,
        {
            configFetcher: new HttpConfigFetcher(),
            cache: new InMemoryCache(),
            sdkType: "ConfigCat-Node",
            sdkVersion: CONFIGCAT_SDK_VERSION
        },
        options);
}

/**
 * Create an instance of ConfigCatClient and setup Manual Polling mode with custom options
 * @param {string} sdkKey - ConfigCat SdkKey to access your configuration.
 * @param options - Options for Manual Polling
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with manual polling for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.ManualPoll, options, ...)' format.
 */
export function createClientWithManualPoll(sdkKey: string, options?: INodeManualPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithManualPoll(
        sdkKey,
        {
            configFetcher: new HttpConfigFetcher(),
            cache: new InMemoryCache(),
            sdkType: "ConfigCat-Node",
            sdkVersion: CONFIGCAT_SDK_VERSION
        },
        options);
}

/**
 * Create an instance of ConfigCatClient and setup Lazy Loading mode with custom options
 * @param {string} sdkKey - ConfigCat SdkKey to access your configuration.
 * @param options - Option for Lazy Loading
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with lazy loading for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.LazyLoad, options, ...)' format.
 */
export function createClientWithLazyLoad(sdkKey: string, options?: INodeLazyLoadingOptions): IConfigCatClient {
    return configcatcommon.createClientWithLazyLoad(
        sdkKey,
        {
            configFetcher: new HttpConfigFetcher(),
            cache: new InMemoryCache(),
            sdkType: "ConfigCat-Node",
            sdkVersion: CONFIGCAT_SDK_VERSION
        },
        options);
}

/**
 * Create an instance of ConfigCatConsoleLogger
 * @param logLevel Specifies message's filtering to output for the CofigCatConsoleLogger.
 */
export function createConsoleLogger(logLevel: LogLevel): IConfigCatLogger {
    return configcatcommon.createConsoleLogger(logLevel);
}

export function createFlagOverridesFromMap(map: { [name: string]: any }, behaviour: number): FlagOverrides {
    return new FlagOverrides(new MapOverrideDataSource(map), behaviour);
}

export interface INodeAutoPollOptions extends IAutoPollOptions {
}

export interface INodeLazyLoadingOptions extends ILazyLoadingOptions {
}

export interface INodeManualPollOptions extends IManualPollOptions {
}

export type OptionsForPollingMode<TMode extends PollingMode | undefined> =
    TMode extends PollingMode.AutoPoll ? INodeAutoPollOptions :
    TMode extends PollingMode.ManualPoll ? INodeManualPollOptions :
    TMode extends PollingMode.LazyLoad ? INodeLazyLoadingOptions :
    TMode extends undefined ? INodeAutoPollOptions :
    never;

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