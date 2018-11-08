import { ConfigCatClientImpl, IConfigCatClient } from "./ConfigCatClientImpl";
import { AutoPollConfiguration, ManualPollConfiguration, LazyLoadConfiguration } from "./ConfigCatClientConfiguration";
import { ProjectConfig } from "./ProjectConfigService";

/** Create an instance of ConfigCatClient and setup AutoPool mode with default settings */
export function createClient(apiKey: string, configCatKernel: IConfigCatKernel): IConfigCatClient {
    return createClientWithAutoPoll(apiKey, configCatKernel, new AutoPollConfiguration());
}

export interface IConfigCatKernel{
    configFetcher: IConfigFetcher;
    cache: ICache;
}

/**
 * Create an instance of ConfigCatClient and setup AutoPoll mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for autoPoll mode
 */
export function createClientWithAutoPoll(apiKey: string, configCatKernel: IConfigCatKernel, config?: IConfigurationOptions): IConfigCatClient {

    let c: AutoPollConfiguration = new AutoPollConfiguration();

    if (config && config.maxInitWaitTimeSeconds) {
        c.maxInitWaitTimeSeconds = config.maxInitWaitTimeSeconds;
    }

    if (config && config.pollIntervalSeconds) {
        c.pollIntervalSeconds = config.pollIntervalSeconds;
    }

    if (config && config.configChanged) {
        c.configChanged = config.configChanged;
    }

    if (config && config.logger) {
        c.logger = config.logger;
    }

    var result: ConfigCatClientImpl = new ConfigCatClientImpl(apiKey, configCatKernel.configFetcher, c, configCatKernel.cache);

    return result;
}

/**
 * Create an instance of ConfigCatClient and setup ManualPoll mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for manualPoll mode
 */
export function createClientWithManualPoll(apiKey: string, configCatKernel: IConfigCatKernel, config?: IConfigurationOptions): IConfigCatClient {

    let c: ManualPollConfiguration = new ManualPollConfiguration();

    if (config && config.logger) {
        c.logger = config.logger;
    }

    var result: ConfigCatClientImpl = new ConfigCatClientImpl(apiKey, configCatKernel.configFetcher, c, configCatKernel.cache);

    return result;
}

/**
 * Create an instance of ConfigCatClient and setup LazyLoad mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for lazyLoad mode
 */
export function createClientWithLazyLoad(apiKey: string, configCatKernel: IConfigCatKernel, config?: IConfigurationOptions): IConfigCatClient {

    let c: LazyLoadConfiguration = new LazyLoadConfiguration();

    if (config && config.logger) {
        c.logger = config.logger;
    }

    if (config && config.cacheTimeToLiveSeconds) {
        c.cacheTimeToLiveSeconds = config.cacheTimeToLiveSeconds;
    }

    var result: ConfigCatClientImpl = new ConfigCatClientImpl(apiKey, configCatKernel.configFetcher, c, configCatKernel.cache);

    return result;
}

export interface IConfigurationOptions {

    logger?: IConfigCatLogger;

    pollIntervalSeconds?: number;

    maxInitWaitTimeSeconds?: number;

    configChanged?: () => void;

    cacheTimeToLiveSeconds?: number;
}

export interface IConfigFetcher {
    fetchLogic(lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void;
}

export interface ICache {
    Set(config: ProjectConfig): void;

    Get(): ProjectConfig;
}

export interface IConfigCatLogger {
    log(message: string): void;

    error(message: string): void;
}