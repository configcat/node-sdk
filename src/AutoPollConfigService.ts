import IConfigFetcher from "./ConfigFetcher";
import ICache from "./Cache";
import { AutoPollConfiguration } from "./ConfigCatClientConfiguration";
import { EventEmitter } from "events";
import { IConfigService, ProjectConfig, ConfigServiceBase } from "./ProjectConfigService";

export class AutoPollConfigService extends ConfigServiceBase implements IConfigService {

    private timer;
    private maxInitWaitExpire: Date;
    private configChanged: EventEmitter;

    public static readonly ON_CHANGED_EVENT: string = "AutoPollConfigService_OnChanged";

    constructor(configFetcher: IConfigFetcher, cache: ICache, autoPollConfig: AutoPollConfiguration) {

        autoPollConfig.validate();

        super(configFetcher, cache, autoPollConfig);

        this.timer = setInterval(() => this.refreshConfig(), autoPollConfig.pollIntervalSeconds * 1000);
        this.maxInitWaitExpire = new Date(new Date().getTime() + autoPollConfig.maxInitWaitTimeSeconds * 1000);
        this.configChanged = autoPollConfig.configChanged;

        this.logger.debug("autoPollConfig.maxInitWaitTimeSeconds - " + autoPollConfig.maxInitWaitTimeSeconds);
        this.logger.debug("autoPollConfig.pollIntervalSeconds - " + autoPollConfig.pollIntervalSeconds);
    }

    getConfig(callback: (value: ProjectConfig) => void): void {

        var p: ProjectConfig = this.cache.Get();

        if (!p && new Date().getTime() < this.maxInitWaitExpire.getTime()) {

            this.logger.debug("wait initailization");

            this.refreshLogic(callback);

        } else {

            callback(p);
        }
    }

    refreshConfig(callback?: (value: ProjectConfig) => void): void {
        this.refreshLogic(callback);
    }

    private refreshLogic(callback?: (value: ProjectConfig) => void): void {
        this.logger.debug("refreshLogic start");

        let p: ProjectConfig = this.cache.Get();

        this.refreshLogicBase(p, (newConfig) => {

            if (callback) {
                callback(newConfig);
            }

            if (!p || p.HttpETag !== newConfig.HttpETag) {
                this.configChanged.emit(AutoPollConfiguration.CONFIG_CHANGED_EVENT);
            }
        });
    }
}
