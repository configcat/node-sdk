import { ProjectConfig } from "./ProjectConfigService";

declare const Promise: any;

export interface IConfigFetcher {
    fetchLogic(lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void;
}

export default IConfigFetcher;