import { IConfigService, ConfigServiceBase, ProjectConfig } from "./ProjectConfigService";
import IConfigFetcher from "./ConfigFetcher";
import ICache from "./Cache";
import { LazyLoadConfiguration } from "./ConfigCatClientConfiguration";

export class LazyLoadConfigService extends ConfigServiceBase implements IConfigService {

    private cacheTimeToLiveSeconds: number;

    constructor(configFetcher: IConfigFetcher, cache: ICache, config: LazyLoadConfiguration) {
        config.validate();

        super(configFetcher, cache, config);

        this.cacheTimeToLiveSeconds = config.cacheTimeToLiveSeconds;
    }

    getConfig(callback: (value: ProjectConfig) => void): void {

        let p: ProjectConfig = this.cache.Get();

        if (p && p.Timestamp < new Date().getTime() + (this.cacheTimeToLiveSeconds * 1000)) {
            callback(p);
        } else {

            this.refreshLogicBase(p, (newConfig) => {
                callback(newConfig);
            });
        }
    }

    refreshConfig(callback?: (value: ProjectConfig) => void): void {
        let p: ProjectConfig = this.cache.Get();

        this.refreshLogicBase(p, (newConfig) => {
            callback(newConfig);
        });
    }
}