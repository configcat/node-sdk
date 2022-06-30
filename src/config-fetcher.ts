import * as http from "http"
import * as https from "https"
import * as tunnel from "tunnel";
import { URL } from "url";
import { FetchResult, IConfigFetcher } from "configcat-common";
import { OptionsBase } from "configcat-common/lib/ConfigCatClientOptions";

export class HttpConfigFetcher implements IConfigFetcher {
    fetchLogic(options: OptionsBase, lastEtag: string, callback: (result: FetchResult) => void): void {
        options.logger.debug("HttpConfigFetcher.fetchLogic() called.");
        const baseUrl = options.getUrl();
        const isBaseUrlSecure = baseUrl.startsWith("https");
        let agent: any;
        if (options.proxy) {
            try {
                const proxy: URL = new URL(options.proxy);
                let agentFactory: any;
                if (proxy.protocol === "https:") {
                    agentFactory = isBaseUrlSecure ? tunnel.httpsOverHttps : tunnel.httpOverHttps;
                } else {
                    agentFactory = isBaseUrlSecure ? tunnel.httpsOverHttp : tunnel.httpOverHttp;
                }
                agent = agentFactory({
                    proxy: {
                        host: proxy.hostname,
                        port: proxy.port,
                        proxyAuth: `${proxy.username}:${proxy.password}`
                    }
                });
            } catch {
                options.logger.error(`Failed to parse options.proxy: ${options.proxy}`);
            }
        }

        const requestOptions = {
            agent,
            headers: { 
                "User-Agent": options.clientVersion,
                "If-None-Match": (lastEtag) ? lastEtag : null
            },
            timeout: options.requestTimeoutMs,
        };        
        options.logger.debug(JSON.stringify(requestOptions));

        const request = (isBaseUrlSecure ? https : http).get(baseUrl, requestOptions, response => {
            const chunks = [];
            response.on("data", chunk => {
                chunks.push(chunk);
            });
            response.on("end", () => {
                if (chunks && response && response.statusCode === 200) {
                    options.logger.debug("HttpConfigFetcher.fetchLogic() Response received, status = 200.");
                    callback(FetchResult.success(Buffer.concat(chunks).toString(), response.headers["etag"]));
                } else if (response && response.statusCode === 304) {
                    options.logger.debug("HttpConfigFetcher.fetchLogic() Response received, status = 304.");
                    callback(FetchResult.notModified());
                } else {
                    const errorDetails = response  
                    ? `Status: ${response.statusCode} - ${response.statusMessage}`
                    : "Empty response from API.";
                    options.logger.error(`Failed to download feature flags & settings from ConfigCat. ${errorDetails}`);
                    options.logger.error("Double-check your SDK Key on https://app.configcat.com/sdkkey");
                    callback(FetchResult.error());
                }
            });
        });
        request.on("timeout", () => {
            // No further logging required as destroy() will trigger the 'error' event with this custom error.
            request.destroy(new Error(`Request timed out. Timeout value: ${options.requestTimeoutMs}ms`));
        }).on("error", error => {
            options.logger.error(`Failed to download feature flags & settings from ConfigCat. ${error}`);
            callback(FetchResult.error());
        }).end();
    }
}

export default IConfigFetcher;
