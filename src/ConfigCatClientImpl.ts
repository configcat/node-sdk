import { IConfigFetcher, HttpConfigFetcher } from "./ConfigFetcher";
import { AutoPollConfiguration, ManualPollConfiguration, LazyLoadConfiguration } from "./ConfigCatClientConfiguration";
import { IConfigService, ProjectConfig } from "./ProjectConfigService";
import { AutoPollConfigService } from "./AutoPollConfigService";
import { InMemoryCache } from "./Cache";
import { LazyLoadConfigSerivce } from "./LazyLoadConfigService";
import { ManualPollService } from "./ManualPollService";
import { User } from "./RolloutEvaluator";

declare const require: any;

const VERSION: string = require("../package.json").version;
export const CONFIG_CHANGE_EVENT_NAME: string = "changed";

/** Client for ConfigCat platform */
export interface IConfigCatClient {

    /** Return a value of the key (Key for programs) */
    getValue(key: string, defaultValue: any, user: User, callback: (value: any) => void): void;

    /** Refresh the configuration */
    forceRefresh(callback: () => void): void;
}

export class ConfigCatClientImpl implements IConfigCatClient {
    private apiKey: string;
    private configService: IConfigService;

    constructor(apiKey: string, configuration?: AutoPollConfiguration | ManualPollConfiguration | LazyLoadConfiguration) {

        if (!apiKey) {
            throw new Error("Invalid 'apiKey' value");
        }

        this.apiKey = apiKey;

        if (configuration && configuration instanceof LazyLoadConfiguration) {

            let lc: LazyLoadConfiguration = <LazyLoadConfiguration>configuration;

            this.configService = new LazyLoadConfigSerivce(
                new HttpConfigFetcher(lc.getUrl(apiKey), "l-" + VERSION),
                new InMemoryCache(),
                lc);

        } else if (configuration && configuration instanceof ManualPollConfiguration) {

            let mc: ManualPollConfiguration = <ManualPollConfiguration>configuration;

            this.configService = new ManualPollService(
                new HttpConfigFetcher(mc.getUrl(apiKey), "m-" + VERSION),
                new InMemoryCache(),
                mc);

        } else {

            let ac: AutoPollConfiguration = new AutoPollConfiguration();

            if (configuration && configuration instanceof AutoPollConfiguration) {
                ac = <AutoPollConfiguration>configuration;
            }

            let autoConfigService: AutoPollConfigService = new AutoPollConfigService(
                new HttpConfigFetcher(ac.getUrl(apiKey), "a-" + VERSION),
                new InMemoryCache(),
                ac);

            this.configService = autoConfigService;
        }
    }

    getValue(key: string, defaultValue: any, user: User, callback: (value: any) => void): void {

        this.configService.getConfig((value) => {
            var result: any = defaultValue;

            if (value && value.JSONConfig) {
                var j: any = JSON.parse(value.JSONConfig);

                if (j[key]) {
                    result = JSON.parse(value.JSONConfig)[key];
                }
            }

            callback(result);
        });
    }

    forceRefresh(callback: () => void): void {
        this.configService.refreshConfig(callback);
    }
}