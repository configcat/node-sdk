import { ConfigCatConsoleLogger } from "./ConfigCatLogger";
import { IConfigCatLogger } from ".";

export abstract class ConfigurationBase {

    public logger: IConfigCatLogger = new ConfigCatConsoleLogger();

    protected validate(): void {

        if (!this.logger) {
            throw new Error("Invalid 'logger' instance");
        }
    }

    getUrl(apiKey: string): string {
        if (apiKey) {
            return "https://cdn.configcat.com/configuration-files/" + apiKey + "/config_v2.json";
        }

        throw new Error("Invalid 'apiKey'");
    }
}

export class AutoPollConfiguration extends ConfigurationBase {

    public pollIntervalSeconds: number;

    public maxInitWaitTimeSeconds: number;

    public configChanged: () => void = () => { };

    constructor() {

        super();

        this.maxInitWaitTimeSeconds = 5;

        this.pollIntervalSeconds = 60;
    }

    validate(): void {

        super.validate();

        if (!this.maxInitWaitTimeSeconds || this.maxInitWaitTimeSeconds < 1) {
            throw new Error("Invalid 'maxInitWaitTimeSeconds' value");
        }

        if (!this.pollIntervalSeconds || this.pollIntervalSeconds < 1) {
            throw new Error("Invalid 'pollIntervalSeconds' value");
        }
    }
}

export class ManualPollConfiguration extends ConfigurationBase {

    constructor() {

        super();
    }

    validate(): void {

        super.validate();
    }
}

export class LazyLoadConfiguration extends ConfigurationBase {

    public cacheTimeToLiveSeconds: number;

    constructor() {

        super();

        this.cacheTimeToLiveSeconds = 60;
    }

    validate(): void {

        super.validate();

        if (!this.cacheTimeToLiveSeconds || this.cacheTimeToLiveSeconds < 1) {
            throw new Error("Invalid 'cacheTimeToLiveSeconds' value. Value must be greater than zero.");
        }
    }
}
