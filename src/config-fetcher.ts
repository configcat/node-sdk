import * as tunnel from "tunnel";
import * as got from "got";
import { FetchResult, IConfigFetcher } from "configcat-common";
import { OptionsBase } from "configcat-common/lib/ConfigCatClientOptions";

export class HttpConfigFetcher implements IConfigFetcher {

    fetchLogic(options: OptionsBase, lastEtag: string, callback: (result: FetchResult) => void): void {

        options.logger.debug("HttpConfigFetcher.fetchLogic() called.");
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
                "User-Agent": options.clientVersion,
                "X-ConfigCat-UserAgent": options.clientVersion,
                "If-None-Match": (lastEtag) ? lastEtag : undefined
            }
        }).then((response) => {
            options.logger.debug("HttpConfigFetcher.fetchLogic(): success. response?.statusCode: " + response?.statusCode);
            if (response && response.statusCode === 304) {
                callback(FetchResult.notModified());
            } else if (response && response.statusCode === 200) {
                callback(FetchResult.success(response.body, response.headers.etag as string));
            } else {
                // tslint:disable-next-line:max-line-length
                options.logger.error(`Failed to download feature flags & settings from ConfigCat. Status: ${response && response.statusCode} - ${response && response.statusMessage}`);
                options.logger.info("Double-check your SDK Key on https://app.configcat.com/sdkkey");
                callback(FetchResult.error());
            }
        }).catch((reason) => {
            options.logger.debug("HttpConfigFetcher.fetchLogic(): catch. reason: " + reason);
            const response: any = reason.response;
            if (response && response.status === 304) {
                callback(FetchResult.notModified());
            } else {
                const errorDetails = response  
                    ? `Status: ${response.statusCode} - ${response.statusMessage}`
                    : `Empty response from API. Error: ${reason.message}`;
                options.logger.error(`Failed to download feature flags & settings from ConfigCat. ${errorDetails}`);
                options.logger.info("Double-check your SDK Key on https://app.configcat.com/sdkkey");
                callback(FetchResult.error());
            }
        });
    }
}

export default IConfigFetcher;
