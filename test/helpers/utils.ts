import { IConfigCatKernel, InMemoryCache } from "configcat-common";
import { ConfigCatClient } from "configcat-common/lib/ConfigCatClient";
import { AutoPollOptions, LazyLoadOptions, ManualPollOptions } from "configcat-common/lib/ConfigCatClientOptions";
import { IConfigCatClient, INodeAutoPollOptions, INodeLazyLoadingOptions, INodeManualPollOptions } from "../../src/client";
import { HttpConfigFetcher } from "../../src/config-fetcher";
import sdkVersion from "../../src/version";

const sdkType = "ConfigCat-Node";

export function createClientWithAutoPoll(sdkKey: string, options?: INodeAutoPollOptions): IConfigCatClient {
  const configCatKernel: IConfigCatKernel = { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache(), sdkType, sdkVersion };
  return new ConfigCatClient(new AutoPollOptions(sdkKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.cache, configCatKernel.eventEmitterFactory), configCatKernel);
}

export function createClientWithManualPoll(sdkKey: string, options?: INodeManualPollOptions): IConfigCatClient {
  const configCatKernel: IConfigCatKernel = { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache(), sdkType, sdkVersion };
  return new ConfigCatClient(new ManualPollOptions(sdkKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.cache, configCatKernel.eventEmitterFactory), configCatKernel);
}

export function createClientWithLazyLoad(sdkKey: string, options?: INodeLazyLoadingOptions): IConfigCatClient {
  const configCatKernel: IConfigCatKernel = { configFetcher: new HttpConfigFetcher(), cache: new InMemoryCache(), sdkType, sdkVersion };
  return new ConfigCatClient(new LazyLoadOptions(sdkKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.cache, configCatKernel.eventEmitterFactory), configCatKernel);
}
