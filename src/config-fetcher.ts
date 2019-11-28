import * as got from 'got';
import * as tunnel from 'tunnel';
import { IConfigFetcher } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ConfigServiceBase";
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
                "User-Agent": "ConfigCat-JS/" + options.clientVersion,
                "X-ConfigCat-UserAgent": "ConfigCat-JS/" + options.clientVersion,
                "If-None-Match": lastProjectConfig ? lastProjectConfig.HttpETag : null
            }
        }).then((response) => {
            if (response && response.statusCode === 304) {
                callback(new ProjectConfig(new Date().getTime(), JSON.stringify(lastProjectConfig.ConfigJSON), response.headers.etag as string));
            } else if (response && response.statusCode === 200) {
                callback(new ProjectConfig(new Date().getTime(), response.body, response.headers.etag as string));
            } else {
                options.logger.log("Failed to download config from ConfigCat. Status:" + (response && response.statusCode) + " - " + (response && response.statusMessage));
                callback(lastProjectConfig);
            }
        }).catch((reason) => {
            const response = reason.response;
            if (response && response.status === 304) {
                callback(new ProjectConfig(new Date().getTime(), JSON.stringify(lastProjectConfig.ConfigJSON), response.headers.get('etag')));
            } else {
                options.logger.log("Failed to download config from ConfigCat. Status:" + (response && response.statusCode) + " - " + (response && response.statusMessage));
                callback(lastProjectConfig);
            }
        });
    }
}

export default IConfigFetcher;
