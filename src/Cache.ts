import { ProjectConfig } from "./ProjectConfigService";
import { ICache } from ".";

export class InMemoryCache implements ICache {
    cache: ProjectConfig;

    Set(config: ProjectConfig): void {
        this.cache = config;
    }
    Get(): ProjectConfig {
        var c: ProjectConfig = this.cache;

        return c;
    }
}