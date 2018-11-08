import * as httprequest from "request";
import { IConfigFetcher, IConfigCatLogger } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ProjectConfigService";

declare const Promise: any;


export class HttpConfigFetcher implements IConfigFetcher {

    url: string;
    productVersion: string;
    logger: any;

    constructor(url: string, productVersion: string, logger: IConfigCatLogger) {
        this.url = url;
        this.productVersion = productVersion;
        this.logger = logger;
    }

    fetchLogic(lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        // tslint:disable-next-line:typedef
        var options = {
            url: this.url,
            headers: {
                "User-Agent": "ConfigCat-node/" + this.productVersion,
                "X-ConfigCat-UserAgent": "ConfigCat-node/" + this.productVersion,
                "If-None-Match": lastProjectConfig ? lastProjectConfig.HttpETag : null
            }
        };

        httprequest(options, (err, response, body) => {

            if (!err && response.statusCode === 304) {

                callback(new ProjectConfig(new Date().getTime(), lastProjectConfig.JSONConfig, response.headers.etag));

            } else if (!err && response.statusCode === 200) {

                callback(new ProjectConfig(new Date().getTime(), body, response.headers.etag));

            } else {

                if (err) {
                    this.logger.error("httprequest error - " + err);
                }

                callback(lastProjectConfig);
            }
        });
    }
}

export default IConfigFetcher;