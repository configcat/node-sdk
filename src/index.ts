import { ConfigCatClientImpl, IConfigCatClient } from "./ConfigCatClientImpl";
import { AutoPollConfiguration, ManualPollConfiguration, LazyLoadConfiguration } from "./ConfigCatClientConfiguration";
import { EventEmitter } from "events";

/** Create an instance of ConfigCatClient and setup AutoPool mode with default settings */
export function createClient(projectSecret: string): IConfigCatClient {
    return createClientWithAutoPoll(projectSecret, new AutoPollConfiguration());
}

/**
 * Create an instance of ConfigCatClient and setup AutoPoll mode
 * @param {string} projectSecret - Project secret to access your configuration.
 * @param config - Configuration for autoPoll
 */
export function createClientWithAutoPoll(projectSecret: string, config?: IConfigurationOptions): IConfigCatClient {

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

    var result: ConfigCatClientImpl = new ConfigCatClientImpl(projectSecret, c);

    return result;
}

/**
 * Create an instance of ConfigCatClient and setup ManulaPoll mode
 * @param {string} projectSecret - Project secret to access your configuration.
 * @param config - Configuration for manualPoll
 */
export function createClientWithManualPoll(projectSecret: string, config?: IConfigurationOptions): IConfigCatClient {

    let c: ManualPollConfiguration = new ManualPollConfiguration();

    if (config && config.logger) {
        c.logger = config.logger;
    }

    var result: ConfigCatClientImpl = new ConfigCatClientImpl(projectSecret, c);

    return result;
}

/**
 * Create an instance of ConfigCatClient and setup LazyLoad mode
 * @param {string} projectSecret - Project secret to access your configuration.
 * @param config - Configuration for lazyLoad
 */
export function createClientWithLazyLoad(projectSecret: string, config?: IConfigurationOptions): IConfigCatClient {

    let c: LazyLoadConfiguration = new LazyLoadConfiguration();

    if (config && config.logger) {
        c.logger = config.logger;
    }

    if (config && config.cacheTimeToLiveSeconds) {
        c.cacheTimeToLiveSeconds = config.cacheTimeToLiveSeconds;
    }

    var result: ConfigCatClientImpl = new ConfigCatClientImpl(projectSecret, c);

    return result;
}

export interface IConfigurationOptions {

    logger?: any;

    pollIntervalSeconds?: number;

    maxInitWaitTimeSeconds?: number;

    configChanged?: EventEmitter;

    cacheTimeToLiveSeconds?: number;
}

export const CONFIG_CHANGED_EVENT: string = AutoPollConfiguration.CONFIG_CHANGED_EVENT;