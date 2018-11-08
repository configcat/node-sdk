import { IConfigFetcher, ICache } from ".";
import { AutoPollConfiguration, ManualPollConfiguration, LazyLoadConfiguration } from "./ConfigCatClientConfiguration";
import { IConfigService } from "./ProjectConfigService";
import { AutoPollConfigService } from "./AutoPollConfigService";
import { InMemoryCache } from "./Cache";
import { LazyLoadConfigService } from "./LazyLoadConfigService";
import { ManualPollService } from "./ManualPollService";
import { User, IRolloutEvaluator, RolloutEvaluator } from "./RolloutEvaluator";

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
    private evaluator: IRolloutEvaluator;

    constructor(
        apiKey: string,
        configFetcher: IConfigFetcher,
        configuration?: AutoPollConfiguration | ManualPollConfiguration | LazyLoadConfiguration,
        cache?: ICache,
        evaluator?: IRolloutEvaluator) {

        if (!apiKey) {
            throw new Error("Invalid 'apiKey' value");
        }

        this.apiKey = apiKey;

        if (configuration && configuration instanceof LazyLoadConfiguration) {

            let lc: LazyLoadConfiguration = <LazyLoadConfiguration>configuration;

            this.configService = new LazyLoadConfigService(
                configFetcher,
                cache ? cache : new InMemoryCache(),
                lc);

            this.evaluator = evaluator ? evaluator : new RolloutEvaluator(lc.logger);

        } else if (configuration && configuration instanceof ManualPollConfiguration) {

            let mc: ManualPollConfiguration = <ManualPollConfiguration>configuration;

            this.configService = new ManualPollService(
                configFetcher,
                cache ? cache : new InMemoryCache(),
                mc);

            this.evaluator = evaluator ? evaluator : new RolloutEvaluator(mc.logger);

        } else {

            let ac: AutoPollConfiguration = new AutoPollConfiguration();

            if (configuration && configuration instanceof AutoPollConfiguration) {
                ac = <AutoPollConfiguration>configuration;
            }

            let autoConfigService: AutoPollConfigService = new AutoPollConfigService(
                configFetcher,
                cache ? cache : new InMemoryCache(),
                ac);

            this.configService = autoConfigService;

            this.evaluator = evaluator ? evaluator : new RolloutEvaluator(ac.logger);
        }
    }

    getValue(key: string, defaultValue: any, user: User, callback: (value: any) => void): void {

        this.configService.getConfig((value) => {
            var result: any = defaultValue;

            result = this.evaluator.Evaluate(value, key, defaultValue, user);

            callback(result);
        });
    }

    forceRefresh(callback: () => void): void {
        this.configService.refreshConfig(callback);
    }
}