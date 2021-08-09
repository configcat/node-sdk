import * as tunnel from "tunnel";
import * as got from "got";
import { IConfigFetcher } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ProjectConfig";
import { OptionsBase } from "configcat-common/lib/ConfigCatClientOptions";

export class HttpConfigFetcher implements IConfigFetcher {

    fetchLogic(options: OptionsBase, lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        let agent: any;
        if (options.proxy) {
            try {
                const proxy: URL = new URL(options.proxy);
                let agentFactory: any = tunnel.httpsOverHttp;
                if (proxy.protocol === "https:") {
                    agentFactory = tunnel.httpsOverHttps;
                }
                agent = agentFactory({
                    proxy: {
                        host: proxy.hostname,
                        port: proxy.port,
                    }
                });
            } catch {
                options.logger.log("Failed to parse options.proxy: " + options.proxy);
            }
        }

        got.get(options.getUrl(), {
            agent,
            headers: {
                "User-Agent": "ConfigCat-Node/" + options.clientVersion,
                "X-ConfigCat-UserAgent": "ConfigCat-Node/" + options.clientVersion,
                "If-None-Match": (lastProjectConfig && lastProjectConfig.HttpETag) ? lastProjectConfig.HttpETag : undefined
            }
        }).then((response) => {
            if (response && response.statusCode === 304) {
                callback(new ProjectConfig(
                    new Date().getTime(),
                    JSON.stringify(lastProjectConfig.ConfigJSON),
                    response.headers.etag as string));
            } else if (response && response.statusCode === 200) {
                callback(new ProjectConfig(new Date().getTime(), response.body, response.headers.etag as string));
            } else {
                // tslint:disable-next-line:max-line-length
                options.logger.error(`Failed to download feature flags & settings from ConfigCat. Status: ${response && response.statusCode} - ${response && response.statusMessage}`);
                options.logger.info("Double-check your SDK Key on https://app.configcat.com/sdkkey");
                callback(lastProjectConfig);
            }
        }).catch((reason) => {
            const response: any = reason.response;
            if (response && response.status === 304) {
                callback(new ProjectConfig(
                    new Date().getTime(),
                    JSON.stringify(lastProjectConfig.ConfigJSON),
                    response.headers.etag as string));
            } else {
                const errorDetails = response  
                    ? `Status: ${response.statusCode} - ${response.statusMessage}`
                    : `Empty response from API. Error: ${reason.message}`;
                options.logger.error(`Failed to download feature flags & settings from ConfigCat. ${errorDetails}`);
                options.logger.info("Double-check your SDK Key on https://app.configcat.com/sdkkey");
                callback(lastProjectConfig);
            }
        });
    }
}

export default IConfigFetcher;
