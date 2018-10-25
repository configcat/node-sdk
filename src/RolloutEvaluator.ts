import { ProjectConfig } from "./ProjectConfigService";
import * as winston from "winston";
import * as nodesha1 from "node-sha1";

export interface IRolloutEvaluator {
    Evaluate(config: ProjectConfig, key: string, defaultValue: any, user: User): any;
}

/** Object for variation evaluation */
export class User {

    constructor(identifier: string) {
        this.Identifier = identifier;
    }

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

    private logger: any;

    constructor(logger?: winston.LoggerInstance) {
        this.logger = logger ? logger : console;
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

        if (rolloutRules) {

            for (let i: number = 0; i < rolloutRules.length; i++) {

                let rule: any = rolloutRules[i];

                let ca: string = this.GetUserAttribute(user, rule.ComparisonAttribute);

                switch (rule.Comparator) {
                    case 0: // in

                        let cvs: string[] = rule.ComparisonValue.split(",");

                        for (let ci: number = 0; ci < cvs.length; ci++) {

                            if (cvs[ci].trim() === ca) {
                                return rule.Value;
                            }
                        }

                        break;

                    case 1: // notIn

                        if (rule.ComparisonValue.split(",").some(e => {
                            if (e.trim() === ca) {
                                return true;
                            }

                            return false;
                        })) {

                            return rule.Value;
                        }

                        break;

                    case 2: // contains

                        if (rule.ComparisonValue.search(ca) !== -1) {
                            return rule.Value;
                        }

                        break;

                    case 3: // not contains

                        if (rule.ComparisonValue.search(ca) === -1) {
                            return rule.Value;
                        }

                        break;

                    default:
                        break;
                }
            }
        }

        return null;
    }

    private EvaluateVariations(rolloutPercentageItems: any, key: string, user: User): any {

        if (rolloutPercentageItems) {

            let hashCandidate: string = key + user.Identifier;
            let hashValue: any = nodesha1(hashCandidate).substring(0, 15);
            let hashScale: any = parseInt(hashValue, 16) % 100;
            let bucket: number = 0;

            for (let i: number = 0; i < rolloutPercentageItems.length; i++) {
                const variation: any = rolloutPercentageItems[i];
                bucket += +variation.Percentage;

                if (hashScale < bucket) {
                    return variation.Value;
                }
            }
        }

        return null;
    }

    private GetUserAttribute(user: User, attribute: string): string {
        switch (attribute) {
            case "Identifier":
                return user.Identifier;
            case "Email":
                return user.Email;
            case "Country":
                return user.Country;
            default:
                return user.Custom[attribute];
        }
    }
}