import * as httprequest from "request";
import { IConfigFetcher, IConfigCatLogger } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ConfigServiceBase";
import { OptionsBase } from "configcat-common/lib/ConfigCatClientOptions";

declare const Promise: any;

export class HttpConfigFetcher implements IConfigFetcher {

    fetchLogic(options: OptionsBase, lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        // tslint:disable-next-line:typedef
        var httpOptions = {
            url: options.getUrl(),
            headers: {
                "User-Agent": "ConfigCat-node/" + options.clientVersion,
                "X-ConfigCat-UserAgent": "ConfigCat-node/" + options.clientVersion,
                "If-None-Match": lastProjectConfig ? lastProjectConfig.HttpETag : null
            }
        };

        httprequest(httpOptions, (err, response, body) => {

            if (!err && response.statusCode === 304) {

                callback(new ProjectConfig(new Date().getTime(), lastProjectConfig.JSONConfig, response.headers.etag));

            } else if (!err && response.statusCode === 200) {

                callback(new ProjectConfig(new Date().getTime(), body, response.headers.etag));

            } else {

                if (err) {
                    options.logger.error("httprequest error - " + err);
                }

                callback(lastProjectConfig);
            }
        });
    }
}

export default IConfigFetcher;