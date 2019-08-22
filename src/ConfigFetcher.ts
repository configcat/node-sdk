import * as httprequest from "request";
import { IConfigFetcher } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ConfigServiceBase";
import { OptionsBase } from "configcat-common/lib/ConfigCatClientOptions";

export class HttpConfigFetcher implements IConfigFetcher {

    fetchLogic(options: OptionsBase, lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        // tslint:disable-next-line:typedef
        var httpOptions = {
            url: options.getUrl(),
            timeout: options.requestTimeoutMs,
            headers: {
                "User-Agent": "ConfigCat-node/" + options.clientVersion,
                "X-ConfigCat-UserAgent": "ConfigCat-node/" + options.clientVersion,
                "If-None-Match": lastProjectConfig ? lastProjectConfig.HttpETag : null
            }
        };

        httprequest(httpOptions, (err, response, body) => {

            if (!err && response && response.statusCode === 304) {

                callback(new ProjectConfig(new Date().getTime(), JSON.stringify(lastProjectConfig.ConfigJSON), response.headers.etag));

            } else if (!err && response && response.statusCode === 200) {

                callback(new ProjectConfig(new Date().getTime(), body, response.headers.etag));

            } else {
                options.logger.error("ConfigCat HTTPRequest error - " + (response && response.statusCode)+ ". Error: " + err);
                callback(lastProjectConfig);
            }
        });
    }
}

export default IConfigFetcher;
