import { ProjectConfig } from "./ProjectConfigService";
import * as winston from "winston";

export interface IRolloutEvaluator {
    Evaluate(config: ProjectConfig, key: string, defaultValue: any, user: User): any;
}

/** Object for variation evaluation */
export class User {

    /** Unique identifier for the User or Session. e.g. Email address, Primary key, Session Id */
    Identifier: string;

    /** Optional parameter for easier targeting rule definitions */
    Email: string;

    /** Optional parameter for easier targeting rule definitions */
    Country: string;

    /** Optional dictionary for custom attributes of the User for advanced targeting rule definitions. e.g. User role, Subscription type */
    Custom: { [key: string]: string } = {};
}

export class RolloutEvaluator implements IRolloutEvaluator {

    private logger: winston.LoggerInstance;

    constructor(logger: winston.LoggerInstance) {
        this.logger = logger;
    }

    Evaluate(config: ProjectConfig, key: string, defaultValue: any, user: User): any {

        if (!config || !config.JSONConfig) {

            this.logger.warn("JSONConfig is not present, returning defaultValue");

            return defaultValue;
        }

        let json: any = JSON.parse(config.JSONConfig);

        if (!json[key]) {

            this.logger.warn("Unknown key: '" + key + "'");

            return defaultValue;
        }

        let result: any;

        if (user) {

            result = this.EvaluateRules(json[key].RolloutRules, user);

            if (result == null) {

                result = this.EvaluateVariations(json[key].RolloutPercentageItems, key, user);
            }
        }

        return result == null ? json[key].Value : result;
    }

    private EvaluateRules(rolloutRules: any, user: User): any {

        rolloutRules.forEach(rule => {

            switch (rule.Comparator) {
                case 0:
                    if (rule.ComparisonValue.split(",").includes()) {
                        break;
                    }

                default:
                    break;
            }

        });

        return null;
    }

    private EvaluateVariations(rolloutPercentageItems: any, key: string, user: User): any {
        return null;
    }
}