import * as got from 'got';
import * as tunnel from 'tunnel';
import { IConfigFetcher } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ProjectConfig";
import { OptionsBase } from "configcat-common/lib/ConfigCatClientOptions";

export class HttpConfigFetcher implements IConfigFetcher {

    fetchLogic(options: OptionsBase, lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        let agent;
        if (options.proxy) {
            try {
                const proxy = new URL(options.proxy);
                let agentFactory = tunnel.httpsOverHttp;
                if (proxy.protocol === 'https:') {
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
                "If-None-Match": lastProjectConfig ? lastProjectConfig.HttpETag : null
            }
        }).then((response) => {
            if (response && response.statusCode === 304) {
                callback(new ProjectConfig(new Date().getTime(), JSON.stringify(lastProjectConfig.ConfigJSON), response.headers.etag as string));
            } else if (response && response.statusCode === 200) {
                callback(new ProjectConfig(new Date().getTime(), response.body, response.headers.etag as string));
            } else {
                options.logger.error("Failed to download feature flags & settings from ConfigCat. Status: " + (response && response.statusCode) + " - " + (response && response.statusMessage));
                options.logger.info("Double-check your API KEY on https://app.configcat.com/apikey");
                callback(lastProjectConfig);
            }
        }).catch((reason) => {
            const response = reason.response;
            if (response && response.status === 304) {
                callback(new ProjectConfig(new Date().getTime(), JSON.stringify(lastProjectConfig.ConfigJSON), response.headers.get('etag')));
            } else {
                options.logger.error("Failed to download feature flags & settings from ConfigCat. Status: " + (response && response.statusCode) + " - " + (response && response.statusMessage));
                options.logger.info("Double-check your API KEY on https://app.configcat.com/apikey");
                callback(lastProjectConfig);
            }
        });
    }
}

export default IConfigFetcher;
