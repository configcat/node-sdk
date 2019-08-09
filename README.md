# ConfigCat SDK for Node.js
https://configcat.com

ConfigCat SDK for Node.js provides easy integration for your application to ConfigCat.

ConfigCat is a feature flag and configuration management service that lets you separate releases from deployments. You can turn your features ON/OFF using <a href="https://app.configcat.com" target="_blank">ConfigCat Management Console</a> even after they are deployed. ConfigCat lets you target specific groups of users based on region, email or any other custom user attribute.

ConfigCat is a <a href="https://configcat.com" target="_blank">hosted feature flag service</a>. Manage feature toggles across frontend, backend, mobile, desktop apps. <a href="https://configcat.com" target="_blank">Alternative to LaunchDarkly</a>. Management app + feature flag SDKs.

[![Build Status](https://travis-ci.com/configcat/node-sdk.svg?branch=master)](https://travis-ci.com/configcat/node-sdk) [![codecov](https://codecov.io/gh/configcat/node-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/node-sdk) [![Known Vulnerabilities](https://snyk.io/test/github/configcat/node-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/node-sdk?targetFile=package.json) ![License](https://img.shields.io/github/license/configcat/node-sdk.svg) \
[![NPM](https://nodei.co/npm/configcat-node.png)](https://nodei.co/npm/configcat-node/)

## Getting Started

### 1. Install and import package:

*via NPM [package](https://npmjs.com/package/configcat-node):*
```PowerShell
npm i configcat-node
```
```js
const configcat = require("configcat-node");
```

### 2. Go to <a href="https://app.configcat.com/connect" target="_blank">Connect your application</a> tab to get your *API Key*:
![API-KEY](https://raw.githubusercontent.com/ConfigCat/node-sdk/master/media/readme01.png  "API-KEY")

### 3. Create a *ConfigCat* client instance:
```js
let configCatClient = configcat.createClient("#YOUR-API-KEY#");
```

> We strongly recommend using the *ConfigCat Client* as a Singleton object in your application.

### 4. Get your setting value:
```js
configCatClient.getValue("isMyAwesomeFeatureEnabled", false, (value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    }
});
```

## Getting user specific setting values with Targeting
Using this feature, you will be able to get different setting values for different users in your application by passing a `User Object` to the `getValue()` function.

Read more about [Targeting here](https://docs.configcat.com/docs/advanced/targeting/).
```js
configCatClient.getValue("isMyAwesomeFeatureEnabled", false, (value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    },
    {identifier : "#USER-IDENTIFIER#"}
});
```

## Sample/Demo app
  [Sample Console App](https://github.com/configcat/node-sdk/tree/master/samples/console)

## Polling Modes
The ConfigCat SDK supports 3 different polling mechanisms to acquire the setting values from ConfigCat. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. Read more about Polling Modes and how to use them at [ConfigCat Docs](https://docs.configcat.com/docs/sdk-reference/node/).

## Support
If you need help how to use this SDK feel free to to contact the ConfigCat Staff on https://configcat.com. We're happy to help.

## Contributing
Contributions are welcome.

## About ConfigCat
- [Official ConfigCat SDK's for other platforms](https://github.com/configcat)
- [Documentation](https://docs.configcat.com)
- [Blog](https://blog.configcat.com)
