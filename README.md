# ConfigCat SDK for node.js
ConfigCat is a cloud based configuration as a service. It integrates with your apps, backends, websites, and other programs, so you can configure them through this website even after they are deployed.
https://configcat.com  

[![Build Status](https://travis-ci.org/configcat/node-sdk.svg?branch=master)](https://travis-ci.org/configcat/node-sdk)\
[![NPM](https://nodei.co/npm/configcat-client.png)](https://nodei.co/npm/configcat-client/)

## Getting Started

 1. Install [NPM](https://docs.npmjs.com/cli/install) package: [ConfigCat-Client]( https://npmjs.com/package/configcat-client)
 ```PowerShell
  npm i configcat-client
 ```
 2. Get your Project secret from [configcat.com](https://configcat.com) portal:
![ProjectSecret](https://raw.githubusercontent.com/ConfigCat/.net-sdk/master/media/readme02.png  "ProjectSecret")

 3. Create a **ConfigCatClient** instance:
```javascript
var configcat = require("configcat");

var client = configcat.createClient("#YOUR-PROJECT-SECRET#");
```
 4. Get your config value:
```javascript
client.getValue("isMyAwesomeFeatureEnabled", false, (n) => {
    if(isMyAwesomeFeatureEnabled) {
        //show your awesome feature to the world!
    }
});
```

## Configuration
Client supports three different caching policies to acquire the configuration from ConfigCat. When the client downloads the latest configuration, puts it into the internal cache and serves any configuration acquisition from cache. With these caching policies you can manage your configurations' lifetimes easily.

### Auto polling (default)
Client downloads the latest configuration and puts into a cache repeatedly. Use ```pollingIntervalSeconds``` parameter to manage polling interval.
You can subscribe to the ```configChanged``` event to get notification about configuration changes. 

### Lazy loading
Client downloads the latest configuration only when it is not present or expired in the cache. Use ```cacheTimeToLiveSeconds``` parameter to manage configuration lifetime.

### Manual polling
With this mode you always have to invoke ```.forceRefresh()``` method to download a latest configuration into the cache. When the cache is empty (for example after client initialization) and you try to acquire any value you'll get the default value!

---

Configuration parameters are different in each mode:
### Base configuration
| PropertyName        | Description           | Default  |
| --- | --- | --- |
| ```projectSecret```      | Project secret to access your configuration.  | REQUIRED |
| ```logger``` | 'winston' logger instance        | no default tracing method | 
### Auto polling
| PropertyName        | Description           | Default  |
| --- | --- | --- |
| ```pollIntervalSeconds ```      | Polling interval in seconds.|   60 | 
| ```maxInitWaitTimeSeconds```      | Maximum waiting time between the client initialization and the first config acquisition in seconds.|   5 |
### Lazy loading
| PropertyName        | Description           | Default  |
| --- | --- | --- | 
| ```cacheTimeToLiveSeconds```      | Use this value to manage the cache's TTL. |   60 |

### Example - increase CacheTimeToLiveSeconds to 600 seconds
``` javascript
var config = {
    "cacheTimeToLiveSeconds": 600
};

var client = configcat.createClientWithLazyLoad("#YOUR-PROJECT-SECRET#", config);
```
### Example - OnConfigurationChanged 
In Auto polling mode you can subscribe an event to get notification about changes. We use "events" package to support event handling in our package.

``` javascript
var events = require("events");

var config = {    
    "configChanged": new events.EventEmitter()
};

config.configChanged.on(configcat.CONFIG_CHANGED_EVENT, () => console.log("config changed, update UI!"));

var client = configcat.createClientWithAutoPoll("#YOUR-PROJECT-SECRET#", config);
```

## Members
### Methods
| Name        | Description           |
| :------- | :--- |
| ``` getValue(key: string, defaultValue: any, callback: (value: any) => void): void; ``` | Returns the value of the key |
| ``` forceRefresh(callback: () => void): void ``` | Fetches the latest configuration from the server. You can use this method with WebHooks to ensure up to date configuration values in your application.|

## Lifecycle of the client
We're recommend to use client as a singleton in your application.

## Logging
We use Winston for logging you can setup with 'logger' attribute.
``` javascript
var config = {
    "logger": new winston.Logger({
            level: "info",
            transports: [
                new winston.transports.Console({ timestamp: true })
            ]})
};
```

## License
[MIT](https://raw.githubusercontent.com/ConfigCat/node-sdk/master/LICENSE)
